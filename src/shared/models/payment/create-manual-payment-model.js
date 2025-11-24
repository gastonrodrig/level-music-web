
export const createManualPaymentModel = (payment = {}) => {
  const formData = new FormData();

  // Campos principales
  if (payment.payment_type) formData.append('payment_type', payment.payment_type);
  if (payment.event_id) formData.append('event_id', payment.event_id);
  if (payment.user_id) formData.append('user_id', payment.user_id);

  // Serializar el array de pagos como JSON string
  if (Array.isArray(payment.payments) && payment.payments.length > 0) {
    formData.append('payments', JSON.stringify(payment.payments));
  }

  // Agregar imágenes en el mismo orden que los pagos
  if (Array.isArray(payment.images) && payment.images.length > 0) {
    payment.images.forEach((file) => {
      if (file instanceof File) {
        formData.append('images', file);
      }
    });
  }

  return formData;
};
