import {
  Box,
  TextField,
  Typography,
  FormGroup,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { useFormContext, Controller } from "react-hook-form";
import dayjs from "dayjs";

export const EventDetailsForm = () => {
  const {
    register,
    control,
    watch,
    formState: { errors },
    setValue
  } = useFormContext();

  // Valores en tiempo real
  const attendeesCount = watch("attendeesCount");
  const startDateTime = watch("startDateTime");
  const endDateTime = watch("endDateTime");
  const placeType = watch("placeType");
  const exactAddress = watch("exactAddress");
  const placeReference = watch("placeReference");
  const placeCapacity = watch("placeCapacity");

  return (
    <Box p={1}>
      <Typography
        variant="subtitle1"
        color="textPrimary"
        fontWeight={600}
        fontSize={18}
        sx={{ mb: 1 }}
      >
        Complete los campos para el evento
      </Typography>

      {/* Cantidad de Asistentes */}
      <TextField
        label="Cantidad de Asistentes"
        placeholder="Ingresa el número de asistentes"
        fullWidth
        type="number"
        InputLabelProps={{ shrink: true }}
        sx={{ mt: 2 }}
        {...register("attendeesCount", {
          required: "La cantidad de asistentes es obligatoria",
          min: { value: 1, message: "Debe ser al menos 1 asistente" },
          pattern: {
          value: /^[0-9]+$/,
          message: "Solo se permiten números",
        },
        valueAsNumber: true,
        })}
        error={!!errors.attendeesCount}
        helperText={errors.attendeesCount?.message}
      />

      {/* Fecha y Hora del Evento */}
      <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1, mt: 2 }}>
        Fecha y Hora del Evento
      </Typography>
      <DemoContainer components={["DateTimePicker"]}>
        <Box sx={{ display: "flex", gap: 2, flexDirection: { xs: "column", sm: "row" } }}>
          <Controller
            name="startDateTime"
            control={control}
            rules={{ required: "La fecha y hora de inicio son obligatorias" }}
            render={({ field }) => (
              <DateTimePicker
                label="Fecha y Hora de Inicio"
                value={field.value || null}
                onChange={field.onChange}
                minDateTime={dayjs().add(2, "day").startOf("day")}
                ampm={true}
                slotProps={{
                  textField: {
                    error: !!errors.startDateTime,
                    helperText: errors.startDateTime?.message,
                  },
                }}
              />
            )}
          />

          <Controller
            name="endDateTime"
            control={control}
            rules={{
              required: "La fecha y hora de fin son obligatorias",
              validate: (value) => {
                const start = watch("startDateTime");
                if (!start || !value) return true;

                const diffHours = value.diff(start, "hour", true);
                if (diffHours <= 0) {
                  return "La hora de fin debe ser posterior a la hora de inicio";
                }
                if (diffHours > 12) {
                  return "La duración del evento no puede superar las 12 horas";
                }
                return true;
              },
            }}
            render={({ field }) => (
              <DateTimePicker
                label="Fecha y Hora de Fin"
                minDateTime={watch("startDateTime") || dayjs().add(2, "day")}
                value={field.value || null}
                onChange={field.onChange}
                ampm={true}
                slotProps={{
                  textField: {
                    error: !!errors.endDateTime,
                    helperText: errors.endDateTime?.message,
                  },
                }}
              />
            )}
          />
        </Box>
      </DemoContainer>

      {/* Tipo de lugar */}
      <Typography variant="subtitle1" fontWeight={600} sx={{ mt: 2, mb: 1 }}>
        Tipo de Lugar
      </Typography>
      <Controller
        name="placeType"
        control={control}
        rules={{ required: "Debes seleccionar un tipo de lugar" }}
        render={({ field }) => (
          <FormGroup row>
            <FormControlLabel
              control={
                <Checkbox
                  checked={field.value === "Abierto"}
                  onChange={() => field.onChange("Abierto")}
                />
              }
              label="Lugar Abierto (Espacios al aire libre como jardines, terrazas, parques)"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={field.value === "Cerrado"}
                  onChange={() => field.onChange("Cerrado")}
                />
              }
              label="Lugar Cerrado (Espacios interiores como salones, restaurantes, oficinas)"
            />
          </FormGroup>
        )}
      />
      {errors.placeType && (
        <Typography color="error" variant="body2" sx={{ mt: 1, ml: 2 }}>
          {errors.placeType?.message}
        </Typography>
      )}

      {/* Dirección Exacta */}
      <TextField
        label="Dirección Exacta"
        placeholder="Ingresa la dirección del evento"
        fullWidth
        
        InputLabelProps={{ shrink: true }}
        sx={{ my: 3 }}
        {...register("exactAddress", {
          required: "La dirección exacta es obligatoria",
        })}
        error={!!errors.exactAddress}
        helperText={errors.exactAddress?.message}
      />

      {/* Referencia del lugar */}
      <TextField
        label="Referencia del Lugar"
        placeholder="Agrega una referencia del lugar"
        fullWidth
        InputLabelProps={{ shrink: true }}
        sx={{ mb: 3 }}
        {...register("placeReference", {
          required: "El lugar de referencia es obligatorio",
        })}
        error={!!errors.placeReference}
        helperText={errors.placeReference?.message}
      />

      {/* Tamaño del lugar */}
      <TextField
        label="Tamaño del Lugar en m²"
        placeholder="Ej: 100m² para 50 personas"
        fullWidth
        type="number"
        InputLabelProps={{ shrink: true }}
        {...register("placeCapacity", {
          required: "El tamaño del lugar es obligatorio",
          pattern: {
          value: /^[0-9]+$/,
          message: "Solo se permiten números",
        },
        valueAsNumber: true,
        })}
        
        error={!!errors.placeCapacity}
        helperText={errors.placeCapacity?.message}
      />

      {/* Resumen */}
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
        <Typography variant="subtitle1" fontWeight={600}>
          Resumen del evento
        </Typography>
        <Typography variant="body2">
          <strong>Asistentes:</strong> {attendeesCount || "-"}
        </Typography>
       <Typography variant="body2">
        <strong>Horario:</strong>{" "}
        {startDateTime?.format("HH:mm") || ""} - {endDateTime?.format("HH:mm") || ""}
      </Typography>
        <Typography variant="body2">
          <strong>Tipo de lugar:</strong>{" "}
          {placeType === "Abierto"
            ? "Lugar Abierto"
            : placeType === "Cerrado"
            ? "Lugar Cerrado"
            : "-"}
        </Typography>
        <Typography variant="body2">
          <strong>Dirección:</strong> {exactAddress || "-"}
        </Typography>
        <Typography variant="body2">
          <strong>Referencia:</strong> {placeReference || "-"}
        </Typography>
        <Typography variant="body2">
          <strong>Tamaño/Capacidad:</strong> {placeCapacity || "-"}
        </Typography>
      </Box>

    </Box>
  );
};
