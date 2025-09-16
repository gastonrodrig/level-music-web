import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  eventTypes: [],
  selected: null,
  total: 0,
  currentPage: 0,
  rowsPerPage: 5,
  loading: false,
};

export const eventTypeSlice = createSlice({
  name: 'eventType',
  initialState,
  reducers: {
    refreshEventTypes: (state, action) => {
      const { items, total, page } = action.payload;
      state.eventTypes = items; 
      state.total = total;
      state.currentPage = page;
      state.loading = false; 
    },
    selectedEventType: (state, action) => {
      state.selected = action.payload;
    },
    setLoadingEventType: (state, action) => {
      state.loading = action.payload;
    },
    setPageEventType: (state, action) => {
      state.currentPage = action.payload;
    },
    setRowsPerPageEventType: (state, action) => {
      state.rowsPerPage = action.payload;
    },
    listAllEventTypes: (state, action) => {
      state.eventTypes = action.payload;
    },
  },
});

export const {
  refreshEventTypes,
  selectedEventType,
  setLoadingEventType,
  setPageEventType,
  setRowsPerPageEventType,
  listAllEventTypes,
} = eventTypeSlice.actions;