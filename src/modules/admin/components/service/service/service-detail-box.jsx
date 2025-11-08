import {
  Box,
  Typography,
  TextField,
  IconButton,
  Button,
  Grid,
  useTheme,
  Switch,
} from "@mui/material";
import { Delete, Add, Close, CalendarMonth } from "@mui/icons-material";
import { useScreenSizes } from "../../../../../shared/constants/screen-width";
import { useState } from "react";
import { useServiceDetailStore } from "../../../../../hooks";

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
  openModal
}) => {
  const theme = useTheme();
  const { isMd } = useScreenSizes();
  const isDark = theme.palette.mode === "dark";

  const serviceDetailId = initialData._id;
  const { setSelectedServiceDetail } = useServiceDetailStore();

  const handleOpenPrices = () => {
    if (!serviceDetailId) return;
    setSelectedServiceDetail(initialData);
    openModal(); 
  };

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
        flexDirection={{ xs: "column", md: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", md: "flex-start" }}
        mb={2}
        gap={3}
      >
        {/* Izquierda: título, botón y estado */}
        <Box display="flex" flexDirection="column" alignItems="flex-start">
          <Typography variant="h6" fontWeight={600}>
            Detalle #{index + 1}
          </Typography>

          <Button
            variant="contained"
            color="primary"
            onClick={handleOpenPrices}
            disabled={!serviceDetailId}
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

          {isEditMode && (
            <Box
              sx={{ display: "flex", alignItems: "center", gap: 1, mt: 1.5 }}
            >
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
              <Typography>
                {initialData.status === "Activo" ? "Activo" : "Inactivo"}
              </Typography>
            </Box>
          )}
        </Box>

        {/* Derecha: botones en columna */}
        <Box
          display="flex"
          flexDirection="column"
          alignItems="flex-end"
          justifyContent="flex-start"
          gap={1.2}
          alignSelf={{ xs: "flex-start", md: "flex-start" }}
          width={{ xs: "100%", md: "auto" }}
        >
          {/* Eliminar Detalle */}
          <Button
            variant="contained"
            color="error"
            startIcon={<Delete />}
            onClick={onDelete}
            disabled={detailsCount === 1 || !!initialData._id}
            fullWidth={isMd}
            sx={{
              textTransform: "none",
              borderRadius: 2,
              color: "#fff",
              fontWeight: 600,
              width: { xs: "100%", md: "180px" },
            }}
          >
            Eliminar Detalle
          </Button>

          {/* Agregar Campo */}
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={onAddField}
            fullWidth={isMd}
            sx={{
              bgcolor: theme.palette.primary.main,
              textTransform: "none",
              borderRadius: 2,
              color: "#fff",
              fontWeight: 600,
              width: { xs: "100%", md: "180px" },
              "&:hover": { bgcolor: theme.palette.primary.dark },
            }}
          >
            Agregar Campo
          </Button>
        </Box>
      </Box>

      {/* === CAMPOS === */}
      <Typography fontSize={16} fontWeight={400} mb={2}>
        Campos del servicio:
      </Typography>

      <Grid container spacing={2}>
        {/* Precio de referencia (ocupa todo el ancho) */}
        <Grid item xs={12}>
          <TextField
            label="Precio por hora de Referencia (S/.)"
            placeholder="Ingresa el precio de referencia"
            type="number"
            fullWidth
            InputLabelProps={{ shrink: true }}
            defaultValue={initialData.ref_price || ""}
            {...register(`serviceDetails.${index}.ref_price`, {
              required: "El precio es obligatorio",
              min: { value: 0, message: "El precio no puede ser negativo" },
            })}
            error={!!errors.serviceDetails?.[index]?.ref_price}
            helperText={errors.serviceDetails?.[index]?.ref_price?.message}
          />
        </Grid>

        {/* Campos personalizados (2 por fila, responsivo) */}
        {fields.length === 0 ? (
          <Grid item xs={12}>
            <Typography color="text.secondary">
              No hay campos configurados para este detalle.
            </Typography>
          </Grid>
        ) : (
          fields.map((field, idx) => (
            <Grid item xs={12} sm={6} key={idx}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 1,
                  width: "100%",
                }}
              >
                <Box sx={{ flexGrow: 1 }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mb: 1,
                    }}
                  >
                    <Typography fontWeight={500}>
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
                    >
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
                </Box>
              </Box>
            </Grid>
          ))
        )}
      </Grid>
    </Box>
  );
};
