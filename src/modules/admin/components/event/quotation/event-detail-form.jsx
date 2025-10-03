import { useFormContext, Controller } from "react-hook-form";
import {
  Box,
  Typography,
  TextField,
  Grid,
  MenuItem,
  useTheme,
} from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import dayjs from "dayjs";
import { EventAvailable } from "@mui/icons-material";

export const EventDetailsForm = () => {
  const {
    register,
    control,
    formState: { errors },
    watch,
  } = useFormContext();
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  const startTime = watch("startDateTime");

  return (
    <>
    <Box sx={{ display: "flex", alignItems: "center", mb: 2, mt: 2 }}>
      <Box
        sx={{
          width: 28,
          height: 28,
          borderRadius: "50%",
          bgcolor: "grey.900",
          color: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "0.875rem",
          fontWeight: "bold",
          mr: 1.5,
        }}
      >
        1
      </Box>
      <Typography variant="subtitle1" fontWeight={600}>
        Paso 1
      </Typography>
    </Box>

    <Box
      sx={{
        borderRadius: 2,
        border: "1px solid",
        borderColor: "divider",
        overflow: "hidden",
        mb: 3,
      }}
    >
      <Box
        sx={{
          bgcolor: isDark ? "#151515" : "#e0e0e0",
          p: 2,
          display: "flex",
          alignItems: "center",
          gap: 1,
        }}
      >
        <EventAvailable />
        <Typography fontWeight={700}>Información del Evento</Typography>
  </Box>
      {/* Contenido más claro */}
      <Box sx={{ p: 3, bgcolor: isDark ? "#1f1e1e" : "#f5f5f5" }}>
        <Grid container spacing={2}>
          {/* Nombre del Evento */}
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Nombre del Evento"
              placeholder="Ej: Festival de Verano 2024"
              {...register("eventName", {
                required: "El nombre es obligatorio",
              })}
              error={!!errors.eventName}
              helperText={errors.eventName?.message}
            />
          </Grid>

          {/* Descripción */}
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Descripción del Evento"
              placeholder="Describe brevemente el evento..."
              {...register("eventDescription", {
                required: "La descripción es obligatoria",
              })}
              error={!!errors.eventDescription}
              helperText={errors.eventDescription?.message}
            />
          </Grid>

          {/* Fecha y hora de inicio */}
          <Grid item xs={12} md={6}>
            <Controller
              name="startDateTime"
              control={control}
              rules={{ required: "La fecha de inicio es obligatoria" }}
              render={({ field }) => (
                <DateTimePicker
                  label="Fecha y Hora de Inicio"
                  value={field.value}
                  onChange={field.onChange}
                  minDateTime={dayjs().add(2, "day")}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      error: !!errors.startDateTime,
                      helperText: errors.startDateTime?.message,
                    },
                  }}
                />
              )}
            />
          </Grid>

          {/* Fecha y hora de fin */}
          <Grid item xs={12} md={6}>
            <Controller
              name="endDateTime"
              control={control}
              rules={{
                required: "La fecha de fin es obligatoria",
                validate: (value) => {
                  if (!startTime || !value) return true;
                  return value.isAfter(startTime)
                    ? true
                    : "Debe ser posterior a la hora de inicio";
                },
              }}
              render={({ field }) => (
                <DateTimePicker
                  label="Fecha y Hora de Fin"
                  value={field.value}
                  onChange={field.onChange}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      error: !!errors.endDateTime,
                      helperText: errors.endDateTime?.message,
                    },
                  }}
                />
              )}
            />
          </Grid>

          {/* Cantidad de Asistentes */}
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              type="number"
              label="Cantidad de Asistentes"
              placeholder="Ej: 100"
              {...register("attendeesCount", {
                required: "Campo obligatorio",
                min: { value: 1, message: "Debe ser al menos 1" },
              })}
              error={!!errors.attendeesCount}
              helperText={errors.attendeesCount?.message}
            />
          </Grid>

          {/* Tipo de lugar */}
          <Grid item xs={12} md={6}>
            <TextField
              select
              fullWidth
              label="Tipo de Lugar"
              defaultValue=""
              {...register("placeType", { required: "Campo obligatorio" })}
              error={!!errors.placeType}
              helperText={errors.placeType?.message}
            >
              <MenuItem value="Abierto">Abierto</MenuItem>
              <MenuItem value="Cerrado">Cerrado</MenuItem>
            </TextField>
          </Grid>

          {/* Tamaño del Lugar */}
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              type="number"
              label="Tamaño del Lugar (m²)"
              placeholder="Ej: 500"
              {...register("placeCapacity", {
                required: "Campo obligatorio",
              })}
              error={!!errors.placeCapacity}
              helperText={errors.placeCapacity?.message}
            />
          </Grid>

          {/* Dirección Exacta */}
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Dirección Exacta"
              placeholder="Av. Principal 123, Distrito, Ciudad"
              {...register("exactAddress", { required: "Campo obligatorio" })}
              error={!!errors.exactAddress}
              helperText={errors.exactAddress?.message}
            />
          </Grid>

          {/* Referencia */}
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Referencia de Ubicación"
              placeholder="Ej: Frente al banco"
              {...register("placeReference", { required: "Campo obligatorio" })}
              error={!!errors.placeReference}
              helperText={errors.placeReference?.message}
            />
          </Grid>
        </Grid>
      </Box>
    </Box>
    </>
  );
};
