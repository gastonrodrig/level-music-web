import { useEffect, useState } from 'react';
import { Box, Typography, TextField, CircularProgress } from '@mui/material';
import { Edit, Download , FactCheck } from '@mui/icons-material';
import { useQuotationStore, useAuthStore } from '../../../../../hooks';
import { TableComponent } from '../../../../../shared/ui/components';
import { handleDownloadPdf } from '../../../../../modules/client/components/events';
import { useScreenSizes } from '../../../../../shared/constants/screen-width';
import { useNavigate } from 'react-router-dom';
import { formatDay } from '../../../../../shared/utils';
import { EventEvaluateModal } from '../../../components';


export const QuotationPage = () => {
  const {
    quotations,
    selected,
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
    setSelectedQuotation,
  } = useQuotationStore();
  
  const [isModalOpen, setIsModalOpen] = useState(false); 

  const { _id } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    startLoadingUserEvents(_id);
  }, [_id, currentPage, rowsPerPage, searchTerm, orderBy, order]);

  const openModal = (payload) => {
    setSelectedQuotation(payload);
    setIsModalOpen(true); 
  };

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
      label: 'Ver Detalle',
      icon: <Edit />,
      onClick: (row) => {
        setSelectedQuotation(row);
        navigate(`/cliente/event-quotes/details`);
      },
    },
    {
      label: 'Descargar PDF',
      icon: <Download />,
      onClick: (row) => {
        setSelectedQuotation(row);
        handleDownloadPdf(row);
      },
    },
    {
      label: 'Evaluar Cotización',
      icon: <FactCheck />,
      onClick: (row) => {
        openModal(row);
      },
        show: (row) => {
        const restricted = ["APROBADO", "RECHAZADO", "PAGO PARCIAL PAGADO"];
        const currentStatus = String(row?.status ?? "").toUpperCase();
        return !restricted.includes(currentStatus);
      },
    }
  ];

  return (
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
            Listado de Cotizaciones
          </Typography>
          <Typography sx={{ color: "text.secondary", fontSize: 16 }}>
            Observa las cotizaciones de tus eventos solicitados
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
      <EventEvaluateModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        quotationId={selected?._id} 
      />
    </Box>
  );
};
