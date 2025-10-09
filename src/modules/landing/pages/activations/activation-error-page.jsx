// src/modules/landing/pages/ActivationErrorPage.jsx
import { Stack, Button, useTheme, Alert } from "@mui/material";
import { AuthLayout } from "../../../auth/layout/auth-layout";
import { Link as RouterLink } from "react-router-dom";

export const ActivationErrorPage = () => {
  const theme = useTheme();

  return (
    <AuthLayout
      title="El enlace no es válido o ha expirado"
      subtitle="Intenta solicitar una nueva activación o comunícate con soporte."
      isLogin={false}
    >
      <Stack spacing={3} alignItems="center" sx={{ width: "100%", mt: 1 }}>
        <Alert 
          severity="error" 
          variant="filled" 
          sx={{ width: "100%" }} 
          aria-live="assertive"
        >
          El enlace de activación es inválido o ha expirado.
        </Alert>

        <Button
          component={RouterLink}
          to="/"
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
          Volver al inicio
        </Button>
      </Stack>
    </AuthLayout>
  );
};
