import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  quotations: [],
  selected: null,
  total: 0,
  currentPage: 0,
  rowsPerPage: 5,
  loading: false,
  dashboardData: null,
  graficperMonth: null,
  eventType: null,
  eventByDate: null,
};

export const quotationSlice = createSlice({
  name: 'quotation',
  initialState,
  reducers: {
    // Refresca las cotizaciones paginadas
    refreshQuotations: (state, action) => {
      const { items, total, page } = action.payload;
      state.quotations = items;
      state.total = total;
      state.currentPage = page;
      state.loading = false;
    },
    // Selecciona una cotización
    selectedQuotation: (state, action) => {
      state.selected = action.payload;
    },
    // Cambia el estado de carga
    setLoadingQuotation: (state, action) => {
      state.loading = action.payload;
    },
    // Cambia la página actual
    setPageQuotation: (state, action) => {
      state.currentPage = action.payload;
    },
    // Cambia la cantidad de filas por página
    setRowsPerPageQuotation: (state, action) => {
      state.rowsPerPage = action.payload;
    },
    // Establece las actividades del trabajador
    setDashboardData: (state, action) => {
      state.dashboardData = action.payload;
    },
    // Establece los datos gráficos por mes
    setGraficsperMonth: (state, action) => {
      state.graficperMonth = action.payload;
    },
    // Lista todas las cotizaciones sin paginación
    setEventType: (state, action) => {
      state.eventType = action.payload;
    },
    // Establece los eventos por fecha
    setEventByDate: (state, action) => {
      state.eventByDate = action.payload;
    },
  },
});

export const {
  refreshQuotations,
  selectedQuotation,
  setLoadingQuotation,
  setPageQuotation,
  setRowsPerPageQuotation,
  listAllQuotations,
  setDashboardData,
  setGraficsperMonth,
  setEventType,
  setEventByDate,
} = quotationSlice.actions;

export default quotationSlice.reducer;
