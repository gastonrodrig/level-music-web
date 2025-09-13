export const createClientCompanyModel = (client) => ({
  email: client.email,
  company_name: client.company_name,
  contact_person: client.contact_person,
  phone: client.phone,
  client_type: 'Empresa',
  document_type: 'Ruc',
  document_number: client.document_number
});