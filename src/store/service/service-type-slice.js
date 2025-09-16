import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  serviceTypes: [],
  selected: null,
  total: 0,
  currentPage: 0,
  rowsPerPage: 5,
  loading: false,
};

export const serviceTypeSlice = createSlice({
  name: "serviceType",
  initialState,
  reducers: {
    refreshServiceType: (state, action) => {
      const { items, total, page } = action.payload;
      state.serviceTypes = items;
      state.total = total;
      state.currentPage = page;
      state.loading = false;
    },
    selectedServiceType: (state, action) => {
      state.selected = action.payload;
    },
    setLoadingServiceType: (state, action) => {
      state.loading = action.payload;
    },
    setPageServiceType: (state, action) => {
      state.currentPage = action.payload;
    },
    setRowsPerPageServiceType: (state, action) => {
      state.rowsPerPage = action.payload;
    },
    listAllServiceTypes: (state, action) => {
      state.serviceTypes = action.payload;
    }
  },
});

export const {  
  refreshServiceType,
  selectedServiceType,
  setLoadingServiceType,
  setPageServiceType,
  setRowsPerPageServiceType,
  listAllServiceTypes,
} = serviceTypeSlice.actions;