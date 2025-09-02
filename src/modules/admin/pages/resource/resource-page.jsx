import { useEffect, useState } from 'react';
import { Box, Typography, Button, TextField, CircularProgress } from '@mui/material';
import { AddCircleOutline, Edit } from '@mui/icons-material';
import { useResourceStore } from '../../../../hooks/resource/use-resource-store';
import { TableComponent } from '../../../../shared/ui/components';
import { ResourceModal } from '../../components/resource/resource-modal';
import { useScreenSizes } from '../../../../shared/constants/screen-width';
import { formatDay } from '../../../../shared/utils';

export const ResourcePage = () => {
  const {
    resources,
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
    startLoadingResourcesPaginated,
    setSelectedResource
  } = useResourceStore();
  const { isLg } = useScreenSizes();

  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    startLoadingResourcesPaginated();
  }, [currentPage, rowsPerPage, searchTerm, orderBy, order]);

  const openModal = (payload) => {
    setSelectedResource(payload || {});
    setIsModalOpen(true);
  };

  const columns = [
    { 
      id: 'name', 
      label: 'Nombre', 
      sortable: true 
    },
    { 
      id: 'resource_type', 
      label: 'Tipo', 
      sortable: true 
    },
    { 
      id: 'serial_number', 
      label: 'N° de Serie', 
      sortable: true 
    },
    { 
      id: 'status', 
      label: 'Estado', 
      sortable: true 
    },
    { 
      id: 'location', 
      label: 'Locación', 
      sortable: true 
    },
    { 
      id: 'next_maintenance_date', 
      label: 'Próximo Mantenimiento (Preventivo)', 
      sortable: true, accessor: (row) => row.next_maintenance_date ? formatDay(row.next_maintenance_date) : 'N/A' 
    },
  ];

  const actions = [
    {
      label: 'Editar',
      icon: <Edit />,
      onClick: (row) => openModal(row),
    },
  ];

  return (
    <Box>
      <Box
        sx={{
          borderRadius: 2,
          border: (theme) =>
            `1px solid ${theme.palette.mode === 'dark' ? 'rgb(140, 140, 140)' : 'rgba(0,0,0,0.12)'}`
        }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ px: 3, py: 2 }}>
          <Box>
            <Typography sx={{ fontWeight: 600, fontSize: 24 }}>Listado de Recursos</Typography>
            <Typography sx={{ color: 'text.secondary', fontSize: 16 }}>Administra los recursos</Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddCircleOutline />}
            sx={{ backgroundColor: '#212121', color: '#fff', borderRadius: 2, textTransform: 'none', px: 3, py: 1.5 }}
            onClick={() => openModal()}
          >
            {isLg ? 'Agregar Recurso' : 'Agregar'}
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
        ) : resources.length === 0 ? (
          <Box display="flex" justifyContent="center" alignItems="center" sx={{ py: 5 }}>
            <Typography sx={{ color: 'text.secondary', fontSize: 16 }}>
              No se encontraron resultados.
            </Typography>
          </Box>
        ) : (
          <TableComponent
            rows={resources}
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

      <ResourceModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        resource={selected}
        setResource={setSelectedResource}
        loading={loading}
      />
    </Box>
  );
};
