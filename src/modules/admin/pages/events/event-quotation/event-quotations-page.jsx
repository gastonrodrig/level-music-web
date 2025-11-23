import { useEffect } from "react";
import {
  useEquipmentStore,
  useEventTypeStore,
  useQuotationStore,
  useServiceDetailStore,
  useServiceStore,
  useWorkerStore,
  useWorkerTypeStore,
} from "../../../../../hooks";
import { useScreenSizes } from "../../../../../shared/constants/screen-width";
import { TableComponent } from "../../../../../shared/ui/components";
import { formatDay } from "../../../../../shared/utils";
import { AddCircleOutline, Edit, Payments, History, CheckCircleOutline,Send,Assignment, CheckCircle } from "@mui/icons-material";
import { Box, Typography, Button, TextField, CircularProgress } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";

export const EventQuotationsPage = () => {
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
    setOrderBy,
    setOrder,
    setPageGlobal,
    setRowsPerPageGlobal,
    startLoadingQuotationPaginated,
    setSelectedQuotation,
  } = useQuotationStore();

  const { startLoadingAllEquipments } = useEquipmentStore();
  const { startLoadingAllWorkers } = useWorkerStore();
  const { startLoadingAllServiceDetails } = useServiceDetailStore();
  const { startLoadingAllServices } = useServiceStore();
  const { startLoadingAllWorkerTypes } = useWorkerTypeStore();
  const { startLoadingAllEventTypes } = useEventTypeStore();
  
  const { isLg } = useScreenSizes();
  const navigate = useNavigate();

  const columns = [
    { 
      id: "event_code", 
      label: "Evento", 
      sortable: false 
    },
    {
      id: "name",
      label: "Nombre del Evento",
      sortable: false,
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
      id: "event_type_name",
      label: "Tipo de Evento",
      sortable: false,
    },
    { 
      id: "status", 
      label: "Estado", 
      sortable: false 
    },
  ];

  useEffect(() => {
    startLoadingQuotationPaginated(null, 1);
    startLoadingAllEquipments();
    startLoadingAllWorkers();
    startLoadingAllServiceDetails();
    startLoadingAllServices();
    startLoadingAllWorkerTypes(); 
    startLoadingAllEventTypes();
  }, [currentPage, rowsPerPage, searchTerm, orderBy, order]);

  const handle = (row, path) => {
    setSelectedQuotation(row);
    navigate(path);
  };

  const actions = (row) => {
    const hasTasks = Array.isArray(row.tasks) && row.tasks.length > 0;

    // Estado 1: BORRADOR → Editar, Historial
    if (row.status === 'Borrador') {
      return [
        { label: 'Editar Cotización', icon: <Edit />, onClick: () => handle(row, '/admin/quotations/edit') },
        { label: 'Historial',         icon: <History />, onClick: () => handle(row, '/admin/quotations/history') },
      ];
    }

    // Estado 2-3: EN REVISIÓN
    if (row.status === 'En Revisión') {
      // Estado 2: después de editar → porcentajes completos pero tasks vacíos
      if (!hasTasks) {
        return [
          { label: 'Editar Cotización', icon: <Edit />,       onClick: () => handle(row, '/admin/quotations/edit') },
          { label: 'Actividades',       icon: <Assignment />, onClick: () => handle(row, '/admin/quotations/activities') },
          { label: 'Historial',         icon: <History />,    onClick: () => handle(row, '/admin/quotations/history') },
        ];
      }

      // Estado 3: tasks llenos → aparece Enviar Propuesta
      if (hasTasks) {
        return [
          { label: 'Editar Cotización', icon: <Edit />,       onClick: () => handle(row, '/admin/quotations/edit') },
          { label: 'Actividades',       icon: <Assignment />, onClick: () => handle(row, '/admin/quotations/activities') },
          { label: 'Historial',         icon: <History />,    onClick: () => handle(row, '/admin/quotations/history') },
          { label: 'Enviar Propuesta',  icon: <Send />,       onClick: () => handle(row, '/admin/quotations/send-proposal') },
        ];
      }
    }

    // Estado 4: ENVIADO → Historial
    if (row.status === 'Enviado') {
      return [
        { label: 'Historial',       icon: <History />,  onClick: () => handle(row, '/admin/quotations/history') },
      ];
    }

    // Estado 5: CONFIRMADO → Programar Pagos + Historial
    if (row.status === 'Confirmado') {
      return [
        { label: 'Programar Pagos', icon: <Payments />, onClick: () => handle(row, '/admin/quotations/payments-programming') },
        { label: 'Historial',       icon: <History />,  onClick: () => handle(row, '/admin/quotations/history') },
      ];
    }

    // Estado 6: PAGOS ASIGNADOS → Historial
    if (row.status === 'Pagos Asignados') {
      return [
        { label: 'Historial',       icon: <History />,  onClick: () => handle(row, '/admin/quotations/history') },
      ];
    }

    // Estado 6: POR VERIFICAR → Aprobar Pagos + Historial
    if (row.status === 'Por Verificar') {
      return [
        { label: 'Aprobar Pagos',   icon: <CheckCircle />, onClick: () => handle(row, '/admin/quotations/payments-approved') },
        { label: 'Historial',       icon: <History />,  onClick: () => handle(row, '/admin/quotations/history') },
      ];
    }

    return [];
  };

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
              Listado de cotizaciones
            </Typography>
            <Typography sx={{ color: "text.secondary", fontSize: 16 }}>
              Administra las cotizaciones
            </Typography>
          </Box>
          <Link to="/admin/quotations/new" style={{ textDecoration: 'none', color: 'inherit' }}>
            <Button
              variant="contained"
              startIcon={<AddCircleOutline />}
              onClick={() => setSelectedQuotation(null)}
              sx={{
                backgroundColor: "#212121",
                color: "#fff",
                borderRadius: 2,
                textTransform: "none",
                px: 3,
                py: 1.5,
              }}
            >
              {isLg ? "Agregar Cotización" : "Agregar"}
            </Button>
          </Link>
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
            actions={(row) => actions(row)}
            hasActions
          />
        )}
      </Box>
    </>
  );
};
