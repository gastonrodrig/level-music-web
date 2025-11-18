import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  IconButton,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { Close } from "@mui/icons-material";

export const ActivityFatherModal = ({ open, onClose, onSubmit }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      task_name: "",
      description: "",
    },
  });

  const onFormSubmit = (data) => {
    onSubmit(data);
    onClose();
    reset();
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: { xs: "90%", sm: 500 },
          bgcolor: "background.paper",
          borderRadius: 2,
          boxShadow: 24,
          p: 4,
        }}
        component="form"
        onSubmit={handleSubmit(onFormSubmit)}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box>
            <Typography variant="h6" component="h2" sx={{ mb: 1 }}>
              Crear Nueva Actividad
            </Typography>
          </Box>
          <IconButton onClick={onClose}>
            <Close />
          </IconButton>
        </Box>
        
        <Typography sx={{ color: "text.secondary", fontSize: 14, mb: 3 }}>
          Crea una nueva actividad para el evento.
        </Typography>

        <Grid container spacing={2}>
          {/* Nombre */}
          <Grid item xs={12}>
            <TextField
              label="Nombre de la Actividad"
              fullWidth
              {...register("task_name", { required: "El nombre es requerido" })}
              error={!!errors.task_name}
              helperText={errors.task_name?.message}
            />
          </Grid>

          {/* Descripción */}
          <Grid item xs={12}>
            <TextField
              label="Descripción"
              fullWidth
              multiline
              rows={3}
              {...register("description")}
            />
          </Grid>
        </Grid>

        {/* Botón Guardar */}
        <Button
          type="submit"
          variant="contained"
          fullWidth
          sx={{
            backgroundColor: "#212121",
            color: "#fff",
            textTransform: "none",
            py: 1.5,
            borderRadius: 2,
            fontWeight: 600,
            mt: 3,
          }}
        >
          Guardar cambios
        </Button>
      </Box>
    </Modal>
  );
};
