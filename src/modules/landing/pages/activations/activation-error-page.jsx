// src/modules/landing/pages/ActivationErrorPage.jsx
import { Stack, Button, Typography, useTheme } from "@mui/material";
import { AuthLayout } from "../../../auth/layout/auth-layout";
import { Link as RouterLink } from "react-router-dom";

export const ActivationErrorPage = () => {
  const theme = useTheme();

  return (
    <AuthLayout
      title="El enlace no es válido o ha expirado ❌"
      subtitle="Intenta solicitar una nueva activación o comunícate con soporte."
      isLogin={false}
    >
      <Stack spacing={2} alignItems="center" sx={{ width: "100%" }}>
        <Typography variant="body1" sx={{ color: "#252020" }}>
          Si crees que esto es un error, vuelve al inicio e inténtalo de nuevo.
        </Typography>

        <Button
          component={RouterLink}
          to="/"
          variant="contained"
          fullWidth
          sx={{
            textTransform: "none",
            fontSize: 16,
            backgroundColor: theme.palette.primary.main,
            color: "white",
            "&:hover": { backgroundColor: theme.palette.primary.hover },
          }}
        >
          Volver al inicio
        </Button>
      </Stack>
    </AuthLayout>
  );
};
