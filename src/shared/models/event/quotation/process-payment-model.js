export const processPaymentModel = (f) => ({
  transaction_amount: f.amount,
  token: f.token,
  description: f.description,
  installments: f.installments || 1,
  payment_method_id: f.payment_method_id,
  payer: {
    email: f.payer.email,
    identification: {
      type: f.payer.identification.type,
      number: f.payer.identification.number,
    },
  },
});