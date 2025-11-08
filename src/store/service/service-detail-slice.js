import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  serviceDetail: [],
  selected: null,
  loading: false,
};

export const serviceDetailSlice = createSlice({
  name: "serviceDetail",
  initialState,
  reducers: {
    setLoadingServiceDetail: (state, action) => {
      state.loading = action.payload;
    },
    selectedServiceDetail: (state, action) => {
      state.selected = action.payload;
    },
    listAllServiceDetails: (state, action) => {
      state.serviceDetail = action.payload;
    }
  },
});

export const {
  setLoadingServiceDetail,
  selectedServiceDetail,
  listAllServiceDetails,
} = serviceDetailSlice.actions;