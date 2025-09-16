import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthRouter } from '../modules/auth/routes/auth-router';
import { ClientRoutes } from '../modules/client/routes/client-routes';
import { LandingRoutes } from '../modules/landing/routes/landing-routes'; 
import { AdminRoutes } from '../modules/admin/routes/admin-router';
import { useSelector } from 'react-redux';
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
    const dashboardPath = role === 'Administrador' ? '/admin' : '/cliente';

    // Redirigir desde rutas de autenticación
    if (location.pathname.startsWith('/auth')) {
      return <Navigate to={lastRoute.startsWith(dashboardPath) ? lastRoute : dashboardPath} replace />;
    }

    // Redirigir desde la raíz
    if (location.pathname === '/') {
      return <Navigate to={dashboardPath} replace />;
    }
  }

  if (status === 'first-login-password') {
    // Si no está en /auth/first-login-password exactamente, redirige siempre a esa ruta
    if (!location.pathname.startsWith('/auth/first-login-password')) {
      return <Navigate to="/auth/first-login-password" replace />;
    }
    // Si está en /auth o cualquier subruta de /auth que no sea /auth/first-login-password, también redirige
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
        path="/cliente/*"
        element={
          <PrivateRoute allowedRoles={['Cliente']}>
            <ClientRoutes />
          </PrivateRoute>
        }
      />

      {/* Redireccion a rutas no existentes */}
      <Route path="/not-found" element={<NotFoundView />} />

      <Route path="*" element={<Navigate to="/not-found" replace />} />
    </Routes>
  );
};