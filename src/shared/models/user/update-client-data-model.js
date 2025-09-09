export const updateClientDataModel = (user) => ({
  first_name: user.firstName,
  last_name: user.lastName,
  phone: user.phone,
  document_type: user.documentType,
  document_number: user.documentNumber
});
