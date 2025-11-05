import React from "react";
import {
  Box,
  Typography,
  Chip,
  Paper,
  Grid,
  useTheme,
} from "@mui/material";
import { Article, AccessTime } from "@mui/icons-material";
import { useQuotationStore } from "../../../../../hooks";
import {
  EventHistoryTable,
  EventVersionModal,
} from "../../../components/event/quotation/history";
import { formatDay } from "../../../../../shared/utils";

export const EventHistoryPage = () => {
  const theme = useTheme();
  const { selected } = useQuotationStore();

  const versions = selected?.versions ||
    selected?.history || [
      {
        version: "v3.0",
        date: "2025-11-04T14:30:00Z",
        changes:
          "Agregó 2 Parlantes JBL adicionales",
        amount: 8500,
        isCurrent: true,
        user: "Admin Principal",
        client: "Jazmin Ore",
        eventType: "Boda",
        eventDate: "2025-12-31",
      },
      { version: "v2.0", date: "2025-11-03T10:15:00Z", changes: "Incrementó cantidad de Iluminación LED de 6 a 8 unidades", amount: 7400, isCurrent: false },
      { version: "v1.0", date: "2025-11-01T16:45:00Z", changes: "Creación inicial de la cotización", amount: 6000, isCurrent: false },
    ];

  const currentVersion = versions.find((v) => v.isCurrent) || versions[0];

  const currency = (n) =>
    new Intl.NumberFormat("es-PE", { style: "currency", currency: "PEN" }).format(n || 0);

  const getClientName = () => {
    if (!selected) return currentVersion?.client || "—";
    if ((selected.client_type || "").toString().toLowerCase() === "persona") {
      return `${selected.first_name || selected.firstName || ""} ${selected.last_name || selected.lastName || ""}`.trim() || currentVersion?.client || "—";
    }
    return selected.company_name || selected.companyName || selected.client_name || currentVersion?.client || "—";
  };

  const top = {
    version: selected?.current_version || selected?.currentVersion || currentVersion?.version || "vN/A",
    lastUpdate:
      (selected?.updated_at || selected?.updatedAt)
        ? formatDay(selected?.updated_at || selected?.updatedAt, true)
        : currentVersion?.date
        ? formatDay(currentVersion.date, true)
        : "N/A",
    client: getClientName(),
    // aquí se prioriza el nombre/tipo del evento (texto), no el código
    eventType:
      selected?.event_type_name ||
      selected?.event_type ||
      selected?.eventType ||
      selected?.type ||
      (currentVersion?.eventType || "—"),
    eventDate:
      selected?.event_date || selected?.eventDate
        ? formatDay(selected?.event_date || selected?.eventDate)
        : currentVersion?.eventDate
        ? formatDay(currentVersion.eventDate)
        : "—",
    amount: selected?.estimated_price || selected?.estimatedPrice || selected?.total_price || currentVersion?.amount || 0,
  };

  const [openVersion, setOpenVersion] = React.useState(false);
  const [versionSelected, setVersionSelected] = React.useState(null);

  const handleView = (v) => {
    setVersionSelected(v);
    setOpenVersion(true);
  };

  return (
    <Box sx={{ px: 3, py: 2 }}>
      <Typography variant="h5" sx={{ mb: 1 }}>
        Historial de Versiones - Cotización {selected?.event_code || selected?.code || ""}
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 3 }}>
        Revisa todas las versiones guardadas de esta cotización
      </Typography>

      <Paper
        elevation={0}
        sx={{
          backgroundColor: theme.palette.background.paper,
          border: `1px solid ${theme.palette.divider}`,
          borderLeft: `6px solid ${theme.palette.warning.main}`, // <-- borde izquierdo restaurado
          borderRadius: 2,
          p: 2,
          mb: 3,
          position: "relative",
        }}
      >
        <Grid container spacing={2} alignItems="center">
          {/* izquierda: icono + título + última actualización */}
          <Grid item xs={12} md={6}>
            <Box display="flex" alignItems="flex-start" gap={2}>
              <Box
                sx={{
                  width: 44,
                  height: 44,
                  borderRadius: 1,
                  backgroundColor: theme.palette.action.selected,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Article fontSize="small" sx={{ color: theme.palette.warning.main }} />
              </Box>

              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                  Versión Vigente ({top.version})
                </Typography>
                <Typography color="text.secondary" sx={{ fontSize: 12, mt: 0.5, display: "flex", alignItems: "center", gap: 1 }}>
                  <AccessTime fontSize="small" sx={{ opacity: 0.8 }} />
                  Última actualización: {top.lastUpdate}
                </Typography>
              </Box>
            </Box>
          </Grid>

          {/* derecha: chip alineado a la derecha */}
          <Grid item xs={12} md={6} sx={{ textAlign: { xs: "left", md: "right" } }}>
            <Box sx={{ display: "inline-block" }}>
              <Chip label="Vigente" size="small" color="success" sx={{ fontWeight: 700 }} />
            </Box>
          </Grid>

          {/* fila con 4 columnas: Cliente / Tipo / Fecha / Monto */}
          <Grid item xs={6} md={3}>
            <Typography color="text.secondary" sx={{ fontSize: 12 }}>Cliente</Typography>
            <Typography sx={{ fontWeight: 600, mt: 0.5 }}>{top.client}</Typography>
          </Grid>

          <Grid item xs={6} md={3}>
            <Typography color="text.secondary" sx={{ fontSize: 12 }}>Tipo de Evento</Typography>
            <Typography sx={{ fontWeight: 600, mt: 0.5 }}>{top.eventType}</Typography>
          </Grid>

          <Grid item xs={6} md={3}>
            <Typography color="text.secondary" sx={{ fontSize: 12 }}>Fecha del Evento</Typography>
            <Typography sx={{ fontWeight: 600, mt: 0.5 }}>{top.eventDate}</Typography>
          </Grid>

          <Grid item xs={6} md={3}>
            <Typography color="text.secondary" sx={{ fontSize: 12 }}>Monto Total</Typography>
            <Typography sx={{ fontWeight: 700, mt: 0.5 }}>{currency(top.amount)}</Typography>
          </Grid>
        </Grid>
      </Paper>

      <Typography variant="h6" sx={{ mb: 1 }}>Todas las Versiones</Typography>

      <EventHistoryTable versions={versions} onView={handleView} />

      <EventVersionModal open={openVersion} onClose={() => setOpenVersion(false)} version={versionSelected || {}} />
    </Box>
  );
};
