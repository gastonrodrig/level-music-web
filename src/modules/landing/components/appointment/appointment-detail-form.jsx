import {
  Box,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  TextField,
  Typography,
  Grid,
  FormHelperText,
} from "@mui/material";
import { useTheme } from "@emotion/react";
import { Event } from "@mui/icons-material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { Controller, useFormContext } from "react-hook-form";
import dayjs from "dayjs";

export const AppointmentDetailForm = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  const {
    register,
    watch,
    control,
    formState: { errors },
  } = useFormContext();

  const startDate = watch("startDate");

  return (
    <Box
      sx={{
        bgcolor: isDark ? "#1f1e1e" : "#f5f5f5",
        my: 2,
        borderRadius: 2,
      }}
    >
      {/* Cabecera más oscura */}
      <Box
        sx={{
          bgcolor: isDark ? "#151515" : "#e0e0e0",
          p: 2,
          display: "flex",
          alignItems: "center",
          gap: 1,
          borderTopLeftRadius: 8,
          borderTopRightRadius: 8,
        }}
      >
        <Event />
        <Typography fontWeight={700}>Información de la Cita</Typography>
      </Box>

      <Box
        sx={{
          px: 3,
          pb: 3,
          pt: 2,
          bgcolor: isDark ? "#1f1e1e" : "#f5f5f5",
          borderBottomLeftRadius: 8,
          borderBottomRightRadius: 8,
        }}
      >
        <Typography variant="subtitle1" fontWeight={600} gutterBottom>
          Tipo de Cita
        </Typography>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2.5,
          }}
        >
          {/* Selector de tipo de cita */}
          <Controller
            name="meetingType"
            control={control}
            defaultValue="Presencial"
            render={({ field }) => (
              <RadioGroup row {...field}>
                <FormControlLabel
                  value="Virtual"
                  control={<Radio />}
                  label="Virtual"
                />
                <FormControlLabel
                  value="Presencial"
                  control={<Radio />}
                  label="Presencial"
                />
              </RadioGroup>
            )}
          />
        </Box>

        {/* Fecha Inicio */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Controller
              name="startDate"
              control={control}
              rules={{ required: "La fecha de inicio es obligatoria" }}
              render={({ field }) => (
                <DatePicker
                  label="Fecha de Inicio"
                  value={field.value}
                  onChange={field.onChange}
                  minDate={dayjs().add(2, "day").startOf("day")}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      error: !!errors.startDate,
                      helperText: errors.startDate?.message,
                    },
                  }}
                />
              )}
            />
          </Grid>

          {/* Fecha Fin */}
          <Grid item xs={12} md={6}>
            <Controller
              name="endDate"
              control={control}
              rules={{ required: "La fecha de fin es obligatoria" }}
              render={({ field }) => (
                <DatePicker
                  label="Fecha de Fin"
                  value={field.value}
                  onChange={field.onChange}
                  minDate={startDate || dayjs().add(2, "day").startOf("day")}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      error: !!errors.endDate,
                      helperText: errors.endDate?.message,
                    },
                  }}
                />
              )}
            />
          </Grid>

          {/* Turno */}
          <Grid item xs={12} md={6}>
            <Controller
              name="shift"
              control={control}
              defaultValue=""
              rules={{ required: "El turno es obligatorio" }}
              render={({ field }) => (
                <FormControl fullWidth error={!!errors.shift}>
                  <InputLabel id="shift-label">Turno</InputLabel>
                  <Select
                    labelId="shift-label"
                    label="Turno"
                    {...field}
                  >
                    <MenuItem value="" disabled>
                    </MenuItem>
                    <MenuItem value="Tarde">Tarde</MenuItem>
                    <MenuItem value="Noche">Noche</MenuItem>
                  </Select>
                  {errors.shift && (
                    <FormHelperText>{errors.shift.message}</FormHelperText>
                  )}
                </FormControl>
              )}
            />
          </Grid>

          {/* Cantidad de Asistentes */}
          <Grid item xs={12} md={6}>
            <TextField
              label="Cantidad de Asistentes"
              placeholder="Ingresa el número de asistentes"
              fullWidth
              type="number"
              defaultValue={1}
              InputLabelProps={{ shrink: true }}
              inputProps={{ min: 1, step: 1, inputMode: 'numeric' }}
              onKeyDown={(e) => {
                // Bloquear caracteres no permitidos en inputs tipo number
                if (["e", "E", "+", "-", "."].includes(e.key)) {
                  e.preventDefault();
                }
              }}
              {...register("attendeesCount", {
                required: "La cantidad de asistentes es obligatoria",
                min: { value: 1, message: "Debe ser al menos 1 asistente" },
                pattern: {
                  value: /^[0-9]+$/,
                  message: "Solo se permiten números enteros positivos",
                },
                valueAsNumber: true,
              })}
              error={!!errors.attendeesCount}
              helperText={errors.attendeesCount?.message}
            />
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}