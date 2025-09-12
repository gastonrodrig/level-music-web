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
import { useClientCompanyStore } from "../../../../hooks";
import { Close } from "@mui/icons-material";
import { useForm } from "react-hook-form";
import { useMemo, useEffect } from "react";

export const ClientCompanyModal = ({
  open,
  onClose,
  clientCompany = {},
  setClientCompany,
  loading,
}) => {
  const isEditing = !!clientCompany?._id;
  const { startCreateClientCompany, startUpdateClientCompany } = useClientCompanyStore();

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
        company_name: clientCompany?.company_name ?? "",
        contact_person: clientCompany?.contact_person ?? "",
        email: clientCompany?.email ?? "",
        phone: clientCompany?.phone ?? "",
        document_number: clientCompany?.document_number ?? "",
        status: clientCompany?.status ?? "Activo",
      });
    }
  }, [open, reset, clientCompany]);

  const onSubmit = async (data) => {
    try {
      const success = isEditing
        ? await startUpdateClientCompany(clientCompany._id, data)
        : await startCreateClientCompany(data);
      if (success) {
        setClientCompany(data); 
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
            {isEditing ? "Editar cliente empresa" : "Agregar cliente empresa"}
          </Typography>
          <IconButton onClick={onClose}>
            <Close />
          </IconButton>
        </Box>

        <Box display="flex" gap={2} mb={2} sx={{ flexDirection: "column" }}>

          {/* Nombre de la empresa */}
          <TextField
            label="Nombre de la Empresa"
            fullWidth
            {...register("company_name", {
              required: "El nombre empresa es obligatorio"              
            })}
            error={!!errors.company_name}
            helperText={errors.company_name?.message}
          />

          {/* Persona de contacto */}
          <TextField
            label="Persona de Contacto"
            fullWidth
            {...register("contact_person", {
              required: "La persona de contacto es obligatorio"
            })}
            error={!!errors.contact_person}
            helperText={errors.contact_person?.message}
          />

          {/* Email */}
          <TextField
            label="Correo"
            fullWidth
            {...register("email", {
              required: "El correo es obligatorio"
            })}
            error={!!errors.email}
            helperText={errors.email?.message}
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

          {/* Número de RUC */}
          <TextField
            label="Número de RUC"
            fullWidth
            {...register("document_number", {
              required: "El número de RUC es obligatorio",
              pattern: {
                value: /^10\d{9}$/,
                message: "El RUC debe iniciar con 10 y tener 11 dígitos",
              },
            })}
            error={!!errors.document_number}
            helperText={errors.document_number?.message}
          />

          {/* Estado */}
          { isEditing && (
            <FormControl fullWidth error={!!errors.status}>
              <InputLabel id="status-label">Estado</InputLabel>
              <Select
                labelId="status-label"
                value={watch("status") || "Activo"}
                {...register("status", {
                  required: "Selecciona un estado",
                })}
                onChange={(e) => setValue("status", e.target.value)}
              >
                <MenuItem value="Activo">Activo</MenuItem>
                <MenuItem value="Inactivo">Inactivo</MenuItem>
              </Select>
              <FormHelperText>{errors.status?.message}</FormHelperText>
            </FormControl>
          )}
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