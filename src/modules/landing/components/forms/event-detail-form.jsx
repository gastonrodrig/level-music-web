import {
  Box,
  TextField,
  Typography,
  FormGroup,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useFormContext, Controller } from "react-hook-form";
import "dayjs/locale/es";
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
  const eventDate = watch("eventDate");
  const startTime = watch("startTime");
  const endTime = watch("endTime");
  const placeType = watch("placeType");
  const exactAddress = watch("exactAddress");
  const placeReference = watch("placeReference");
  const placeCapacity = watch("placeCapacity");

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
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
          InputLabelProps={{ shrink: true }}
          sx={{ mb: 3, mt: 2 }}
          {...register("attendeesCount", {
            required: "La cantidad de asistentes es obligatoria",
            min: { value: 1, message: "Debe ser al menos 1 asistente" },
          })}
          error={!!errors.attendeesCount}
          helperText={errors.attendeesCount?.message}
        />

        {/* Fecha del Evento */}
        <DemoContainer components={["DatePicker"]}>
          <DatePicker
            label="Fecha del evento"
            value={
              watch("eventDate") ? dayjs(watch("eventDate")) : null
            }
            onChange={(date) => {
              const formatted = date ? date.format("YYYY-MM-DD") : "";
              setValue("eventDate", formatted);
            }}
            minDate={dayjs().startOf('day')}
            slotProps={{
              textField: {
                fullWidth: true,
                ...register("eventDate", {
                  required: "La fecha del evento es obligatoria"
                }),
                error: !!errors.eventDate,
                helperText: errors.eventDate?.message ?? "",
              },
            }}
          />
        </DemoContainer>

        {/* Horario del Evento */}
        <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1, mt: 2 }}>
          Horario del Evento
        </Typography>
        <DemoContainer components={["TimePicker", "TimePicker"]}>
          <Controller
            name="startTime"
            control={control}
            rules={{ required: "La hora de inicio es obligatoria" }}
            render={({ field }) => (
              <TimePicker
                label="Hora Inicio"
                value={field.value}
                onChange={field.onChange}
                ampm={true}
                slotProps={{
                  textField: {
                    error: !!errors.startTime,
                    helperText: errors.startTime?.message,
                  },
                }}
              />
            )}
          />
          <Controller
            name="endTime"
            control={control}
            rules={{ required: "La hora de fin es obligatoria" }}
            render={({ field }) => (
              <TimePicker
                label="Hora Fin"
                value={field.value}
                onChange={field.onChange}
                ampm={true}
                slotProps={{
                  textField: {
                    error: !!errors.endTime,
                    helperText: errors.endTime?.message,
                  },
                }}
              />
            )}
          />
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
          label="Tamaño del Lugar en m² + capacidad"
          placeholder="Ej: 100m² para 50 personas"
          fullWidth
          InputLabelProps={{ shrink: true }}
          {...register("placeCapacity", {
            required: "El tamaño del lugar es obligatorio",
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
            <strong>Fecha:</strong>{" "}
            {eventDate
              ? (typeof eventDate === 'string'
                  ? dayjs(eventDate).isValid()
                    ? dayjs(eventDate).format('DD/MM/YYYY')
                    : eventDate
                  : eventDate.format('DD/MM/YYYY'))
              : "-"}
          </Typography>
          <Typography variant="body2">
            <strong>Horario:</strong>{" "}
            {startTime ? startTime.format("HH:mm") : "?"} -{" "}
            {endTime ? endTime.format("HH:mm") : "?"}
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
    </LocalizationProvider>
  );
};
