import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  maintenances: [],
  selected: null,
  total: 0,
  currentPage: 0,
  rowsPerPage: 5,
  loading: false,
};

export const maintenanceSlice = createSlice({
  name: "maintenance",
  initialState,
  reducers: {
    refreshMaintenance: (state, action) => {
      const { items, total, page } = action.payload;
      state.maintenances = items;
      state.total = total;
      state.currentPage = page;
      state.loading = false;
    },
    selectedMaintenance: (state, action) => {
      state.selected = action.payload;
    },
    setLoadingMaintenance: (state, action) => {
      state.loading = action.payload;
    },
    setPageMaintenance: (state, action) => {
      state.currentPage = action.payload;
    },
    setRowsPerPageMaintenance: (state, action) => {
      state.rowsPerPage = action.payload;
    },
  },
});

export const {
  refreshMaintenance,
  selectedMaintenance,
  setLoadingMaintenance,
  setPageMaintenance,
  setRowsPerPageMaintenance,
} = maintenanceSlice.actions;
