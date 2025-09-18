import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  services: [],
  selected: null,
  total: 0,
  currentPage: 0,
  rowsPerPage: 5,
  loading: false,
};

export const serviceSlice = createSlice({
  name: "service",
  initialState,
  reducers: {
    refreshService: (state, action) => {
      const { items, total, page } = action.payload;
      state.services = items;
      state.total = total;
      state.currentPage = page;
      state.loading = false;
    },
    selectedService: (state, action) => {
      state.selected = action.payload;
    },
    setLoadingService: (state, action) => {
      state.loading = action.payload;
    },
    setPageService: (state, action) => {
      state.currentPage = action.payload;
    },
    setRowsPerPageService: (state, action) => {
      state.rowsPerPage = action.payload;
    },
    listAllServices: (state, action) => {
      state.services = action.payload;
    }
  },
});
export const {  
  refreshService,
  selectedService,
  setLoadingService,
  setPageService,
  setRowsPerPageService,
  listAllServices
} = serviceSlice.actions;