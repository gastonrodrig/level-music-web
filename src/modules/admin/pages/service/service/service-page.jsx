import { useEffect, useState } from 'react';
import { Box, Typography, Button, TextField, CircularProgress } from '@mui/material';
import { AddCircleOutline, Edit } from '@mui/icons-material';
import { useServiceStore } from '../../../../../hooks';
import { TableComponent } from '../../../../../shared/ui/components';
import { useScreenSizes } from '../../../../../shared/constants/screen-width';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

export const ServicePage = () => {
  const {
    services,
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
    startLoadingServicePaginated,
    setSelectedService,
  } = useServiceStore();

  const { isLg } = useScreenSizes();
  const navigate = useNavigate();

  useEffect(() => {
    startLoadingServicePaginated();
  }, [currentPage, rowsPerPage, searchTerm, orderBy, order]);

  const columns = [
    { id: 'provider_name', label: 'Proveedor', sortable: true },
    { id: 'service_type_name', label: 'Tipo de Servicio', sortable: true }
  ];

  const actions = [
    { 
      label: 'Editar', 
      icon: <Edit />, 
      onClick: (row) => {
        setSelectedService(row);
        navigate(`/admin/service/edit`);
      },
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
            <Typography sx={{ fontWeight: 600, fontSize: 24 }}>Listado de Servicios</Typography>
            <Typography sx={{ color: 'text.secondary', fontSize: 16 }}>Administra los servicios</Typography>
          </Box>
          <Link to="/admin/service/new" style={{ textDecoration: 'none', color: 'inherit' }}>
            <Button
              variant="contained"
              startIcon={<AddCircleOutline />}
              sx={{ backgroundColor: '#212121', color: '#fff', borderRadius: 2, textTransform: 'none', px: 3, py: 1.5 }}
            >
              {isLg ? 'Agregar Servicio' : 'Agregar'}
            </Button>
          </Link>
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
        ) : (services?.length ?? 0) === 0 ?  (
          <Box display="flex" justifyContent="center" alignItems="center" sx={{ py: 5 }}>
            <Typography sx={{ color: 'text.secondary', fontSize: 16 }}>
              No se encontraron resultados.
            </Typography>
          </Box>
        ) : (
          <TableComponent
            rows={services}
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
    </>
  );
};
