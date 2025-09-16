import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  quotations: [],
  selected: null,
  total: 0,
  currentPage: 0,
  rowsPerPage: 5,
  loading: false,
};

export const quotationSlice = createSlice({
  name: 'quotation',
  initialState,
  reducers: {
    refreshQuotations: (state, action) => {
      const { items, total, page } = action.payload;
      state.quotations = items; 
      state.total = total;
      state.currentPage = page;
      state.loading = false; 
    },
    selectedQuotation: (state, action) => {
      state.selected = action.payload;
    },
    setLoadingQuotation: (state, action) => {
      state.loading = action.payload;
    },
    setPageQuotation: (state, action) => {
      state.currentPage = action.payload;
    },
    setRowsPerPageQuotation: (state, action) => {
      state.rowsPerPage = action.payload;
    }
  },
});

export const {
  refreshQuotations,
  selectedQuotation,
  setLoadingQuotation,
  setPageQuotation,
  setRowsPerPageQuotation,
} = quotationSlice.actions;