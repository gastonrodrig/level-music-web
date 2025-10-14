import { useDispatch, useSelector } from "react-redux";
import { createPaymentsDto } from "../../shared/models";
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
      const payload = createPaymentsDto(payments);
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
  };
};
