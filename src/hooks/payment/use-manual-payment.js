import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createManualPaymentModel } from '../../shared/models';
import { paymentApi } from '../../api';
import { getAuthConfig } from '../../shared/utils';
import {
  setLoadingPayment,
  selectedPayment,
  showSnackbar,
  setPagePayment,
} from '../../store';

export const useManualPayment = () => {
  const dispatch = useDispatch();

  const {
    payments,
    selected,
    total,
    loading,
    currentPage,
    rowsPerPage,
  } = useSelector((state) => state.payment || {});

  const { token } = useSelector((state) => state.auth || {});

  const [searchTerm, setSearchTerm] = useState('');
  const [orderBy, setOrderBy] = useState('created_at');
  const [order, setOrder] = useState('desc');
  const [error, setError] = useState(null);

  const openSnackbar = (message) => dispatch(showSnackbar({ message }));

  /**
   * Validar que haya la misma cantidad de imágenes que pagos
   */
  const validatePaymentData = (paymentData) => {
    const { payments: paymentsArray, images } = paymentData;

    if (!Array.isArray(paymentsArray) || paymentsArray.length === 0) {
      openSnackbar('Debe agregar al menos un pago.');
      return false;
    }

    if (!Array.isArray(images) || images.length === 0) {
      openSnackbar('Debe agregar al menos una imagen de comprobante.');
      return false;
    }

    if (paymentsArray.length !== images.length) {
      openSnackbar(
        `La cantidad de pagos (${paymentsArray.length}) debe coincidir con la cantidad de imágenes (${images.length}).`
      );
      return false;
    }

    // Validar que cada pago tenga los campos requeridos
    for (let i = 0; i < paymentsArray.length; i++) {
      const payment = paymentsArray[i];
      if (!payment.payment_method) {
        openSnackbar(`El pago ${i + 1} debe tener un método de pago.`);
        return false;
      }
      if (!payment.amount || payment.amount <= 0) {
        openSnackbar(`El pago ${i + 1} debe tener un monto válido.`);
        return false;
      }
    }

    // Validar que todas las imágenes sean archivos válidos
    for (let i = 0; i < images.length; i++) {
      if (!(images[i] instanceof File)) {
        openSnackbar(`La imagen ${i + 1} no es un archivo válido.`);
        return false;
      }
    }

    return true;
  };

  /**
   * Crear un pago manual con múltiples métodos de pago
   */
  const startCreateManualPayment = async (paymentData = {}) => {
    // Validar datos antes de enviar
    if (!validatePaymentData(paymentData)) {
      return false;
    }

    dispatch(setLoadingPayment(true));
    try {
      const payload = createManualPaymentModel(paymentData);
      await paymentApi.post('/manual', payload, getAuthConfig(token, true));
      return true;
    } catch (err) {
      console.log(err)
      const message = 
        err?.response?.data?.message || 
        err.message || 
        'Ocurrió un error al registrar el pago.';
      openSnackbar(message);
      setError(message);
      return false;
    } finally {
      dispatch(setLoadingPayment(false));
    }
  };

  const setSelectedPaymentLocal = (p) => dispatch(selectedPayment(p));

  const setPageGlobal = (page) => dispatch(setPagePayment(page));

  return {
    // redux state
    payments,
    selected,
    total,
    loading,
    currentPage,
    rowsPerPage,

    // local state
    searchTerm,
    setSearchTerm,
    orderBy,
    setOrderBy,
    order,
    setOrder,
    error,

    // actions
    startCreateManualPayment,
    setSelectedPaymentLocal,
    setPageGlobal,
    validatePaymentData,
  };
};