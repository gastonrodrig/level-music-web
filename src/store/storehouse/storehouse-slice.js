import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  storehouseMovements: [],
  total: 0,
  currentPage: 0,
  rowsPerPage: 5,
  loading: false,
};

export const storehouseMovementSlice = createSlice({
  name: "storehouseMovement",
  initialState,
  reducers: {
    refreshStorehouseMovement: (state, action) => {
      const { items, total, page } = action.payload;
      state.storehouseMovements = items;
      state.total = total;
      state.currentPage = page;
      state.loading = false;
    },
    setLoadingStorehouseMovement: (state, action) => {
      state.loading = action.payload;
    },
    setPageStorehouseMovement: (state, action) => {
      state.currentPage = action.payload;
    },
    setRowsPerPageStorehouseMovement: (state, action) => {
      state.rowsPerPage = action.payload;
    }
  },
});

export const {  
  refreshStorehouseMovement,
  setLoadingStorehouseMovement,
  setPageStorehouseMovement,
  setRowsPerPageStorehouseMovement,
} = storehouseMovementSlice.actions;