import { Box, Typography, CircularProgress, TextField } from '@mui/material';
import { AccessTime, Inventory } from '@mui/icons-material';
import { TableComponent } from "../../../../../shared/ui/components";
import { useQuotationStore, useEventTypeStore } from '../../../../../hooks';
import { useEffect, useMemo } from 'react';
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
  const {
    eventTypes,
    startLoadingAllEventTypes,
  } = useEventTypeStore();

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
        if (row.client_type === "Persona") {
          return row.first_name && row.last_name
            ? `${row.first_name} ${row.last_name}`
            : "N/A";
        }
        if (row.client_type === "Empresa") {
          return row.company_name || "N/A";
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
      accessor: (row) => row.phone || "N/A",
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
    {
      id: "activities",
      label: "Actividades",
      sortable: false,
      accessor: (row) => {
        const cnt = getAttributesCountForRow(row);
        return `${cnt} actividades`;
      },
    },
  ];

  useEffect(() => {
    startLoadingQuotationPaginated(null, 2);
  }, []);

  const eventTypesMap = useMemo(() => {
    const map = {};
    (eventTypes || []).forEach((et) => {
      map[et._id] = et;
    });
    return map;
  }, [eventTypes]);

  const getAttributesArray = (eventType) => {
    if (!eventType) return [];
    const attrs = eventType.attributes;
    if (!attrs) return [];
    if (Array.isArray(attrs)) return attrs;
    try {
      return JSON.parse(attrs);
    } catch {
      return [];
    }
  };

  // 3) helper para contar atributos de un row (cotización)
  const getAttributesCountForRow = (row) => {
    const et = eventTypesMap[row.event_type] || eventTypesMap[row.event_type_id]; // adapta si usas event_type o event_type_id
    return getAttributesArray(et).length;
  };

  const actions = [
    {
      label: 'Ver Seguimiento',
      icon: <AccessTime />,
      onClick: (row) => {
        setSelectedQuotation(row);
         navigate(`/admin/event-ongoing/activities`);
      },
    },
    {
      label: 'Ver Ordenes',
      icon: <Inventory />,
      onClick: (row) => {
        setSelectedQuotation(row);
        navigate(`/admin/event-ongoing/orders`);
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

        <Box
          display="flex"
          justifyContent="start"
          alignItems="center"
          sx={{
            px: 3,
            pb: { xs: 1, lg: 3 },
            width: { xs: "100%", sm: "300px" },
          }}
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
