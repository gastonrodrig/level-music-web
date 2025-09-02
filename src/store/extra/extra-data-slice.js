import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	loadingExtraData: false,
};

export const extraDataSlice = createSlice({
	name: "extraData",
	initialState,
	reducers: {
    setLoadingExtraData(state) {
      state.loadingExtraData = true;
    },
    stopLoadingExtraData(state) {
      state.loadingExtraData = false;
    },
	},
});

export const { 
  setLoadingExtraData, 
  stopLoadingExtraData 
} = extraDataSlice.actions;
