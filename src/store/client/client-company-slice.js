import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  clientsCompany: [],
  selected: null,
  total: 0,
  currentPage: 0,
  rowsPerPage: 5,
  loading: false,
};

export const clientCompanySlice = createSlice({
  name: 'clientCompany',
  initialState,
  reducers: {
    refreshClientsCompany: (state, action) => {
      const { items, total, page } = action.payload;
      state.clientsCompany = items;
      state.total = total;
      state.currentPage = page;
      state.loading = false;
    },
    selectedClientCompany: (state, action) => {
      state.selected = action.payload;
    },
    setLoadingClientCompany: (state, action) => {
      state.loading = action.payload;
    },
    setPageClientCompany: (state, action) => {
      state.currentPage = action.payload;
    },
    setRowsPerPageClientCompany: (state, action) => {
      state.rowsPerPage = action.payload;
    },
  },
});

export const {
  refreshClientsCompany,
  selectedClientCompany,
  setLoadingClientCompany,
  setPageClientCompany,
  setRowsPerPageClientCompany,
} = clientCompanySlice.actions;