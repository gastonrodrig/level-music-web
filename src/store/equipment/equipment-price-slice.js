import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  equipmentPrices: [],
  selected: null,
  total: 0,
  currentPage: 0,
  rowsPerPage: 5,
  loading: false,
};

export const equipmentPricesSlice = createSlice({
  name: 'equipmentPrices',
  initialState,
  reducers: {
    refreshEquipmentPrices: (state, action) => {
      const { items, total } = action.payload;
      state.equipmentPrices = items;
      state.total = total;
      state.loading = false;
    },
    selectedEquipmentPrice: (state, action) => {
      state.selected = action.payload;
    },
    setLoadingEquipmentPrice: (state, action) => {
      state.loading = action.payload;
    },
    setPageEquipmentPrice: (state, action) => {
      state.currentPage = action.payload;
    },
    setRowsPerPageEquipmentPrice: (state, action) => {
      state.rowsPerPage = action.payload;
    },
  },
});

export const {
  refreshEquipmentPrices,
  selectedEquipmentPrice,
  setLoadingEquipmentPrice,
  setPageEquipmentPrice,
  setRowsPerPageEquipmentPrice,
} = equipmentPricesSlice.actions;
