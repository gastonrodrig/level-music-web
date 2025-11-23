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
  alpha,
  FormControlLabel,
  
} from "@mui/material";
import { Delete, Add, Close, CloudUpload, WarningAmber } from "@mui/icons-material";
import { useScreenSizes } from "../../../../../shared/constants/screen-width";
import { useServiceDetailStore, useImageManager } from "../../../../../hooks";
import { useFormContext } from "react-hook-form";
import { useState, useEffect } from "react";
import { ImagePreviewModal } from "../../../../../shared/ui/components/common";

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
  openModal,
  onDeleteExistingPhoto,
}) => {
  const theme = useTheme();
  const { isMd } = useScreenSizes();
  const isDark = theme.palette.mode === "dark";
  const { watch } = useFormContext();
  const { setSelectedServiceDetail } = useServiceDetailStore();
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [selectedPreview, setSelectedPreview] = useState(null);

  const hasExistingPhotos = initialData?.photos?.length > 0;
  const [showPhotos, setShowPhotos] = useState(hasExistingPhotos);

  const {
    existingImages,
    files,
    previews,
    initExisting,
    handleImagesChange,
    handleRemoveImage,
    handleRemoveExisting,
  } = useImageManager(watch, setValue, {
    onDeleteExistingPhoto,
    fieldPath: `serviceDetails.${index}.photos`,
  });

  useEffect(() => {
    initExisting(initialData.photos);
  }, [initialData.photos, initExisting]);

  const handleOpenPreview = (url) => {
    setSelectedPreview(url);
    setPreviewModalOpen(true);
  };

  const handleOpenPrices = () => {
    if (!initialData._id) return;
    setSelectedServiceDetail(initialData);
    openModal();
  };

  const status = watch(`serviceDetails.${index}.status`);

  useEffect(() => {
    if (hasExistingPhotos) {
      setShowPhotos(true);
    }
  }, [hasExistingPhotos]);

  useEffect(() => {
    const total = (existingImages?.length || 0) + (files?.length || 0);
    if (!hasExistingPhotos && total === 0) {
      setShowPhotos(false);
    }
  }, [existingImages, files, hasExistingPhotos]);

  return (
    <Box
      sx={{
        p: 3,
        borderRadius: 3,
        bgcolor: isDark ? "#1f1e1e" : "#f5f5f5",
        mb: 3,
      }}
    >
      {/* === ENCABEZADO === */}
      <Box
        display="flex"
        flexDirection="row"
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", md: "flex-start" }}
        mb={2}
        gap={3}
      >
        {/* Izquierda: título, botón y estado */}
        <Box display="flex" flexDirection="column" alignItems="flex-start">
          <Box display="flex" flexDirection="row" alignItems="center" gap={1} alignContent="center">
            <Typography variant="h6" fontWeight={600}>
              Detalle #{index + 1}
            </Typography>

            {isEditMode && (
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Switch
                  checked={status === "Activo"}
                  onChange={() =>
                    setValue(
                      `serviceDetails.${index}.status`,
                      status === "Activo" ? "Inactivo" : "Activo"
                    )
                  }
                  color="success"
                />
                <Typography>
                  {status === "Activo" ? "Activo" : "Inactivo"}
                </Typography>
              </Box>
            )}
          </Box>

          <Button
            variant="contained"
            color="primary"
            onClick={handleOpenPrices}
            disabled={!initialData._id}
            sx={{
              mt: 2,
              mb: 2,
              fontWeight: 600,
              textTransform: "none",
              fontSize: 14,
              borderRadius: 2,
              px: 2.5,
              py: 1,
              color: "#fff",
              bgcolor: theme.palette.primary.main,
              "&:hover": {
                bgcolor: theme.palette.primary.dark,
                color: "#fff",
              },
            }}
          >
            Ver Precios
          </Button>
        </Box>

        {/* Contenedor de botones, evita anidar <button> */}
        <Box display="flex" gap={1} flexDirection={isMd ? "column" : "row"}>
          {/* Botón eliminar detalle */}
          {!isMd ? (
            <IconButton color="error" onClick={onDelete} disabled={detailsCount === 1 || !!initialData._id} >
              <Delete />
            </IconButton>
          ) : (
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
          )}

          {/* Botón agregar campo */}
          {!isMd ? (
            <IconButton
              color="primary"
              onClick={onAddField}
              sx={{
                bgcolor: theme.palette.primary.main,
                color: "#fff",
                borderRadius: "12px",
                "&:hover": {
                  bgcolor: theme.palette.primary.dark,
                },
              }}
            >
              <Add />
            </IconButton>
          ) : (
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
          )}
        </Box>
      </Box>

      {/* === CAMPOS === */}
      <Typography fontSize={16} fontWeight={400} mb={2}>
        Campos del servicio:
      </Typography>

      {/* === Campos === */}
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            label="Precio por hora de Referencia (S/.)"
            type="number"
            fullWidth
            defaultValue={initialData.ref_price || ""}
            {...register(`serviceDetails.${index}.ref_price`, {
              required: "El precio es obligatorio",
              min: { value: 0, message: "El precio no puede ser negativo" },
            })}
            error={!!errors.serviceDetails?.[index]?.ref_price}
            helperText={errors.serviceDetails?.[index]?.ref_price?.message}
          />
        </Grid>

        {fields.length === 0 ? (
          <Grid item xs={12}>
            <Typography color="text.secondary">
              No hay campos configurados para este detalle.
            </Typography>
          </Grid>
        ) : (
          fields.map((field, idx) => (
            <Grid item xs={12} sm={6} key={idx}>
              <Box display="flex" alignItems="center" gap={1}>
                <Typography fontWeight={500} flex={1}>
                  {field.name}
                  {field.required && (
                    <Typography component="span" color="error">
                      *
                    </Typography>
                  )}
                </Typography>
                <IconButton onClick={() => onRemoveField(idx)} color="error" size="small">
                  <Close fontSize="small" />
                </IconButton>
              </Box>
              <TextField
                fullWidth
                defaultValue={initialData.details?.[field.name] || ""}
                {...register(
                  `serviceDetails.${index}.details.${field.name}`,
                  { required: "Campo requerido" }
                )}
                error={
                  !!errors.serviceDetails?.[index]?.details?.[field.name]
                }
                helperText={
                  errors.serviceDetails?.[index]?.details?.[field.name]
                    ?.message
                }
              />
            </Grid>
          ))
        )}
      </Grid>

      <FormControlLabel
        sx={{ mt: 2 }}
        control={
          <Switch
            checked={showPhotos}
            onChange={(e) => setShowPhotos(e.target.checked)}
            color="primary"
            disabled={hasExistingPhotos && existingImages.length > 0}
          />
        }
        label={
          hasExistingPhotos && existingImages.length > 0
            ? `Requiere fotos (${existingImages.length} cargadas)`
            : "¿Requiere fotos?"
        }
      />

      {/* === GESTIÓN DE IMÁGENES === */}
      {showPhotos && (
      <Grid container spacing={2} sx={{ mt: 2 }}>
        <Grid item xs={12}>
          <Typography
            variant="body2"
            sx={{
              color: theme.palette.text.primary,
              mb: 1,
              fontWeight: 600,
            }}
          >
            Fotos del Detalle *
          </Typography>

          {/* --- Campo invisible para validar con RHF --- */}
          <input
            type="hidden"
            {...register(`serviceDetails.${index}.photos`, {
              validate: () => {
                if (!showPhotos) return true;
                const hasExisting = (existingImages?.length || 0) > 0;
                const hasNew = (files?.length || 0) > 0;
                if (!hasExisting && !hasNew)
                  return "Debe subir al menos una foto (jpg, jpeg, png)";
                return true;
              },
            })}
          />

          {/* --- Dropzone (botón subir) --- */}
          <Paper
            elevation={0}
            component="label"
            htmlFor={`file-upload-${index}`}
            sx={{
              p: 3,
              border: `2px dashed ${
                errors?.serviceDetails?.[index]?.photos
                  ? alpha("#AB1D33", 0.9)
                  : theme.palette.divider
              }`,
              borderRadius: 2,
              bgcolor: isDark ? "#141414" : "#fcfcfc",
              cursor: "pointer",
              transition: "all 0.2s",
              "&:hover": {
                borderColor: errors?.serviceDetails?.[index]?.photos
                  ? "#e7203dff"
                  : theme.palette.primary.main,
              },
              display: "flex",
              alignItems: "center",
              gap: 3,
              position: "relative",
            }}
          >
            <Box
              sx={{
                bgcolor: isDark ? "#333" : "#f0f0f0",
                borderRadius: 2,
                p: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <CloudUpload sx={{ fontSize: 40, color: theme.palette.mode === "dark" ? "#999" : "#666" }} />
            </Box>

            <Box sx={{ flex: 1, textAlign: "left" }}>
              <Typography
                variant="body2"
                sx={{
                  color: theme.palette.text.primary,
                  mb: 0.5,
                  fontWeight: 500,
                }}
              >
                Sube las fotos
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: theme.palette.text.secondary,
                  display: "block",
                }}
              >
                PNG, JPG (Máx. 5 MB c/u)
              </Typography>
            </Box>

            {/* --- Mensaje de error visual dentro del recuadro --- */}
            {errors?.serviceDetails?.[index]?.photos && (
              <Box
                sx={{
                  position: "absolute",
                  top: 8,
                  right: 8,
                  display: "flex",
                  alignItems: "center",
                  gap: 0.5,
                  color: theme.palette.error.main,
                }}
              >
                <WarningAmber fontSize="small" />
                <Typography
                  variant="caption"
                  sx={{ fontWeight: 500 }}
                >
                  {errors.serviceDetails[index].photos.message}
                </Typography>
              </Box>
            )}
          </Paper>

          {/* --- Input de archivos --- */}
          <input
            type="file"
            id={`file-upload-${index}`}
            accept="image/png,image/jpeg,image/jpg"
            style={{ display: "none" }}
            onChange={handleImagesChange}
            multiple
          />

          {/* --- Vista previa --- */}
          {(existingImages.length > 0 || files.length > 0) && (
            <Grid container spacing={2} sx={{ mt: 1 }}>
              {/* Fotos existentes */}
              {existingImages.map((photo) => (
                <Grid item xs={6} sm={4} md={3} key={photo._id}>
                  <Paper
                    elevation={0}
                    sx={{
                      border: `1px solid ${theme.palette.divider}`,
                      borderRadius: 2,
                      bgcolor: isDark ? "#2d2d2d" : "#e0e0e0",
                      position: "relative",
                      height: 120,
                      overflow: "hidden",
                    }}
                  >
                    <IconButton
                      size="small"
                      onClick={() => handleRemoveExisting(photo._id)}
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
                    <Box
                      component="img"
                      src={photo.url}
                      alt={photo.name || "foto existente"}
                      onClick={() => handleOpenPreview(photo.url)}
                      sx={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        cursor: "pointer",
                      }}
                    />
                  </Paper>
                </Grid>
              ))}

              {/* Fotos nuevas */}
              {files.map((file, fileIndex) => (
                <Grid item xs={6} sm={4} md={3} key={file.name}>
                  <Paper
                    elevation={0}
                    sx={{
                      border: `1px solid ${theme.palette.divider}`,
                      borderRadius: 2,
                      bgcolor: isDark ? "#2d2d2d" : "#e0e0e0",
                      position: "relative",
                      height: 120,
                      overflow: "hidden",
                    }}
                  >
                    <IconButton
                      size="small"
                      onClick={() => handleRemoveImage(fileIndex)}
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
                    <Box
                      component="img"
                      src={previews[fileIndex]}
                      alt={file.name}
                      onClick={() => handleOpenPreview(previews[fileIndex])}
                      sx={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        cursor: "pointer",
                      }}
                    />
                  </Paper>
                </Grid>
              ))}
            </Grid>
          )}
        </Grid>
      </Grid>

      )}

      <ImagePreviewModal
        open={previewModalOpen}
        src={selectedPreview}
        onClose={() => setPreviewModalOpen(false)}
      />
    </Box>
  );
};
