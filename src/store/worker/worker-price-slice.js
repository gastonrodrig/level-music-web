import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  workerPrices: [],
  selected: null,
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
    selectedWorkerPrice: (state, action) => {
      state.selected = action.payload;
    },
    setLoadingWorkerPrice: (state, action) => {
      state.loading = action.payload;
    },
    setPageWorkerPrice: (state, action) => {
      state.currentPage = action.payload;
    },
    setRowsPerPageWorkerPrice: (state, action) => {
      state.rowsPerPage = action.payload;
    },
  },
});

export const {
  refreshWorkerPrices,
  selectedWorkerPrice,
  setLoadingWorkerPrice,
  setPageWorkerPrice,
  setRowsPerPageWorkerPrice,
} = workerPricesSlice.actions;