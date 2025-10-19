import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  eventTasks: [],
  selected: null,
  total: 0,
  currentPage: 0,
  rowsPerPage: 5,
  loading: false,
};
export const eventTaskSlice = createSlice({
    name: 'eventTask',
    initialState,
    reducers: {
    refreshEventTasks: (state, action) => {
      const { items, total, page } = action.payload;
      state.eventTasks = items; 
      state.total = total;
      state.currentPage = page;
      state.loading = false; 
    },
    selectedEventTask: (state, action) => {
      state.selected = action.payload;
    },
    setLoadingEventTask: (state, action) => {
      state.loading = action.payload;
    },
    setPageEventTask: (state, action) => {
      state.currentPage = action.payload;
    },
    setRowsPerPageEventTask: (state, action) => {
      state.rowsPerPage = action.payload;
    },
    listAllEventTasks: (state, action) => {
      state.eventTasks = action.payload;
    },
  },
});

export const {
    refreshEventTasks,
    selectedEventTask,
    setLoadingEventTask,
    setPageEventTask,
    setRowsPerPageEventTask,
    listAllEventTasks,
} = eventTaskSlice.actions;

export default eventTaskSlice.reducer;