import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  FormHelperText,
} from "@mui/material";
import { useClientStore } from "../../../../hooks";
import { Close } from "@mui/icons-material";
import { useForm } from "react-hook-form";
import { useMemo, useEffect } from "react";

export const ClientModal = ({
  open,
  onClose,
  client = {},
  setClient,
  loading,
}) => {
  const isEditing = !!client?._id;
  const { startCreateClient, startUpdateClient } = useClientStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm({
    mode: "onBlur",
  });

  useEffect(() => {
    if (open) {
      reset({
        first_name: client?.first_name ?? "",
        last_name: client?.last_name ?? "",
        email: client?.email ?? "",
        phone: client?.phone ?? "",
        document_type: client?.document_type ?? "",
        document_number: client?.document_number ?? "",
      });
    }
  }, [open, reset, client]);

  const onSubmit = async (data) => {
    try {
      const success = isEditing
        ? await startUpdateClient(client._id, data)
        : await startCreateClient(data);
      if (success) {
        setClient(data); 
        onClose();
      } 
    } catch (error) {
      console.log(error)
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
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={3}
        >
          <Typography variant="h6" fontWeight={600}>
            {isEditing ? "Editar cliente" : "Agregar cliente"}
          </Typography>
          <IconButton onClick={onClose}>
            <Close />
          </IconButton>
        </Box>

        <Box display="flex" gap={2} mb={2} sx={{ flexDirection: "column" }}>
          <TextField
            label="Nombre"
            fullWidth
            {...register("first_name", {
              required: "El nombre es obligatorio"              
            })}
            error={!!errors.first_name}
            helperText={errors.first_name?.message}
          />
          <TextField
            label="Apellido"
            fullWidth
            {...register("last_name", {
              required: "El apellido es obligatorio"
            })}
            error={!!errors.last_name}
            helperText={errors.last_name?.message}
          />
          <TextField
            label="Correo"
            fullWidth
            {...register("email", {
              required: "El correo es obligatorio"
            })}
            error={!!errors.email}
            helperText={errors.email?.message}
          />
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
          {isEditing ? "Guardar cambios" : "Agregar"}
        </Button>
      </Box>
    </Modal>
  );
};