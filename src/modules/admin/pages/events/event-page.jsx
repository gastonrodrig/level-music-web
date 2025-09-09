import React, { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  TableSortLabel,
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import MoreVertIcon from '@mui/icons-material/MoreVert';

export const EventPage = () => {
  // Datos de ejemplo (reemplaza con tu fetch/API)
  const initialRows = [
    { id: 1, nombre: 'Concierto Rock', fecha: '2025-05-15', ubicacion: 'Lima',  estado: 'Activo' },
    { id: 2, nombre: 'Feria de Arte',   fecha: '2025-06-01', ubicacion: 'Cusco', estado: 'Inactivo' },
    // …más eventos
  ];

  const [order, setOrder]     = useState('asc');        // 'asc' o 'desc'
  const [orderBy, setOrderBy] = useState('nombre');     // campo por el que ordenas
  const [anchorEl, setAnchorEl] = useState(null);       // para el menú de acciones

  // Alterna dirección y columna
  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  // Reordena rows según order/orderBy
  const sortedRows = useMemo(() => {
    return [...initialRows].sort((a, b) => {
      const aVal = a[orderBy].toString().toLowerCase();
      const bVal = b[orderBy].toString().toLowerCase();
      if (aVal < bVal) return order === 'asc' ? -1 : 1;
      if (aVal > bVal) return order === 'asc' ? 1 : -1;
      return 0;
    });
  }, [initialRows, order, orderBy]);

  const handleMenuOpen = (e) => setAnchorEl(e.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  return (
    <>
      {/* Card Container */}
      <Box sx={{ borderRadius: 2, border: '1px solid rgba(0, 0, 0, 0.12)' }}>
        {/* Header */}
        <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ p: 3 }}>
          <Box>
            <Typography gutterBottom sx={{ fontWeight: 600, fontSize: 24 }}>
              Listado de eventos
            </Typography>
            <Typography sx={{ color: 'text.secondary', fontSize: 16 }}>
              Administra tus eventos
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddCircleOutlineIcon />}
            sx={{
              backgroundColor: '#212121',
              color: '#FFFFFF',
              borderRadius: '16px',
              textTransform: 'none',
              px: 3,
              py: 1.5,
              boxShadow: 'none',
              border: '1px solid rgba(255,255,255,0.2)',
              '&:hover': {
                backgroundColor: '#424242',
                boxShadow: 'none',
              },
            }}
          >
            Agregar evento
          </Button>
        </Box>

        {/* Tabla */}
        <Table>
          <TableHead>
            <TableRow>
              {/* Nombre */}
              <TableCell sortDirection={orderBy === 'nombre' ? order : false}>
                <TableSortLabel
                  active={orderBy === 'nombre'}
                  direction={orderBy === 'nombre' ? order : 'asc'}
                  onClick={() => handleRequestSort('nombre')}
                  hideSortIcon={false}
                  sx={{ '& .MuiTableSortLabel-icon': { opacity: 1 } }}
                >
                  Nombre
                </TableSortLabel>
              </TableCell>

              {/* Fecha */}
              <TableCell sortDirection={orderBy === 'fecha' ? order : false}>
                <TableSortLabel
                  active={orderBy === 'fecha'}
                  direction={orderBy === 'fecha' ? order : 'asc'}
                  onClick={() => handleRequestSort('fecha')}
                  hideSortIcon={false}
                  sx={{ '& .MuiTableSortLabel-icon': { opacity: 1 } }}
                >
                  Fecha
                </TableSortLabel>
              </TableCell>

              {/* Ubicación */}
              <TableCell sortDirection={orderBy === 'ubicacion' ? order : false}>
                <TableSortLabel
                  active={orderBy === 'ubicacion'}
                  direction={orderBy === 'ubicacion' ? order : 'asc'}
                  onClick={() => handleRequestSort('ubicacion')}
                  hideSortIcon={false}
                  sx={{ '& .MuiTableSortLabel-icon': { opacity: 1 } }}
                >
                  Ubicación
                </TableSortLabel>
              </TableCell>

              {/* Estado */}
              <TableCell sortDirection={orderBy === 'estado' ? order : false}>
                <TableSortLabel
                  active={orderBy === 'estado'}
                  direction={orderBy === 'estado' ? order : 'asc'}
                  onClick={() => handleRequestSort('estado')}
                  hideSortIcon={false}
                  sx={{ '& .MuiTableSortLabel-icon': { opacity: 1 } }}
                >
                  Estado
                </TableSortLabel>
              </TableCell>

              {/* Acción (sin orden) */}
              <TableCell align="right">Acción</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {sortedRows.map((row) => (
              <TableRow hover key={row.id}>
                <TableCell>{row.nombre}</TableCell>
                <TableCell>{row.fecha}</TableCell>
                <TableCell>{row.ubicacion}</TableCell>
                <TableCell>
                  <Chip
                    label={row.estado}
                    color={row.estado === 'Activo' ? 'success' : 'default'}
                    size="small"
                  />
                </TableCell>
                <TableCell align="right">
                  <IconButton onClick={handleMenuOpen}>
                    <MoreVertIcon />
                  </IconButton>
                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                    PaperProps={{
                      sx: {
                        borderRadius: 2,
                        minWidth: 180,
                        boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
                        border: '1px solid rgba(0, 0, 0, 0.12)',
                      },
                    }}
                  >
                    <MenuItem
                      onClick={handleMenuClose}
                      sx={{
                        fontSize: '14px',
                        fontWeight: 500,
                        '&:hover': { backgroundColor: '#EF7E1B', color: 'white' },
                      }}
                    >
                      Editar evento
                    </MenuItem>
                    <MenuItem
                      onClick={handleMenuClose}
                      sx={{
                        fontSize: '14px',
                        fontWeight: 500,
                        '&:hover': { backgroundColor: '#EF7E1B', color: 'white' },
                      }}
                    >
                      Ver detalles
                    </MenuItem>
                    <MenuItem
                      onClick={handleMenuClose}
                      sx={{
                        fontSize: '14px',
                        fontWeight: 500,
                        color: 'error.main',
                        '&:hover': { backgroundColor: '#EF7E1B', color: 'white' },
                      }}
                    >
                      Eliminar evento
                    </MenuItem>
                  </Menu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
    </>
  );
};
