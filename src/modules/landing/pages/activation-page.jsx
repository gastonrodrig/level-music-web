// src/modules/landing/pages/ActivationPage.jsx
import { useSearchParams, Link as RouterLink } from "react-router-dom";
import { Stack, Button, CircularProgress, useTheme } from "@mui/material";
import { AuthLayout } from "../../auth/layout/auth-layout";

export const ActivationPage = () => {
  const theme = useTheme();
  const [params] = useSearchParams();
  const status = params.get("status");     // "sent" | "processing" | "error"
  const email  = params.get("email") || "";

  return (
    <AuthLayout
      title={status === "sent" ? "Revisa tu correo" : status === "processing" ? "Procesando…" : "Algo salió mal"}
      subtitle={
        status === "sent"
          ? `Te enviaremos tus credenciales a ${email} en breve. Revisa también la carpeta de spam.`
          : status === "processing"
          ? "Estamos activando tu cuenta. Esto puede tardar unos segundos."
          : "El enlace no es válido o ha expirado."
      }
      isLogin={false}
    >
      <Stack spacing={2} alignItems="center" sx={{ width: '100%' }}>

        {status === "processing" && (
          <CircularProgress />
        )}

        {status === "sent" && (
          <Button
            component={RouterLink}
            to="/auth/login"
            variant="text"
            fullWidth
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
        )}

        {(!status || status === "error") && (
          <Button
            component={RouterLink}
            to="/"
            variant="text"
            fullWidth
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
        )}

      </Stack>
    </AuthLayout>
  );
};
