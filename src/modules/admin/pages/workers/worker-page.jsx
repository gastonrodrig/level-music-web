import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, TextField, CircularProgress } from '@mui/material';
import { AddCircleOutline, Edit } from '@mui/icons-material';
// Asegúrate de tener estos hooks y componentes creados
import { useWorkerStore, useWorkerTypeStore } from '../../../../hooks';
import { TableComponent } from '../../../../shared/ui/components';
import { WorkerModal } from '../../components';
import { useScreenSizes } from '../../../../shared/constants/screen-width';

export const WorkerPage = () => {
  const {
    workers,
    total,
    loading,
    searchTerm,
    rowsPerPage,
    currentPage,
    orderBy,
    order,
    selected,
    setSearchTerm,
    setRowsPerPageGlobal,
    setPageGlobal,
    setOrderBy,
    setOrder,
    startLoadingWorkerPaginated,
    setSelectedWorker,
  } = useWorkerStore();
  const { startLoadingAllWorkerTypes } = useWorkerTypeStore();
  const { isLg } = useScreenSizes();

  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    startLoadingWorkerPaginated();
    startLoadingAllWorkerTypes();
  }, [currentPage, rowsPerPage, searchTerm, orderBy, order]);

  const openModal = (payload) => {
    setSelectedWorker(payload);
    setIsModalOpen(true);
  };

  const columns = [
    { id: 'first_name', label: 'Nombre', sortable: true, width: '140px', truncate: true },
    { id: 'last_name', label: 'Apellido', sortable: true, width: '140px', truncate: true },
    { id: 'email', label: 'Correo', sortable: true, width: '140px', truncate: true },
    { id: 'phone', label: 'Teléfono', sortable: true, width: '140px', truncate: true },
    { id: 'worker_type_name', label: 'Tipo de Trabajador', sortable: true, width: '140px', truncate: true },
    { id: 'status', label: 'Estado', sortable: true, width: '140px', truncate: true },
  ];

  const actions = [
    {
      label: 'Editar',
      icon: <Edit />,
      onClick: (row) => openModal(row),
    },
  ];

  return (
    <>
      <Box
        sx={{
          borderRadius: 2,
          border: (theme) => `1px solid ${theme.palette.mode === 'dark' ? 'rgb(140, 140, 140)' : 'rgba(0,0,0,0.12)'}`
        }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ px: 3, py: 2 }}>
          <Box>
            <Typography sx={{ fontWeight: 600, fontSize: 24 }}>Listado de Trabajadores</Typography>
            <Typography sx={{ color: 'text.secondary', fontSize: 16 }}>Administra los trabajadores</Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddCircleOutline />}
            sx={{ backgroundColor: '#212121', color: '#fff', borderRadius: 2, textTransform: 'none', px: 3, py: 1.5 }}
            onClick={() => openModal()}
          >
            {isLg ? 'Agregar Trabajador' : 'Agregar'}
          </Button>
        </Box>

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

        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" sx={{ py: 5 }}>
            <CircularProgress />
          </Box>
        ) : workers.length === 0 ? (
          <Box display="flex" justifyContent="center" alignItems="center" sx={{ py: 5 }}>
            <Typography sx={{ color: 'text.secondary', fontSize: 16 }}>
              No se encontraron resultados.
            </Typography>
          </Box>
        ) : (
          <TableComponent
            rows={workers}
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
            actions={actions}
            hasActions
          />
        )}
      </Box>

      <WorkerModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        worker={selected}
        setWorker={setSelectedWorker}
        loading={loading}
      /> 
    </>
  );
};
