import { useEffect, useMemo, useState } from "react";
import { useFormContext } from "react-hook-form";
import {
  Box,
  Grid,
  Card,
  CardActionArea,
  CardContent,
  CardHeader,
  Chip,
  Typography,
  Button,
  Stack,
  CircularProgress,
  Alert,
  CardActions,
} from "@mui/material";
import { Done, Edit } from "@mui/icons-material";
import { useServiceTypeStore } from "../../../../hooks";
import { ServiceModal } from "../modal";
import { iconByCategory } from "../../constants";

export const ServicesForm = ({ onChange }) => {
  const { setValue } = useFormContext();
  const { serviceTypes, loading } = useServiceTypeStore();

  // util icono por categoría
  const getIcon = (cat) => iconByCategory[cat];

  // estado
  const [selectedIds, setSelectedIds] = useState([]);
  const [notesById, setNotesById] = useState({}); // id -> nota

  // modal
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // solo activos
  const items = useMemo(
    () => (serviceTypes || []).filter((s) => s.status === "Activo"),
    [serviceTypes]
  );

  const isSelected = (id) => selectedIds.includes(id);

  const toggleService = (id) => {
    setSelectedIds((prev) => {
      const already = prev.includes(id);
      const next = already ? prev.filter((x) => x !== id) : [...prev, id];

      // limpiar nota si se des-selecciona
      if (already) {
        setNotesById((p) => {
          const c = { ...p };
          delete c[id];
          return c;
        });
      }

      // sincronizar con RHF (por si lo consumes al enviar)
      setValue(
        "services_requested",
        next.map((sid) => ({
          service_type_id: sid,
          service_type_name: items.find((s) => s._id === sid)?.name ?? "",
          details: notesById[sid] ?? "",
        }))
      );

      return next;
    });
  };

  const openCustomize = (id) => {
    setEditingId(id);
    setDialogOpen(true);
  };

  const handleSaveNote = (note) => {
    if (!editingId) return;
    setNotesById((p) => ({ ...p, [editingId]: note }));

    // actualizar RHF con las notas actuales
    setValue(
      "services_requested",
      selectedIds.map((sid) => ({
        service_type_id: sid,
        service_type_name: items.find((s) => s._id === sid)?.name ?? "",
        details: sid === editingId ? note : (notesById[sid] ?? ""),
      }))
    );

    setDialogOpen(false);
    setEditingId(null);
  };

  // notificar arriba (opcional)
  useEffect(() => {
    onChange?.({
      services: selectedIds.map((id) => ({
        id,
        notes: notesById[id],
      })),
    });
  }, [selectedIds, notesById, onChange]);

  // loading
  if (loading) {
    return (
      <Box display="flex" alignItems="center" justifyContent="center" minHeight={260}>
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Cargando servicios…</Typography>
      </Box>
    );
  }

  return (
    <Box p={1}>
      <Typography variant="subtitle1" fontWeight={600} gutterBottom>
        Servicios Adicionales
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Selecciona los servicios adicionales que necesitas para tu evento. Puedes agregar notas
        específicas en cada uno.
      </Typography>

      {/* indicador # seleccionados */}
      {selectedIds.length > 0 && (
        <Alert severity="info" sx={{ mb: 3 }}>
          {selectedIds.length} servicio{selectedIds.length > 1 ? "s" : ""} seleccionado
          {selectedIds.length > 1 ? "s" : ""}.
        </Alert>
      )}

      {/* grid */}
      <Grid container spacing={3}>
        {items.map((service) => {
          const selected = isSelected(service._id);
          return (
            <Grid item xs={12} sm={6} md={4} key={service._id}>
              <Card
                elevation={0}
                sx={{
                  height: "100%",
                  border: "1px solid",
                  borderColor: selected ? "warning.main" : "divider",
                  bgcolor: selected ? "action.hover" : "background.paper",
                  transition: "all .2s ease",
                }}
              >
                <CardActionArea
                  onClick={() => toggleService(service._id)}
                  sx={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "stretch" }}
                >
                  <CardHeader
                    avatar={getIcon(service.category)}
                    title={
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <Typography variant="subtitle1" fontWeight={600}>
                          {service.name}
                        </Typography>
                        {selected && <Done color="warning" fontSize="small" />}
                      </Stack>
                    }
                    subheader={
                      <Chip
                        size="small"
                        label={service.category || "Servicio"}
                        variant="outlined"
                        sx={{ mt: .5 }}
                      />
                    }
                    sx={{ pb: 0.5 }}
                  />
                  <CardContent sx={{ pt: 0.5 }}>
                    <Typography variant="body2" color="text.secondary">
                      {service.description}
                    </Typography>
                  </CardContent>
                </CardActionArea>

                {/* acciones fijas para evitar salto de alto */}
                <CardActions
                  sx={{
                    p: 1,
                    borderTop: "1px solid",
                    borderColor: "divider",
                    height: 0,
                    visibility: selected ? "visible" : "hidden",
                  }}
                >
                  <Button
                    size="small"
                    startIcon={<Edit />}
                    onClick={(e) => {
                      e.stopPropagation();
                      openCustomize(service._id);
                    }}
                    fullWidth
                    variant="outlined"
                  >
                    Agregar detalles
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {/* Resumen de selección */}
      {selectedIds.length > 0 && (
        <Box
          mt={4}
          p={3}
          sx={{
            border: "1px dashed",
            borderColor: "divider",
            borderRadius: 2,
            bgcolor: (theme) =>
              theme.palette.mode === "dark"
                ? "rgba(255,255,255,0.05)"
                : "rgba(0,0,0,0.05)",
          }}
        >
          <Typography variant="h6" gutterBottom>
            Tu Selección
          </Typography>

          {selectedIds.map((id) => {
            const service = items.find((s) => s._id === id);
            if (!service) return null;
            const hasNote = !!notesById[id];

            return (
              <Box
                key={id}
                sx={{
                  mb: 2,
                  p: 2,
                  bgcolor: (theme) => (theme.palette.mode === "dark" ? "grey.700" : "white"),
                  borderRadius: 1,
                  border: "1px solid",
                  borderColor: "divider",
                }}
              >
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Box>
                    <Typography variant="subtitle2" fontWeight={600}>{service.name}</Typography>
                    <Typography variant="caption" color="text.secondary">{service.category}</Typography>
                    {hasNote && <Chip size="small" label="Personalizado" color="primary" sx={{ ml: 1 }} />}
                  </Box>
                  <Button
                    size="small"
                    startIcon={<Edit />}
                    onClick={() => openCustomize(id)}
                    sx={{ color: (t) => (t.palette.mode === "dark" ? "white" : "primary.main") }}
                  >
                    Editar
                  </Button>
                </Stack>

                {hasNote && (
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1, fontStyle: "italic" }}>
                    {notesById[id]}
                  </Typography>
                )}
              </Box>
            );
          })}
        </Box>
      )}

      {/* Modal para editar nota del servicio (incluye “Otros”) */}
      <ServiceModal
        open={dialogOpen}
        onClose={() => {
          setDialogOpen(false);
          setEditingId(null);
        }}
        service={items.find((s) => s._id === editingId)}
        initialNote={editingId ? notesById[editingId] || "" : ""}
        onSave={handleSaveNote}
      />
    </Box>
  );
};
