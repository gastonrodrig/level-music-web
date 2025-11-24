export const createManualPaymentModel = (data = {}) => {
  const formData = new FormData();

  // Agregar user_id (obligatorio)
  if (data.user_id) {
    formData.append('user_id', data.user_id);
  }

  // Agregar event_id (obligatorio) 
  if (data.event_id) {
    formData.append('event_id', data.event_id);
  }

  // Agregar payment_type (obligatorio: "Parcial" o "Final")
  if (data.payment_type) {
    formData.append('payment_type', data.payment_type);
  }

  // Agregar los pagos como array de objetos
  if (Array.isArray(data.payments) && data.payments.length > 0) {
    data.payments.forEach((payment, index) => {
      formData.append(`payments[${index}][payment_method]`, payment.payment_method || '');
      formData.append(`payments[${index}][amount]`, payment.amount || 0);
      formData.append(`payments[${index}][operation_number]`, payment.operation_number || '');
      
      if (payment.payment_date) {
        formData.append(`payments[${index}][payment_date]`, payment.payment_date);
      }
    });
  }

  // Agregar las imágenes (vouchers)
  if (Array.isArray(data.images) && data.images.length > 0) {
    data.images.forEach((image) => {
      formData.append('vouchers', image);
    });
  }

  return formData;
};
