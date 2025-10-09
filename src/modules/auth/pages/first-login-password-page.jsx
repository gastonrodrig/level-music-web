import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { Button, useTheme } from "@mui/material";
import { AuthLayout } from "../layout/auth-layout";
import { FormInputText } from "../../../shared/ui/components";
import { useAuthStore } from "../../../hooks";

export const FirstLoginPassword = () => {
  const theme = useTheme();
  const { status, startChangePasswordFirstLogin } = useAuthStore();
  
  const {
    handleSubmit,
    formState: { errors, isSubmitting },
    register,
  } = useForm({
    mode: "onBlur",
  });

  const isAuthenticated = useMemo(() => status === "checking", [status]);

  const onSubmit = async (data) => {
    await startChangePasswordFirstLogin(data);
  };

  return (
    <AuthLayout
      title="Cambiar contraseña"
      subtitle="La contraseña debe tener entre 6 y 12 caracteres, incluir letras, números y al menos un caracter especial (!$@%)."
    >
      <form onSubmit={handleSubmit(onSubmit)} style={{ width: "100%" }}>
        {/* Nueva contraseña */}
        <FormInputText
          name="password"
          register={register}
          label="Nueva contraseña"
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

        {/* Confirmar nueva contraseña */}
        <FormInputText
          name="confirmPassword"
          register={register}
          label="Confirmar nueva contraseña"
          type="password"
          error={errors.confirmPassword}
          rules={{ 
            required: "La contraseña es obligatoria",
            minLength: { value: 6, message: "Mínimo 6 caracteres" },
            maxLength: { value: 12, message: "Máximo 12 caracteres" },
            pattern: {
              value: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!$@%])[A-Za-z\d!$@%]{6,12}$/,
              message: "Debe incluir letras, números y al menos un caracter especial (!$@%)"
            }
          }}
        />

        {/* Botón de actualizar contraseña */}
        <Button
          type="submit"
          fullWidth
          variant="text"
          color="primary"
          sx={{
            mt: 3,
            padding: "10px",
            textTransform: "none",
            fontSize: 16,
            backgroundColor: theme.palette.primary.main,
            color: "white",
            "&:hover": {
              backgroundColor: theme.palette.primary.hover,
            },
          }}
          disabled={isSubmitting || isAuthenticated}
        >
          Actualizar
        </Button>
      </form>
    </AuthLayout>
  );
};