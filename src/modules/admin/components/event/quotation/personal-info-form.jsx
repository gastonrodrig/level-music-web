import { useEffect } from "react";
import {
  Box,
  TextField,
  Typography,
  RadioGroup,
  FormControlLabel,
  Radio,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  useTheme,
  Divider,
} from "@mui/material";
import { Controller, useFormContext } from "react-hook-form";
import { AccountBox } from "@mui/icons-material";

export const PersonalInfoForm = () => {
  const {
    register,
    watch,
    control,
    formState: { errors },
    setValue,
  } = useFormContext();
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  const clientType = watch("client_type", "Persona");
  const documentType = watch("document_type", "Dni");

  useEffect(() => {
    const currentDocType = watch("document_type");

    if (clientType === "Empresa") {
      if (currentDocType !== "Ruc") {
        setValue("document_type", "Ruc");
        setValue("document_number", "");
      }
      // Limpiar campos de persona que no aplican
      setValue("first_name", "");
      setValue("last_name", "");
      setValue("email", "");
      setValue("phone", "");
    } else if (clientType === "Persona") {
      // Limpiar campos de empresa que no aplican
      setValue("company_name", "");
      setValue("contact_person", "");
      setValue("document_type", "Dni");
    }
  }, [clientType, watch, setValue]);

  return (
    <>
      <Box
        sx={{
          borderRadius: 2,
          border: "1px solid",
          borderColor: "divider",
          overflow: "hidden",
          mb: 3,
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
          }}
        >
          <AccountBox />
          <Typography fontWeight={700}>Información del Cliente</Typography>
        </Box>

        {/* Contenido más claro */}
        <Box sx={{ p: 3, bgcolor: isDark ? "#1f1e1e" : "#f5f5f5" }}>
          {/* Tipo de Cliente */}
          <Typography variant="subtitle1" fontWeight={600} gutterBottom>
            Tipo de Cliente
          </Typography>
          <Controller
            name="client_type"
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

          <Grid container spacing={3} mt={1}>
            {clientType === "Persona" ? (
              <>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Nombre"
                    placeholder="Ingresa tu nombre"
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    {...register("first_name", {
                      required: "El nombre es obligatorio",
                    })}
                    error={!!errors.first_name}
                    helperText={errors.first_name?.message}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Apellido"
                    placeholder="Ingresa tu apellido"
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    {...register("last_name", {
                      required: "El apellido es obligatorio",
                    })}
                    error={!!errors.last_name}
                    helperText={errors.last_name?.message}
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
                    {...register("company_name", {
                      required: "El nombre de la empresa es obligatorio",
                    })}
                    error={!!errors.company_name}
                    helperText={errors.company_name?.message}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Persona de Contacto"
                    placeholder="Nombre de la persona de contacto"
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    {...register("contact_person", {
                      required: "La persona de contacto es obligatoria",
                    })}
                    error={!!errors.contact_person}
                    helperText={errors.contact_person?.message}
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
                  pattern: { value: /^\S+@\S+$/i, message: "Formato inválido" },
                })}
                error={!!errors.email}
                helperText={errors.email?.message}
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
              <FormControl fullWidth error={!!errors.document_type}>
                <InputLabel id="document-type-label">
                  Tipo de Documento
                </InputLabel>
                <Controller
                  name="document_type"
                  control={control}
                  rules={{ required: "Selecciona un tipo de documento" }}
                  render={({ field }) => (
                    <Select
                      {...field}
                      labelId="document-type-label"
                      value={field.value || ""}
                      onChange={(e) => {
                        console.log(e.target.value);
                        field.onChange(e);
                        setValue("document_number", "");
                      }}
                      disabled={clientType === "Empresa"}
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
                <FormHelperText>{errors.document_type?.message}</FormHelperText>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Número de Documento"
                placeholder="Ingresa tu número"
                fullWidth
                InputLabelProps={{ shrink: true }}
                {...register("document_number", {
                  required:
                    documentType === "Ruc"
                      ? "El número de RUC es obligatorio"
                      : "El número de DNI es obligatorio",
                  pattern:
                    documentType === "Ruc"
                      ? {
                          value: /^10\d{9}$/,
                          message:
                            "El RUC debe iniciar con 10 y tener 11 dígitos",
                        }
                      : {
                          value: /^\d{8}$/,
                          message: "El DNI debe tener 8 dígitos",
                        },
                })}
                error={!!errors.document_number}
                helperText={errors.document_number?.message}
              />
            </Grid>
          </Grid>
        </Box>
      </Box>
    </>
  );
};
