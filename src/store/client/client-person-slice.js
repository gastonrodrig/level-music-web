import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  clientsPerson: [],
  selected: null,
  total: 0,
  currentPage: 0,
  rowsPerPage: 5,
  loading: false,
};

export const clientPersonSlice = createSlice({
  name: 'clientPerson',
  initialState,
  reducers: {
    refreshClientsPerson: (state, action) => {
      const { items, total, page } = action.payload;
      state.clientsPerson = items;
      state.total = total;
      state.currentPage = page;
      state.loading = false;
    },
    selectedClientPerson: (state, action) => {
      state.selected = action.payload;
    },
    setLoadingClientPerson: (state, action) => {
      state.loading = action.payload;
    },
    setPageClientPerson: (state, action) => {
      state.currentPage = action.payload;
    },
    setRowsPerPageClientPerson: (state, action) => {
      state.rowsPerPage = action.payload;
    },
  },
});

export const {
  refreshClientsPerson,
  selectedClientPerson,
  setLoadingClientPerson,
  setPageClientPerson,
  setRowsPerPageClientPerson,
} = clientPersonSlice.actions;