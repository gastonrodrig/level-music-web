import React, { useEffect } from 'react';
import { Box, Typography, TextField, CircularProgress, IconButton } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useReprogramingsEvent } from '../../../../../hooks';
import { TableComponent } from '../../../../../shared/ui/components';

export const RequestsPage = () => {
  const {
    reprogramings,
    total,
    loading,
    searchTerm,
    rowsPerPage,
    currentPage,
    orderBy,
    order,
    setSearchTerm,
    setRowsPerPageGlobal,
    setPageGlobal,
    setOrderBy,
    setOrder,
    startLoadingAllReprogramingsPaginated,
  } = useReprogramingsEvent();

  useEffect(() => {
    startLoadingAllReprogramingsPaginated();
  }, [currentPage, rowsPerPage, searchTerm, orderBy, order]);

  const columns = [
    {
      id: 'event_code',
      label: 'Código Evento',
      sortable: false,
      accessor: (row) => row.event_code || '',
    },
    {
      id: 'new_start_time',
      label: 'Hora Inicio',
      sortable: false,
      accessor: (row) =>
        row.new_start_time
          ? new Date(row.new_start_time).toLocaleString('es-PE')
          : '',
    },
    {
      id: 'new_end_time',
      label: 'Hora Fin',
      sortable: false,
      accessor: (row) =>
        row.new_end_time
          ? new Date(row.new_end_time).toLocaleString('es-PE')
          : '',
    },
    {
      id: 'reason',
      label: 'Razón',
      sortable: false,
    },
    {
      id: 'status',
      label: 'Estado',
      sortable: true,
    },
    {
      id: 'actions',
      label: 'Opciones',
      sortable: false,
      accessor: (row) => (
        <IconButton
          color="primary"
          onClick={() => {
            // Aquí puedes abrir un modal o mostrar detalles en el futuro
          }}
        >
          <VisibilityIcon />
        </IconButton>
      ),
    },
  ];

  return (
    <Box
      sx={{
        borderRadius: 2,
        border: (theme) =>
          `1px solid ${
            theme.palette.mode === 'dark'
              ? 'rgb(140, 140, 140)'
              : 'rgba(0,0,0,0.12)'
          }`,
      }}
    >
      {/* Header */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        sx={{ px: 3, py: 2 }}
      >
        <Box>
          <Typography sx={{ fontWeight: 600, fontSize: 24 }}>
            Solicitudes de Reprogramación
          </Typography>
          <Typography sx={{ color: 'text.secondary', fontSize: 16 }}>
            Consulta todas las solicitudes de reprogramación de eventos
          </Typography>
        </Box>
      </Box>

      {/* Buscador */}
      <Box
        display="flex"
        justifyContent="start"
        alignItems="center"
        sx={{ px: 3, pb: { xs: 1, lg: 3 }, width: { xs: '100%', sm: '300px' } }}
      >
        <TextField
          size="small"
          placeholder="Buscar..."
          value={searchTerm}
          fullWidth
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </Box>

      {/* Tabla o Loading */}
      {loading ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          sx={{ py: 5 }}
        >
          <CircularProgress />
        </Box>
      ) : reprogramings.length === 0 ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          sx={{ py: 5 }}
        >
          <Typography sx={{ color: 'text.secondary', fontSize: 16 }}>
            No se encontraron solicitudes.
          </Typography>
        </Box>
      ) : (
        <TableComponent
          rows={reprogramings}
          columns={columns}
          order={order}
          orderBy={orderBy}
          onRequestSort={(prop) => {
            const isAsc = orderBy === prop && order === 'asc';
            setOrder(isAsc ? 'desc' : 'asc');
            setOrderBy(prop);
          }}
          page={currentPage}
          rowsPerPage={rowsPerPage}
          total={total}
          onPageChange={(_, newPage) => setPageGlobal(newPage)}
          onRowsPerPageChange={(e) => {
            setRowsPerPageGlobal(parseInt(e.target.value, 10));
            setPageGlobal(0);
          }}
          hasActions={false}
        />
      )}
    </Box>
  );
};