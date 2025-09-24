import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  provider: [],
  selected: null,
  total: 0,
  currentPage: 0,
  rowsPerPage: 5,
  loading: false,
};
export const providerSlice = createSlice({
  name: "provider",
  initialState,
  reducers: {
    refreshProvider: (state, action) => {
      const { items, total, page } = action.payload;
      state.provider = items;
      state.total = total;
      state.currentPage = page;
      state.loading = false;
    },
    selectedProvider: (state, action) => {
      state.selected = action.payload;
    },
    setLoadingProvider: (state, action) => {
      state.loading = action.payload;
    },
    setPageProvider: (state, action) => {
      state.currentPage = action.payload;
    },
    setRowsPerPageProvider: (state, action) => {
      state.rowsPerPage = action.payload;
    },
    listAllProviders: (state, action) => {
      state.provider = action.payload;
    },
  },
});
export const {
  refreshProvider,
  selectedProvider,
  setLoadingProvider,
  setPageProvider,
  setRowsPerPageProvider,
  listAllProviders,
} = providerSlice.actions;