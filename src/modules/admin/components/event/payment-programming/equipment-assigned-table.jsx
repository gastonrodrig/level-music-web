import { PaymentTableBase } from "../../ui";

export const EquipmentAssignedTable = ({ data = [] }) => {
  const rows = data.map((eq) => {
    const total = eq.hourly_rate;
    const partial = Number((total * 0.5).toFixed(2));
    return {
      name: eq.equipment_name,
      hours: eq.hours,
      unitPrice: eq.hourly_rate / eq.hours,
      total,
      partial,
    };
  });

  const columns = [
    { key: "name", label: "Equipo" },
    { key: "hours", label: "Horas" },
    {
      key: "unitPrice",
      label: "Precio/Hora",
      render: (v) => `S/. ${v.toLocaleString("es-PE", { minimumFractionDigits: 2 })}`,
    },
    {
      key: "total",
      label: "Precio Total",
      render: (v) => `S/. ${v.toLocaleString("es-PE", { minimumFractionDigits: 2 })}`,
    },
    {
      key: "partial",
      label: "Pago Parcial (50%)",
      render: (v) => `S/. ${v.toLocaleString("es-PE", { minimumFractionDigits: 2 })}`,
    },
  ];

  return (
    <PaymentTableBase
      title="Equipos Asignados"
      policy="Política: 50% anticipo"
      columns={columns}
      rows={rows}
      subtotalLabel="Subtotal Equipos:"
      getRowKey={(r) => r.name}
    />
  );
};
