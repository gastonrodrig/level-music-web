import {
  EquipmentAssignedTable,
  WorkersAssignedTable,
  AdditionalServicesTable,
  TasksAssignedTable,
} from ".";

export const PaymentTablesContainer = ({ selected }) => {
  const assignations = selected?.assignations || [];
  const tasks = selected?.tasks || [];

  const servicios = assignations.filter(
    (a) => a.resource_type === "Servicio Adicional"
  );
  const equipos = assignations.filter(
    (a) => a.resource_type === "Equipo"
  );
  const trabajadores = assignations.filter(
    (a) => a.resource_type === "Trabajador"
  );

  return (
    <>
      {servicios.length > 0 && <AdditionalServicesTable data={servicios} />}
      {equipos.length > 0 && <EquipmentAssignedTable data={equipos} />}
      {trabajadores.length > 0 && <WorkersAssignedTable data={trabajadores} />}
      {tasks.length > 0 && <TasksAssignedTable data={tasks} />}

    </>
  );
};
