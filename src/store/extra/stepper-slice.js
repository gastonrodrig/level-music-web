import { createSlice } from '@reduxjs/toolkit';

export const stepperSlice = createSlice({
  name: 'stepper',
  initialState: {
    flows: {} // { quotation: { currentPage: 0 }, onboarding: { currentPage: 2 } }
  },
  reducers: {
    nextPage(state, action) {
      const { id } = action.payload;
      state.flows[id].currentPage += 1;
    },
    previousPage(state, action) {
      const { id } = action.payload;
      state.flows[id].currentPage = Math.max(0, state.flows[id].currentPage - 1);
    },
    goToPage(state, action) {
      const { id, page } = action.payload;
      state.flows[id].currentPage = page;
    },
    initStepper(state, action) {
      const { id } = action.payload;
      state.flows[id] = { currentPage: 0 };
    }
  }
});

export const { 
  nextPage, 
  previousPage, 
  goToPage, 
  initStepper 
} = stepperSlice.actions;
