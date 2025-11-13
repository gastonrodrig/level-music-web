import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  workerPrices: [],
  total: 0,
  currentPage: 0,
  rowsPerPage: 5,
  loading: false,
};

export const workerPricesSlice = createSlice({
  name: 'workerPrices',
  initialState,
  reducers: {
    refreshWorkerPrices: (state, action) => {
      const { items, total } = action.payload;
      state.workerPrices = items;
      state.total = total;
      state.loading = false;
    },
    setLoadingWorkerPrice: (state, action) => {
      state.loading = action.payload;
    },
    setPageWorkerPrice: (state, action) => {
      // coerce to a safe numeric page index (defensive: avoid non-serializable values)
      const p = Number(action.payload);
      state.currentPage = Number.isFinite(p) && p >= 0 ? p : state.currentPage;
    },
    setRowsPerPageWorkerPrice: (state, action) => {
      // coerce to a safe numeric rows-per-page value
      const r = Number(action.payload);
      state.rowsPerPage = Number.isFinite(r) && r > 0 ? r : state.rowsPerPage;
    },
  },
});

export const {
  refreshWorkerPrices,
  setLoadingWorkerPrice,
  setPageWorkerPrice,
  setRowsPerPageWorkerPrice,
} = workerPricesSlice.actions;