import React from 'react';
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  Grid,
} from '@mui/material';
import { Close } from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { useReprogramingsEvent } from '../../../../../hooks/event/use-reprogramings-event';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import dayjs from 'dayjs';

export const EventReprogrammingModal = ({
  open,
  onClose,
  event = {},
  setEventToDo,
  loading,
}) => {
  const { startCreateReprograming } = useReprogramingsEvent();

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({ mode: 'onBlur' });

  React.useEffect(() => {
    if (open && event) {
      reset({
        newStartTime: null,
        newEndTime: null,
        reason: '',
      });
    }
  }, [open, event, reset]);

  const handleClose = () => {
    setEventToDo(null); // Limpia el evento seleccionado
    onClose();
  };

  const onSubmit = async (data) => {
    const payload = {
      event_id: event?._id,
      new_start_time: data.newStartTime,
      new_end_time: data.newEndTime,
      reason: data.reason,
    };
    const success = await startCreateReprograming(payload);
    if (success) {
      setEventToDo(null); 
      onClose();
    }
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: { xs: '90%', sm: 450 },
          bgcolor: 'background.paper',
          borderRadius: 4,
          boxShadow: 24,
          p: 4,
        }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h6" fontWeight={600}>
            Solicitar Reprogramación
          </Typography>
          <IconButton onClick={handleClose}>
            <Close />
          </IconButton>
        </Box>

        <Typography fontWeight={600} mb={2}>
          Fecha y Hora del Evento
        </Typography>
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12}>
            <Controller
              name="newStartTime"
              control={control}
              rules={{ required: "La fecha de inicio es obligatoria" }}
              render={({ field }) => (
                <DateTimePicker
                  label="Fecha y Hora de Inicio"
                  value={field.value}
                  onChange={field.onChange}
                  ampm={true}
                  minDateTime={dayjs().add(2, "day").startOf("day")}
                  slotProps={{
                    textField: {
                      error: !!errors.newStartTime,
                      helperText: errors.newStartTime?.message,
                      fullWidth: true,
                    },
                  }}
                />
              )}
            />
          </Grid>
          <Grid item xs={12}>
            <Controller
              name="newEndTime"
              control={control}
              rules={{ required: "La fecha de fin es obligatoria" }}
              render={({ field }) => (
                <DateTimePicker
                  label="Fecha y Hora de Fin"
                  value={field.value}
                  onChange={field.onChange}
                  ampm={true}
                  minDateTime={dayjs().add(2, "day").startOf("day")}
                  slotProps={{
                    textField: {
                      error: !!errors.newEndTime,
                      helperText: errors.newEndTime?.message,
                      fullWidth: true,
                    },
                  }}
                />
              )}
            />
          </Grid>
        </Grid>

        <TextField
          label="Razón de la reprogramación"
          multiline
          rows={4}
          fullWidth
          {...register('reason', { required: 'La razón es obligatoria' })}
          error={!!errors.reason}
          helperText={errors.reason?.message}
          sx={{ mb: 2 }}
        />

        <Button
          type="submit"
          variant="contained"
          fullWidth
          disabled={loading}
          sx={{
            mt: 1,
            backgroundColor: '#212121',
            color: '#fff',
            textTransform: 'none',
            py: 1.5,
            borderRadius: 2,
            fontWeight: 600,
          }}
        >
          Solicitar reprogramación
        </Button>
      </Box>
    </Modal>
  );
};
