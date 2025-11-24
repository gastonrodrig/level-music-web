import { PaymentTableBase } from "../../ui";

export const WorkersAssignedTable = ({ data = [] }) => {
  const rows = data.map((w) => {
    const total = Number((w.hourly_rate).toFixed(2));
    const partial = Number((total * 0.5).toFixed(2)); 
    return {
      name: `${w.worker_first_name} ${w.worker_last_name}`,
      role: w.worker_role,
      hours: w.hours,
      rate: w.hourly_rate / w.hours,
      total,
      partial,
    };
  });

  const columns = [
    { key: "name", label: "Nombre" },
    { key: "role", label: "Rol" },
    { key: "hours", label: "Horas" },
    {
      key: "rate",
      label: "Precio/Hora",
      render: (v) => `S/ ${v.toLocaleString("es-PE", { minimumFractionDigits: 2 })}`,
    },
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
      title="Trabajadores Asignados"
      policy="Política: 50% anticipo"
      columns={columns}
      rows={rows}
      subtotalLabel="Subtotal Trabajadores:"
      getRowKey={(r) => r.name}
    />
  );
};
