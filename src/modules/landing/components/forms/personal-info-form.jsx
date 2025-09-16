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
  Button
} from '@mui/material';
import { useEffect } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { useAuthStore, useUsersStore } from '../../../../hooks';

export const PersonalInfoForm = () => {
  const {
    firstName,
    lastName,
    email,
    phone,
    documentType,
    documentNumber
  } = useUsersStore();

  const { status } = useAuthStore();

  const {
    register,
    watch,
    control,
    formState: { errors },
    setValue
  } = useFormContext();

  const clientType = watch("client_type", "Persona");

  const handleAutofill = () => {
    if (status === 'authenticated') {
      setValue('first_name', firstName || '');
      setValue('last_name', lastName || '');
      setValue('email', email || '');
      setValue('phone', phone || '');
      setValue('document_type', documentType || 'Dni');
      setValue('document_number', documentNumber || '');
    }
  };

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
    <Box p={1}>
      {/* Selección tipo de cliente */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle1" fontWeight={600} gutterBottom>
          Tipo de Cliente
        </Typography>
        <Box 
          sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center' 
          }}
        >
          {/* Selector de tipo de cliente */}
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

          {/* Botón de autocompletar si está autenticado y es persona natural */}
          {status === 'authenticated' && clientType === 'Persona' && (
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
              <Button
                variant="contained"
                style={{
                  px: 4,
                  py: 1,
                  borderRadius: 3,
                  textTransform: 'none',
                  fontWeight: 600,
                  bgcolor: '#4a4a4a',
                  color: '#fff',
                  '&:hover': {
                    bgcolor: '#5c5c5c',
                  },
                }}
                onClick={handleAutofill}
              >
                Autocompletar datos
              </Button>
            </Box>
          )}
        </Box>
      </Box>

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
                placeholder="Ingresa tu apellido"
                fullWidth
                InputLabelProps={{ shrink: true }}
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
                placeholder="Ingresa el nombre de la empresa"
                fullWidth
                InputLabelProps={{ shrink: true }}
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
                placeholder="Nombre de la persona de contacto"
                fullWidth
                InputLabelProps={{ shrink: true }}
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
            placeholder="ejemplo@correo.com"
            InputLabelProps={{ shrink: true }}
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
                  disabled={clientType === "Empresa"}
                >
                  {clientType === "Empresa"
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
            placeholder="Ingresa tu número"
            fullWidth
            InputLabelProps={{ shrink: true }}
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

      {/* Resumen */}
      <Box
        mt={4}
        p={3}
        sx={{
          border: "1px dashed",
          borderColor: "divider",
          borderRadius: 2,
          bgcolor: (theme) =>
            theme.palette.mode === "dark"
              ? "rgba(255,255,255,0.05)"
              : "rgba(0,0,0,0.05)",
        }}
      >
        <Typography variant="subtitle1" fontWeight={600} gutterBottom>
          Resumen de Información Personal
        </Typography>
        <Typography variant="body2">
          Tipo de Cliente: {clientType === "Persona" ? "Persona Natural" : "Empresa"}
        </Typography>

        {clientType === "Persona" ? (
          <>
            <Typography variant="body2">
              Nombre: {watch("first_name") || "-"}
            </Typography>
            <Typography variant="body2">
              Apellido: {watch("last_name") || "-"}
            </Typography>
          </>
        ) : (
          <>
            <Typography variant="body2">
              Empresa: {watch("company_name") || "-"}
            </Typography>
            <Typography variant="body2">
              Contacto: {watch("contact_person") || "-"}
            </Typography>
          </>
        )}

        <Typography variant="body2">
          Correo: {watch("email") || "-"}
        </Typography>
        <Typography variant="body2">
          Teléfono: {watch("phone") || "-"}
        </Typography>
        <Typography variant="body2">
          Documento: {watch("document_type") || "-"}{" "}
          {watch("document_number") || ""}
        </Typography>
      </Box>
    </Box>
  );
};
