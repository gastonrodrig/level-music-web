import React from "react";
import {
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Box,
  Typography,
  Chip,
  useTheme,
} from "@mui/material";
import { Article, AccessTime, Visibility } from "@mui/icons-material";

export const EventHistoryTable = ({ versions = [], onView }) => {
  const theme = useTheme();

  const formatDay = (d, withTime) => {
    if (!d) return "N/A";
    const dt = new Date(d);
    const dd = String(dt.getDate()).padStart(2, "0");
    const mm = String(dt.getMonth() + 1).padStart(2, "0");
    const yyyy = dt.getFullYear();
    if (withTime) {
      const hh = String(dt.getHours()).padStart(2, "0");
      const min = String(dt.getMinutes()).padStart(2, "0");
      return `${dd}/${mm}/${yyyy} ${hh}:${min}`;
    }
    return `${dd}/${mm}/${yyyy}`;
  };

  const currency = (n) =>
    new Intl.NumberFormat("es-PE", { style: "currency", currency: "PEN" }).format(n || 0);

  return (
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
              <TableCell sx={{ verticalAlign: "middle", py: 2 }}>
                <Box display="flex" alignItems="center" gap={1}>
                  <Article fontSize="small" sx={{ color: theme.palette.text.primary, opacity: 0.9 }} />
                  <Typography sx={{ fontWeight: 700 }}>{v.version}</Typography>
                </Box>
              </TableCell>

              <TableCell sx={{ verticalAlign: "middle", py: 2, color: theme.palette.text.secondary }}>
                <Box display="flex" alignItems="center" gap={1}>
                  <AccessTime fontSize="small" sx={{ opacity: 0.85 }} />
                  <Typography>{v.date ? formatDay(v.date, true) : "N/A"}</Typography>
                </Box>
              </TableCell>

              <TableCell sx={{ verticalAlign: "middle", py: 2 }}>
                <Typography sx={{ maxWidth: 640, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {v.changes}
                </Typography>
              </TableCell>

              <TableCell align="right" sx={{ verticalAlign: "middle", py: 2, fontWeight: 700 }}>
                {currency(v.amount)}
              </TableCell>

              <TableCell sx={{ verticalAlign: "middle", py: 2 }}>
                <Chip label={v.isCurrent ? "Vigente" : "Histórico"} size="small" color={v.isCurrent ? "success" : "default"} />
              </TableCell>

              <TableCell align="center" sx={{ verticalAlign: "middle", py: 2 }}>
                <IconButton size="small" title="Ver versión" onClick={() => onView && onView(v)}>
                  <Visibility fontSize="small" />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
};