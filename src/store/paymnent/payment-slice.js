import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  payments: [],
  selected: null,
  total: 0,
  currentPage: 0,
  rowsPerPage: 5,
  loading: false,
};

export const paymentSlice = createSlice({
  name: "payment",
  initialState,
  reducers: {
    refreshPayment: (state, action) => {
      const { items, total, page } = action.payload;
      state.payments = items;
      state.total = total;
      state.currentPage = page;
      state.loading = false;
    },
    selectedPayment: (state, action) => {
      state.selected = action.payload;
    },
    setLoadingPayment: (state, action) => {
      state.loading = action.payload;
    },
    setPagePayment: (state, action) => {
      state.currentPage = action.payload;
    },
    setRowsPerPagePayment: (state, action) => {
      state.rowsPerPage = action.payload;
    }
  },
});

export const {
  refreshPayment,
  selectedPayment,
  setLoadingPayment,
  setPagePayment,
  setRowsPerPagePayment
} = paymentSlice.actions;
