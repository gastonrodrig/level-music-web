import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AuthRouter } from "../modules/auth/routes/auth-router";
import { ClientRoutes } from "../modules/client/routes/client-routes";
import { LandingRoutes } from "../modules/landing/routes/landing-routes";
import { AdminRoutes } from "../modules/admin/routes/admin-router";
import { useSelector } from "react-redux";
import { useCheckAuth, usePersistRoute,useSessionTimeout } from "../hooks";
import { CircProgress } from "../shared/ui/components";
import { NotFoundView } from "../shared/ui/layout/not-found";
import { PrivateRoute } from "./private-routes";

// Importa Material UI para el modal
import { Modal, Box, Typography, Button } from '@mui/material';

export const AppRouter = () => {
  const location = useLocation();
  const { status } = useCheckAuth();
  const { role } = useSelector((state) => state.auth);

  const { showModal, modalCountdown, forceLogout } = useSessionTimeout(); // 👈 Hook

  usePersistRoute();

  const lastRoute = sessionStorage.getItem("lastRoute") || "/";

  if (status === "checking") {
    return <CircProgress />;
  }

  if (status === "authenticated") {
    const dashboardPath = role === "Administrador" ? "/admin" : "/cliente";

    if (location.pathname.startsWith("/auth")) {
      return (
        <Navigate
          to={
            lastRoute.startsWith(dashboardPath) ? lastRoute : dashboardPath
          }
          replace
        />
      );
    }

    if (location.pathname === "/") {
      return <Navigate to={dashboardPath} replace />;
    }
  }

  if (status === "first-login-password") {
    if (!location.pathname.startsWith("/auth/first-login-password")) {
      return <Navigate to="/auth/first-login-password" replace />;
    }
    if (location.pathname === "/auth" || location.pathname === "/auth/") {
      return <Navigate to="/auth/first-login-password" replace />;
    }
  }

  return (
    <>
      <Routes>
        {/* Rutas del Landing */}
        <Route path="/*" element={<LandingRoutes />} />

        {/* Rutas de Autenticación */}
        <Route path="/auth/*" element={<AuthRouter />} />

        {/* Rutas de Admin protegidas */}
        <Route
          path="/admin/*"
          element={
            <PrivateRoute allowedRoles={["Administrador"]}>
              <AdminRoutes />
            </PrivateRoute>
          }
        />

        {/* Rutas de Cliente protegidas */}
        <Route
          path="/cliente/*"
          element={
            <PrivateRoute allowedRoles={["Cliente"]}>
              <ClientRoutes />
            </PrivateRoute>
          }
        />

        {/* Redireccion a rutas no existentes */}
        <Route path="/not-found" element={<NotFoundView />} />
        <Route path="*" element={<Navigate to="/not-found" replace />} />
      </Routes>

      {/*  Modal incrustado aquí mismo */}
      <Modal open={showModal} disableEscapeKeyDown>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            bgcolor: 'background.paper',
            p: 4,
            borderRadius: 3,
            textAlign: 'center',
            boxShadow: 24,
            minWidth: 340,
            maxWidth: 420,
            mx: 2,
          }}
        >
          <Typography
            variant="h6"
            gutterBottom
            sx={{
              color: 'primary.main',
              fontWeight: 700,
              mb: 1.5,
            }}
          >
            Tu sesión ha expirado
          </Typography>
          <Typography
            variant="body1"
            gutterBottom
            sx={{ color: 'text.secondary', mb: 2 }}
          >
            Serás redirigido en <b>{modalCountdown}</b> segundos...
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={forceLogout}
            sx={{
              borderRadius: 2,
              px: 4,
              fontWeight: 600,
              boxShadow: 2,
              textTransform: 'none',
            }}
          >
            Cerrar sesión ahora
          </Button>
        </Box>
      </Modal>
    </>
  );
};
