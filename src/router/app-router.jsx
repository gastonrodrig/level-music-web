import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { AuthRouter } from '../modules/auth/routes/auth-router';
import { ClientRoutes } from '../modules/client/routes/client-routes';
import { LandingRoutes } from '../modules/landing/routes/landing-routes'; 
import { AdminRoutes } from '../modules/admin/routes/admin-router';
import { StorekeeperRoutes } from '../modules/storekeeper/routes/storekeeper-routes'; // 👈 nuevo import
import { useCheckAuth, usePersistRoute } from '../hooks';
import { CircProgress } from '../shared/ui/components';
import { NotFoundView } from '../shared/ui/layout/not-found';
import { PrivateRoute } from './private-routes'; 

export const AppRouter = () => {
  const location = useLocation();
  const { status } = useCheckAuth();
  const { role } = useSelector((state) => state.auth);

  usePersistRoute();

  const lastRoute = sessionStorage.getItem('lastRoute') || '/';

  if (status === 'checking') {
    return <CircProgress />;
  }

  if (status === 'authenticated') {
    // 👇 Detectar el dashboard según el rol
    const dashboardPath =
      role === 'Administrador'
        ? '/admin'
        : role === 'Cliente'
          ? '/client'
          : role === 'Almacenero'
            ? '/storekeeper'
            : '/';

    // Redirigir desde rutas de autenticación
    if (location.pathname.startsWith('/auth')) {
      return (
        <Navigate
          to={lastRoute.startsWith(dashboardPath) ? lastRoute : dashboardPath}
          replace
        />
      );
    }

    // Redirigir desde la raíz
    if (location.pathname === '/') {
      return <Navigate to={dashboardPath} replace />;
    }
  }

  if (status === 'first-login-password') {
    if (!location.pathname.startsWith('/auth/first-login-password')) {
      return <Navigate to="/auth/first-login-password" replace />;
    }
    if (location.pathname === '/auth' || location.pathname === '/auth/') {
      return <Navigate to="/auth/first-login-password" replace />;
    }
  }

  return (
    <Routes>
      {/* Rutas del Landing */}
      <Route path="/*" element={<LandingRoutes />} />

      {/* Rutas de Autenticación */}
      <Route path="/auth/*" element={<AuthRouter />} />

      {/* Rutas de Admin protegidas */}
      <Route
        path="/admin/*"
        element={
          <PrivateRoute allowedRoles={['Administrador']}>
            <AdminRoutes />
          </PrivateRoute>
        }
      />

      {/* Rutas de Cliente protegidas */}
      <Route
        path="/client/*"
        element={
          <PrivateRoute allowedRoles={['Cliente']}>
            <ClientRoutes />
          </PrivateRoute>
        }
      />

      {/* Rutas de Almacenero protegidas */}
      <Route
        path="/storekeeper/*"
        element={
          <PrivateRoute allowedRoles={['Almacenero']}>
            <StorekeeperRoutes />
          </PrivateRoute>
        }
      />

      {/* Redirección a rutas no existentes */}
      <Route path="/not-found" element={<NotFoundView />} />
      <Route path="*" element={<Navigate to="/not-found" replace />} />
    </Routes>
  );
};
