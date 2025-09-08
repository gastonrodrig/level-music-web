import { useState, useMemo, useRef } from "react";
import { useForm } from "react-hook-form";
import { useUsersStore } from "../../../../hooks";
import { default_profile_user } from "../../../../assets/images/user";
import {
  Box,
  Typography,
  Button,
  Grid,
  TextField,
  MenuItem,
  Avatar,
} from "@mui/material";

export const ProfilePage = () => {
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
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    mode: "onBlur",
    defaultValues: {
      firstName,
      lastName,
      email,
      phone,
      documentType,
      documentNumber,
    },
  });

  const [isEditing, setIsEditing] = useState(false);
  const fileInputRef = useRef(null);

  const isButtonDisabled = useMemo(
    () => loadingClientProfile,
    [loadingClientProfile]
  );

  const onSubmit = async (data) => {
    await startUpdateClientProfileData(uid, data);
    setIsEditing(false);
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
      <Typography
        sx={{
          mb: 3,
          fontSize: { xs: 20, sm: 30 },
          fontWeight: "bold",
        }}
      >
        Editar Perfil
      </Typography>

      {/* FOTO */}
      <Box display="flex" alignItems="center" mb={3}>
        <Avatar
          src={photoURL || default_profile_user}
          alt="Profile"
          sx={{ width: 80, height: 80, mr: 2 }}
        />
        <Button
          variant="outlined"
          component="label"
          sx={{ mr: 2 }}
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
          variant="outlined"
          color="error"
          onClick={handleRemovePhoto}
          disabled={isButtonDisabled}
        >
          Eliminar
        </Button>
      </Box>

      {/* FORM */}
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Nombre"
              fullWidth
              {...register("firstName")}
              disabled={!isEditing}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Apellido"
              fullWidth
              {...register("lastName")}
              disabled={!isEditing}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Correo"
              type="email"
              fullWidth
              {...register("email")}
              disabled
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Teléfono"
              fullWidth
              {...register("phone")}
              disabled={!isEditing}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              select
              label="Tipo Documento"
              fullWidth
              {...register("documentType")}
              disabled={!isEditing}
            >
              <MenuItem value="DNI">DNI</MenuItem>
              <MenuItem value="CE">CE</MenuItem>
              <MenuItem value="PAS">PAS</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="N° Documento"
              fullWidth
              {...register("documentNumber")}
              disabled={!isEditing}
            />
          </Grid>
        </Grid>

        {/* BOTONES */}
        <Box display="flex" justifyContent="flex-end" mt={3}>
          {!isEditing ? (
            <>
              <Button
                variant="outlined"
                sx={{ mr: 2 }}
                disabled
              >
                Guardar
              </Button>
              <Button
                variant="contained"
                onClick={() => setIsEditing(true)}
                disabled={isButtonDisabled}
              >
                Editar
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="outlined"
                color="error"
                sx={{ mr: 2 }}
                onClick={handleCancel}
                disabled={isButtonDisabled}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={isButtonDisabled}
              >
                Guardar
              </Button>
            </>
          )}
        </Box>
      </form>
    </Box>
  );
};
