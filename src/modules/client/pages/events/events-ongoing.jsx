import { useEffect, useState } from 'react';
import { Box, Typography, TextField, CircularProgress } from '@mui/material';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import { useQuotationStore, useAuthStore } from '../../../../hooks';
import { TableComponent } from '../../../../shared/ui/components';
import { formatDay } from '../../../../shared/utils';

export const EventsOngoingPage = () => {
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
    startLoadingQuotationPaginated,
    setSelectedQuotation,
    
    selected,
  } = useQuotationStore();

  const { _id } = useAuthStore();

  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    startLoadingQuotationPaginated(_id, 2);
  }, [_id, currentPage, rowsPerPage, searchTerm, orderBy, order]);

  const columns = [
    { 
      id: 'event_code', 
      label: 'Código Evento', 
      sortable: true 
    },
    { 
      id: 'event_type_name', 
      label: 'Tipo Evento', 
      sortable: true 
    },
    { 
      id: 'event_date', 
      label: 'Fecha Evento', 
      sortable: true, accessor: (row) => row.event_date ? formatDay(row.event_date) : 'N/A'
    },
    { 
      id: 'status', 
      label: 'Estado', 
      sortable: true 
    }
  ];

  const actions = [
    {
      label: 'NOSE',
      icon: <AutorenewIcon />,
      onClick: (row) => {
        setSelectedQuotation(row);
        setIsModalOpen(true);
      },
    }
  ];

  return (
    <>
      <Box
        sx={{
          borderRadius: 2,
          border: (theme) =>
            `1px solid ${
              theme.palette.mode === "dark"
                ? "rgb(140, 140, 140)"
                : "rgba(0,0,0,0.12)"
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
              Eventos por Realizar
            </Typography>
            <Typography sx={{ color: "text.secondary", fontSize: 16 }}>
              Observa los eventos que tienes pendientes por realizar
            </Typography>
          </Box>
        </Box>

        {/* Buscador */}
        <Box
          display="flex"
          justifyContent="start"
          alignItems="center"
          sx={{ px: 3, pb: { xs: 1, lg: 3 }, width: { xs: "100%", sm: "300px" } }}
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
        ) : quotations.length === 0 ? (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            sx={{ py: 5 }}
          >
            <Typography sx={{ color: "text.secondary", fontSize: 16 }}>
              No se encontraron resultados.
            </Typography>
          </Box>
        ) : (
          <TableComponent
            rows={quotations}
            columns={columns}
            order={order}
            orderBy={orderBy}
            onRequestSort={(prop) => {
              const isAsc = orderBy === prop && order === "asc";
              setOrder(isAsc ? "desc" : "asc");
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
