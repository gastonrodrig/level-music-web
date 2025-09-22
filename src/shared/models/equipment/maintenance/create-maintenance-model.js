export const createMaintenanceModel = (maintenance) => ({
  type: maintenance.type,
  description: maintenance.description,
  equipment_id: maintenance.equipment_id,
  date: maintenance.date,
});