export const updateClientPersonModel = (client) => ({
  email: client.email,
  first_name: client.first_name,
  last_name: client.last_name,
  phone: client.phone,
  document_type: client.document_type,
  document_number: client.document_number,
  status: client.status
});