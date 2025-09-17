import {
  Box,
  Typography,
  TextField,
  IconButton,
  Button,
  Grid,
  useTheme,
} from "@mui/material";
import { Delete, Add, Close } from "@mui/icons-material";
import { useScreenSizes } from "../../../../../shared/constants/screen-width";

export const ServiceDetailBox = ({
  index,
  register,
  errors,
  onDelete,
  onAddField,
  onRemoveField,
  fields = [],
}) => {
  const theme = useTheme();
  const { isMd } = useScreenSizes(); // Hook personalizado para tamaños de pantalla
  const isDark = theme.palette.mode === "dark";

  return (
    <Box
      sx={{
        p: 3,
        borderRadius: 3,
        bgcolor: isDark ? "#1f1e1e" : "#f5f5f5",
        mb: 2,
      }}
    >
      {/* Encabezado con botones */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Box
          display={'flex'}
          flexDirection={'column'}
          alignItems={'flex-start'}
          justifyContent={"space-between"}
          gap={2}
        >
          <Typography variant="h6" fontWeight={600}>
            Detalle #{index + 1}
          </Typography>

          <Typography 
            fontSize={16} 
            fontWeight={300}
          >
            Campos del servicio:
          </Typography>
        </Box>

        {/* Contenedor de botones, evita anidar <button> */}
        <Box display="flex" gap={1} flexDirection={isMd ? "column" : "row"}>
          {/* Botón eliminar detalle */}
          {!isMd ? (
            <IconButton color="error" onClick={onDelete}>
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

      {/* Campos */}
      <Grid container spacing={2}>
        {/* Precio de Referencia */}
        <Grid item xs={12}>
          <TextField
            label="Precio de Referencia (S/.)"
            placeholder="Ingresa el precio de referencia"
            type="number"
            fullWidth
            InputLabelProps={{ shrink: true }}
            {...register(`serviceDetails.${index}.ref_price`, {
              required: "El precio es obligatorio",
            })}
            error={!!errors.serviceDetails?.[index]?.ref_price}
            helperText={errors.serviceDetails?.[index]?.ref_price?.message}
          />
        </Grid>

        {/* Mensaje si no hay campos configurados */}
        {fields.length === 0 && (
          <Grid item xs={12}>
            <Typography color="text.secondary">
              No hay campos configurados para este detalle.
            </Typography>
          </Grid>
        )}

        {/* Campos dinámicos */}
        {fields.map((field, idx) => (
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
                  <IconButton onClick={() => onRemoveField(idx)} color="error" size="small" sx={{ p: 0.5 }}>
                    <Close fontSize="small" />
                  </IconButton>
                </Box>
                <TextField
                  fullWidth
                  {...register(
                    `serviceDetails.${index}.details.${field.name}`,
                    {
                      required: field.required ? "Campo requerido" : false,
                    }
                  )}
                  error={
                    !!errors.serviceDetails?.[index]?.details?.[field.name]
                  }
                  helperText={
                    errors.serviceDetails?.[index]?.details?.[field.name]?.message
                  }
                />
              </Box>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};
