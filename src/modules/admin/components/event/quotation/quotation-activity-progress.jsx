import React from "react";
import { Box, LinearProgress, Grid, Paper, Typography,useTheme } from "@mui/material";

export const ActivityProgressHeader = ({ totals = {}, total, percent }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  const summaryChips = [
    // Estados (Status)
    { key: "pending", label: "Pendientes", color: "default", count: totals.pending },
    { key: "completed", label: "Completadas", color: "success", count: totals.completed },
    // Fases (Phases)
    { key: "planning", label: "Planificación", color: "info", count: totals.planning },
    { key: "execution", label: "Ejecución", color: "warning", count: totals.execution },
    { key: "tracking", label: "Seguimiento", color: "primary", count: totals.tracking },
    // Extras
    { key: "assigned", label: "Asignadas", color: "secondary", count: totals.assigned },
  ];

  return (
    <Paper sx={{ p: 2, mb: 2, boxShadow: 'none' }}>
      <Grid container alignItems="center" spacing={2}>
        <Grid item xs={12} md={9}>
          <Typography variant="h6" sx={{ mb: 2 }}>Progreso General ({percent}%)</Typography>
          <Box sx={{ width: "100%" }}>
            <LinearProgress 
                variant="determinate" 
                value={percent ?? 0} 
                color={percent === 100 ? "success" : "primary"}
                sx={{ height: 8, borderRadius: 2 }} 
            />
          </Box>
        </Grid>

        <Grid item xs={12} md={3} sx={{ textAlign: { xs: "left", md: "right" } }}>
          <Typography variant="h6">
            {totals.completed} / {total} Subtareas
          </Typography>
        </Grid>

        <Grid item xs={12}>
          <Box sx={{ display: "flex", gap: 2, overflowX: "auto", mt: 2, py: 1 }}>
            {summaryChips.map((c) => (
              <Paper key={c.key} variant="outlined" sx={{
                px: 3, py: 1.25, borderRadius: 4, minWidth: 140,
                display: "flex", flexDirection: "column", alignItems: "center",
                bgcolor: isDark ? "#1f1e1e" : "#f5f5f5",
                borderLeft: `4px solid ${theme.palette[c.color]?.main || 'grey'}` // Borde decorativo
              }}>
                <Typography variant="caption" color="text.secondary" sx={{textTransform: 'uppercase', fontWeight: 'semibold'}}>
                    {c.label}
                </Typography>
                <Typography variant="h5" sx={{fontWeight: 'bold'}}>
                    {c.count ?? 0}
                </Typography>
              </Paper>
            ))}
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
};