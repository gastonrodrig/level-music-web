import { useDispatch, useSelector } from "react-redux";
import {
  onApproveAllPayments,
  onReportPaymentIssues,
  selectedPayment,
  setLoadingPayment,
  setPagePayment,
  setRowsPerPagePayment,
  showSnackbar,
} from "../../store";
import { createPaymentsModel, processPaymentModel } from "../../shared/models";
import { paymentApi } from "../../api";
import { getAuthConfig } from "../../shared/utils";
import { useState } from "react";

export const usePaymentStore = () => {
  const dispatch = useDispatch();
  const {
    payments,
    selected,
    total,
    loading,
    currentPage,
    rowsPerPage,
    isLoading,
  } = useSelector((state) => state.payment);

  const { token } = useSelector((state) => state.auth);

  const [searchTerm, setSearchTerm] = useState("");
  const [orderBy, setOrderBy] = useState("name");
  const [order, setOrder] = useState("asc");

  const openSnackbar = (message) => dispatch(showSnackbar({ message }));

  const startCreatePayments = async (payments) => {
    dispatch(setLoadingPayment(true));
    try {
      const payload = createPaymentsModel(payments);
      await paymentApi.post("/", payload, getAuthConfig(token));
      openSnackbar("Los pagos fueron creados exitosamente.");
      return true;
    } catch (error) {
      const message = error.response?.data?.message;
      openSnackbar(
        message ?? "Ocurrió un error al crear el tipo de servicio."
      );
      return false;
    } finally {
      dispatch(setLoadingPayment(false));
    }
  };

  const startProcessingPayments = async (payments) => {
    dispatch(setLoadingPayment(true));

    try {
      const payload = processPaymentModel(payments);
      const result = await paymentApi.post(
        "/test/mercadopago",
        payload,
        getAuthConfig(token)
      );
      openSnackbar("El pago fue procesado exitosamente.");
      console.log("✅ Resultado del pago:", result.data);
      return true;
    } catch (error) {
      console.error("❌ Error al procesar el pago:", error);
      const message = error.response?.data?.message;
      openSnackbar(
        message ?? "Ocurrió un error al crear el tipo de servicio."
      );
      return false;
    } finally {
      dispatch(setLoadingPayment(false));
    }
  };

  const startApproveAllPayments = async (event_id) => {
    dispatch(setLoadingPayment(true));
    try {
      const response = await paymentApi.post(
        "/approve-all",
        { event_id },
        getAuthConfig(token)
      );

      dispatch(
        onApproveAllPayments({
          event_id,
          ...response.data,
        })
      );

      openSnackbar(response.data.message || "Pagos aprobados exitosamente.");
      return true;
    } catch (error) {
      console.error("Error al aprobar pagos:", error);
      const message = error.response?.data?.message;
      openSnackbar(message ?? "Error al aprobar los pagos.");
      return false;
    } finally {
      dispatch(setLoadingPayment(false));
    }
  };

  const startReportPaymentIssues = async (event_id, issues) => {
    dispatch(setLoadingPayment(true));
    try {
      const response = await paymentApi.post(
        "/report-issues",
        { event_id, issues },
        getAuthConfig(token)
      );

      dispatch(
        onReportPaymentIssues({
          event_id,
          payment_ids: issues.map((i) => i.payment_id),
          ...response.data,
        })
      );

      openSnackbar(response.data.message || "Reporte enviado exitosamente.");
      return true;
    } catch (error) {
      console.error("Error al reportar issues:", error);
      const message = error.response?.data?.message;
      openSnackbar(message ?? "Error al enviar el reporte.");
      return false;
    } finally {
      dispatch(setLoadingPayment(false));
    }
  };

  const setSelectedPayment = (payment) => {
    dispatch(selectedPayment({ ...payment }));
  };

  const setPageGlobal = (page) => {
    dispatch(setPagePayment(page));
  };

  const setRowsPerPageGlobal = (rows) => {
    dispatch(setRowsPerPagePayment(rows));
  };

  return {
    // state
    payments,
    selected,
    total,
    loading,
    searchTerm,
    rowsPerPage,
    currentPage,
    orderBy,
    order,
    isLoading,

    // setters
    setSearchTerm,
    setOrderBy,
    setOrder,
    setPageGlobal,
    setRowsPerPageGlobal,

    // actions
    startCreatePayments,
    setSelectedPayment,
    startProcessingPayments,
    startApproveAllPayments,
    startReportPaymentIssues,
  };
};
