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
  FormHelperText
} from '@mui/material';
import { useEffect } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

export const PersonalInfoForm = () => {
  const {
    register,
    watch,
    control,
    formState: { errors },
    setValue
  } = useFormContext();

  const clientType = watch("client_type", "PERSONA"); 

  useEffect(() => {
    const currentDocType = watch("document_type");

    if (clientType === "EMPRESA") {
      // Empresa siempre debe ser Ruc, pero solo si no está ya en Ruc
      if (currentDocType !== "Ruc") {
        setValue("document_type", "Ruc");
        setValue("document_number", "");
      }
    } else if (clientType === "PERSONA") {
      // Persona: no tocar lo que ya eligió el usuario
      if (!currentDocType) {
        setValue("document_type", "Dni");
      }
    }
  }, [clientType, watch, setValue]);

  return (
    <Box p={1}>
      {/* Selección tipo de cliente */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle1" fontWeight={600} gutterBottom>
          Tipo de Cliente
        </Typography>
        <Controller
          name="client_type"
          control={control}
          defaultValue="PERSONA"
          render={({ field }) => (
            <RadioGroup row {...field}>
              <FormControlLabel
                value="PERSONA"
                control={<Radio />}
                label="Persona Natural"
              />
              <FormControlLabel
                value="EMPRESA"
                control={<Radio />}
                label="Empresa"
              />
            </RadioGroup>
          )}
        />
      </Box>

      {/* Campos dinámicos */}
      <Grid container spacing={3}>
        {clientType === "PERSONA" ? (
          <>
            <Grid item xs={12} md={6}>
              <TextField
                label="Nombre"
                fullWidth
                {...register("first_name", {
                  required: "El nombre es obligatorio"
                })}
                error={!!errors.first_name}
                helperText={errors.first_name?.message}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Apellido"
                fullWidth
                {...register("last_name", {
                  required: "El apellido es obligatorio"
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
                fullWidth
                {...register("company_name", {
                  required: "El nombre de la empresa es obligatorio"
                })}
                error={!!errors.company_name}
                helperText={errors.company_name?.message}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Persona de Contacto"
                fullWidth
                {...register("contact_person", {
                  required: "La persona de contacto es obligatoria"
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
            {...register("email", {
              required: "El correo es obligatorio",
              pattern: { value: /^\S+@\S+$/i, message: "Formato inválido" }
            })}
            error={!!errors.email}
            helperText={errors.email?.message}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            label="Teléfono de Contacto"
            fullWidth
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

      <Divider sx={{ my: 4 }} />

      {/* Documento de identidad */}
      <Typography variant="subtitle1" fontWeight={600} gutterBottom>
        Documento de Identidad
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth error={!!errors.document_type}>
            <InputLabel id="document-type-label">Tipo de documento</InputLabel>
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
                    field.onChange(e);
                    setValue("document_number", "");
                  }}
                  disabled={clientType === "EMPRESA"}
                >
                  {clientType === "EMPRESA"
                    ? [<MenuItem key="Ruc" value="Ruc">Ruc</MenuItem>]
                    : [
                        <MenuItem key="Dni" value="Dni">Dni</MenuItem>,
                        <MenuItem key="Ruc" value="Ruc">Ruc</MenuItem>
                      ]}
                </Select>
              )}
            />
            <FormHelperText>{errors.document_type?.message}</FormHelperText>
          </FormControl>
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            label="Número de documento"
            fullWidth
            {...register("document_number", {
              required:
                watch("document_type") === "Ruc"
                  ? "El número de RUC es obligatorio"
                  : watch("document_type") === "Dni"
                  ? "El número de DNI es obligatorio"
                  : "El número de documento es obligatorio",
              pattern:
                watch("document_type") === "Ruc"
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
        </Grid>
      </Grid>
    </Box>
  );
};
