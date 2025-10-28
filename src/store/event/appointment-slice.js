import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  appointments: [],
  selected: null,
  total: 0,
  currentPage: 0,
  rowsPerPage: 5,
  loading: false,
};

export const appointmentsSlice = createSlice({
  name: 'appointment',
  initialState,
  reducers: {
    refreshAppointments: (state, action) => {
      const { items, total, page } = action.payload;
      state.appointments = items;
      state.total = total;
      state.currentPage = page;
      state.loading = false; 
    },
    selectedAppointment: (state, action) => {
      state.selected = action.payload;
    },
    setLoadingAppointment: (state, action) => {
      state.loading = action.payload;
    },
    setPageAppointment: (state, action) => {
      state.currentPage = action.payload;
    },
    setRowsPerPageAppointment: (state, action) => {
      state.rowsPerPage = action.payload;
    }
  },
});

export const {
  refreshAppointments,
  selectedAppointment,
  setLoadingAppointment,
  setPageAppointment,
  setRowsPerPageAppointment,
} = appointmentsSlice.actions;