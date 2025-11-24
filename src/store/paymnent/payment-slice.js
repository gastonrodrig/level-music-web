import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  payments: [],
  selected: null,
  total: 0,
  currentPage: 0,
  rowsPerPage: 5,
  loading: false,
};

export const paymentSlice = createSlice({
  name: "payment",
  initialState: {
    payments: [],
    isLoading: false,
  },
  reducers: {
    refreshPayment: (state, action) => {
      const { items, total, page } = action.payload;
      state.payments = items;
      state.total = total;
      state.currentPage = page;
      state.loading = false;
    },
    selectedPayment: (state, action) => {
      state.selected = action.payload;
    },
    setLoadingPayment: (state, action) => {
      state.loading = action.payload;
    },
    setPagePayment: (state, action) => {
      state.currentPage = action.payload;
    },
    setRowsPerPagePayment: (state, action) => {
      state.rowsPerPage = action.payload;
    },
    onApproveAllPayments: (state, { payload }) => {
      state.isLoading = false;
      // Actualizar todos los pagos del evento a APROBADO
      state.payments = state.payments.map((payment) =>
        payment.event === payload.event_id
          ? { ...payment, status: "Aprobado", approved_at: new Date().toISOString() }
          : payment
      );
    },
    onReportPaymentIssues: (state, { payload }) => {
      state.isLoading = false;
      const { payment_ids } = payload;
      // Actualizar los pagos con observaciones
      state.payments = state.payments.map((payment) =>
        payment_ids.includes(payment._id)
          ? { ...payment, status: "Con Observaciones", has_issues: true }
          : payment
      );
    },
    onSetLoadingPayments: (state, { payload }) => {
      state.isLoading = payload;
    },
  },
});

export const {
  refreshPayment,
  selectedPayment,
  setLoadingPayment,
  setPagePayment,
  setRowsPerPagePayment,
  onApproveAllPayments,
  onReportPaymentIssues,
  onSetLoadingPayments,
} = paymentSlice.actions;
