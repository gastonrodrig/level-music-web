import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  serviceDetail: [],
  loading: false,
};

export const serviceDetailSlice = createSlice({
  name: "serviceDetail",
  initialState,
  reducers: {
    setLoadingServiceDetail: (state, action) => {
      state.loading = action.payload;
    },
    listAllServiceDetails: (state, action) => {
      state.serviceDetail = action.payload;
    }
  },
});

export const {
  setLoadingServiceDetail,
  listAllServiceDetails,
} = serviceDetailSlice.actions;