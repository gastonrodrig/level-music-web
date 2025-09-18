import { toTimeString } from "../../../utils";

export const createQuotationLandingModel = (f) => ({
  date: f.eventDate,
  start_time: toTimeString(f.startTime),
  end_time: toTimeString(f.endTime),

  attendees_count: Number(f.attendeesCount),
  exact_address: f.exactAddress,
  location_reference: f.placeReference,
  place_type: f.placeType,
  place_size: Number(f.placeCapacity),

  user_id: f.user_id || null,

  event_type_id: f.event_type_id,
  event_type_name: f.customEventType !== "" ? f.customEventType : f.event_type_name,

  services_requested: 
    f.services_requested.map(s => ({
      service_type_id: s.service_type_id,
      service_type_name: s.service_type_name,
      details: s.details
    })),

  client_info: {
    client_type: f.client_type === "Empresa" ? "Empresa" : "Persona",
    first_name: f.client_type === "Persona" ? f.first_name : null,
    last_name: f.client_type === "Persona" ? f.last_name : null,
    company_name: f.client_type === "Empresa" ? f.company_name : null,
    contact_person: f.client_type === "Empresa" ? f.contact_person : null,
    email: f.email,
    phone: f.phone,
    document_type: f.document_type,
    document_number: f.document_number
  }
});
