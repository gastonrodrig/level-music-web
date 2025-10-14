import { PaymentTableBase } from "../../ui";

export const AdditionalServicesTable = ({ data = [] }) => {
  const rows = data.map((s) => {
    const total = s.hourly_rate * s.hours;
    const required = s.payment_percentage_required;
    const applied = required < 50 ? 50 : required;
    const partial = Number((total * (applied / 100)).toFixed(2));

    return {
      service: s.service_type_name,
      total,
      required,
      applied,
      partial,
    };
  });

  const getRequiredColor = (v) => {
    if (!v && v !== 0) return "#E0E0E0";
    if (v < 50) return "#FB8C00";
    if (v >= 50 && v < 100) return "#FFB300";
    return "#F57C00";
  };

  const getAppliedColor = (v) => {
    if (!v && v !== 0) return "#E0E0E0";
    if (v === 100) return "#F57C00";
    return "#42A5F5";
  };

  const columns = [
    { key: "service", label: "Servicio" },
    {
      key: "total",
      label: "Precio Total",
      render: (v) =>
        `S/ ${v.toLocaleString("es-PE", { minimumFractionDigits: 2 })}`,
    },
    {
      key: "required",
      label: "% Requerido",
      render: (v) =>
        v || v === 0 ? (
          <span style={{ color: getRequiredColor(v), fontWeight: 500 }}>
            {`${v}%`}
          </span>
        ) : (
          "-"
        ),
    },
    {
      key: "applied",
      label: "% Aplicado",
      render: (v) =>
        v || v === 0 ? (
          <span style={{ color: getAppliedColor(v), fontWeight: 500 }}>
            {`${v}%`}
          </span>
        ) : (
          "-"
        ),
    },
    {
      key: "partial",
      label: "Pago Parcial",
      render: (v) =>
        `S/. ${v.toLocaleString("es-PE", { minimumFractionDigits: 2 })}`,
    },
  ];

  return (
    <PaymentTableBase
      title="Servicios Adicionales"
      policy="Política: 50% mínimo, ajustable según proveedor"
      columns={columns}
      rows={rows}
      subtotalLabel="Subtotal Servicios Adicionales:"
      getRowKey={(r) => r.service}
    />
  );
};
