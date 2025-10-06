export const createQuotationAdminModel = (data) => ({
  name: data.eventName,
  description: data.eventDescription,
  event_date: new Date(data.startDateTime),
  start_time: new Date(data.startDateTime),
  end_time: new Date(data.endDateTime),
  attendees_count: Number(data.attendeesCount),
  exact_address: data.exactAddress,
  location_reference: data.placeReference,
  place_type: data.placeType,
  place_size: Number(data.placeCapacity),
  user_id: data.user_id || null,
  event_type_id: data.event_type_id,
  event_type_name: data.event_type_name,
  
  // "estimated_price": 1500.5,
  // "final_price": 1500.5,
  // "assignations": [
  //   {
  //     "resource_type": "Servicio Adicional",
  //     "resource_id": "string",
  //     "hours": 0,
  //     "hourly_rate": 0,
  //     "available_from": "2025-10-06T00:16:07.607Z",
  //     "available_to": "2025-10-06T00:16:07.607Z"
  //   }
  // ],
  // "client_info": {
  //   "client_type": "PERSONA",
  //   "first_name": "John",
  //   "last_name": "Doe",
  //   "company_name": "ACME S.A.C.",
  //   "contact_person": "Carlos Pérez",
  //   "email": "user@example.com",
  //   "phone": "987654321",
  //   "document_type": "Dni",
  //   "document_number": "12345678"
})
