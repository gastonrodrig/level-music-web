export const updateEquipmentModel = (equipment) => ({
  name: equipment.name,
  description: equipment.description,
  equipment_type: equipment.equipment_type,
  last_maintenance_date: equipment.last_maintenance_date || null,
  maintenance_interval_days: equipment.maintenance_interval_days,
});