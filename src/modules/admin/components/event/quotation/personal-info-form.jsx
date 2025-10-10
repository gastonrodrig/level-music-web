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
import {
  useUsersStore,
} from "../../../../../hooks";
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
  const { startLoadingUserDocument } = useUsersStore();
  const clientType = watch("client_type", "Persona");
  const documentType = watch("document_type");
  const documentNumber = watch("document_number");
  useEffect(() => {
    // Solo buscar si hay número y tipo de documento
    if (documentNumber && documentType && clientType) {
      (async () => {
        const userData = await startLoadingUserDocument(documentNumber);
        console.log("userData", userData);
        if (userData) {
          // Llena los campos del formulario con los datos recibidos
          setValue("first_name", userData.first_name || "");
          setValue("last_name", userData.last_name || "");
          setValue("email", userData.email || "");
          setValue("phone", userData.phone || "");
          setValue("company_name", userData.company_name || "");
          setValue("contact_person", userData.contact_person || "");
        }
      })();
    }
  }, [documentNumber, documentType, clientType, setValue, startLoadingUserDocument]);


  return (
    
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
 <Box sx={{ p: 3, bgcolor: isDark ? "#1f1e1e" : "#f5f5f5" }}>
        {/* Tipo de Cliente */}
        <Typography variant="subtitle1" fontWeight={600} gutterBottom>
          Tipo de Cliente
        </Typography>
        <FormControl fullWidth error={!!errors.client_type} sx={{ mb: 2, mt:2 }}>
          <InputLabel id="client-type-label">Seleccione el tipo de cliente</InputLabel>
          <Controller
            name="client_type"
            control={control}
            defaultValue=""
            rules={{ required: "Selecciona el tipo de cliente" }}
            render={({ field }) => (
              <Select
                {...field}
                labelId="client-type-label"
                label="Seleccione el tipo de cliente"
                value={field.value || ""}
              >
                <MenuItem value="Persona">Persona Natural</MenuItem>
                <MenuItem value="Empresa">Empresa</MenuItem>
              </Select>
            )}
          />
          <FormHelperText>{errors.client_type?.message}</FormHelperText>
        </FormControl>

        {/* Documento de Identidad */}
        <Typography variant="subtitle1" fontWeight={600} mb={1}>
          Documento de Identidad
        </Typography>
        <Grid container spacing={3} sx={{ mb: 2 }}>
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
                    label="Tipo de Documento"
                    value={field.value || ""}
                    disabled={!clientType}
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
              disabled={!clientType}
            />
          </Grid>
        </Grid>

        <Divider sx={{ mt: 2, mb: 3 }} />

        {/* Datos del Cliente */}
        <Typography variant="subtitle1" fontWeight={600} mb={2}>
          Datos del Cliente
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              label="Nombre"
              placeholder="Nombre"
              fullWidth
              InputLabelProps={{ shrink: true }}
              {...register("first_name", {
                required: clientType === "Persona" ? "El nombre es obligatorio" : false,
              })}
              error={!!errors.first_name}
              helperText={errors.first_name?.message}
              disabled={!clientType || clientType === "Empresa"}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label="Apellido"
              placeholder="Apellido"
              fullWidth
              InputLabelProps={{ shrink: true }}
              {...register("last_name", {
                required: clientType === "Persona" ? "El apellido es obligatorio" : false,
              })}
              error={!!errors.last_name}
              helperText={errors.last_name?.message}
              disabled={!clientType || clientType === "Empresa"}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Correo Electrónico"
              placeholder="correo@ejemplo.com"
              InputLabelProps={{ shrink: true }}
              {...register("email", {
                required: "El correo es obligatorio",
                pattern: { value: /^\S+@\S+$/i, message: "Formato inválido" },
              })}
              error={!!errors.email}
              helperText={errors.email?.message}
              disabled={!clientType}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label="Teléfono de Contacto"
              placeholder="+51 999 999 999"
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
              disabled={!clientType}
            />
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};