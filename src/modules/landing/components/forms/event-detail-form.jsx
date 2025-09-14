import {
  Box,
  TextField,
  Grid,
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
import dayjs from 'dayjs';
import 'dayjs/locale/es';

export const EventDetailsForm = () => {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext();

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
      <Box>
        <TextField
          fullWidth
          label="Cantidad de Asistentes"
          type="number"
          placeholder="Ingresa el número de asistentes"
          margin="normal"
          {...register("attendeesCount", {
            required: "La cantidad de asistentes es obligatoria",
            min: { value: 1, message: "Debe ser al menos 1 asistente" },
          })}
          error={!!errors.attendeesCount}
          helperText={errors.attendeesCount?.message}
        />

        {/* Fecha del Evento */}
        <Typography variant="subtitle1" fontWeight={600} sx={{ mt: 3, mb: 1 }}>
          Fecha del Evento
        </Typography>
        <Controller
          name="eventDate"
          control={control}
          rules={{ required: "La fecha del evento es obligatoria" }}
          render={({ field }) => (
            <DatePicker
              label="Fecha del evento"
              value={field.value}
              onChange={field.onChange}
              disablePast
              slotProps={{
                textField: {
                  fullWidth: true,
                  error: !!errors.eventDate,
                  helperText: errors.eventDate?.message,
                  sx: { mb: 2 }
                },
              }}
            />
          )}
        />

        {/* Horario del Evento */}
        <Typography variant="subtitle1" fontWeight={600} sx={{ mt: 3, mb: 2 }}>
          Horario del Evento
        </Typography>
        <DemoContainer components={['TimePicker', 'TimePicker']}>
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

        <TextField
          fullWidth
          label="Dirección Exacta"
          placeholder="Ingresa la dirección del evento"
          margin="normal"
          {...register("exactAddress", {
            required: "La dirección exacta es obligatoria",
          })}
          error={!!errors.exactAddress}
          helperText={errors.exactAddress?.message}
        />

        <TextField
          fullWidth
          label="Referencia del Lugar"
          placeholder="Agrega una referencia del lugar"
          margin="normal"
          {...register("placeReference")}
        />

        {/* Checkboxes en lugar de select - Solo uno seleccionable */}
        <Typography variant="subtitle1" fontWeight={600} sx={{ mt: 3, mb: 1 }}>
          Tipo de Lugar *
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
                    checked={field.value === "abierto"}
                    onChange={() => field.onChange("abierto")}
                  />
                }
                label="Lugar Abierto (Espacios al aire libre como jardines, terrazas, parques)"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={field.value === "cerrado"}
                    onChange={() => field.onChange("cerrado")}
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

        <TextField
          fullWidth
          label="Tamaño del Lugar en m² + capacidad"
          placeholder="Ej: 100m² para 50 personas"
          margin="normal"
          {...register("placeCapacity", {
            required: "El tamaño del lugar es obligatorio",
          })}
          error={!!errors.placeCapacity}
          helperText={errors.placeCapacity?.message}
        />
      </Box>
    </LocalizationProvider>
  );
};