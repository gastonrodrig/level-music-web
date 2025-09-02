import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  CircularProgress,
} from "@mui/material";
import { AddCircleOutline, Edit } from "@mui/icons-material";
import { useEventFeaturedStore } from "../../../../hooks";
import { TableComponent } from "../../../../shared/ui/components";
import { EventFeaturedModal } from "../../components";
import { useScreenSizes } from "../../../../shared/constants/screen-width";

export const EventFeaturedPage = () => {
  const {
    eventFeatured,
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
    startLoadingEventFeaturedPaginated,
    setSelectedEventFeatured,
  } = useEventFeaturedStore();

  const { isLg } = useScreenSizes();
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    startLoadingEventFeaturedPaginated();
  }, [currentPage, rowsPerPage, searchTerm, orderBy, order]);

  const openModal = (payload) => {
    setSelectedEventFeatured(payload);
    setIsModalOpen(true);
  };

  const columns = [
    { id: "title", label: "Título", sortable: true },
  ];

  const actions = [
    {
      label: "Editar",
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
            `1px solid ${
              theme.palette.mode === "dark"
                ? "rgb(140, 140, 140)"
                : "rgba(0,0,0,0.12)"
            }`,
        }}
      >
        {/* Header con título y botón */}
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          sx={{ px: 3, py: 2 }}
        >
          <Box>
            <Typography sx={{ fontWeight: 600, fontSize: 24 }}>
              Listado de eventos destacados
            </Typography>
            <Typography sx={{ color: "text.secondary", fontSize: 16 }}>
              Administra los eventos destacados
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddCircleOutline />}
            sx={{
              backgroundColor: "#212121",
              color: "#fff",
              borderRadius: 2,
              textTransform: "none",
              px: 3,
              py: 1.5,
            }}
            onClick={() => openModal()}
          >
            {isLg ? "Agregar Evento Destacado" : "Agregar"}
          </Button>
        </Box>

        {/* Barra de búsqueda */}
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

        {/* Tabla o estado de carga */}
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" sx={{ py: 5 }}>
            <CircularProgress />
          </Box>
        ) : eventFeatured.length === 0 ? (
          <Box display="flex" justifyContent="center" alignItems="center" sx={{ py: 5 }}>
            <Typography sx={{ color: "text.secondary", fontSize: 16 }}>
              No se encontraron resultados.
            </Typography>
          </Box>
        ) : (
          <TableComponent
            rows={eventFeatured}
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

      {/* Modal */}
      <EventFeaturedModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        eventFeatured={selected}
        setEventFeatured={setSelectedEventFeatured}
        loading={loading}
      />
    </Box>
  );
};
