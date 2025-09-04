import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  workerTypes: [],
  selected: null,
  total: 0,
  currentPage: 0,
  rowsPerPage: 5,
  loading: false,
};

export const workerTypesSlice = createSlice({
  name: 'workerTypes',
  initialState,
  reducers: {
    refreshWorkerTypes: (state, action) => {
      const { items, total, page } = action.payload;
      state.workerTypes = items; 
      state.total = total;
      state.currentPage = page;
      state.loading = false; 
    },
    selectedWorkerType: (state, action) => {
      state.selected = action.payload;
    },
    setLoadingWorkerType: (state, action) => {
      state.loading = action.payload;
    },
    setPageWorkerType: (state, action) => {
      state.currentPage = action.payload;
    },
    setRowsPerPageWorkerType: (state, action) => {
      state.rowsPerPage = action.payload;
    },
    listAllWorkerTypes: (state, action) => {
      state.workerTypes = action.payload;
    },
  },
});

export const {
  refreshWorkerTypes,
  selectedWorkerType,
  setLoadingWorkerType,
  setPageWorkerType,
  setRowsPerPageWorkerType,
  listAllWorkerTypes,
} = workerTypesSlice.actions;