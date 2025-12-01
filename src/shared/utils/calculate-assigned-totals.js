export function calculateAssignedTotals(
  assignedServices = [],
  assignedWorkerTypes = [],
  assignedEquipments = []
) {
  // --- TOTAL SERVICIOS ---
  const totalServices = Array.isArray(assignedServices)
    ? assignedServices.reduce(
        (sum, s) => sum + (s?.service_price ?? 0),
        0
      )
    : 0;

  // --- TOTAL TRABAJADORES (precio × horas × cantidad) ---
  const totalWorkers = Array.isArray(assignedWorkerTypes)
    ? assignedWorkerTypes.reduce(
        (sum, w) =>
          sum +
          ((w?.worker_price ?? 0) *
          (w?.worker_hours ?? 1) *
          (w?.worker_quantity ?? 1)),
        0
      )
    : 0;

  // --- TOTAL EQUIPOS (precio × horas) ---
  const totalEquipments = Array.isArray(assignedEquipments)
    ? assignedEquipments.reduce(
        (sum, e) =>
          sum +
          ((e?.equipment_price ?? 0) * (e?.equipment_hours ?? 1)),
        0
      )
    : 0;

  // --- TOTAL GENERAL ---
  return totalServices + totalWorkers + totalEquipments;
}
