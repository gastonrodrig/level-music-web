import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  reprogramings: [],
  selected: null,
  total: 0,
  currentPage: 0,
  rowsPerPage: 5,
  loading: false,
};

export const reprogramingsSlice = createSlice({
  name: 'reprogramings',
  initialState,
  reducers: {
    // Refresca las reprogramaciones paginadas
    refreshReprogramings: (state, action) => {
      const { items, total, page } = action.payload;
      state.reprogramings = items;
      state.total = total;
      state.currentPage = page;
      state.loading = false;
    },

    // Selecciona una reprogramación
    selectedReprograming: (state, action) => {
      state.selected = action.payload;
    },

    // Cambia el estado de carga
    setLoadingReprogramings: (state, action) => {
      state.loading = action.payload;
    },

    // Cambia la página actual
    setPageReprogramings: (state, action) => {
      state.currentPage = action.payload;
    },

    // Cambia la cantidad de filas por página
    setRowsPerPageReprogramings: (state, action) => {
      state.rowsPerPage = action.payload;
    },
  },
});

export const {
  refreshReprogramings,
  selectedReprograming,
  setLoadingReprogramings,
  setPageReprogramings,
  setRowsPerPageReprogramings,
} = reprogramingsSlice.actions;

export default reprogramingsSlice.reducer;