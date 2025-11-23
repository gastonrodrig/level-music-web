import { PaymentTableBase } from "../../ui";

export const TasksAssignedTable = ({ data = [] }) => {
  const rows = data.map((task) => {
    // Sumar el precio de todas las subtareas
    const total = task.subtasks?.reduce((acc, subtask) => {
      return acc + (subtask.price || 0);
    }, 0) || 0;
    
    const totalFormatted = Number(total.toFixed(2));
    const partial = Number((totalFormatted * 0.5).toFixed(2)); // 50% del total

    return {
      name: task.name || "Sin nombre",
      total: totalFormatted,
      partial,
    };
  });

  const columns = [
    { key: "name", label: "Actividad" },
    {
      key: "total",
      label: "Precio Total",
      render: (v) => `S/ ${v.toLocaleString("es-PE", { minimumFractionDigits: 2 })}`,
    },
    {
      key: "partial",
      label: "Pago Parcial (50%)",
      render: (v) => `S/ ${v.toLocaleString("es-PE", { minimumFractionDigits: 2 })}`,
    },
  ];

  return (
    <PaymentTableBase
      title="Actividades Programadas"
      policy="Política: 50% anticipo"
      columns={columns}
      rows={rows}
      subtotalLabel="Subtotal Actividades:"
      getRowKey={(r) => r.name}
    />
  );
};