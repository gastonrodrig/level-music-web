import { 
  createUserWithEmailAndPassword, 
  GoogleAuthProvider, 
  FacebookAuthProvider,
  signInWithEmailAndPassword, 
  signInWithPopup, 
  updateProfile 
} from 'firebase/auth';
import { FirebaseAuth } from './config';

const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(FirebaseAuth, googleProvider);
    console.log(result);
    const { displayName, email, photoURL, uid } = result.user;

    return {
      ok: true,
      displayName, email, photoURL, uid
    };
  } catch (error) {
    console.log(error);
    return {
      ok: false,
      errorCode: error.code,
      errorMessage: error.message
    };
  }
};

export const signInWithFacebook = async () => {
  try {
    const result = await signInWithPopup(FirebaseAuth, facebookProvider);
    console.log(result);
    const { displayName, email, photoURL, uid } = result.user;

    return {
      ok: true,
      displayName, email, photoURL, uid
    };
  } catch (error) {
    console.log(error);
    return {
      ok: false,
      errorCode: error.code,
      errorMessage: error.message
    };
  }
};

export const registerUserWithEmailPassword = async ({email, password, displayName}) => {
  try {
    const resp = await createUserWithEmailAndPassword(FirebaseAuth, email, password);
    const { uid, photoURL } = resp.user;

    await updateProfile(FirebaseAuth.currentUser, { displayName });

    return {
      ok: true,
      uid, photoURL, email, displayName 
    }

  } catch (error) {
    console.log(error);
    const errorMessage = error.message;

    return {
      ok: false,
      errorMessage
    }
  }
}

export const loginWithEmailPassword = async ({ email, password }) => {
  try {
    const resp = await signInWithEmailAndPassword(FirebaseAuth, email, password);
    const { displayName, photoURL, uid } = resp.user;

    return {
      ok: true,
      uid, photoURL, email, displayName 
    }
  } catch (error) {
    console.log(error);
    const errorMessage = error.message;

    return {
      ok: false,
      errorMessage
    }
  }
}

export const logoutFirebase = async () => {
  return await FirebaseAuth.signOut();
}