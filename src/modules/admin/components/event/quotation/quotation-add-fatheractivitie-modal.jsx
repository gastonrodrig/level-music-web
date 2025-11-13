// En: ../../../components/ActivityFatherModal.jsx (o donde lo quieras crear)

import {
  Modal, Box, Typography, TextField, Button, Grid, useTheme ,IconButton
} from "@mui/material";
import { useForm } from "react-hook-form";
import { Save,Close } from "@mui/icons-material";


export const ActivityFatherModal = ({ open, onClose, onSubmit }) => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      nombre: "",
      descripcion: "",
    }
  });

  // 'data' es el objeto del formulario ({nombre, descripcion})
  const onFormSubmit = (data) => {
    onSubmit(data); // Llama a la función del padre
    onClose();     // Cierra el modal
  };
  

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  borderRadius: 2,
  boxShadow: 24,
  p: 4,}} component="form" onSubmit={handleSubmit(onFormSubmit)}>
        
        <Box sx={{ display:"flex",
          justifyContent:"space-between",
          alignItems:"center",
          
 }}>
        <Box>
        <Typography variant="h6" component="h2" sx={{ mb: 1 }}>
          Crear Nueva Actividad Padre
        </Typography>
         
        </Box>
        <IconButton
        onClick={onClose}
        >
        <Close />
        </IconButton>

        </Box>
        <Typography sx={{ color: "text.secondary", fontSize: 14,mb:3 }}>Crea una nueva actividad padre para el evento.</Typography>
        <Grid container spacing={2}>
          
          {/* Nombre */}
          <Grid item xs={12}>
            <TextField
              label="Nombre de la Actividad"
              fullWidth
              {...register("nombre", { required: "El nombre es requerido" })}
              error={!!errors.nombre}
              helperText={errors.nombre?.message}
            />
          </Grid>
          
          {/* Descripción */}
          <Grid item xs={12}>
            <TextField
              label="Descripción"
              fullWidth
              multiline
              rows={3}
              {...register("descripcion")}
            />
          </Grid>

          {/* Botón Guardar */}
          <Grid item xs={12} sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
            <Button
          type="submit"
          variant="contained"
          fullWidth
          
          sx={{
            mt: 1,
            backgroundColor: "#212121",
            color: "#fff",
            textTransform: "none",
            py: 1.5,
            borderRadius: 2,
            fontWeight: 600,
            width: '50%',
          }}
        >
          Guardar cambios
        </Button>
          </Grid>
          
        </Grid>
      </Box>
    </Modal>
  );
};