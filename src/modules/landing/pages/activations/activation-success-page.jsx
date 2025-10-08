// src/modules/landing/pages/ActivationSuccessPage.jsx
import { Stack, Button, Typography, useTheme } from "@mui/material";
import { AuthLayout } from "../../../auth/layout/auth-layout";
import { Link as RouterLink } from "react-router-dom";

export const ActivationSuccessPage = () => {
  const theme = useTheme();

  return (
    <AuthLayout
      title="Cuenta activada correctamente 🎉"
      subtitle="Ya puedes iniciar sesión con tus credenciales."
      isLogin={false}
    >
      <Stack spacing={2} alignItems="center" sx={{ width: "100%" }}>
        <Typography variant="body1" sx={{ color: "#252020" }}>
          Gracias por activar tu cuenta en Level Music.
        </Typography>

        <Button
          component={RouterLink}
          to="/auth/login"
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
          Ir al inicio de sesión
        </Button>
      </Stack>
    </AuthLayout>
  );
};
