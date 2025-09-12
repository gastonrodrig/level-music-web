import { useState, useEffect, useCallback } from "react";
import { getAuth, signOut } from "firebase/auth";
import { useAuthStore } from "../auth/use-auth-store";

export const useSessionTimeout = () => {
  const auth = getAuth();
  const { onLogout } = useAuthStore();
  const [timeLeft, setTimeLeft] = useState(null);
  const [expired, setExpired] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalCountdown, setModalCountdown] = useState(2); // 2 segundos

  // logout seguro
  const forceLogout = useCallback(async () => {
//  const showModal = true;
// const modalCountdown = 5;
// const forceLogout = () => alert('Cerrar sesión (demo)');
    try {
      await signOut(auth);
      onLogout();
    } catch (err) {
      console.error("Error al cerrar sesión", err);
    } finally {
      setShowModal(false);
    }
  }, [auth, onLogout]);

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
        setModalCountdown(2); // reinicia a 2 seg
      }, remaining);
    });

    return () => clearTimeout(timer);
  }, [auth]);

  // Manejo del contador del modal
  useEffect(() => {
    if (!showModal) return;

    if (modalCountdown === 0) {
      forceLogout();
      return;
    }

    const countdownTimer = setTimeout(() => {
      setModalCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(countdownTimer);
  }, [showModal, modalCountdown, forceLogout]);

  return { expired, timeLeft, showModal, modalCountdown, forceLogout };
};
