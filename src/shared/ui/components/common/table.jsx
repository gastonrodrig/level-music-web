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
import { useScreenSizes } from '../../../constants/screen-width';
import { useNavigate } from 'react-router-dom';

export const TableComponent = ({
  rows,
  columns,
  order,
  orderBy,
  onRequestSort,
  page,
  rowsPerPage,
  total,
  onPageChange,
  onRowsPerPageChange,
  actions,
  hasActions = false, // Nuevo prop, por defecto false
}) => {
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

  const canShowActions = (row) =>
  hasActions &&
  actions &&
  !['finalizado', 'cancelado'].includes(String(row?.status || '').toLowerCase());

  const sortedRows = useMemo(() => {
    return [...rows].sort((a, b) => {
      const aVal = a[orderBy]?.toString().toLowerCase();
      const bVal = b[orderBy]?.toString().toLowerCase();
      if (aVal < bVal) return order === 'asc' ? -1 : 1;
      if (aVal > bVal) return order === 'asc' ? 1 : -1;
      return 0;
    });
  }, [rows, order, orderBy]);

  const totalPages = Math.ceil(total / rowsPerPage);

  return (
    <>
      {!isLg ? (
        <Box
          sx={{
            maxHeight: '625px',
            overflowY: isLg ? (sortedRows.length > 6 ? 'auto' : 'hidden') : (sortedRows.length > 2 ? 'auto' : 'hidden'),
            display: 'grid',
            gridTemplateColumns: isMd ? 'repeat(2, 1fr)' : '1fr',
            gap: 2,
            p: 2,
          }}
        >
          {sortedRows.map((row) => (
            <Card 
              key={row._id} 
              sx={{ 
                borderRadius: 3, 
                border: (theme) => `1px solid ${theme.palette.mode === 'dark' ? 'rgb(140, 140, 140)' : 'rgba(224, 224, 224, 1)'}`, 
                boxShadow: 'none', 
                backgroundColor: 'inherit',
                position: 'relative' 
              }}
            >

              {canShowActions(row) && (
                <IconButton
                  size="small"
                  onClick={(e) => handleMenuOpen(e, row)}
                  sx={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                  }}
                >
                  <MoreVertIcon fontSize="small" />
                </IconButton>
              )}
              <CardContent>
                {columns.map((column) => (
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
                      ) : (
                        column.accessor ? column.accessor(row) : row[column.id]
                      )}
                    </Typography>
                  </Box>
                ))}
              </CardContent>

              {hasActions && actions && (
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                  PaperProps={{
                    sx: {
                      borderRadius: 4,
                      backgroundColor: (theme) => theme.palette.mode === 'dark' ? 'rgb(0, 0, 0)' : '#FFFFFF',
                      boxShadow: '0px 2px 6px rgba(0, 0, 0, 0.08)',
                      py: 1,
                    },
                  }}
                >
                  {actions.map((action, index) => (
                    <MenuItem
                      key={`${menuRow?._id}-action-${index}`}
                      onClick={() => {
                        handleMenuClose();
                        if (action.onClick) {
                          action.onClick(menuRow);
                        }
                        if (action.url) {
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
                        color: (theme) => theme.palette.mode === 'dark' ? '#fff' : '#212121',
                        '&:hover': {
                          backgroundColor: (theme) => theme.palette.mode === 'dark' ? 'rgba(36, 36, 36, 0.54)' : 'rgba(0, 0, 0, 0.04)',
                        },
                      }}
                    >
                      {action.icon && (
                        <span style={{ fontSize: 18, display: 'flex', alignItems: 'center', color: action.label === 'Eliminar' ? '#d32f2f' : 'inherit' }}>
                          {action.icon}
                        </span>
                      )}
                      {action.label}
                    </MenuItem>
                  ))}
                </Menu>
              )}
            </Card>
          ))}
        </Box>
      ) : (
        <Box
          sx={{
            height: '335px',
            overflowY: rows.length > 5 ? 'auto' : 'hidden',
          }}
        >
          <Table size="small" stickyHeader>
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    sortDirection={orderBy === column.id ? order : false}
                    sx={{ 
                      borderTop: (theme) => `1px solid ${theme.palette.mode === 'dark' ? 'rgb(140, 140, 140)' : 'rgba(224, 224, 224, 1)'}`, 
                      borderBottom: (theme) => `1px solid ${theme.palette.mode === 'dark' ? 'rgb(140, 140, 140)' : 'rgba(224, 224, 224, 1)'}`,
                      p: 2, 
                      backgroundColor: theme => theme.palette.mode === 'dark' ? '#1F1F1F' : '#f5f5f5', 
                      fontWeight: 600,
                      maxWidth: column.width || 'auto',
                      whiteSpace: column.truncate ? 'nowrap' : 'normal',
                      overflow: column.truncate ? 'hidden' : 'visible',
                      textOverflow: column.truncate ? 'ellipsis' : 'clip'
                    }}
                  >
                    {column.sortable ? (
                      <TableSortLabel
                        active={orderBy === column.id}
                        direction={orderBy === column.id ? order : 'asc'}
                        onClick={() => onRequestSort(column.id)}
                        sx={{ '& .MuiTableSortLabel-icon': { opacity: 1 } }}
                      >
                        {column.label}
                      </TableSortLabel>
                    ) : (
                      column.label
                    )}
                  </TableCell>
                ))}
                {hasActions && actions && (
                  <TableCell 
                    align="right"
                    sx={{ 
                      borderTop: (theme) => `1px solid ${theme.palette.mode === 'dark' ? 'rgb(140, 140, 140)' : 'rgba(224, 224, 224, 1)'}`,
                      borderBottom: (theme) => `1px solid ${theme.palette.mode === 'dark' ? 'rgb(140, 140, 140)' : 'rgba(224, 224, 224, 1)'}`,
                      backgroundColor: theme => theme.palette.mode === 'dark' ? '#1F1F1F' : '#f5f5f5', 
                      fontWeight: 600 
                    }}
                  >
                    Acción
                  </TableCell>
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedRows.map((row, index) => (
                <TableRow
                  hover
                  key={row._id}
                  sx={{
                    '&:last-child td': rows.length >= 5 ? { borderBottom: 'none' } : {},
                  }}
                >
                  {columns.map((column) => (
                    <TableCell 
                      key={`${row._id}-${column.id}`}
                      sx={{
                        p: column.id === 'status' ? 0 : 2,
                        pl: column.id === 'status' ? 2 : 2,
                        fontSize: 16,
                        maxWidth: column.width || 'auto',
                        whiteSpace: column.truncate ? 'nowrap' : 'normal',
                        overflow: column.truncate ? 'hidden' : 'visible',
                        textOverflow: column.truncate ? 'ellipsis' : 'clip'
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
                      ) : (
                        column.accessor ? column.accessor(row) : row[column.id]
                      )}
                    </TableCell>
                  ))}
                  {hasActions && actions && (
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
                            backgroundColor: (theme) => theme.palette.mode === 'dark' ? 'rgb(0, 0, 0)' : '#FFFFFF',
                            boxShadow: '0px 2px 6px rgba(0, 0, 0, 0.08)',
                            py: 1,
                          },
                        }}
                      >
                        
                        {actions.map((action, index) => (
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
                              color: (theme) => theme.palette.mode === 'dark' ? '#fff' : '#212121',
                              '&:hover': {
                                backgroundColor: (theme) => theme.palette.mode === 'dark' ? 'rgba(36, 36, 36, 0.54)' : 'rgba(0, 0, 0, 0.04)',
                              },
                            }}
                          >
                            {action.icon && (
                              <span style={{ fontSize: 18, display: 'flex', alignItems: 'center', color: action.label === 'Eliminar' ? '#d32f2f' : 'inherit' }}>
                                {action.icon}
                              </span>
                            )}
                            {action.label}
                          </MenuItem>
                        ))}
                      </Menu>
                      </>
                      )}
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      )}
      <TablePagination
        component="div"
        count={total || 0}
        page={Math.min(page, totalPages - 1)}
        rowsPerPage={rowsPerPage || 5}
        onPageChange={(e, newPage) => {
          if (newPage >= 0 && newPage < totalPages) {
            onPageChange(e, newPage);
          }
        }}
        onRowsPerPageChange={onRowsPerPageChange}
        rowsPerPageOptions={[5, 10, 25, 50]}
        sx={{ 
          '& .MuiTablePagination-toolbar': { py: 1, px: 2 }, 
          borderTop: (theme) => `1px solid ${theme.palette.mode === 'dark' ? 'rgb(140, 140, 140)' : 'rgba(0,0,0,0.12)'}`, 
        }}
      />
    </>
  );
};
