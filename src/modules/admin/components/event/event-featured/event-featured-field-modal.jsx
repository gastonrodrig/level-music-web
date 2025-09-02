import React, { useEffect } from "react";
import {
  Box,
  Button,
  Modal,
  TextField,
  Typography,
  IconButton,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import { useForm } from "react-hook-form";

export const EventFeaturedFieldModal = ({
  open,
  onClose,
  onSubmit,
  field = {},
  index = null,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    mode: "onBlur",
    defaultValues: {
      title: "",
      description: "",
    },
  });

  useEffect(() => {
    if (open) {
      reset({
        title: field?.title ?? "",
        description: field?.description ?? "",
      });
    }
  }, [open, reset, field]);

  const handleFormSubmit = (data) => {
    onSubmit(data, index);
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        component="form"
        onSubmit={handleSubmit(handleFormSubmit)}
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: { xs: "90%", sm: 400 },
          bgcolor: "background.paper",
          borderRadius: 4,
          boxShadow: 24,
          p: 4,
        }}
      >
        {/* Header */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h6" fontWeight={600}>
            {field?.title ? "Editar servicio" : "Añadir servicio"}
          </Typography>
          <IconButton onClick={onClose}>
            <Close />
          </IconButton>
        </Box>

        {/* Campos */}
        <Box display="flex" flexDirection="column" gap={2}>
          <TextField
            label="Título del servicio"
            fullWidth
            {...register("title", { required: "El título es obligatorio" })}
            error={Boolean(errors.title)}
            helperText={errors.title?.message}
          />

          <TextField
            label="Descripción"
            fullWidth
            multiline
            rows={4}
            {...register("description", { required: "La descripción es obligatoria" })}
            error={Boolean(errors.description)}
            helperText={errors.description?.message}
          />
        </Box>

        {/* Botón guardar */}
        <Button
          type="submit"
          variant="contained"
          fullWidth
          sx={{
            mt: 2,
            backgroundColor: "#212121",
            color: "#fff",
            textTransform: "none",
            py: 1.5,
            borderRadius: 2,
            fontWeight: 600,
          }}
        >
          Guardar
        </Button>
      </Box>
    </Modal>
  );
};
