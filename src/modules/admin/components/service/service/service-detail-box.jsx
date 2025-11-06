import {
  Box,
  Typography,
  TextField,
  IconButton,
  Button,
  Grid,
  useTheme,
  Switch,
  Paper,
} from "@mui/material";
import { Delete, Add, Close, CalendarMonth, CloudUpload, CheckCircle, InsertDriveFile } from "@mui/icons-material";
import { useScreenSizes } from "../../../../../shared/constants/screen-width";
import { useState, useEffect } from "react";
import { ImagePreviewModal } from "../../../../../shared/ui/components/common";

const formatFileSize = (bytes) => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

export const ServiceDetailBox = ({
  index,
  register,
  errors,
  onDelete,
  onAddField,
  onRemoveField,
  fields = [],
  detailsCount,
  isEditMode,
  setValue,
  initialData = {},
  onOpenPrices, // 👈 función que abre el modal
}) => {
  const theme = useTheme();
  const { isMd } = useScreenSizes();
  const isDark = theme.palette.mode === "dark";

  const serviceDetailId = initialData._id;
  // Handler para el botón Ver Precios: si no hay _id, fuerza re-fetch antes de abrir el modal
  const handleOpenPrices = async () => {
    if (!serviceDetailId && typeof window.fetchServiceById === 'function') {
      // Si el detalle es nuevo, fuerza re-fetch del servicio (debe estar implementado en el store global)
      await window.fetchServiceById(initialData.service_id);
    }
    if (serviceDetailId) onOpenPrices(serviceDetailId);
  };
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [selectedPreview, setSelectedPreview] = useState(null); // <-- 1. AÑADIDO: Estado para la imagen seleccionada
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const MAX_FILES = 5;

 

    const handleOpenPreview = (url) => {
    if (url) {
      setSelectedPreview(url);
      setPreviewModalOpen(true);
    }
  };

  const handleClosePreview = () => {
    setPreviewModalOpen(false);
    setSelectedPreview(null); // <-- Buena práctica: limpiar al cerrar
  };
  useEffect(() => {
    const newUrls = selectedFiles.map(file => {
      // Solo creamos URL si es un tipo de imagen
      if (file.type.startsWith("image/")) {
        return URL.createObjectURL(file);
      }
      return null; // Será null para PDFs u otros
    });
    setPreviewUrls(newUrls);

    // Limpieza: revocar URLs al desmontar
    return () => newUrls.forEach(url => url && URL.revokeObjectURL(url));
  }, [selectedFiles]);

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    // Filtramos los archivos que ya están (por nombre) y aplicamos el límite
    const newFiles = files.filter(
      (newFile) => !selectedFiles.some((sf) => sf.name === newFile.name)
    );
    const updatedFiles = [...selectedFiles, ...newFiles].slice(0, MAX_FILES);
    setSelectedFiles(updatedFiles);
    // ¡CLAVE! Actualizamos react-hook-form
    // El 'detail_number' se usará en el hook 'useServiceStore' para crear el fieldname
    setValue(`serviceDetails.${index}.photos`, updatedFiles, { 
      shouldValidate: true, 
      shouldDirty: true 
    });
  };

  const handleRemoveFile = (fileName) => {
    const updatedFiles = selectedFiles.filter((file) => file.name !== fileName);
    setSelectedFiles(updatedFiles);
    
    // ¡CLAVE! Actualizamos react-hook-form
    setValue(`serviceDetails.${index}.photos`, updatedFiles, { 
      shouldValidate: true, 
      shouldDirty: true 
    });
  };

 

  return (
    <Box
      sx={{
        p: 3,
        borderRadius: 3,
        bgcolor: isDark ? "#1f1e1e" : "#f5f5f5",
        mb: 2,
      }}
    >
      {/* === ENCABEZADO === */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={5}
      >
        {/* Izquierda: título y estado */}
        <Box
          display="flex"
          flexDirection="column"
          alignItems="flex-start"
          gap={2}
        >
          <Grid
            item
            xs={12}
            sx={isEditMode ? { display: "flex" } : { display: "block" }}
          >
            <Typography variant="h6" fontWeight={600}>
              Detalle #{index + 1}
            </Typography>
            {isEditMode && (
              <Box sx={{ display: "flex", alignItems: "center", ml: 2, gap: 1 }}>
                <Switch
                  checked={initialData.status === "Activo"}
                  onChange={() =>
                    setValue(
                      `serviceDetails.${index}.status`,
                      initialData.status === "Activo" ? "Inactivo" : "Activo"
                    )
                  }
                  color="success"
                />
                <Typography sx={{ ml: 0 }}>
                  {initialData.status === "Activo" ? "Activo" : "Inactivo"}
                </Typography>

                {/* Botón Ver Precios: solo habilitado si hay _id */}
                {isMd ? (
                  <Button
                    variant="contained"
                    startIcon={<CalendarMonth />}
                    onClick={handleOpenPrices}
                    disabled={!serviceDetailId}
                    sx={{
                      textTransform: "none",
                      borderRadius: 2,
                      fontWeight: 600,
                      bgcolor: theme.palette.primary.main,
                      "&:hover": { bgcolor: theme.palette.primary.hover },
                      ml: 1,
                    }}
                  >
                    Ver Precios
                  </Button>
                ) : (
                  <IconButton
                    color="primary"
                    onClick={handleOpenPrices}
                    disabled={!serviceDetailId}
                    sx={{
                      bgcolor: theme.palette.primary.main,
                      color: "#fff",
                      borderRadius: "12px",
                      p: 0.5,
                      ml: 1,
                      "&:hover": { bgcolor: theme.palette.primary.dark },
                    }}
                  >
                    <CalendarMonth />
                  </IconButton>
                )}
              </Box>
            )}
          </Grid>

          <Typography fontSize={16} fontWeight={300}>
            Campos del servicio:
          </Typography>
        </Box>

        {/* Derecha: botones (Eliminar / Agregar campo). El botón de precios está a la izquierda ahora */}
        <Box display="flex" gap={1} flexDirection={isMd ? "column" : "row"}>
          {/* 🔹 Eliminar detalle */}
          {isMd ? (
            <Button
              variant="contained"
              onClick={onDelete}
              startIcon={<Delete />}
              color="error"
              sx={{
                textTransform: "none",
                borderRadius: 2,
                color: "#fff",
                fontWeight: 600,
              }}
              disabled={detailsCount === 1 || !!initialData._id}
            >
              Eliminar Detalle
            </Button>
          ) : (
            <IconButton
              color="error"
              onClick={onDelete}
              disabled={detailsCount === 1 || !!initialData._id}
            >
              <Delete />
            </IconButton>
          )}

          {/* 🔹 Agregar campo */}
          {isMd ? (
            <Button
              variant="contained"
              onClick={onAddField}
              startIcon={<Add />}
              sx={{
                textTransform: "none",
                borderRadius: 2,
                color: "#fff",
                fontWeight: 600,
              }}
            >
              Agregar Campo
            </Button>
          ) : (
            <IconButton
              color="primary"
              onClick={onAddField}
              sx={{
                bgcolor: theme.palette.primary.main,
                color: "#fff",
                borderRadius: "12px",
                "&:hover": { bgcolor: theme.palette.primary.dark },
              }}
            >
              <Add />
            </IconButton>
          )}
        </Box>
      </Box>

      {/* === CAMPOS === */}
      <Grid container spacing={2}>
        {/* Precio de referencia */}
        <TextField
          sx={{ ml: 2 }}
          label="Precio por hora de Referencia (S/.)"
          placeholder="Ingresa el precio de referencia"
          type="number"
          fullWidth
          InputLabelProps={{ shrink: true }}
          defaultValue={initialData.ref_price || ""}
          {...register(`serviceDetails.${index}.ref_price`, {
            required: "El precio es obligatorio",
            min: {
              value: 0,
              message: "El precio no puede ser negativo",
            },
          })}
          error={!!errors.serviceDetails?.[index]?.ref_price}
          helperText={errors.serviceDetails?.[index]?.ref_price?.message}
        />

        {/* Si no hay campos personalizados */}
        {fields.length === 0 ? (
          <Grid item xs={12}>
            <Typography color="text.secondary">
              No hay campos configurados para este detalle.
            </Typography>
          </Grid>
        ) : (
          fields.map((field, idx) => (
            <Grid item xs={12} sm={6} key={idx}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Box sx={{ flexGrow: 1 }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Typography fontWeight={500} mb={1}>
                      {field.name}{" "}
                      {field.required && (
                        <Typography component="span" color="error">
                          *
                        </Typography>
                      )}
                    </Typography>
                    <IconButton
                      onClick={() => onRemoveField(idx)}
                      color="error"
                      size="small"
                      sx={{ p: 0.5 }}
                    >
                      <Close fontSize="small" />
                    </IconButton>
                  </Box>
                  <TextField
                    fullWidth
                    defaultValue={initialData.details?.[field.name] || ""}
                    {...register(
                      `serviceDetails.${index}.details.${field.name}`,
                      {
                        required: "Campo requerido",
                      }
                    )}
                    error={
                      !!errors.serviceDetails?.[index]?.details?.[field.name]
                    }
                    helperText={
                      errors.serviceDetails?.[index]?.details?.[field.name]
                        ?.message
                    }
                  />
                </Box>
              </Box>
            </Grid>
          ))
        )}
      </Grid>
        {/* === INICIO DEL UPLOADER DE FOTOS (ADAPTADO) === */}
      <Grid container spacing={2} sx={{ mt: 2 }}>
        <Grid item xs={12}>
          <Typography variant="body2" sx={{ color: theme.palette.text.primary, mb: 1, fontWeight: 600 }}>
            Fotos del Detalle (Máx. {MAX_FILES})
          </Typography>
          
          <input
            type="file"
            id={`file-upload-${index}`} // <-- ID único por detalle
            accept="image/png,image/jpeg,image/jpg"
            style={{ display: "none" }}
            onChange={handleFileChange}
            multiple // <-- ¡IMPORTANTE! Permite múltiples archivos
          />

          {/* --- Dropzone (Botón para subir) --- */}
          {selectedFiles.length < MAX_FILES && (
             <Paper
              elevation={0}
              component="label"
              htmlFor={`file-upload-${index}`} // <-- Conecta con el input
              sx={{
                p: 3,
                border: `2px dashed ${theme.palette.divider}`,
                borderRadius: 2,
                bgcolor: isDark ? "#2d2d2d" : "#e0e0e0",
                cursor: "pointer",
                transition: "all 0.2s",
                "&:hover": { borderColor: theme.palette.primary.main },
                display: "flex",
                alignItems: "center",
                gap: 3,
              }}
            >
              <Box
                sx={{
                  bgcolor: isDark ? "#333" : "#f0f0f0",
                  borderRadius: 2,
                  p: 2,
                  display: "flex",
                }}
              >
                <CloudUpload sx={{ fontSize: 40, color: theme.palette.text.secondary }} />
              </Box>
              <Box sx={{ flex: 1, textAlign: "left" }}>
                <Typography
                  variant="body2"
                  sx={{ color: theme.palette.text.primary, mb: 0.5, fontWeight: 500 }}
                >
                  Sube las fotos
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ color: theme.palette.text.secondary, display: "block" }}
                >
                  PNG, JPG (Máx. 5MB c/u)
                </Typography>
              </Box>
            </Paper>
          )}

          {/* --- Previsualización de archivos seleccionados --- */}
          {selectedFiles.length > 0 && (
            <Grid container spacing={2} sx={{ mt: 1 }}>
              {selectedFiles.map((file, fileIndex) => (
                <Grid item xs={6} sm={4} md={3} key={file.name}>
                  <Paper
                    elevation={0}
                    sx={{
                      border: `1px solid ${theme.palette.divider}`,
                      borderRadius: 2,
                      bgcolor: isDark ? "#2d2d2d" : "#e0e0e0",
                      position: "relative",
                      height: 120, // Altura fija
                      overflow: 'hidden'
                    }}
                  >
                    <IconButton
                      size="small"
                      onClick={() => handleRemoveFile(file.name)}
                      sx={{
                        position: "absolute",
                        top: 4,
                        right: 4,
                        zIndex: 1,
                        bgcolor: "rgba(0,0,0,0.5)",
                        "&:hover": { bgcolor: "rgba(0,0,0,0.7)" },
                      }}
                    >
                      <Close fontSize="small" sx={{ color: "#fff" }} />
                    </IconButton>

                    {previewUrls[fileIndex] ? (
                      // Es imagen, mostrar preview
                      <Box
                        component="img"
                        src={previewUrls[fileIndex]}
                        alt={file.name}
                        onClick={() => handleOpenPreview(previewUrls[fileIndex])}
                        sx={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover", // Cubre el espacio
                          cursor: "pointer",
                        }}
                      />
                    ) : (
                      // No es imagen (o está cargando)
                      <Box sx={{ p: 2, textAlign: 'center' }}>
                        <InsertDriveFile sx={{ fontSize: 48, color: "#f44336" }} />
                        <Typography variant="caption" display="block" noWrap>
                          {file.name}
                        </Typography>
                      </Box>
                    )}
                  </Paper>
                </Grid>
              ))}
            </Grid>
          )}

        </Grid>
      </Grid>
      {/* === FIN DEL UPLOADER DE FOTOS === */}
      <ImagePreviewModal
        open={previewModalOpen}
        src={selectedPreview}
        onClose={handleClosePreview}
      />

    </Box>
  );
};
