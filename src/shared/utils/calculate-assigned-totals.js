export function calculateAssignedTotals(
  assignedServices = [],
  assignedWorkers = [],
  assignedEquipments = []
) {
  // --- TOTAL SERVICIOS ---
  const totalServices = Array.isArray(assignedServices)
    ? assignedServices.reduce(
        (sum, s) => sum + (s?.service_price ?? 0),
        0
      )
    : 0;

  // --- TOTAL TRABAJADORES (precio * horas) ---
  const totalWorkers = Array.isArray(assignedWorkers)
    ? assignedWorkers.reduce(
        (sum, w) =>
          sum + ((w?.worker_price ?? 0) * (w?.worker_hours ?? 1)),
        0
      )
    : 0;

  // --- TOTAL EQUIPOS (precio * horas) ---
  const totalEquipments = Array.isArray(assignedEquipments)
    ? assignedEquipments.reduce(
        (sum, e) =>
          sum + ((e?.equipment_price ?? 0) * (e?.equipment_hours ?? 1)),
        0
      )
    : 0;

  // --- TOTAL GENERAL ---
  return totalServices + totalWorkers + totalEquipments;
}
