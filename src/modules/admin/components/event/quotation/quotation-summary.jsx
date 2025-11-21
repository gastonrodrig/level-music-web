import { useState, useMemo } from "react";
import { Box, Typography, IconButton, Collapse } from "@mui/material";
import { ExpandMore, ExpandLess } from "@mui/icons-material";

export const QuotationSummary = ({
  isDark,
  assignedServices = [],
  assignedEquipments = [],
  assignedWorkers = [],
  grandTotal = 0,
}) => {
  const [expandedServices, setExpandedServices] = useState(false);
  const [expandedEquipments, setExpandedEquipments] = useState(false);
  const [expandedWorkers, setExpandedWorkers] = useState(false);

  const servicesTotal = useMemo(
    () =>
      (assignedServices || []).reduce(
        (acc, s) => acc + (parseFloat(s.service_price) || 0),
        0
      ),
    [assignedServices]
  );

  const equipmentsTotal = useMemo(
    () =>
      (assignedEquipments || []).reduce(
        (acc, e) => acc + (parseFloat(e.equipment_price) || 0) * (Number(e.equipment_hours) || 0),
        0
      ),
    [assignedEquipments]
  );

  const workersTotal = useMemo(
    () =>
      (assignedWorkers || []).reduce(
        (acc, w) => acc + (parseFloat(w.worker_price) || 0) * (Number(w.worker_hours) || 0),
        0
      ),
    [assignedWorkers]
  );

  const Row = ({ left, right }) => (
    <Box sx={{ display: "flex", justifyContent: "space-between", py: 0.5 }}>
      <Typography fontSize={13} color="text.secondary">{left}</Typography>
      <Typography fontSize={13}>{right}</Typography>
    </Box>
  );

  const money = (n) => `S/ ${(Number(n) || 0).toFixed(2)}`;
  const lineTotal = (price, hours) => (parseFloat(price) || 0) * (Number(hours) || 0);

  return (
    <Box sx={{ p: 3, borderRadius: 3, bgcolor: isDark ? "#1f1e1e" : "#f5f5f5", my: 2 }}>
      <Typography sx={{ fontSize: 20, fontWeight: 500, mb: 2 }}>
        Resumen de la Asignación
      </Typography>

      {/* Servicios */}
      <Box sx={{ mb: 2 }}>
        <Box
          sx={{
            display: "flex", justifyContent: "space-between", alignItems: "center",
            cursor: "pointer",
            "&:hover": { bgcolor: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)" },
            p: 1, borderRadius: 1,
          }}
          onClick={() => setExpandedServices((v) => !v)}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography fontSize={14} color="text.secondary">
              + Servicios adicionales ({assignedServices.length})
            </Typography>
            <IconButton size="small">
              {expandedServices ? <ExpandLess /> : <ExpandMore />}
            </IconButton>
          </Box>
          <Typography fontSize={14}>{money(servicesTotal)}</Typography>
        </Box>

        <Collapse in={expandedServices}>
          <Box sx={{ ml: 2, mt: 1 }}>
            {assignedServices.length > 0 ? (
              assignedServices.map((s, i) => (
                <Row
                  key={s.id ?? `${s._id ?? "svc"}-${i}`}
                  left={`• ${s.name ?? s.service_type_name ?? "Servicio"}`}
                  right={money(lineTotal(s.service_price, 1))}
                />
              ))
            ) : (
              <Typography fontSize={13} color="text.secondary" sx={{ fontStyle: "italic" }}>
                No hay servicios asignados
              </Typography>
            )}
          </Box>
        </Collapse>
      </Box>

      {/* Equipos */}
      <Box sx={{ mb: 2 }}>
        <Box
          sx={{
            display: "flex", justifyContent: "space-between", alignItems: "center",
            cursor: "pointer",
            "&:hover": { bgcolor: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)" },
            p: 1, borderRadius: 1,
          }}
          onClick={() => setExpandedEquipments((v) => !v)}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography fontSize={14} color="text.secondary">
              + Equipos ({assignedEquipments.length})
            </Typography>
            <IconButton size="small">
              {expandedEquipments ? <ExpandLess /> : <ExpandMore />}
            </IconButton>
          </Box>
          <Typography fontSize={14}>{money(equipmentsTotal)}</Typography>
        </Box>

        <Collapse in={expandedEquipments}>
          <Box sx={{ ml: 2, mt: 1 }}>
            {assignedEquipments.length > 0 ? (
              assignedEquipments.map((e, i) => (
                <Row
                  key={e.id ?? `${e._id ?? "eq"}-${i}`}
                  left={`• ${e.name ?? "Equipo"} (${e.equipment_hours}h)`}
                  right={money(lineTotal(e.equipment_price, e.equipment_hours))}
                />
              ))
            ) : (
              <Typography fontSize={13} color="text.secondary" sx={{ fontStyle: "italic" }}>
                No hay equipos asignados
              </Typography>
            )}
          </Box>
        </Collapse>
      </Box>

      {/* Trabajadores */}
      <Box sx={{ mb: 3 }}>
        <Box
          sx={{
            display: "flex", justifyContent: "space-between", alignItems: "center",
            cursor: "pointer",
            "&:hover": { bgcolor: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)" },
            p: 1, borderRadius: 1,
          }}
          onClick={() => setExpandedWorkers((v) => !v)}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography fontSize={14} color="text.secondary">
              + Trabajadores ({assignedWorkers.length})
            </Typography>
            <IconButton size="small">
              {expandedWorkers ? <ExpandLess /> : <ExpandMore />}
            </IconButton>
          </Box>
          <Typography fontSize={14}>{money(workersTotal)}</Typography>
        </Box>

        <Collapse in={expandedWorkers}>
          <Box sx={{ ml: 2, mt: 1 }}>
            {assignedWorkers.length > 0 ? (
              assignedWorkers.map((w, i) => (
                <Row
                  key={w.id ?? `${w._id ?? "wk"}-${i}`}
                  left={`• ${(w.name ?? `${w.first_name ?? ""} ${w.last_name ?? ""}`.trim()) || "Trabajador"} (${w.worker_hours}h)`}
                  right={money(lineTotal(w.worker_price, w.worker_hours))}
                />
              ))
            ) : (
              <Typography fontSize={13} color="text.secondary" sx={{ fontStyle: "italic" }}>
                No hay trabajadores asignados
              </Typography>
            )}
          </Box>
        </Collapse>
      </Box>

      {/* Total */}
      <Box
        sx={{
          p: 2, borderRadius: 2,
          bgcolor: isDark ? "#2a2a2a" : "#e0e0e0",
          display: "flex", justifyContent: "space-between", alignItems: "center",
        }}
      >
        <Typography fontSize={16} fontWeight={600}>Total Estimado</Typography>
        <Typography fontSize={16} fontWeight={600}>{money(grandTotal)}</Typography>
      </Box>
    </Box>
  );
};
