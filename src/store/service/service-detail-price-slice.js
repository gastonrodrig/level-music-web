import { createSlice } from '@reduxjs/toolkit';
import { serviceDetailPriceApi } from '../../api/service';

const initialState = {
  serviceDetailPrices: [],
  total: 0,
  currentPage: 0,
  rowsPerPage: 5,
  loading: false,
};

export const serviceDetailPriceSlice = createSlice({
  name: 'serviceDetailPrice',
  initialState,
  reducers: {
    refreshServiceDetailPrices: (state, action) => {
      const { items, total } = action.payload;
      state.serviceDetailPrices = items;
      state.total = total;
      state.loading = false;
    },
    setLoadingServiceDetailPrice: (state, action) => {
      state.loading = action.payload;
    },
    setPageServiceDetailPrice: (state, action) => {
      state.currentPage = action.payload;
    },
    setRowsPerPageServiceDetailPrice: (state, action) => {
      state.rowsPerPage = action.payload;
    }
  },
});

export const { 
  refreshServiceDetailPrices,
  setLoadingServiceDetailPrice, 
  setPageServiceDetailPrice, 
  setRowsPerPageServiceDetailPrice 
} = serviceDetailPriceSlice.actions;