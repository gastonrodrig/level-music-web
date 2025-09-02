import { useDispatch, useSelector } from 'react-redux';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  updatePassword,
  getAuth,
  verifyPasswordResetCode,
  confirmPasswordReset,
} from 'firebase/auth';
import { FirebaseAuth } from '../../modules/auth/firebase/config';
import { 
  checkingCredentials, 
  login, 
  logout,
  showSnackbar,
  authenticated,
  sendingResetEmail,
  resetEmailSent,
  changingPassword
} from '../../store';
import { useUsersStore } from '../../hooks';
import { userApi } from '../../api';
import { createRequestPasswordResetModel } from '../../shared/models'

const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: "select_account" });
googleProvider.addScope("email");

export const useAuthStore = () => {
  const dispatch = useDispatch();
  const { 
    status, 
    uid, 
    email, 
    displayName, 
    photoURL, 
    role,
    extra_data,
  } = useSelector((state) => state.auth);

  const { startCreateUser, findUserByEmail } = useUsersStore();

  const openSnackbar = (message) => dispatch(showSnackbar({ message }));

  const onGoogleSignIn = async () => {
    try {
      dispatch(checkingCredentials());
      const { user } = await signInWithPopup(FirebaseAuth, googleProvider);
      const { data, ok } = await findUserByEmail(user.providerData[0].email); 
      
      if (!ok) {
        const { data: newUser } = await startCreateUser(user, "google");
        dispatch(login({
          uid: newUser.auth_id,
          email: newUser.email,
          firstName: null,
          lastName: null,
          phone: null,
          documentType: null,
          documentNumber: null,
          role: newUser.role,
          userStatus: newUser.status, // Activo, Inactivo
          photoURL: newUser.profile_picture,
          token: user.accessToken,
          isExtraDataCompleted: newUser.is_extra_data_completed,
        }));
        return true;
      } else {
        if (data.status === "Inactivo") {
          dispatch(logout());
          return false;
        } 
        const needsPassword = !!data.needs_password_change;
        dispatch(login({
          uid: data.auth_id,
          email: data.email,
          firstName: data.first_name,
          lastName: data.last_name,
          phone: data.phone,
          documentType: data.document_type,
          documentNumber: data.document_number,
          role: data.role,
          needsPasswordChange: needsPassword,
          userStatus: data.status,
          photoURL: data.profile_picture,
          token: user.accessToken,
          isExtraDataCompleted: data.is_extra_data_completed
        }));
        return !needsPassword;
      }
    } catch (error) {
      console.log(error);
      dispatch(logout());
      if (error.code === "auth/error-code:-47") {
        openSnackbar("Este correo ya está registrado con otro método de autenticación.");
      } else {
        openSnackbar("Error al iniciar sesión.");
      }
      return false;
    }
  };

  const startLogin = async ({ email, password }) => {
    try {
      dispatch(checkingCredentials());
      const { user } = await signInWithEmailAndPassword(FirebaseAuth, email, password);
      const { data } = await findUserByEmail(user.providerData[0].email); 

      if (data.status === "Inactivo") {
        dispatch(logout());
        return false;
      }
      
      const needsPassword = !!data.needs_password_change;
      dispatch(login({
        uid: data.auth_id,
        email: data.email,
        firstName: data.first_name,
        lastName: data.last_name,
        phone: data.phone,
        documentType: data.document_type,
        documentNumber: data.document_number,
        role: data.role,
        needsPasswordChange: needsPassword,
        userStatus: data.status,
        photoURL: data.profile_picture,
        token: user.accessToken,
        isExtraDataCompleted: data.is_extra_data_completed
      }));
      return !needsPassword;
    } catch (error) {
      dispatch(logout());
      if (error.code === "auth/invalid-credential") {
        openSnackbar("Credenciales incorrectas.");
      } else {
        openSnackbar("Error al iniciar sesión.");
      }
      return false;
    }
  };

  const startRegisterUser = async ({ email, password }) => {
    try {
      dispatch(checkingCredentials());
      const { ok } = await findUserByEmail(email); 

      if (ok) {
        dispatch(logout());
        openSnackbar("Este correo ya está registrado.");
        return false;
      } else {
        const { user } = await createUserWithEmailAndPassword(FirebaseAuth, email, password);
        const { data: newUser } = await startCreateUser(user, "email/password");
        dispatch(login({ 
          uid: newUser.auth_id, 
          email: newUser.email, 
          displayName: null, 
          phone: null,
          documentType: null,
          documentNumber: null,
          role: newUser.role,
          userStatus: newUser.status, // Activo, Inactivo
          photoURL: null,
          token: user.accessToken,
          isExtraDataCompleted: newUser.is_extra_data_completed
        }));
        return true;
      }
    } catch (error) {
      dispatch(logout());
      if (error.code === "auth/email-already-in-use") {
        openSnackbar("Este correo ya está en uso.");
      } else {
        openSnackbar("Error al crear usuario.");
      }
      return false;
    }
  };

  const onLogout = async () => {
    await signOut(FirebaseAuth);
    dispatch(logout());
  };

  const startChangePasswordFirstLogin = async ({ password, confirmPassword }) => {
    if (password !== confirmPassword) {
      openSnackbar("Las contraseñas no coinciden.");
      return false;
    }

    try {
      const user = FirebaseAuth.currentUser;
      await updatePassword(user, password);
      await userApi.patch(`/reset-password-flag/${uid}`);
      dispatch(authenticated());
      openSnackbar("Contraseña actualizada exitosamente.");
      return true;
    } catch (error) {
      if (error.code === "auth/requires-recent-login") {
        openSnackbar("Por seguridad, vuelve a iniciar sesión para cambiar tu contraseña.");
      } else {
        openSnackbar("Error al cambiar la contraseña.");
      }
      return false;
    }
  }

  const startPasswordReset = async (data) => {
    try {
      dispatch(sendingResetEmail());
      const payload = createRequestPasswordResetModel(data);
      await userApi.post('/forgot-password', payload);
      openSnackbar("Se envió un enlace para restablecer tu contraseña a tu correo.");
      return true;
    } catch (error) {
      console.log(error)
      const message = error.response?.data?.message;
      openSnackbar(message ?? "Ocurrió un error al restablecer la contraseña.");
      return false;
    } finally {
      dispatch(resetEmailSent());
    }
  };

  const startChangePasswordForgot = async ({ password, confirmPassword }) => {
    if (password !== confirmPassword) {
      openSnackbar("Las contraseñas no coinciden.");
      return false;
    }

    try {
      dispatch(changingPassword());
      const params = new URLSearchParams(window.location.search);
      const code = params.get("oobCode");
      if (!code) {
        openSnackbar("El enlace de recuperación no es válido.");
        return false;
      }

      const auth = getAuth();

      const email = await verifyPasswordResetCode(auth, code);

      await confirmPasswordReset(auth, code, password);

      await signInWithEmailAndPassword(auth, email, password);

      await startLogin({ email, password });
      
      openSnackbar(`La contraseña de ${email} se ha restablecido exitosamente.`);
      return true;
    } catch (error) {
      if (error.code === "auth/invalid-action-code") {
        openSnackbar("El enlace de restablecimiento es inválido o ha expirado.");
      } else if (error.code === "auth/requires-recent-login") {
        openSnackbar("Por seguridad, vuelve a iniciar sesión para cambiar tu contraseña.");
      } else {
        openSnackbar("Error al cambiar la contraseña.");
      }
      dispatch(logout());
      return false;
    }
  };

  return { 
    // state
    status, 
    uid, 
    email, 
    displayName, 
    photoURL, 
    role,
    extra_data,
    // actions
    onGoogleSignIn, 
    startLogin, 
    startRegisterUser,
    onLogout,
    startChangePasswordFirstLogin,
    startPasswordReset,
    startChangePasswordForgot
  };
};
