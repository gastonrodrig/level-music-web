import {
  Box,
  TextField,
  Typography,
  RadioGroup,
  FormControlLabel,
  Radio,
  Divider,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Button,
  useTheme,
} from "@mui/material";
import { useEffect } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { useAuthStore, useUsersStore } from "../../../../hooks";
import { AccountBox } from "@mui/icons-material";

export const PersonalInfoForm = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const { firstName, lastName, email, phone, documentType, documentNumber } =
    useUsersStore();

  const { status } = useAuthStore();

  const {
    register,
    watch,
    control,
    formState: { errors },
    setValue,
  } = useFormContext();

  const clientType = watch("clientType", "Persona");

  useEffect(() => {
    if (status === "authenticated") {
      if (clientType === "Persona") {
        setValue("firstName", firstName || "");
        setValue("lastName", lastName || "");
        setValue("email", email || "");
        setValue("phone", phone || "");
        setValue("documentType", documentType || "Dni");
        setValue("documentNumber", documentNumber || "");
      } else if (clientType === "Empresa") {
        // We don't have a company name in the user store; populate contact with user name when available
        setValue("companyName", "");
        const contact = `${firstName || ""} ${lastName || ""}`.trim();
        setValue("contactPerson", contact || "");
        setValue("email", email || "");
        setValue("phone", phone || "");
        // For empresa, prefer Ruc as default document type
        setValue("documentType", documentType || "Ruc");
        setValue("documentNumber", documentNumber || "");
      }
    }
  }, [
    status,
    clientType,
    firstName,
    lastName,
    email,
    phone,
    documentType,
    documentNumber,
    setValue,
  ]);

  useEffect(() => {
    const currentDocType = watch("documentType");

    if (clientType === "Empresa") {
      if (currentDocType !== "Ruc") {
        setValue("documentType", "Ruc");
        setValue("documentNumber", "");
      }
      // Limpiar campos de persona que no aplican
      setValue("firstName", "");
      setValue("lastName", "");
      setValue("email", "");
      setValue("phone", "");
    } else if (clientType === "Persona") {
      // Limpiar campos de empresa que no aplican
      setValue("companyName", "");
      setValue("contactPerson", "");
      setValue("documentType", "Dni");
    }
  }, [clientType, watch, setValue]);

  return (
    <Box
      sx={{
        bgcolor: isDark ? "#1f1e1e" : "#f5f5f5",
        borderRadius: 2,
        mb: 2,
      }}
    >
      {/* Cabecera más oscura */}
      <Box
        sx={{
          bgcolor: isDark ? "#151515" : "#e0e0e0",
          p: 2,
          display: "flex",
          alignItems: "center",
          gap: 1,
          borderTopLeftRadius: 8,
          borderTopRightRadius: 8,
        }}
      >
        <AccountBox />
        <Typography fontWeight={700}>Información del Cliente</Typography>
      </Box>

      <Box
        sx={{
          px: 3,
          pb: 3,
          pt: 2,
          bgcolor: isDark ? "#1f1e1e" : "#f5f5f5",
          borderBottomLeftRadius: 8,
          borderBottomRightRadius: 8,
        }}
      >
        {status !== "authenticated" && (
          <>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              Tipo de Cliente
            </Typography>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2.5,
              }}
            >
              {/* Selector de tipo de cliente */}
              <Controller
                name="clientType"
                control={control}
                defaultValue="Persona"
                render={({ field }) => (
                  <RadioGroup row {...field}>
                    <FormControlLabel
                      value="Persona"
                      control={<Radio />}
                      label="Persona Natural"
                    />
                    <FormControlLabel
                      value="Empresa"
                      control={<Radio />}
                      label="Empresa"
                    />
                  </RadioGroup>
                )}
              />
            </Box>
          </>
        )}

        {/* Campos dinámicos */}
        <Grid container spacing={3}>
          {clientType === "Persona" ? (
            <>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Nombre"
                  placeholder="Ingresa tu nombre"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  {...register("firstName", {
                    required: "El nombre es obligatorio",
                  })}
                  error={!!errors.firstName}
                  helperText={errors.firstName?.message}
                  disabled={
                    status === "authenticated" && clientType === "Persona"
                  }
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Apellido"
                  placeholder="Ingresa tu apellido"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  {...register("lastName", {
                    required: "El apellido es obligatorio",
                  })}
                  error={!!errors.lastName}
                  helperText={errors.lastName?.message}
                  disabled={
                    status === "authenticated" && clientType === "Persona"
                  }
                />
              </Grid>
            </>
          ) : (
            <>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Nombre de la Empresa"
                  placeholder="Ingresa el nombre de la empresa"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  {...register("companyName", {
                    required: "El nombre de la empresa es obligatorio",
                  })}
                  error={!!errors.companyName}
                  helperText={errors.companyName?.message}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Persona de Contacto"
                  placeholder="Nombre de la persona de contacto"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  {...register("contactPerson", {
                    required: "La persona de contacto es obligatoria",
                  })}
                  error={!!errors.contactPerson}
                  helperText={errors.contactPerson?.message}
                />
              </Grid>
            </>
          )}

          {/* Campos comunes */}
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Correo Electrónico"
              placeholder="ejemplo@correo.com"
              InputLabelProps={{ shrink: true }}
              {...register("email", {
                required: "El correo es obligatorio",
                pattern: {
                  value: /^\S+@\S+$/i,
                  message: "Formato inválido",
                },
              })}
              error={!!errors.email}
              helperText={errors.email?.message}
              disabled={
                status === "authenticated" && clientType === "Persona"
              }
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              label="Teléfono de Contacto"
              placeholder="Ingresa tu número (9 dígitos)"
              fullWidth
              InputLabelProps={{ shrink: true }}
              {...register("phone", {
                required: "El teléfono es obligatorio",
                pattern: {
                  value: /^[0-9]{9}$/,
                  message: "El número debe tener 9 dígitos",
                },
              })}
              error={!!errors.phone}
              helperText={errors.phone?.message}
              disabled={
                status === "authenticated" && clientType === "Persona"
              }
            />
          </Grid>
        </Grid>

        <Divider sx={{ mt: 4, mb: 3 }} />

        {/* Documento de identidad */}
        <Typography variant="subtitle1" fontWeight={600} mb={3}>
          Documento de Identidad
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth error={!!errors.documentType}>
              <InputLabel id="document-type-label">
                Tipo de documento
              </InputLabel>
              <Controller
                name="documentType"
                control={control}
                rules={{ required: "Selecciona un tipo de documento" }}
                render={({ field }) => (
                  <Select
                    {...field}
                    labelId="document-type-label"
                    value={field.value || ""}
                    onChange={(e) => {
                      field.onChange(e);
                      setValue("documentNumber", "");
                    }}
                    disabled={
                      clientType === "Empresa" ||
                      (status === "authenticated" &&
                        clientType === "Persona")
                    }
                  >
                    {clientType === "Empresa"
                      ? [
                          <MenuItem key="Ruc" value="Ruc">
                            Ruc
                          </MenuItem>,
                        ]
                      : [
                          <MenuItem key="Dni" value="Dni">
                            Dni
                          </MenuItem>,
                          <MenuItem key="Ruc" value="Ruc">
                            Ruc
                          </MenuItem>,
                        ]}
                  </Select>
                )}
              />
              <FormHelperText>
                {errors.document_type?.message}
              </FormHelperText>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              label="Número de documento"
              placeholder="Ingresa tu número"
              fullWidth
              InputLabelProps={{ shrink: true }}
              {...register("documentNumber", {
                required:
                  watch("documentType") === "Ruc"
                    ? "El número de RUC es obligatorio"
                    : watch("documentType") === "Dni"
                    ? "El número de DNI es obligatorio"
                    : "El número de documento es obligatorio",
                pattern:
                  watch("documentType") === "Ruc"
                    ? {
                        value: /^10\d{9}$/,
                        message:
                          "El RUC debe iniciar con 10 y tener 11 dígitos",
                      }
                    : watch("documentType") === "Dni"
                    ? {
                        value: /^\d{8}$/,
                        message: "El DNI debe tener 8 dígitos",
                      }
                    : undefined,
              })}
              error={!!errors.documentNumber}
              helperText={errors.documentNumber?.message}
              disabled={
                status === "authenticated" && clientType === "Persona"
              }
            />
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};
