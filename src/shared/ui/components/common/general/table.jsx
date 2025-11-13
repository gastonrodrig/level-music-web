import { useMemo, useState } from 'react';
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableSortLabel,
  TablePagination,
  IconButton,
  Menu,
  MenuItem,
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useScreenSizes } from '../../../../constants/screen-width';
import { useNavigate } from 'react-router-dom';

export const TableComponent = ({
  rows = [],
  columns = [],
  order = 'asc',
  orderBy = '',
  onRequestSort,
  page = 0,
  rowsPerPage = 5,
  total = 0,
  onPageChange,
  onRowsPerPageChange,
  actions = [],
  hasActions = false,
}) => {
  // 🔒 Normaliza props (evita "number 0 is not iterable")
  const rowsArr = Array.isArray(rows) ? rows : [];
  const columnsArr = Array.isArray(columns) ? columns : [];
  const actionsArr = Array.isArray(actions) ? actions : [];

  const [anchorEl, setAnchorEl] = useState(null);
  const [menuRow, setMenuRow] = useState(null);
  const { isMd, isLg } = useScreenSizes();
  const navigate = useNavigate();

  const handleMenuOpen = (event, row) => {
    setAnchorEl(event.currentTarget);
    setMenuRow(row);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setMenuRow(null);
  };

  // Devuelve solo las acciones visibles para una fila (respeta action.show si existe)
  const getVisibleActions = (row) => actionsArr.filter((a) => !a.show || a.show(row));

  // Solo muestra acciones cuando: hay acciones visibles y el estado no es finalizado/cancelado
  const canShowActions = (row) => {
    const closed = ['finalizado', 'cancelado'].includes(String(row?.status || '').toLowerCase());
    return hasActions && actionsArr.length > 0 && !closed && getVisibleActions(row).length > 0;
  };

  const sortedRows = useMemo(() => {
    if (!orderBy) return [...rowsArr];

    return [...rowsArr].sort((a, b) => {
      const aRaw = a?.[orderBy];
      const bRaw = b?.[orderBy];

      const aVal = aRaw === null || aRaw === undefined ? '' : String(aRaw).toLowerCase();
      const bVal = bRaw === null || bRaw === undefined ? '' : String(bRaw).toLowerCase();

      if (aVal < bVal) return order === 'asc' ? -1 : 1;
      if (aVal > bVal) return order === 'asc' ? 1 : -1;
      return 0;
    });
  }, [rowsArr, order, orderBy]);

  const safeRowsPerPage = Number.isFinite(rowsPerPage) && rowsPerPage > 0 ? rowsPerPage : 5;
  const safeTotal = Number.isFinite(total) && total >= 0 ? total : 0;
  const totalPages = Math.max(1, Math.ceil(safeTotal / safeRowsPerPage));
  const safePage = Math.min(Number.isFinite(page) ? page : 0, totalPages - 1);

  return (
    <>
      {/* Vista Cards (mobile / tablets) */}
      {!isLg ? (
        <Box
          sx={{
            maxHeight: '625px',
            overflowY: sortedRows.length > 2 ? 'auto' : 'hidden',
            display: 'grid',
            gridTemplateColumns: isMd ? 'repeat(2, 1fr)' : '1fr',
            gap: 2,
            p: 2,
          }}
        >
          {sortedRows.map((row) => {
            const visibleActions = getVisibleActions(row);

            return (
              <Card
                key={row._id}
                sx={{
                  borderRadius: 3,
                  border: (theme) =>
                    `1px solid ${
                      theme.palette.mode === 'dark'
                        ? 'rgb(140, 140, 140)'
                        : 'rgba(224, 224, 224, 1)'
                    }`,
                  boxShadow: 'none',
                  backgroundColor: 'inherit',
                  position: 'relative',
                }}
              >
                {canShowActions(row) && (
                  <IconButton
                    size="small"
                    onClick={(e) => handleMenuOpen(e, row)}
                    sx={{ position: 'absolute', top: 8, right: 8 }}
                  >
                    <MoreVertIcon fontSize="small" />
                  </IconButton>
                )}

                <CardContent>
                  {columnsArr.map((column) => (
                    <Box key={`${row._id}-${column.id}`} sx={{ mb: 1 }}>
                      <Typography variant="subtitle2" color="textSecondary">
                        {column.label}
                      </Typography>
                      <Typography component="div">
                        {column.id === 'status' ? (
                          <Chip
                            label={row[column.id]}
                            color={
                              row[column.id] === 'Activo'
                                ? 'success'
                                : row[column.id] === 'Inactivo'
                                ? 'error'
                                : 'default'
                            }
                            size="small"
                          />
                        ) : column.accessor ? (
                          column.accessor(row)
                        ) : (
                          row[column.id]
                        )}
                      </Typography>
                    </Box>
                  ))}
                </CardContent>

                {hasActions && actionsArr.length > 0 && (
                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                    PaperProps={{
                      sx: {
                        borderRadius: 4,
                        backgroundColor: (theme) =>
                          theme.palette.mode === 'dark' ? 'rgb(0, 0, 0)' : '#FFFFFF',
                        boxShadow: '0px 2px 6px rgba(0, 0, 0, 0.08)',
                        py: 1,
                      },
                    }}
                  >
                    {(menuRow ? getVisibleActions(menuRow) : visibleActions).map((action, index) => (
                      <MenuItem
                        key={`${menuRow?._id}-action-${index}`}
                        onClick={() => {
                          handleMenuClose();
                          if (action.onClick && typeof action.onClick === 'function') {
                            action.onClick(menuRow);
                          }
                          if (action.url && typeof action.url === 'function') {
                            navigate(action.url(menuRow));
                          }
                        }}
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1,
                          py: 1,
                          px: 2,
                          fontSize: 14,
                          color: (theme) => (theme.palette.mode === 'dark' ? '#fff' : '#212121'),
                          '&:hover': {
                            backgroundColor: (theme) =>
                              theme.palette.mode === 'dark'
                                ? 'rgba(36, 36, 36, 0.54)'
                                : 'rgba(0, 0, 0, 0.04)',
                          },
                        }}
                      >
                        {action.icon && (
                          <span
                            style={{
                              fontSize: 18,
                              display: 'flex',
                              alignItems: 'center',
                              color: action.label === 'Eliminar' ? '#d32f2f' : 'inherit',
                            }}
                          >
                            {action.icon}
                          </span>
                        )}
                        {action.label}
                      </MenuItem>
                    ))}
                  </Menu>
                )}
              </Card>
            );
          })}
        </Box>
      ) : (
        // Vista Tabla (desktop)
        <Box
          sx={{
            height: '335px',
            overflowY: rowsArr.length > 5 ? 'auto' : 'hidden',
          }}
        >
          <Table size="small" stickyHeader>
            <TableHead>
              <TableRow>
                {columnsArr.map((column) => (
                  <TableCell
                    key={column.id}
                    sortDirection={orderBy === column.id ? order : false}
                    sx={{
                      borderTop: (theme) =>
                        `1px solid ${
                          theme.palette.mode === 'dark'
                            ? 'rgb(140, 140, 140)'
                            : 'rgba(224, 224, 224, 1)'
                        }`,
                      borderBottom: (theme) =>
                        `1px solid ${
                          theme.palette.mode === 'dark'
                            ? 'rgb(140, 140, 140)'
                            : 'rgba(224, 224, 224, 1)'
                        }`,
                      p: 2,
                      backgroundColor: (theme) =>
                        theme.palette.mode === 'dark' ? '#1F1F1F' : '#f5f5f5',
                      fontWeight: 600,
                      maxWidth: column.width || 'auto',
                      whiteSpace: column.truncate ? 'nowrap' : 'normal',
                      overflow: column.truncate ? 'hidden' : 'visible',
                      textOverflow: column.truncate ? 'ellipsis' : 'clip',
                    }}
                  >
                    {column.sortable ? (
                      <TableSortLabel
                        active={orderBy === column.id}
                        direction={orderBy === column.id ? order : 'asc'}
                        onClick={() => onRequestSort?.(column.id)}
                        sx={{ '& .MuiTableSortLabel-icon': { opacity: 1 } }}
                      >
                        {column.label}
                      </TableSortLabel>
                    ) : (
                      column.label
                    )}
                  </TableCell>
                ))}
                {hasActions && actionsArr.length > 0 && (
                  <TableCell
                    align="right"
                    sx={{
                      borderTop: (theme) =>
                        `1px solid ${
                          theme.palette.mode === 'dark'
                            ? 'rgb(140, 140, 140)'
                            : 'rgba(224, 224, 224, 1)'
                        }`,
                      borderBottom: (theme) =>
                        `1px solid ${
                          theme.palette.mode === 'dark'
                            ? 'rgb(140, 140, 140)'
                            : 'rgba(224, 224, 224, 1)'
                        }`,
                      backgroundColor: (theme) =>
                        theme.palette.mode === 'dark' ? '#1F1F1F' : '#f5f5f5',
                      fontWeight: 600,
                    }}
                  >
                    Acción
                  </TableCell>
                )}
              </TableRow>
            </TableHead>

            <TableBody>
              {sortedRows.map((row) => {
                const visibleActions = getVisibleActions(row);
                return (
                  <TableRow
                    hover
                    key={row._id}
                    sx={{
                      '&:last-child td': rowsArr.length >= 5 ? { borderBottom: 'none' } : {},
                    }}
                  >
                    {columnsArr.map((column) => (
                      <TableCell
                        key={`${row._id}-${column.id}`}
                        sx={{
                          p: column.id === 'status' ? 0 : 2,
                          pl: 2,
                          fontSize: 16,
                          maxWidth: column.width || 'auto',
                          whiteSpace: column.truncate ? 'nowrap' : 'normal',
                          overflow: column.truncate ? 'hidden' : 'visible',
                          textOverflow: column.truncate ? 'ellipsis' : 'clip',
                        }}
                      >
                        {column.id === 'status' ? (
                          <Chip
                            label={row[column.id]}
                            color={
                              row[column.id] === 'Activo'
                                ? 'success'
                                : row[column.id] === 'Inactivo'
                                ? 'error'
                                : 'default'
                            }
                            size="small"
                          />
                        ) : column.accessor ? (
                          column.accessor(row)
                        ) : (
                          row[column.id]
                        )}
                      </TableCell>
                    ))}

                    {hasActions && actionsArr.length > 0 && (
                      <TableCell align="right" sx={{ py: 1, px: 2 }}>
                        {canShowActions(row) && (
                          <>
                            <IconButton size="small" onClick={(e) => handleMenuOpen(e, row)}>
                              <MoreVertIcon fontSize="small" />
                            </IconButton>

                            <Menu
                              anchorEl={anchorEl}
                              open={Boolean(anchorEl)}
                              onClose={handleMenuClose}
                              PaperProps={{
                                sx: {
                                  borderRadius: 4,
                                  backgroundColor: (theme) =>
                                    theme.palette.mode === 'dark' ? 'rgb(0, 0, 0)' : '#FFFFFF',
                                  boxShadow: '0px 2px 6px rgba(0, 0, 0, 0.08)',
                                  py: 1,
                                },
                              }}
                            >
                              {(menuRow ? getVisibleActions(menuRow) : visibleActions).map(
                                (action, index) => (
                                  <MenuItem
                                    key={`${menuRow?._id}-action-${index}`}
                                    onClick={() => {
                                      handleMenuClose();
                                      if (action.onClick && typeof action.onClick === 'function') {
                                        action.onClick(menuRow);
                                      } else if (action.url && typeof action.url === 'function') {
                                        navigate(action.url(menuRow));
                                      }
                                    }}
                                    sx={{
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: 1,
                                      py: 1,
                                      px: 2,
                                      fontSize: 14,
                                      color:
                                        action.label === 'Eliminar'
                                          ? '#d32f2f'
                                          : (theme) =>
                                              theme.palette.mode === 'dark' ? '#fff' : '#212121',
                                      '&:hover': {
                                        backgroundColor: (theme) =>
                                          theme.palette.mode === 'dark'
                                            ? 'rgba(36, 36, 36, 0.54)'
                                            : 'rgba(0, 0, 0, 0.04)',
                                      },
                                    }}
                                  >
                                    {action.icon && (
                                      <span
                                        style={{
                                          fontSize: 18,
                                          display: 'flex',
                                          alignItems: 'center',
                                          color:
                                            action.label === 'Eliminar' ? '#d32f2f' : 'inherit',
                                        }}
                                      >
                                        {action.icon}
                                      </span>
                                    )}
                                    <span
                                      style={action.label === 'Eliminar' ? { color: '#d32f2f' } : {}}
                                    >
                                      {action.label}
                                    </span>
                                  </MenuItem>
                                )
                              )}
                            </Menu>
                          </>
                        )}
                      </TableCell>
                    )}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Box>
      )}

      <TablePagination
        component="div"
        count={safeTotal}
        page={safePage}
        rowsPerPage={safeRowsPerPage}
        onPageChange={(e, newPage) => {
          if (newPage >= 0 && newPage < totalPages) {
            onPageChange?.(e, newPage);
          }
        }}
        onRowsPerPageChange={(e) => onRowsPerPageChange?.(e)}
        rowsPerPageOptions={[5, 10, 25, 50]}
        sx={{
          '& .MuiTablePagination-toolbar': { py: 1, px: 2 },
          borderTop: (theme) =>
            `1px solid ${
              theme.palette.mode === 'dark' ? 'rgb(140, 140, 140)' : 'rgba(0,0,0,0.12)'
            }`,
        }}
      />
    </>
  );
};
