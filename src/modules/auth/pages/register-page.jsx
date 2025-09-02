import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { Link,useNavigate } from "react-router-dom";
import { Button, Box, Typography, useTheme } from "@mui/material";
import { AuthLayout } from "../layout/auth-layout";
import { useAuthStore } from "../../../hooks";
import { CircProgress, FormInputText } from '../../../shared/ui/components';
import googleLogo from "../../../assets/images/logo/google.png";

export const RegisterPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { status, startRegisterUser, onGoogleSignIn } = useAuthStore();

  const { 
    handleSubmit, 
    formState: { errors, isSubmitting },
    register,
  } = useForm({
    mode: "onBlur"
  });
  
  const isAuthenticated = useMemo(() => status === "checking", [status]);

  const onSubmit = async (data) => {
    await startRegisterUser(data);
  };

  const signInWithGoogle = async () => {
    await onGoogleSignIn();
    
  };

  return (
    <AuthLayout 
      title="Regístrate para explorar eventos únicos" 
      subtitle="Usa estas credenciales para reservar eventos y gestionar tu cuenta fácilmente."
    >
      {status === 'checking' && <CircProgress />}
      <form onSubmit={handleSubmit(onSubmit)} style={{ width: "100%" }}>
        {/* Email */}
        <FormInputText
          name="email"
          register={register}
          label="Correo electrónico"
          type="email"
          error={errors.email}
          rules={{ 
            required: "El email es obligatorio",
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: "Email inválido"
            }
          }}
        />

        {/* Contraseña */}
        <FormInputText
          name="password"
          register={register}
          label="Contraseña"
          type="password"
          error={errors.password}
          rules={{ 
            required: "La contraseña es obligatoria",
            minLength: { value: 6, message: "Mínimo 6 caracteres" },
            maxLength: { value: 12, message: "Máximo 12 caracteres" },
            pattern: {
              value: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!$@%])[A-Za-z\d!$@%]{6,12}$/,
              message: "Debe incluir letras, números y al menos un caracter especial (!$@%)"
            }
          }}
          isPasswordInput
        />

        <Button
          type="submit"
          fullWidth
          variant="text"
          sx={{
            mt: 3,
            padding: "10px",
            textTransform: "none",
            fontSize: "1rem",
            backgroundColor: theme.palette.primary.main,
            color: "white",
            "&:hover": { backgroundColor: theme.palette.primary.hover }
          }}
          disabled={isSubmitting || isAuthenticated}
        >
          Registrarse
        </Button>

        <Typography sx={{ my: 3, textAlign: 'center' }}>O crea una cuenta con</Typography>
        
        <Button
          fullWidth
          variant="text"
          onClick={signInWithGoogle}
          sx={{
            padding: "10px",
            textTransform: "none",
            fontSize: "1rem",
            color: "#000",
            "&:hover": { backgroundColor: "#D3B7AD" },
            backgroundColor: "#F0D1C5",
            mb: 2,
          }}
          disabled={isSubmitting || isAuthenticated}
        >
          <Box component="img" src={googleLogo} alt="Google Logo" sx={{ width: 24, height: 24, mr: 1 }} />
          <Typography sx={{ ml: 1 }}>Continuar con Gmail</Typography>
        </Button>
        
        <Typography sx={{ mt: 1, textAlign: 'center' }}>
          ¿Ya tienes cuenta?{' '}
          <Link 
            to="/auth/login" 
            style={{ color: theme.palette.text.primary, textDecoration: "underline", fontWeight: 600 }}
          >
            Inicia sesión
          </Link>
        </Typography>
      </form>
    </AuthLayout>
  );
};