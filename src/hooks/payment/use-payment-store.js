import { useDispatch, useSelector } from "react-redux";
import { createPaymentsModel , processPaymentModel } from "../../shared/models";
import { 
  selectedPayment, 
  setLoadingPayment, 
  setPagePayment, 
  setRowsPerPagePayment, 
  showSnackbar 
} from "../../store";
import { useState } from "react";
import { paymentApi } from "../../api";
import { getAuthConfig } from "../../shared/utils";

export const usePaymentStore = () => {
  const dispatch = useDispatch();
  const{
    payments,
    selected,
    total,
    loading,
    currentPage,
    rowsPerPage,  
  } = useSelector((state) => state.payment);

  const { token } = useSelector((state) => state.auth);

  const [searchTerm, setSearchTerm] = useState('');
  const [orderBy, setOrderBy] = useState('name');
  const [order, setOrder] = useState('asc');

  const openSnackbar = (message) => dispatch(showSnackbar({ message }));

  const startCreatePayments = async (payments) => {
    dispatch(setLoadingPayment(true));
    try {
      const payload = createPaymentsModel(payments);
      await paymentApi.post('/', payload, getAuthConfig(token));
      openSnackbar("Los pagos fueron creados exitosamente.");
      return true;
    } catch (error) {
      const message = error.response?.data?.message;
      openSnackbar(message ?? "Ocurrió un error al crear el tipo de servicio.");
      return false;
    } finally {
      dispatch(setLoadingPayment(false));
    }
  };

  const startProcessingPayments = async (payments) => {
    dispatch(setLoadingPayment(true));
    
    try {
      const payload = processPaymentModel(payments);
      const result = await paymentApi.post('/test/mercadopago', payload, getAuthConfig(token));
      openSnackbar("El pago fue procesado exitosamente.");
      console.log("✅ Resultado del pago:", result.data); 
      return true;
    } catch (error) {
      console.error("❌ Error al procesar el pago:", error);
      const message = error.response?.data?.message;
      openSnackbar(message ?? "Ocurrió un error al crear el tipo de servicio.");
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
  };
};
