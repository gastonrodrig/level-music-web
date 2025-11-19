/**
 * Crea un FormData para enviar un pago manual al backend.
 * Campos incluidos (sugeridos):
 * - event_id
 * - quotation_id (opcional)
 * - payment_date
 * - amount
 * - currency
 * - payment_method
 * - payer_name (opcional)
 * - notes (opcional)
 * - records (opcional) -> JSON string
 * - receipts -> archivos (puede ser array de File)
 *
 * El backend debe aceptar campos form-data y múltiples archivos con la misma key 'receipts'.
 */


export const createManualPaymentModel = (payment = {}) => {
  const formData = new FormData();

  // Campos obligatorios / principales
  if (payment.event_id) formData.append('event_id', payment.event_id);
  if (payment.quotation_id) formData.append('quotation_id', payment.quotation_id);

  // Fecha: aceptar valor o usar fecha actual ISO
  formData.append('payment_date', payment.payment_date || new Date().toISOString());

  // Monto y moneda
  formData.append('amount', String(payment.amount ?? 0));
  if (payment.currency) formData.append('currency', payment.currency);

  // Método y datos del pagador
  formData.append('payment_method', payment.payment_method || 'manual');
  if (payment.payer_name) formData.append('payer_name', payment.payer_name);
  if (payment.notes) formData.append('notes', payment.notes);

  // Registros adicionales: se serializan como JSON
  if (payment.records && Array.isArray(payment.records)) {
    try {
      formData.append('records', JSON.stringify(payment.records));
    } catch (err) {
      // si hay algún problema al serializar, agregar como string sencillo
      formData.append('records', String(payment.records));
    }
  }

  // Archivos de comprobante: aceptar array de File u objetos tipo File
  // Archivos de comprobante / imágenes: seguir el mismo patrón que createEventFeaturedModel
  // Si se envía payment.images (array), añadimos cada file como 'images'
  if (Array.isArray(payment.images)) {
    payment.images.forEach((file) => {
      // Expect File/Blob objects from <input type="file" multiple>
      if (file) formData.append('images', file);
    });
  }

  // Compatibilidad: también soportar property 'receipts' o 'receipt' si existe
  if (Array.isArray(payment.receipts)) {
    payment.receipts.forEach((file) => {
      if (file) formData.append('receipts', file);
    });
  } else if (payment.receipt) {
    formData.append('receipts', payment.receipt);
  }

  return formData;
};

export default createManualPaymentModel;
