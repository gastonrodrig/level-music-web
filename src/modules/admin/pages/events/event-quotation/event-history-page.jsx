import React from "react";
import {
  Box,
  Typography,
  Chip,
  Paper,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  IconButton,
  useTheme,
  Grid,
} from "@mui/material";
import { Visibility, Article, AccessTime } from "@mui/icons-material";
import { useQuotationStore } from "../../../../../hooks";
import { formatDay } from "../../../../../shared/utils";

export const EventHistoryPage = () => {
  const theme = useTheme();
  const { selected } = useQuotationStore();

  const versions =
    selected?.versions ||
    selected?.history ||
    [
      {
        version: "v3.0",
        date: "2025-11-04T14:30:00Z",
        changes: "Agregó 2 Parlantes JBL adicionales +2 más",
        amount: 8500,
        isCurrent: true,
      },
      {
        version: "v2.0",
        date: "2025-11-03T10:15:00Z",
        changes: "Incrementó cantidad de Iluminación LED de 6 a 8 unidades +2 más",
        amount: 7400,
        isCurrent: false,
      },
      {
        version: "v1.0",
        date: "2025-11-01T16:45:00Z",
        changes: "Creación inicial de la cotización",
        amount: 6000,
        isCurrent: false,
      },
    ];

  const current = versions.find((v) => v.isCurrent);

  const currency = (n) =>
    new Intl.NumberFormat("es-PE", { style: "currency", currency: "PEN" }).format(n || 0);

  return (
    <Box sx={{ px: 3, py: 2 }}>
      <Typography variant="h5" sx={{ mb: 1 }}>
        Historial de Versiones - Cotización {selected?.event_code || ""}
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 3 }}>
        Revisa todas las versiones guardadas de esta cotización
      </Typography>

      {/* Tarjeta superior (alineada) */}
      <Paper
        elevation={0}
        sx={{
          backgroundColor: theme.palette.background.paper,
          border: `1px solid ${theme.palette.divider}`,
          borderLeft: `6px solid ${theme.palette.warning.main}`,
          borderRadius: 2,
          p: 2,
          mb: 3,
        }}
      >
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <Box>
              <Typography
                variant="subtitle2"
                sx={{ fontWeight: 700, display: "flex", alignItems: "center", gap: 1 }}
              >
                <Article fontSize="small" sx={{ color: theme.palette.warning.main }} />
                Versión Vigente ({current?.version || "N/A"})
              </Typography>

              <Typography color="text.secondary" sx={{ fontSize: 12, mt: 0.5, display: "flex", gap: 1, alignItems: "center" }}>
                <AccessTime fontSize="small" sx={{ opacity: 0.8 }} />
                Última actualización: {formatDay(current?.date)}
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={6} md={2}>
            <Typography color="text.secondary" sx={{ fontSize: 12 }}>
              Cliente
            </Typography>
            <Typography sx={{ fontWeight: 600, mt: 0.5 }}>
              {selected?.client_type === "Persona"
                ? `${selected?.first_name || ""} ${selected?.last_name || ""}`
                : selected?.company_name || "N/A"}
            </Typography>
          </Grid>

          <Grid item xs={6} md={2}>
            <Typography color="text.secondary" sx={{ fontSize: 12 }}>
              Fecha del Evento
            </Typography>
            <Typography sx={{ fontWeight: 600, mt: 0.5 }}>
              {selected?.event_date ? formatDay(selected.event_date) : "N/A"}
            </Typography>
          </Grid>

          <Grid item xs={6} md={2} sx={{ display: "flex", alignItems: "center", justifyContent: "flex-end" }}>
            <Box textAlign="right">
              <Typography color="text.secondary" sx={{ fontSize: 12 }}>
                Monto Total
              </Typography>
              <Typography sx={{ fontWeight: 600, mt: 0.5 }}>
                {currency(selected?.estimated_price || current?.amount)}
              </Typography>
            </Box>

            <Box ml={2}>
              <Chip label="Actual" size="small" color="success" sx={{ fontWeight: 700 }} />
            </Box>
          </Grid>
        </Grid>
      </Paper>

      <Typography variant="h6" sx={{ mb: 1 }}>
        Todas las Versiones
      </Typography>

      <Paper
        elevation={0}
        sx={{
          mt: 1,
          backgroundColor: theme.palette.background.paper,
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: 2,
          overflow: "hidden",
        }}
      >
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: theme.palette.action.hover }}>
              <TableCell sx={{ color: theme.palette.text.secondary }}>Versión</TableCell>
              <TableCell sx={{ color: theme.palette.text.secondary }}>Fecha</TableCell>
              <TableCell sx={{ color: theme.palette.text.secondary }}>Cambios Principales</TableCell>
              <TableCell align="right" sx={{ color: theme.palette.text.secondary }}>
                Monto
              </TableCell>
              <TableCell sx={{ color: theme.palette.text.secondary }}>Estado</TableCell>
              <TableCell align="center" sx={{ color: theme.palette.text.secondary }}>
                Acciones
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {versions.map((v) => (
              <TableRow
                key={v.version}
                sx={{
                  backgroundColor: theme.palette.background.default,
                  borderLeft: v.isCurrent ? `4px solid ${theme.palette.success.main}` : "4px solid transparent",
                  "&:not(:last-child)": { borderBottom: `1px solid ${theme.palette.divider}` },
                }}
              >
                <TableCell sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Article fontSize="small" sx={{ color: theme.palette.text.primary, opacity: 0.9 }} />
                  <Typography sx={{ fontWeight: 700 }}>{v.version}</Typography>
                </TableCell>

                <TableCell sx={{ display: "flex", alignItems: "center", gap: 1, color: theme.palette.text.secondary }}>
                  <AccessTime fontSize="small" sx={{ opacity: 0.85 }} />
                  {v.date ? formatDay(v.date) : "N/A"}
                </TableCell>

                <TableCell>
                  <Typography sx={{ maxWidth: 420, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {v.changes}
                  </Typography>
                </TableCell>

                <TableCell align="right" sx={{ fontWeight: 700 }}>
                  {currency(v.amount)}
                </TableCell>

                <TableCell>
                  <Chip label={v.isCurrent ? "Actual" : "Histórico"} size="small" color={v.isCurrent ? "success" : "default"} />
                </TableCell>

                <TableCell align="center">
                  <IconButton size="small" title="Ver versión">
                    <Visibility fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
}