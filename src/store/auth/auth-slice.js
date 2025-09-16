import { createSlice } from '@reduxjs/toolkit';
import { set } from 'react-hook-form';

export const authSlice = createSlice({
  name: 'auth',
  initialState: {
    status: 'not-authenticated',  // 'authenticated' | 'not-authenticated' | 
                                  // 'checking' | 'first-login-password' | 
                                  // 'sending-reset-email' | 'reset-email-sent' | 
                                  // 'changing-password'
    _id: null, 
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

      state._id = payload._id;
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
      state._id = null;
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
    setClientData: (state, { payload }) => {
      state.firstName = payload.firstName;
      state.lastName = payload.lastName;
      state.phone = payload.phone;
      state.documentType = payload.documentType;
      state.documentNumber = payload.documentNumber;
      state.needsPasswordChange = false;
      state.isExtraDataCompleted = true;
    },
    setClientProfile: (state, { payload }) => {
      state.photoURL = payload.photoURL;
    },
    removeClientProfile: (state) => {
      state.photoURL = null;
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
  setClientData,
  setClientProfile,
  removeClientProfile
} = authSlice.actions;