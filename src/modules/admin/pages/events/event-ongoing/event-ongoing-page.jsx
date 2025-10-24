import { Box, Typography, CircularProgress } from '@mui/material';
import { AccessTime } from '@mui/icons-material';
import { TableComponent } from "../../../../../shared/ui/components";
import { useQuotationStore } from '../../../../../hooks';
import { useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { formatDay } from "../../../../../shared/utils";

export const EventOnGoing = () => {
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
    setOrderBy,
    setOrder,
    setPageGlobal,
    setRowsPerPageGlobal,
    startLoadingQuotationPaginated,
    setSelectedQuotation,
  } = useQuotationStore();

  const navigate = useNavigate();

  const columns = [
    { 
      id: "event_code", 
      label: "Evento", 
      sortable: false 
    },
    {
      id: "client_info",
      label: "Cliente",
      sortable: false,
      accessor: (row) => {
        if (row.client_info.client_type === "Persona") {
          return row.client_info.first_name && row.client_info.last_name
            ? `${row.client_info.first_name} ${row.client_info.last_name}`
            : "N/A";
        }
        if (row.client_info.client_type === "Empresa") {
          return row.client_info.company_name || "N/A";
        }
        return "N/A";
      },
    },
    {
      id: "name",
      label: "Nombre Evento",
      sortable: false,
      accessor: (row) => row.name || "N/A",
    },
    {
      id: "phone",
      label: "Teléfono",
      sortable: false,
      accessor: (row) => row.client_info.phone || "N/A",
    },
    {
      id: "event_date",
      label: "Fecha",
      sortable: true,
      accessor: (row) => (row.event_date ? formatDay(row.event_date) : "N/A"),
    },
    { 
      id: "status", 
      label: "Estado", 
      sortable: false 
    },
  ];

  useEffect(() => {
    startLoadingQuotationPaginated(null, 2);
  }, []);

  const actions = [
    {
      label: 'Reprogramar Evento',
      icon: <AccessTime />,
      onClick: (row) => {
        setSelectedQuotation(row);
        navigate(`/admin/event-ongoing/reprogramming`);
      },
    },
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
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          sx={{ px: 3, py: 2 }}
        >
          <Box>
            <Typography sx={{ fontWeight: 600, fontSize: 24 }}>
              Listado de Eventos en Seguimiento
            </Typography>
            <Typography sx={{ color: "text.secondary", fontSize: 16 }}>
              Administra los eventos que están en seguimiento
            </Typography>
          </Box>
        </Box>
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
