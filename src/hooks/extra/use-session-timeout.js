import { useState, useEffect, useCallback } from "react";
import { getAuth, signOut } from "firebase/auth";
import { useAuthStore } from "../auth";

export const useSessionTimeout = () => {
  const auth = getAuth();
  const { onLogout } = useAuthStore();
  const [timeLeft, setTimeLeft] = useState(null);
  const [expired, setExpired] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalCountdown, setModalCountdown] = useState(2); 

  const forceLogout = useCallback(async () => {
    try {
      await signOut(auth);
      onLogout();
    } catch (err) {
      console.error("Error al cerrar sesión", err);
    } finally {
      setShowModal(false);
    }
  }, [auth, onLogout]);

  //  Token de Firebase
  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    let timer;
    user.getIdTokenResult().then((tokenResult) => {
      const expTime = new Date(tokenResult.expirationTime).getTime();
      const remaining = expTime - Date.now();
      setTimeLeft(remaining);

      timer = setTimeout(() => {
        setExpired(true);
        setShowModal(true);
        setModalCountdown(2);
      }, remaining);
    });

    return () => clearTimeout(timer);
  }, [auth]);

  // Manejo del contador solo para mostrar el tiempo restante en el modal
  useEffect(() => {
    if (!showModal) return;

    if (modalCountdown === 0) {
      return;
    }

    const countdownTimer = setTimeout(() => {
      setModalCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(countdownTimer);
  }, [showModal, modalCountdown]);

  return { 
    expired, 
    timeLeft, 
    showModal, 
    modalCountdown, 
    forceLogout 
  };
};
