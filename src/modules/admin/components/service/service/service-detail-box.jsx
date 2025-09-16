import {
  Box,
  Typography,
  TextField,
  IconButton,
  Button,
  Grid,
} from "@mui/material";
import { Delete, Add } from "@mui/icons-material";

export const ServiceDetailBox = ({
  index,
  control,
  register,
  errors,
  onDelete,
  onAddField,
  onRemoveField,
  fields = [],
}) => {
  return (
    <Box sx={{ p: 3, borderRadius: 3, bgcolor: "#1f1e1e", mb: 2 }}>
      {/* Encabezado */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6">Detalle #{index + 1}</Typography>
        <IconButton color="error" onClick={onDelete}>
          <Delete />
        </IconButton>
      </Box>

      {/* Botón agregar campo */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography fontWeight={500}>Campos del Servicio</Typography>
        <Button
          variant="outlined"
          onClick={onAddField}
          startIcon={<Add />}
        >
          Agregar Campo
        </Button>
      </Box>

      {/* Campos */}
      <Grid container spacing={2}>
        {/* Ref Price */}
        <Grid item xs={12}>
          <Typography fontWeight={500} mb={1}>
            Precio de Referencia *
          </Typography>
          <TextField
            type="number"
            fullWidth
            {...register(`serviceDetails.${index}.ref_price`, {
              required: "El precio es obligatorio",
            })}
            error={!!errors.serviceDetails?.[index]?.ref_price}
            helperText={errors.serviceDetails?.[index]?.ref_price?.message}
          />
        </Grid>

        {/* Campos dinámicos */}
        {fields.length === 0 && (
          <Grid item xs={12}>
            <Typography color="text.secondary">
              No hay campos configurados para este detalle.
            </Typography>
          </Grid>
        )}
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
                  <Typography>
                    {field.name}
                    {field.required && (
                      <Typography component="span" color="error">
                        *
                      </Typography>
                    )}
                  </Typography>
                  <IconButton onClick={() => onRemoveField(idx)} color="error">
                    <Delete />
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
