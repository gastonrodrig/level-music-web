export const updateClientCompanyModel = (client) => ({
  email: client.email,
  company_name: client.company_name,
  contact_person: client.contact_person,
  phone: client.phone,
  document_number: client.document_number,
  status: client.status
});