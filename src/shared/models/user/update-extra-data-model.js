export const updateExtraDataModel = (user) => ({
  first_name: user.first_name,
  last_name: user.last_name,
  phone: user.phone,
  document_type: user.document_type,
  document_number: user.document_number
});
