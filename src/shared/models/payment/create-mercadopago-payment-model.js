
export const createMercadoPagoPaymentModel = (data = {}) => {
  // Validaciones básicas
  if (!data.event_id) {
    throw new Error('event_id es requerido');
  }

  if (!data.user_id) {
    throw new Error('user_id es requerido');
  }

  if (!data.token) {
    throw new Error('token es requerido');
  }

  if (!data.transaction_amount || data.transaction_amount <= 0) {
    throw new Error('transaction_amount debe ser mayor a 0');
  }

  // Construir el payload
  const payload = {
    payment_type: data.payment_type || 'Parcial',
    event_id: data.event_id,
    user_id: data.user_id,
    transaction_amount: Number(data.transaction_amount),
    token: data.token,
    description: data.description || 'Pago de evento',
    installments: data.installments || 1,
    payment_method_id: data.payment_method_id || 'visa',
    payer: {
      email: data.payer?.email || '',
      identification: {
        type: data.payer?.identification?.type || 'DNI',
        number: data.payer?.identification?.number || '',
      },
    },
  };

  return payload;
};