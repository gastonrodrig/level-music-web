export const processPaymentModel = (f) => ({
  transaction_amount: f.amount,
  token: f.token,
  description: f.description,
  installments: f.installments || 1,
  payment_method_id: f.paymentMethodId,
  payer: {
    email: f.email,
    first_name: f.firstName,
    identification: {
      type: f.documentType,
      number: f.documentNumber,
    },
  },
});