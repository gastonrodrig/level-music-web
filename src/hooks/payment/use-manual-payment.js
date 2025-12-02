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

  const { token, _id: userId } = useSelector((state) => state.auth || {});

  const [searchTerm, setSearchTerm] = useState('');
  const [orderBy, setOrderBy] = useState('created_at');
  const [order, setOrder] = useState('desc');
  const [error, setError] = useState(null);

  const openSnackbar = (message) => dispatch(showSnackbar({ message }));

  /**
   * Validar que todos los datos requeridos estén presentes
   */
  const validatePaymentData = (paymentData) => {
    const { user_id, event_id, payment_type, payments: paymentsArray, images } = paymentData;

    // Validar user_id
    if (!user_id) {
      openSnackbar('El ID de usuario es requerido.');
      return false;
    }

    // Validar que sea un MongoDB ID válido (24 caracteres hexadecimales)
    if (!/^[0-9a-fA-F]{24}$/.test(user_id)) {
      openSnackbar('El ID de usuario no es válido.');
      return false;
    }

    // Validar event_id
    if (!event_id) {
      openSnackbar('El ID del evento es requerido.');
      return false;
    }

    // Validar que sea un MongoDB ID válido
    if (!/^[0-9a-fA-F]{24}$/.test(event_id)) {
      openSnackbar('El ID del evento no es válido.');
      return false;
    }

    // Validar payment_type
    if (!payment_type) {
      openSnackbar('El tipo de pago es requerido.');
      return false;
    }

    // Validar que sea "Parcial" o "Final"
    if (!['Parcial', 'Final'].includes(payment_type)) {
      openSnackbar('El tipo de pago debe ser "Parcial" o "Final".');
      return false;
    }

    // Validar array de pagos
    if (!Array.isArray(paymentsArray) || paymentsArray.length === 0) {
      openSnackbar('Debe agregar al menos un pago.');
      return false;
    }

    // Validar array de imágenes
    if (!Array.isArray(images) || images.length === 0) {
      openSnackbar('Debe agregar al menos una imagen de comprobante.');
      return false;
    }

    // Validar que la cantidad de pagos coincida con la cantidad de imágenes
    if (paymentsArray.length !== images.length) {
      openSnackbar(
        `La cantidad de pagos (${paymentsArray.length}) debe coincidir con la cantidad de imágenes (${images.length}).`
      );
      return false;
    }

    // Validar cada pago individualmente
    for (let i = 0; i < paymentsArray.length; i++) {
      const payment = paymentsArray[i];
      
      // Validar payment_method (enum: Yape, Plin, Transferencia)
      if (!payment.payment_method) {
        openSnackbar(`El pago ${i + 1} debe tener un método de pago.`);
        return false;
      }

      console.log(payment)

      const validMethods = ['Yape', 'Plin', 'Transferencia'];
      if (!validMethods.includes(payment.payment_method)) {
        openSnackbar(`El método de pago del pago ${i + 1} debe ser: Yape, Plin o Transferencia.`);
        return false;
      }

      // Validar amount (debe ser un número positivo)
      if (!payment.amount || payment.amount <= 0) {
        openSnackbar(`El pago ${i + 1} debe tener un monto válido mayor a 0.`);
        return false;
      }

      if (typeof payment.amount !== 'number' && isNaN(Number(payment.amount))) {
        openSnackbar(`El monto del pago ${i + 1} debe ser un número válido.`);
        return false;
      }

      // operation_number es opcional según el DTO
    }

    // Validar que todas las imágenes sean archivos válidos
    for (let i = 0; i < images.length; i++) {
      if (!(images[i] instanceof File)) {
        openSnackbar(`La imagen ${i + 1} no es un archivo válido.`);
        return false;
      }

      // Validar tipo de archivo (imágenes)
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!validTypes.includes(images[i].type)) {
        openSnackbar(`La imagen ${i + 1} debe ser JPG, PNG o WEBP.`);
        return false;
      }

      // Validar tamaño de archivo (máximo 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (images[i].size > maxSize) {
        openSnackbar(`La imagen ${i + 1} debe ser menor a 5MB.`);
        return false;
      }
    }

    return true;
  };

  /**
   * Crear un pago manual con múltiples métodos de pago
   */
  const startCreateManualPayment = async (paymentData = {}) => {
    // ✅ Agregar user_id automáticamente si no viene en paymentData
    const completePaymentData = {
      ...paymentData,
      user_id: paymentData.user_id || userId, // Usar el userId del estado de auth
    };

    // Validar datos antes de enviar
    if (!validatePaymentData(completePaymentData)) {
      return false;
    }

    dispatch(setLoadingPayment(true));
    setError(null);

    try {
      // Crear FormData con el modelo
      const payload = createManualPaymentModel(completePaymentData);

      // Log para debugging (remover en producción)
      console.log('📤 Enviando pago manual:', {
        user_id: completePaymentData.user_id,
        event_id: completePaymentData.event_id,
        payment_type: completePaymentData.payment_type,
        payments_count: completePaymentData.payments?.length,
        images_count: completePaymentData.images?.length,
      });

      // Enviar al backend
      const response = await paymentApi.post('/manual', payload, getAuthConfig(token, true));

      console.log('✅ Pago manual creado exitosamente:', response.data);

      openSnackbar('Pagos registrados exitosamente');
      return true;

    } catch (err) {
      console.error('❌ Error al crear pago manual:', err);
      
      // Extraer mensaje de error detallado
      let message = 'Ocurrió un error al registrar el pago.';

      if (err?.response?.data?.message) {
        // Error del backend
        if (Array.isArray(err.response.data.message)) {
          // Errores de validación (array)
          message = err.response.data.message.join(', ');
        } else {
          message = err.response.data.message;
        }
      } else if (err.message) {
        // Error de red o del cliente
        message = err.message;
      }

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
    userId, // ✅ Exportar userId para uso externo si es necesario

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