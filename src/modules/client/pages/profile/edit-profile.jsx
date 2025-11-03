import {
  Box,
  Typography,
  Button,
  Grid,
  TextField,
  MenuItem,
  Avatar,
  FormControl,
  InputLabel,
  Select,
  FormHelperText,
} from "@mui/material";
import { useState, useMemo, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useUsersStore } from "../../../../hooks";
import { useTheme } from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";

export const ProfilePage = () => {
  const theme = useTheme();
  const {
    uid,
    email,
    firstName,
    lastName,
    phone,
    documentType,
    documentNumber,
    photoURL,
    loadingClientProfile,
    startUpdateClientProfileData,
    startUpdateClientProfilePicture,
    startRemoveClientProfilePicture,
  } = useUsersStore();

  const {
    register,
    getValues,
    reset,
    watch,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onBlur",
  });

  useEffect(() => {
    reset({
      firstName,
      lastName,
      email,
      phone,
      documentType,
      documentNumber,
    });
  }, [firstName, lastName, email, phone, documentType, documentNumber, reset]);

  const [isEditing, setIsEditing] = useState(false);
  const fileInputRef = useRef(null);

  const isButtonDisabled = useMemo(
    () => loadingClientProfile,
    [loadingClientProfile]
  );

  const onSubmit = async () => {
    const data = getValues();
    try {
      const success = await startUpdateClientProfileData(uid, data);
      if (success) {
        setIsEditing(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleCancel = () => {
    reset({
      firstName,
      lastName,
      email,
      phone,
      documentType,
      documentNumber,
    });
    setIsEditing(false);
  };

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    await startUpdateClientProfilePicture(uid, file);
  };

  const handleRemovePhoto = async () => {
    await startRemoveClientProfilePicture(uid);
  };

  return (
    <Box>
      <Box sx={{ p: 3 }}>
        {/* Foto */}
        <Box display="flex" alignItems="center" mb={3}>
          <Avatar
            src={
              photoURL ||
              (theme.palette.mode === "dark"
                ? "https://i.postimg.cc/qMPMwJfT/user-profile-dark.png"
                : "https://i.postimg.cc/C5Kd3m7W/user-profile-light.png")
            }
            alt="Profile"
            sx={{
              width: 130,
              height: 130,
              mr: 2,
              border: (theme) =>
                `6px solid ${
                  theme.palette.mode === "dark" ? "#373737ff" : "#e4e4e4ff"
                }`,
              boxSizing: "border-box",
            }}
          />
          <Box
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="flex-start"
            gap={1}
          >
            <Typography sx={{ fontWeight: 300, fontSize: 20, mb: 1 }}>
              {firstName} {lastName}
            </Typography>
            <Box
              display="flex"
              sx={{
                flexDirection: { xs: "column", sm: "row" },
                gap: { xs: 1, sm: 1 },
              }}
            >
              <Button
                variant="contained"
                component="label"
                sx={{
                  backgroundColor: "#212121",
                  color: "#fff",
                  borderRadius: 2,
                  textTransform: "none",
                  px: 2,
                  py: 1,
                }}
                disabled={isButtonDisabled}
              >
                Subir Foto
                <input
                  type="file"
                  hidden
                  ref={fileInputRef}
                  onChange={handleUpload}
                />
              </Button>
              <Button
                variant="text"
                startIcon={<Delete />}
                sx={{
                  color: "text.primary",
                  px: 2,
                  py: 1,
                  "&:hover": {
                    backgroundColor: "rgba(0, 0, 0, 0.3)",
                    color: "text.primary",
                  },
                  textTransform: "none",
                  borderRadius: 2,
                }}
                onClick={handleRemovePhoto}
                disabled={isButtonDisabled}
              >
                Eliminar
              </Button>
            </Box>
          </Box>
        </Box>

        {/* Formulario */}
        <Box
          sx={{
            borderRadius: 2,
            border: (theme) =>
              `1px solid ${
                theme.palette.mode === "dark"
                  ? "rgb(140, 140, 140)"
                  : "rgba(0,0,0,0.12)"
              }`,
            p: 3,
          }}
        >
          <Grid container spacing={3}>
            {/* Nombre */}
            <Grid item xs={12} sm={6}>
              <TextField
                label="Nombre"
                fullWidth
                {...register("firstName", {
                  required: "El nombre es obligatorio",
                })}
                disabled={!isEditing}
                error={!!errors.firstName}
                helperText={errors.firstName?.message}
              />
            </Grid>

            {/* Apellido */}
            <Grid item xs={12} sm={6}>
              <TextField
                label="Apellido"
                fullWidth
                {...register("lastName", {
                  required: "El apellido es obligatorio",
                })}
                disabled={!isEditing}
                error={!!errors.lastName}
                helperText={errors.lastName?.message}
              />
            </Grid>

            {/* Correo */}
            <Grid item xs={12} sm={6}>
              <TextField
                label="Correo"
                type="email"
                fullWidth
                {...register("email")}
                disabled
              />
            </Grid>

            {/* Teléfono */}
            <Grid item xs={12} sm={6}>
              <TextField
                label="Teléfono"
                fullWidth
                {...register("phone", {
                  required: "El teléfono es obligatorio",
                  pattern: {
                    value: /^[0-9]{9}$/,
                    message: "El teléfono debe tener 9 dígitos",
                  },
                })}
                disabled={!isEditing}
                error={!!errors.phone}
                helperText={errors.phone?.message}
              />
            </Grid>

            {/* Tipo Documento */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth error={!!errors.document_type} disabled={!isEditing}>
                <InputLabel id="document-type-label" disabled={!isEditing}>Tipo de documento</InputLabel>
                <Select
                  labelId="document-type-label"
                  value={watch("documentType") || ""}
                  {...register("documentType", {
                    required: "Selecciona un tipo de documento",
                    onChange: (e) => {
                      setValue("documentType", e.target.value);
                    },
                  })}
                  onChange={(e) => {
                    setValue("documentType", e.target.value);
                  }}
                  disabled={!isEditing}
                >
                  <MenuItem value="Dni">Dni</MenuItem>
                  <MenuItem value="Ruc">Ruc</MenuItem>
                </Select>
                <FormHelperText>{errors.document_type?.message}</FormHelperText>
              </FormControl>
            </Grid>

            {/* Número de Documento */}
            <Grid item xs={12} sm={6}>
              <TextField
                label="Número de documento"
                fullWidth
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
                          message: "El RUC debe iniciar con 10 y tener 11 dígitos",
                        }
                      : watch("documentType") === "Dni"
                      ? {
                          value: /^\d{8}$/,
                          message: "El DNI debe tener 8 dígitos",
                        }
                      : undefined,
                })}
                disabled={!isEditing}
                error={!!errors.documentNumber}
                helperText={errors.documentNumber?.message}
              />
            </Grid>
          </Grid>

          {/* Botones */}
          <Box display="flex" justifyContent="flex-end" mt={3}>
            {!isEditing ? (
              <>
                <Button
                  variant="contained"
                  startIcon={<Edit />}
                  sx={{ 
                    mr: 2,
                    color: "#fff",
                    textTransform: 'none',
                    borderRadius: 2,
                    px: 2,
                    py: 1,
                  }}
                  onClick={() => setIsEditing(true)}
                  disabled={isButtonDisabled}
                >
                  Editar
                </Button>
                <Button 
                  variant="outlined" 
                  sx={{ 
                    textTransform: 'none',
                    borderRadius: 2,
                    px: 2,
                    py: 1,
                  }} 
                  disabled
                >
                  Guardar
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="outlined"
                  color="error"
                  sx={{ 
                    mr: 2,
                    textTransform: 'none',
                    borderRadius: 2,
                    px: 2,
                    py: 1,
                  }}
                  onClick={handleCancel}
                  disabled={isButtonDisabled}
                >
                  Cancelar
                </Button>
                <Button
                  variant="contained"
                  sx={{ 
                    color: "#fff",
                    textTransform: 'none',
                    borderRadius: 2,
                    px: 2,
                    py: 1,
                  }}
                  onClick={handleSubmit(onSubmit)}
                  disabled={isButtonDisabled}
                >
                  Guardar
                </Button>
              </>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
