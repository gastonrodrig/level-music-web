import { useEffect, useState } from 'react';
import { Box, Typography, Button, TextField, CircularProgress, Modal, List, ListItem, ListItemText } from '@mui/material';
import { useQuotationStore, useAuthStore } from '../../../../hooks';
import { TableComponent } from '../../../../shared/ui/components';

export const QuotationPage = () => {
  const {
    quotations,
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
    startLoadingUserEvents,
  } = useQuotationStore();

  const { _id } = useAuthStore();

  const [openModal, setOpenModal] = useState(false);
  const [selectedServices, setSelectedServices] = useState([]);

  useEffect(() => {
    if (_id) startLoadingUserEvents(_id);
  }, [_id]);

  const handleOpenServices = (services) => {
    setSelectedServices(services);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedServices([]);
  };

  const columns = [
    { id: 'event_code', label: 'Código Evento', sortable: false },
    { id: 'exact_address', label: 'Dirección', sortable: false },
    { id: 'place_size', label: 'Capacidad', sortable: false },
    { id: 'date', label: 'Fecha Evento', sortable: true },
    { id: 'estimated_price', label: 'Precio Estimado', sortable: true },
    { id: 'final_price', label: 'Precio Final', sortable: true },
    { id: 'status', label: 'Estado', sortable: false },
    { id: 'services', label: 'Servicios', sortable: false },
  ];

  const mappedQuotations = quotations.map(q => ({
    event_code: q.event_code,
    exact_address: q.exact_address,
    place_size: q.place_size,
    date: new Date(q.date).toLocaleDateString('es-PE'),
    estimated_price: q.estimated_price ? `S/ ${q.estimated_price}` : 'Pendiente',
    final_price: q.final_price ? `S/ ${q.final_price}` : 'Pendiente',
    status: q.final_price > 0 ? 'Cotizado' : 'Pendiente',
    
    services: (
      <Button size="small" variant="outlined"sx={{ 
      backgroundColor: '#1F1F1F', 
      
       
    }} onClick={() => handleOpenServices(q.services_requested)}>
        Ver Servicios
      </Button>
    ),
  }));

  return (
    <>
      <Box sx={{ borderRadius: 2, border: (theme) => `1px solid ${theme.palette.mode === 'dark' ? 'rgb(140, 140, 140)' : 'rgba(0,0,0,0.12)'}` }}>
        {/* Header */}
        <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ px: 3, py: 2 }}>
          <Box>
            <Typography sx={{ fontWeight: 600, fontSize: 24 }}>Listado de cotizaciones</Typography>
            <Typography sx={{ color: 'text.secondary', fontSize: 16 }}>Observa las cotizaciones de tus eventos solicitados</Typography>
          </Box>
        </Box>

        {/* Buscador */}
        <Box display="flex" justifyContent="start" alignItems="center" sx={{ px: 3, pb: { xs: 1, lg: 3 }, width: { xs: '100%', sm: '300px' } }}>
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
          <Box display="flex" justifyContent="center" alignItems="center" sx={{ py: 5 }}>
            <CircularProgress />
          </Box>
        ) : quotations.length === 0 ? (
          <Box display="flex" justifyContent="center" alignItems="center" sx={{ py: 5 }}>
            <Typography sx={{ color: 'text.secondary', fontSize: 16 }}>
              No se encontraron resultados.
            </Typography>
          </Box>
        ) : (
          <TableComponent
            rows={mappedQuotations}
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
          />
        )}
      </Box>

      {/* Modal de Servicios */}
      <Modal open={openModal} onClose={handleCloseModal}>
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', borderRadius: 2, p: 4 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>Servicios del Evento</Typography>
          <List>
            {selectedServices.map((s, index) => (
              <ListItem key={index}>
                <ListItemText primary={s.service_type_name} secondary={s.details || 'Sin detalles'} />
              </ListItem>
            ))}
          </List>
          <Button fullWidth onClick={handleCloseModal}>Cerrar</Button>
        </Box>
      </Modal>
    </>
  );
};
