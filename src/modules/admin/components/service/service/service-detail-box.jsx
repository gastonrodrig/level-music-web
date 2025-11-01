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

  const serviceDetailId = initialData._id; // 👈 el ID del detalle viene directo del backend

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
              <Box sx={{ display: "flex", alignItems: "center", ml: 2 }}>
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
                <Typography sx={{ ml: 1 }}>
                  {initialData.status === "Activo" ? "Activo" : "Inactivo"}
                </Typography>
              </Box>
            )}
          </Grid>

          <Typography fontSize={16} fontWeight={300}>
            Campos del servicio:
          </Typography>
        </Box>

        {/* Derecha: botones */}
        <Box display="flex" gap={1} flexDirection={isMd ? "column" : "row"}>
          {/* 🔹 Ver precios */}
          <Button
            variant="contained"
            startIcon={<CalendarMonth />}
            onClick={() => onOpenPrices(serviceDetailId)}
            disabled={!serviceDetailId}
            sx={{
              textTransform: "none",
              borderRadius: 2,
              fontWeight: 600,
              bgcolor: theme.palette.primary.main,
              "&:hover": { bgcolor: theme.palette.primary.hover },
            }}
          >
            Ver Precios
          </Button>

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
    </Box>
  );
};
