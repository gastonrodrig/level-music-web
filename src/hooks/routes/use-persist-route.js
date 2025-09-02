import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export const usePersistRoute = () => {
  const location = useLocation();

  useEffect(() => {
    // Guardar la última ruta válida, incluyendo /auth/first-login-password
    if (!location.pathname.startsWith('/auth') || location.pathname.startsWith('/auth/first-login-password')) {
      sessionStorage.setItem('lastRoute', location.pathname);
    }
  }, [location.pathname]);
};