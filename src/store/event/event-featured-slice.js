import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  eventFeatured: [],
  selected: null,
  total: 0,
  currentPage: 0,
  rowsPerPage: 5,
  loading: false,
};

export const eventFeaturedSlice = createSlice({
  name: 'eventFeatured',
  initialState,
  reducers: {
    refreshEventFeatured: (state, action) => {
      const { items, total, page } = action.payload;
      state.eventFeatured = items; 
      state.total = total;
      state.currentPage = page;
      state.loading = false; 
    },
    selectedEventFeatured: (state, action) => {
      state.selected = action.payload;
    },
    setLoadingEventFeatured: (state, action) => {
      state.loading = action.payload;
    },
    setPageEventFeatured: (state, action) => {
      state.currentPage = action.payload;
    },
    setRowsPerPageEventFeatured: (state, action) => {
      state.rowsPerPage = action.payload;
    },
  },
});

export const {
  refreshEventFeatured,
  selectedEventFeatured,
  setLoadingEventFeatured,
  setPageEventFeatured,
  setRowsPerPageEventFeatured,
} = eventFeaturedSlice.actions;