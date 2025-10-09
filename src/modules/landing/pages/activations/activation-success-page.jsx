// src/modules/landing/pages/ActivationSuccessPage.jsx
import { Stack, Button, Typography, useTheme, Box, Alert, AlertTitle } from "@mui/material";
import { AuthLayout } from "../../../auth/layout/auth-layout";
import { Link as RouterLink } from "react-router-dom";

export const ActivationSuccessPage = () => {
  const theme = useTheme();

  return (
    <AuthLayout
      title="Cuenta activada correctamente"
      subtitle="Ya puedes iniciar sesión con una nueva cuenta."
      isLogin={false}
    >
      <Stack spacing={3} sx={{ width: "100%", mt: 1 }}>
        <Alert 
          severity="success"
          variant="filled"
          sx={{ width: "100%" }}
          aria-live="polite"
        >
          Revisa tu correo electrónico para encontrar tus credenciales de acceso.
        </Alert>
        <Button
          component={RouterLink}
          to="/auth/login"
          fullWidth
          variant="text"
          color="primary"
          sx={{
            mt: 1,
            padding: "10px",
            textTransform: "none",
            fontSize: 16,
            "&:hover": {
              backgroundColor: theme.palette.primary.hover,
            },
            backgroundColor: theme.palette.primary.main,
            color: "white",
          }}
        >
          Ir al inicio de sesión
        </Button>
      </Stack>
    </AuthLayout>
  );
};
