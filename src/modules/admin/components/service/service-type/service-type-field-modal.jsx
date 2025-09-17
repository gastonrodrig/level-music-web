import React, { useEffect } from "react";
import {
  Box,
  Button,
  Modal,
  TextField,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  IconButton,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import { useForm, Controller } from "react-hook-form";

export const ServiceTypeFieldModal = ({
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
    watch,
    setValue,
    control,
    formState: { errors },
  } = useForm({
    mode: "onBlur",
    defaultValues: {
      name: "",
      type: "numérico",
      default: false,
    },
  });

  useEffect(() => {
    if (open) {
      reset({
        name: field?.name ?? "",
        type: field?.type ?? "numérico",
        default: field?.default ?? false,
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
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h6" fontWeight={600}>
            {field?.name ? "Editar campo" : "Añadir campo"}
          </Typography>
          <IconButton onClick={onClose}>
            <Close />
          </IconButton>
        </Box>

        <Box display="flex" flexDirection="column" gap={2}>
          <TextField
            label="Nombre del campo"
            fullWidth
            {...register("name", { required: "El nombre del campo es obligatorio" })}
            error={Boolean(errors.name)}
            helperText={errors.name?.message}
          />

          <FormControl fullWidth error={Boolean(errors.type)}>
            <InputLabel id="type-label">Tipo de dato</InputLabel>
            <Select
              labelId="type-label"
              value={watch("type") || "texto"}
              {...register("type", { required: "Selecciona un tipo de dato" })}
              onChange={(e) => setValue("type", e.target.value)}
            >
              <MenuItem value="texto">texto</MenuItem>
              <MenuItem value="numérico">numérico</MenuItem>
            </Select>
          </FormControl>

          <Box display="flex" alignItems="center" gap={1}>
            <Controller
              name="default"
              control={control}
              render={({ field }) => (
                <Checkbox
                  {...field}
                  checked={field.value}
                />
              )}
            />
            <Typography>Por defecto</Typography>
          </Box>
        </Box>

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
