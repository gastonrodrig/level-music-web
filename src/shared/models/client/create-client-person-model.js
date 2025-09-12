export const createClientPersonModel = (client) => ({
  email: client.email,
  first_name: client.first_name,
  last_name: client.last_name,
  phone: client.phone,
  client_type: 'Persona',
  document_type: client.document_type,
  document_number: client.document_number
});