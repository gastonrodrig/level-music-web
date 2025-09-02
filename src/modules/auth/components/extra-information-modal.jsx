import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { useUsersStore } from "../../../hooks/user/use-users-store";
import { useMemo } from "react";

export const ExtraInformationModal = ({ 
  open, 
  onClose 
}) => {
  const { uid, loadingExtraData, startUpdateExtraData } = useUsersStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm({
    mode: "onBlur",
  });

  const onSubmit = async (data) => {
    try {
      const success = await startUpdateExtraData(uid, data);
      if (success) onClose();
    } catch (error) {
      console.log(error);
    }
  };

  const isButtonDisabled = useMemo(() => loadingExtraData, [loadingExtraData]);

  return (
    <Modal
      open={open}
      onClose={onClose}
      hideBackdrop={false}
      disableEscapeKeyDown
    >
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
        <Typography variant="h6" mb={2}>
          Complete la información adicional
        </Typography>
        <Typography variant="body2" mb={3}>
          Por favor, proporciona la siguiente información adicional para completar tu perfil.
        </Typography>

        <Box display="flex" gap={2} mb={2} sx={{ flexDirection: "column" }}>
          
          {/* Nombre */}
          <TextField
            label="Nombre"
            fullWidth
            {...register("first_name", {
              required: "El nombre es obligatorio"              
            })}
            error={!!errors.first_name}
            helperText={errors.first_name?.message}
          />

          {/* Apellido */}
          <TextField
            label="Apellido"
            fullWidth
            {...register("last_name", {
              required: "El apellido es obligatorio"
            })}
            error={!!errors.last_name}
            helperText={errors.last_name?.message}
          />

          {/* Teléfono */}
          <TextField
            label="Teléfono"
            fullWidth
            {...register("phone", {
              required: "El número es obligatorio",
              pattern: {
                value: /^[0-9]{9}$/,
                message: "El número debe tener 9 dígitos",
              },
            })}
            error={!!errors.phone}
            helperText={errors.phone?.message}
          />

          {/* Tipo de documento */}
          <FormControl fullWidth error={!!errors.document_type}>
            <InputLabel id="document-type-label">Tipo de documento</InputLabel>
            <Select
              labelId="document-type-label"
              value={watch("document_type") || ""}
              {...register("document_type", {
                required: "Selecciona un tipo de documento",
                onChange: (e) => {
                  setValue("document_type", e.target.value);
                  setValue("document_number", "");
                },
              })}
              onChange={(e) => {
                setValue("document_type", e.target.value);
                setValue("document_number", "");
              }}
            >
              <MenuItem value="Dni">DNI</MenuItem>
              <MenuItem value="Ruc">RUC</MenuItem>
            </Select>
            <FormHelperText>{errors.document_type?.message}</FormHelperText>
          </FormControl>

          {/* Número de documento */}
          <TextField
            label="Número de documento"
            fullWidth
            {...register("document_number", {
              required: watch("document_type") === "Ruc"
                ? "El número de RUC es obligatorio"
                : watch("document_type") === "Dni"
                ? "El número de DNI es obligatorio"
                : "El número de documento es obligatorio",
              pattern: watch("document_type") === "Ruc"
                ? {
                    value: /^10\d{9}$/,
                    message: "El RUC debe iniciar con 10 y tener 11 dígitos",
                  }
                : watch("document_type") === "Dni"
                ? {
                    value: /^\d{8}$/,
                    message: "El DNI debe tener 8 dígitos",
                  }
                : undefined,
            })}
            error={!!errors.document_number}
            helperText={errors.document_number?.message}
          />
        </Box>

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
          Guardar Información
        </Button>
      </Box>
    </Modal>
  );
};
