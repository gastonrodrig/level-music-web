export const createPaymentsDto = (f) => ({
  partial_payment_date: f.partialPaymentDate,
  final_payment_date: f.finalPaymentDate,
  partial_amount: f.partialAmount,
  final_amount: f.finalAmount,
  event_id: f.event_id,
});
