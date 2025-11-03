export const updateClientDataModel = (user) => ({
  client_type: user.client_type,
  first_name: user.first_name || null,
  last_name: user.last_name || null,
  company_name: user.company_name || null,
  contact_person: user.contact_person || null,
  phone: user.phone,
  document_type: user.document_type,
  document_number: user.document_number
});
