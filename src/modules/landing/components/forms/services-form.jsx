import React, { useEffect, useState } from "react";
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Stack,
  CircularProgress,
  Alert,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import {
  Done as DoneIcon,
  MusicNote as MusicIcon,
  PhotoCamera as CameraIcon,
  Restaurant as UtensilsIcon,
  LocalFlorist as FlowerIcon,
  Group as UsersIcon,
  Add as PlusIcon,
  Edit as EditIcon,
  Lightbulb as LightIcon,
  Construction as StructureIcon,
  MiscellaneousServices as TechIcon,
} from "@mui/icons-material";

// Categorías disponibles
const CATEGORIES = {
  FOTOGRAFIA: "Fotografía",
  ENTRETENIMIENTO: "Entretenimiento",
  GASTRONOMIA: "Gastronomía",
  ESTRUCTURA: "Estructura",
  ILUMINACION: "Iluminación",
  DECORACION: "Decoración",
  SERVICIO: "Servicio",
  TECNOLOGIA: "Tecnología",
  PERSONALIZADO: "Personalizado",
};

// Iconos por categoría
const categoryIcon = {
  [CATEGORIES.ENTRETENIMIENTO]: <MusicIcon fontSize="small" />,
  [CATEGORIES.FOTOGRAFIA]: <CameraIcon fontSize="small" />,
  [CATEGORIES.GASTRONOMIA]: <UtensilsIcon fontSize="small" />,
  [CATEGORIES.ESTRUCTURA]: <StructureIcon fontSize="small" />,
  [CATEGORIES.DECORACION]: <FlowerIcon fontSize="small" />,
  [CATEGORIES.ILUMINACION]: <LightIcon fontSize="small" />,
  [CATEGORIES.SERVICIO]: <UsersIcon fontSize="small" />,
  [CATEGORIES.TECNOLOGIA]: <TechIcon fontSize="small" />,
  [CATEGORIES.PERSONALIZADO]: <PlusIcon fontSize="small" />,
};

// Servicios mock basados en tu estructura real del backend
const mockServices = [
  {
    _id: "1",
    name: "DJ Profesional",
    description: "Música en vivo con equipo de sonido profesional",
    category: "Entretenimiento",
    status: "Activo",
    attributes: [
      { name: "Horas de servicio", type: "numero", required: true },
      { name: "Género musical", type: "texto", required: false },
    ],
  },
  {
    _id: "2",
    name: "Fotografía de Eventos",
    description: "Sesión fotográfica profesional del evento",
    category: "Fotografía",
    status: "Activo",
    attributes: [
      { name: "Horas de cobertura", type: "numero", required: true },
      { name: "Entrega digital", type: "select", required: true },
    ],
  },
  {
    _id: "3",
    name: "Catering Completo",
    description: "Servicio de alimentación para el evento",
    category: "Gastronomía",
    status: "Activo",
    attributes: [
      { name: "Número de personas", type: "numero", required: true },
      { name: "Tipo de menú", type: "texto", required: true },
    ],
  },
  {
    _id: "4",
    name: "Decoración Temática",
    description: "Ambientación y decoración personalizada",
    category: "Decoración",
    status: "Activo",
    attributes: [
      { name: "Tema", type: "texto", required: true },
      { name: "Área a decorar", type: "texto", required: false },
    ],
  },
  {
    _id: "5",
    name: "Iluminación Especial",
    description:
      "Sistema de iluminación LED personalizable con efectos ambientales",
    category: "Iluminación",
    status: "Activo",
    attributes: [{ name: "Horas de servicio", type: "texto", required: false }],
  },
  {
    _id: "6",
    name: "Sonido Profesional",
    description: "Equipos de audio de alta calidad para eventos",
    category: "Tecnología",
    status: "Activo",
    attributes: [
      { name: "Potencia requerida", type: "numero", required: true },
      { name: "Tipo de evento", type: "texto", required: true },
    ],
  },
  {
    _id: "7",
    name: "Servicio de Mozos",
    description: "Personal profesional para atención al cliente",
    category: "Servicio",
    status: "Activo",
    attributes: [
      { name: "Cantidad de mozos", type: "numero", required: true },
      { name: "Horario de servicio", type: "texto", required: false },
    ],
  },
  {
    _id: "8",
    name: "Estructura y Carpas",
    description: "Montaje de estructuras y carpas para eventos al aire libre",
    category: "Estructura",
    status: "Activo",
    attributes: [
      { name: "Área a cubrir", type: "numero", required: true },
      { name: "Tipo de estructura", type: "texto", required: true },
    ],
  },
];

