export const updateMaintenanceStatusModel = (maintenance) => ({
  status: maintenance.status,
  reagendation_reason: maintenance.reagendation_reason || null,
  cancelation_reason: maintenance.cancelation_reason || null,
  rescheduled_date: maintenance.rescheduled_date || null
});