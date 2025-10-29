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
  Menu,
  Grid,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { useUsersStore } from "../../../hooks/user/use-users-store";
import { useMemo, useEffect } from "react";

export const ExtraInformationModal = ({ 
  open, 
  onClose 
}) => {
  const { uid, loadingClientProfile, startUpdateExtraData } = useUsersStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    reset,
  } = useForm({
    mode: "onBlur",
  });

  useEffect(() => {
    if (open) {
      reset({
        first_name: "",
        last_name: "",
        company_name: "",
        contact_person: "",
        phone: "",
        document_type: "",
        document_number: "",
        client_type: "",
      });
    }
  }, [open, reset]);

  const onSubmit = async (data) => {
    try {
      const success = await startUpdateExtraData(uid, data);
      if (success) onClose();
    } catch (error) {
      console.log(error);
    }
  };

  const isButtonDisabled = useMemo(() => loadingClientProfile, [loadingClientProfile]);

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

          {/* Tipo de cliente */}
          <FormControl fullWidth error={!!errors.client_type}>
            <InputLabel id="user-type-label">Tipo de cliente</InputLabel>
            <Select
              labelId="user-type-label"
              value={watch("client_type") || ""}
              {...register("client_type", {
                required: "Selecciona tipo de cliente",
                onChange: (e) => {
                  const v = e.target.value;
                  setValue("client_type", v);
                  if (v === "Empresa") {
                    setValue("document_type", "Ruc");
                    // Limpiar campos de persona
                    setValue("first_name", "");
                    setValue("last_name", "");
                  } else if (v === "Persona") {
                    setValue("document_type", "Dni");
                    // Limpiar campos de empresa
                    setValue("company_name", "");
                    setValue("contact_person", "");
                  } else {
                    setValue("document_type", "");
                  }
                  setValue("document_number", "");
                },
              })}
              onChange={(e) => {
                const v = e.target.value;
                setValue("client_type", v);
                if (v === "Empresa") {
                  setValue("document_type", "Ruc");
                  // Limpiar campos de persona
                  setValue("first_name", "");
                  setValue("last_name", "");
                } else if (v === "Persona") {
                  setValue("document_type", "Dni");
                  // Limpiar campos de empresa
                  setValue("company_name", "");
                  setValue("contact_person", "");
                } else {
                  setValue("document_type", "");
                }
                setValue("document_number", "");
              }}
            >
              <MenuItem value="Persona">Persona Natural</MenuItem>
              <MenuItem value="Empresa">Empresa</MenuItem>
            </Select>
            <FormHelperText>{errors.client_type?.message}</FormHelperText>
          </FormControl>
          
          {/* Campos dinámicos: Persona vs Empresa */}
          <Grid container spacing={2}>
            {watch("client_type") === "Empresa" ? (
              <>
                <Grid item xs={12} md={12}>
                  <TextField
                    label="Nombre de la Empresa"
                    fullWidth
                    InputLabelProps={{ shrink: !!watch("company_name") }}
                    {...register("company_name", {
                      required: "El nombre de la empresa es obligatorio",
                    })}
                    error={!!errors.company_name}
                    helperText={errors.company_name?.message}
                  />
                </Grid>
                <Grid item xs={12} md={12}>
                  <TextField
                    label="Persona de Contacto"
                    fullWidth
                    InputLabelProps={{ shrink: !!watch("contact_person") }}
                    {...register("contact_person", {
                      required: "La persona de contacto es obligatoria",
                    })}
                    error={!!errors.contact_person}
                    helperText={errors.contact_person?.message}
                  />
                </Grid>
              </>
            ) : (
              <>
                <Grid item xs={12} md={12}>
                  <TextField
                    label="Nombre"
                    fullWidth
                    InputLabelProps={{ shrink: !!watch("first_name") }}
                    {...register("first_name", {
                      required: "El nombre es obligatorio",
                    })}
                    error={!!errors.first_name}
                    helperText={errors.first_name?.message}
                  />
                </Grid>
                <Grid item xs={12} md={12}>
                  <TextField
                    label="Apellido"
                    fullWidth
                    InputLabelProps={{ shrink: !!watch("last_name") }}
                    {...register("last_name", {
                      required: "El apellido es obligatorio",
                    })}
                    error={!!errors.last_name}
                    helperText={errors.last_name?.message}
                  />
                </Grid>
              </>
            )}

            {/* Teléfono (común) */}
            <Grid item xs={12}>
              <TextField
                label="Teléfono"
                fullWidth
                InputLabelProps={{ shrink: !!watch("phone") }}
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
            </Grid>
          </Grid>

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
              disabled={watch("client_type") === "Empresa"}
            >
              {watch("client_type") === "Empresa" ? (
                <MenuItem value="Ruc">RUC</MenuItem>
              ) : watch("client_type") === "Persona" ? (
                [
                  <MenuItem key="dni" value="Dni">DNI</MenuItem>,
                  <MenuItem key="ruc" value="Ruc">RUC</MenuItem>,
                ]
              ) : (
                [
                  <MenuItem key="dni" value="Dni">DNI</MenuItem>,
                  <MenuItem key="ruc" value="Ruc">RUC</MenuItem>,
                ]
              )}
            </Select>
            <FormHelperText>{errors.document_type?.message}</FormHelperText>
          </FormControl>

          {/* Número de documento */}
          <TextField
            label="Número de documento"
            fullWidth
            InputLabelProps={{ shrink: !!watch("document_number") }}
            {...register("document_number", {
              required: watch("document_type") === "Ruc"
                ? "El número de RUC es obligatorio"
                : watch("document_type") === "Dni"
                ? "El número de DNI es obligatorio"
                : "El número de documento es obligatorio",
              pattern: watch("document_type") === "Ruc"
                ? (watch("client_type") === "Empresa"
                    ? {
                        value: /^20\d{9}$/,
                        message: "El RUC debe iniciar con 20 y tener 11 dígitos",
                      }
                    : {
                        value: /^10\d{9}$/,
                        message: "El RUC debe iniciar con 10 y tener 11 dígitos",
                      }
                  )
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
