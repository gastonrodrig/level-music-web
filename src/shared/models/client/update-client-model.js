export const updateClientModel = (client) => ({
  first_name: client.first_name,
  last_name: client.last_name,
  phone: client.phone,
  email: client.email,
  document_type: client.document_type,
  document_number: client.document_number,
  status: "Activo",
});