// Componente principal
export const ServicesForm = ({ onChange }) => {
  const { setValue } = useFormContext();

  // Estados
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState(mockServices);
  const [error, setError] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);
  const [notesById, setNotesById] = useState({});
  const [attrValuesById, setAttrValuesById] = useState({});
  const [otherSelected, setOtherSelected] = useState(false);
  const [otherText, setOtherText] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Simular carga de datos (solo para demostración visual)
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      const activeServices = mockServices.filter(
        (service) => service.status === "Activo"
      );
      setItems(activeServices);
      setLoading(false);
    }, 800); // Simula carga de 0.8 segundos
  }, []);

  // Utilidades
  const isSelected = (id) => selectedIds.includes(id);

  const toggleService = (id) => {
    setSelectedIds((prev) => {
      const isCurrentlySelected = prev.includes(id);
      let newSelection;

      if (isCurrentlySelected) {
        newSelection = prev.filter((x) => x !== id);
        // Limpiar datos asociados
        const newNotes = { ...notesById };
        const newAttrs = { ...attrValuesById };
        delete newNotes[id];
        delete newAttrs[id];
        setNotesById(newNotes);
        setAttrValuesById(newAttrs);
      } else {
        newSelection = [...prev, id];
      }

      // Actualizar formulario
      setValue("additionalServices", newSelection.join(","));
      return newSelection;
    });
  };

  const openCustomize = (id) => {
    setEditingId(id);
    setDialogOpen(true);
  };

  const saveDialog = () => {
    setDialogOpen(false);
    setEditingId(null);

    // Actualizar formulario con notas y atributos
    setValue("serviceNotes", JSON.stringify(notesById));
    setValue("serviceAttributes", JSON.stringify(attrValuesById));
  };

  const updateNote = (id, note) => {
    setNotesById((prev) => ({ ...prev, [id]: note }));
  };

  const updateAttribute = (serviceId, attrName, value) => {
    setAttrValuesById((prev) => ({
      ...prev,
      [serviceId]: {
        ...prev[serviceId],
        [attrName]: value,
      },
    }));
  };

  // Agrupar servicios por categoría
  const categories = React.useMemo(() => {
    const grouped = {};
    items.forEach((item) => {
      const cat = item.category || "Sin categoría";
      if (!grouped[cat]) grouped[cat] = [];
      grouped[cat].push(item);
    });
    return grouped;
  }, [items]);

  // Obtener servicio actual para edición
  const editingService = editingId
    ? items.find((s) => s._id === editingId)
    : null;
  const currentNote = editingId ? notesById[editingId] || "" : "";
  const currentAttrs = editingId ? attrValuesById[editingId] || {} : {};

  // Notificar cambios al componente padre
  useEffect(() => {
    const payload = {
      services: selectedIds.map((id) => ({
        id,
        notes: notesById[id],
        attributes: attrValuesById[id],
      })),
      other: otherSelected ? otherText : undefined,
    };
    onChange?.(payload);
  }, [
    selectedIds,
    notesById,
    attrValuesById,
    otherSelected,
    otherText,
    onChange,
  ]);

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight={300}
      >
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Cargando servicios...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Servicios Adicionales
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Selecciona los servicios adicionales que necesitas para tu evento.
        Puedes personalizar cada servicio según tus necesidades.
      </Typography>

      {/* Indicador de servicios seleccionados */}
      {selectedIds.length > 0 && (
        <Alert severity="info" sx={{ mb: 3 }}>
          {selectedIds.length} servicio{selectedIds.length > 1 ? "s" : ""}{" "}
          seleccionado{selectedIds.length > 1 ? "s" : ""}
        </Alert>
      )}

      {/* Grid unificado de servicios en 3 columnas */}
      <Grid container spacing={3}>
        {items.map((service) => (
          <Grid item xs={12} sm={6} md={4} key={service._id}>
            <Card
              elevation={0}
              sx={{
                height: "100%",
                border: "1px solid",
                borderColor: isSelected(service._id)
                  ? "primary.main"
                  : "divider",
                bgcolor: isSelected(service._id)
                  ? "primary.50"
                  : "background.paper",
                transition: "all 0.2s ease",
                "&:hover": {
                  borderColor: "primary.main",
                  boxShadow: 2,
                },
              }}
            >
              <CardActionArea
                onClick={() => toggleService(service._id)}
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "stretch",
                }}
              >
                <CardHeader
                  avatar={categoryIcon[service.category]}
                  title={
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Typography variant="subtitle1" fontWeight={600}>
                        {service.name}
                      </Typography>
                      {isSelected(service._id) && (
                        <DoneIcon color="primary" fontSize="small" />
                      )}
                    </Stack>
                  }
                  subheader={
                    <Chip
                      size="small"
                      label={service.category}
                      variant="outlined"
                      sx={{ mt: 0.5 }}
                    />
                  }
                  sx={{ pb: 1 }}
                />
                <CardContent sx={{ pt: 0, flex: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    {service.description}
                  </Typography>

                  {service.attributes && service.attributes.length > 0 && (
                    <Box sx={{ mt: 1 }}>
                      <Typography variant="caption" color="text.secondary">
                        Campos configurables: {service.attributes.length}
                      </Typography>
                    </Box>
                  )}
                </CardContent>
              </CardActionArea>

              {isSelected(service._id) && (
                <Box
                  sx={{ p: 1, borderTop: "1px solid", borderColor: "divider" }}
                >
                  <Button
                    size="small"
                    startIcon={<EditIcon />}
                    onClick={(e) => {
                      e.stopPropagation();
                      openCustomize(service._id);
                    }}
                    fullWidth
                    variant="outlined"
                  >
                    Agregar detalles
                  </Button>
                </Box>
              )}
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Opción "Otro" */}
      <Box
        sx={{
          mt: 4,
          p: 3,
          border: "1px dashed",
          borderColor: "divider",
          borderRadius: 2,
        }}
      >
        <FormControlLabel
          control={
            <Checkbox
              checked={otherSelected}
              onChange={(e) => {
                setOtherSelected(e.target.checked);
                if (!e.target.checked) {
                  setOtherText("");
                  setValue("otherServices", "");
                }
              }}
            />
          }
          label="Otro servicio no listado"
        />

        {otherSelected && (
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Describe el servicio que necesitas"
            value={otherText}
            onChange={(e) => {
              setOtherText(e.target.value);
              setValue("otherServices", e.target.value);
            }}
            sx={{ mt: 2 }}
          />
        )}
      </Box>

      {/* Resumen de selección */}
      {(selectedIds.length > 0 || otherSelected) && (
        <Box sx={{ 
          mt: 4, 
          p: 3, 
          bgcolor: (theme) => theme.palette.mode === 'dark' ? 'grey.800' : 'grey.50', 
          borderRadius: 2 
        }}>
          <Typography variant="h6" gutterBottom>
            Tu Selección
          </Typography>

          {selectedIds.map((id) => {
            const service = items.find((s) => s._id === id);
            if (!service) return null;

            const hasCustomization =
              notesById[id] ||
              (attrValuesById[id] &&
                Object.keys(attrValuesById[id]).length > 0);

            return (
              <Box
                key={id}
                sx={{
                  mb: 2,
                  p: 2,
                  bgcolor: (theme) => theme.palette.mode === 'dark' ? 'grey.700' : 'white',
                  borderRadius: 1,
                  border: "1px solid",
                  borderColor: "divider",
                }}
              >
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Box>
                    <Typography variant="subtitle2" fontWeight={600}>
                      {service.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {service.category}
                    </Typography>
                    {hasCustomization && (
                      <Chip
                        size="small"
                        label="Personalizado"
                        color="primary"
                        sx={{ ml: 1 }}
                      />
                    )}
                  </Box>
                  <Button
                    size="small"
                    startIcon={<EditIcon />}
                    onClick={() => openCustomize(id)}
                    sx={{
                      color: (theme) => theme.palette.mode === 'dark' ? 'white' : 'primary.main'
                    }}
                  >
                    Editar
                  </Button>
                </Stack>

                {notesById[id] && (
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 1, fontStyle: "italic" }}
                  >
                    "{notesById[id]}"
                  </Typography>
                )}
              </Box>
            );
          })}

          {otherSelected && otherText && (
            <Box
              sx={{
                p: 2,
                bgcolor: (theme) => theme.palette.mode === 'dark' ? 'grey.700' : 'white',
                borderRadius: 1,
                border: "1px solid",
                borderColor: "divider",
              }}
            >
              <Typography variant="subtitle2" fontWeight={600}>
                Servicio Personalizado
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                {otherText}
              </Typography>
            </Box>
          )}
        </Box>
      )}

      {/* Modal de personalización */}
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            p: 0,
          },
        }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: "1px solid",
            borderColor: "divider",
            pb: 2,
          }}
        >
          <Typography variant="h6" fontWeight={600}>
            Personalizar: {editingService?.name}
          </Typography>
          <Button
            onClick={() => setDialogOpen(false)}
            sx={{ minWidth: "auto", p: 1 }}
            color="inherit"
          >
            ✕
          </Button>
        </DialogTitle>

        <DialogContent sx={{ p: 3 }}>
          <Typography variant="body1" fontWeight={500} sx={{ mb: 2 }}>
            Describe cómo quieres personalizar este servicio
          </Typography>

          <TextField
            fullWidth
            multiline
            rows={4}
            placeholder="Ejemplo: Música pop/rock, evitar reggaetón, incluir primera danza..."
            value={currentNote}
            onChange={(e) => updateNote(editingId, e.target.value)}
            variant="outlined"
            sx={{
              mb: 3,
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
              },
            }}
          />
        </DialogContent>

        <DialogActions
          sx={{
            p: 3,
            pt: 0,
            gap: 2,
            justifyContent: "flex-end",
          }}
        >
          <Button
            onClick={() => setDialogOpen(false)}
            variant="outlined"
            sx={{
              borderRadius: 2,
              px: 3,
              py: 1,
            }}
          >
            Cancelar
          </Button>
          <Button
            onClick={saveDialog}
            variant="contained"
            sx={{
              borderRadius: 2,
              px: 3,
              py: 1,
              bgcolor: "primary.main",
              "&:hover": {
                bgcolor: "primary.dark",
              },
            }}
          >
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
