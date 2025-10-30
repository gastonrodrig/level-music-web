import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  workers: [],
  selected: null,
  total: 0,
  currentPage: 0,
  rowsPerPage: 5,
  loading: false,
};

export const workersSlice = createSlice({
  name: 'workers',
  initialState,
  reducers: {
    refreshWorkers: (state, action) => {
      const { items, total, page } = action.payload;
      state.workers = items;
      state.total = total;
      state.currentPage = page;
      state.loading = false;
    },
    selectedWorker: (state, action) => {
      state.selected = action.payload;
    },
    setLoadingWorker: (state, action) => {
      state.loading = action.payload;
    },
    setPageWorker: (state, action) => {
      state.currentPage = action.payload;
    },
    setRowsPerPageWorker: (state, action) => {
      state.rowsPerPage = action.payload;
    },
    listAllWorkers: (state, action) => {
      state.workers = action.payload;
    }
  },
});

export const {
  refreshWorkers,
  selectedWorker,
  setLoadingWorker,
  setPageWorker,
  setRowsPerPageWorker,
  listAllWorkers
} = workersSlice.actions;