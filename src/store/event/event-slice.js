import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  loading: false,
};

export const eventSlice = createSlice({
  name: 'event',
  initialState,
  reducers: {
    setLoadingEvent: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const {
  setLoadingEvent
} = eventSlice.actions;

export default eventSlice.reducer;
