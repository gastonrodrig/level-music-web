import { createSlice } from '@reduxjs/toolkit';
import { set } from 'react-hook-form';

export const authSlice = createSlice({
  name: 'auth',
  initialState: {
    status: 'not-authenticated',  // 'authenticated' | 'not-authenticated' | 
                                  // 'checking' | 'first-login-password' | 
                                  // 'sending-reset-email' | 'reset-email-sent' | 
                                  // 'changing-password'
    uid: null, 
    email: null,
    firstName: null,
    lastName: null,
    phone: null,
    documentType: null,
    documentNumber: null,
    role: null,
    needsPasswordChange: null, 
    userStatus: null, // Activo, Inactivo
    photoURL: null, 
    token: null,
    isExtraDataCompleted: false,
  },
  reducers: {
    login: (state, { payload }) => {
      if (payload.userStatus === "Inactivo") {
        state.status = "not-authenticated";
        return;
      }

      state.uid = payload.uid; 
      state.email = payload.email;
      state.firstName = payload.firstName ?? null; 
      state.lastName = payload.lastName ?? null; 
      state.phone = payload.phone ?? null;
      state.documentType = payload.documentType ?? null;
      state.documentNumber = payload.documentNumber ?? null;
      state.role = payload.role;
      state.needsPasswordChange = payload.needsPasswordChange ?? null; 
      state.userStatus = payload.userStatus;
      state.photoURL = payload.photoURL; 
      state.token = payload.token;
      state.status = payload.needsPasswordChange ? "first-login-password" : "authenticated";
      state.isExtraDataCompleted = payload.isExtraDataCompleted;
    },
    logout: (state) => {
      state.status = 'not-authenticated';
      state.uid = null;
      state.email = null;
      state.firstName = null;
      state.lastName = null;
      state.phone = null;
      state.documentType = null;
      state.documentNumber = null;
      state.role = null;
      state.needsPasswordChange = null;
      state.userStatus = null;
      state.photoURL = null;
      state.token = null;
      state.isExtraDataCompleted = false;
    },
    checkingCredentials: (state) => {
      state.status = 'checking';
    },
    authenticated: (state) => {
      state.status = 'authenticated';
      state.needsPasswordChange = false;
    },
    sendingResetEmail: (state) => {
      state.status = 'sending-reset-email';
    },
    resetEmailSent: (state) => {
      state.status = 'reset-email-sent';
    },
    changingPassword: (state) => {
      state.status = 'changing-password';
    },
    setExtraData: (state, { payload }) => {
      state.firstName = payload.firstName;
      state.lastName = payload.lastName;
      state.phone = payload.phone;
      state.documentType = payload.documentType;
      state.documentNumber = payload.documentNumber;
      state.needsPasswordChange = false;
      state.isExtraDataCompleted = true;
    }
  }
});

export const { 
  login, 
  logout, 
  checkingCredentials, 
  authenticated,
  sendingResetEmail,
  resetEmailSent,
  changingPassword,
  setExtraData
} = authSlice.actions;