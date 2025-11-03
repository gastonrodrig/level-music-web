import {
  Modal,
  Box,
  Typography,
  Button,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import { useMemo, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import { formatDay } from "../../../../shared/utils";
import { availableHours } from "../../constants/hours";
import { useAppointmentStore } from "../../../../hooks";

export const AppointmentModal = ({
  open,
  onClose,
  loading,
  appointment = {},
  setAppointment,
}) => {
  const { startConfirmAppointment } = useAppointmentStore();
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm({
    mode: "onBlur",
    defaultValues: {
      appointmentDate: null,
      hour: "02:00 PM",
    },
  });

  const hour = watch("hour");

  useEffect(() => {
    if (open) {
      reset({
        appointmentDate: null,
        hour: "02:00 PM",
      });
    }
  }, [open, reset]);

  const onSubmit = (data) => {
    const success = startConfirmAppointment(appointment._id, data);
    if (success){
      setAppointment(null);
      onClose();
    }
  };

  const isButtonDisabled = useMemo(() => loading, [loading]);

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: { xs: "90%", sm: 500 },
          bgcolor: "background.paper",
          borderRadius: 4,
          boxShadow: 24,
          p: 4,
        }}
      >
        {/* Header */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h6" fontWeight={600}>
            Confirmar Cita
          </Typography>
          <IconButton onClick={onClose}>
            <Close />
          </IconButton>
        </Box>

        {/* Disponibilidad */}
        <Box mb={3}>
          <Typography variant="subtitle1" fontWeight={600} mb={1}>
            Disponibilidad
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Fecha de inicio: {appointment?.start_date ? formatDay(appointment.start_date) : "-"}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Fecha de fin: {appointment?.end_date ? formatDay(appointment.end_date) : "-"}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Turno: {appointment?.shift || "-"}
          </Typography>
        </Box>

        {/* Fecha de la cita y Hora */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12}>
            <Controller
              name="appointmentDate"
              control={control}
              rules={{ required: "La fecha de la cita es obligatoria" }}
              render={({ field }) => (
                <DatePicker
                  label="Fecha de la cita"
                  value={field.value}
                  onChange={field.onChange}
                  minDate={dayjs(appointment?.start_date)}
                  maxDate={dayjs(appointment?.end_date)}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      error: !!errors.appointmentDate,
                      helperText: errors.appointmentDate?.message,
                    },
                  }}
                />
              )}
            />
          </Grid>

          {/* Horas */}
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel id="hour-label">Hora</InputLabel>
              <Select
                labelId="hour-label"
                value={hour || "02:00 PM"}
                onChange={(e) => setValue("hour", e.target.value)}
                label="Hora"
                sx={{ height: 56 }}
              >
                {availableHours.map((hour) => (
                  <MenuItem key={hour} value={hour}>
                    {hour}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        {/* Botón Confirmar */}
        <Button
          type="submit"
          variant="contained"
          fullWidth
          disabled={isButtonDisabled}
          sx={{
            mt: 1,
            backgroundColor: "#212121",
            color: "#fff",
            textTransform: "none",
            py: 1.5,
            borderRadius: 2,
            fontWeight: 600,
          }}
        >
          {"Confirmar"}
        </Button>
      </Box>
    </Modal>
  );
};
