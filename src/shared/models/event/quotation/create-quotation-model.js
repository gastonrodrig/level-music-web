export const createQuotationModel = (data) => { 
  const assignations = [
    // Servicios Adicionales
    ...data.services.map((s) => ({
      resource_type: "Servicio Adicional",
      resource_id: String(s.service_detail_id),
      hours: Number(s.service_hours || 1),
      hourly_rate: Number(s.service_price ?? s.ref_price ?? 0),
      available_from: data.startDateTime,
      available_to: data.endDateTime,
      payment_percentage_required: s.payment_percentage_required ?? 0,
    })),
    // Equipos
    ...data.equipments.map((e) => ({
      resource_type: "Equipo",
      resource_id: String(e._id),
      hours: Number(e.equipment_hours || 1),
      hourly_rate: Number(e.equipment_price || 0),
      available_from: data.startDateTime,
      available_to: data.endDateTime,
    })),
    // Trabajadores
    ...data.workers.map((w) => ({
      resource_type: "Trabajador",
      resource_id: String(w._id),
      hours: Number(w.worker_hours || 1),
      hourly_rate: Number(w.worker_price || 0),
      available_from: data.startDateTime,
      available_to: data.endDateTime,
    })),
  ].filter((r) => r.resource_id && r.hours > 0 && r.hourly_rate > 0);

  return {
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
    estimated_price: Number(data.estimated_price),
    assignations,
    // campos desnormalizados (ya no client_info)
    client_type: data.client_type === "Empresa" ? "Empresa" : "Persona",
    first_name: data.client_type === "Persona" ? data.first_name : null,
    last_name: data.client_type === "Persona" ? data.last_name : null,
    company_name: data.client_type === "Empresa" ? data.company_name : null,
    contact_person: data.client_type === "Empresa" ? data.contact_person : null,
    email: data.email,
    phone: data.phone,
    document_type: data.document_type,
    document_number: data.document_number
  }
}