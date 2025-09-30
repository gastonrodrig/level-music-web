export const assignResourcesModel = (data) => {
  const resources = [
    // Servicios Adicionales
    ...data.services.map((s) => ({
      resource_type: "Servicio Adicional",
      resource_id: String(s.service_detail_id),
      hours: Number(s.service_hours || 1),
      hourly_rate: Number(s.service_price ?? s.ref_price ?? 0),
      available_from: data.from,
      available_to: data.to,
    })),
    // Equipos
    ...data.equipments.map((e) => ({
      resource_type: "Equipo",
      resource_id: String(e._id),
      hours: Number(e.equipment_hours || 1),
      hourly_rate: Number(e.equipment_price || 0),
      available_from: data.from,
      available_to: data.to,
    })),
    // Trabajadores
    ...data.workers.map((w) => ({
      resource_type: "Trabajador",
      resource_id: String(w._id),
      hours: Number(w.worker_hours || 1),
      hourly_rate: Number(w.worker_price || 0),
      available_from: data.from,
      available_to: data.to,
    })),
  ].filter((r) => r.resource_id && r.hours > 0 && r.hourly_rate > 0);

  return {
    name: data.name,
    description: data.description,
    resources,
  };
};
