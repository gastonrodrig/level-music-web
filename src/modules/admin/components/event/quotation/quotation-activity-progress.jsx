import React from "react";
import { Box, LinearProgress, Grid, Paper, Typography } from "@mui/material";

export const ActivityProgressHeader = ({ totals = {}, total, percent }) => {
  return (
    <Paper sx={{ p: 2, mb: 2 }}>
      <Grid container alignItems="center" spacing={2}>
        <Grid item xs={12} md={9}>
          <Typography variant="h6" sx={{ mb: 2 }}>Progreso General</Typography>
          <Box sx={{ width: "100%" }}>
            <LinearProgress variant="determinate" value={percent ?? 0} sx={{ height: 8, borderRadius: 2 }} />
          </Box>
        </Grid>

        <Grid item xs={12} md={3} sx={{ textAlign: { xs: "left", md: "right" } }}>
          <Typography variant="h6">{(totals.completed ?? 0)} de {total ?? 0} completadas ({Math.round(percent ?? 0)}%)</Typography>
        </Grid>

        {/** chips summary */}
        <Grid item xs={12}>
          <Box
            sx={{
              display: "flex",
              gap: 2,
              flexWrap: "nowrap",      // evitar wrap para que ocupen en línea
              overflowX: "auto",       // permitir scroll horizontal si falta espacio
              mt: 2,
              py: 1,
            }}
          >
            {[
              { key: "pending", label: "Pendientes", color: "default" },
              { key: "in_progress", label: "En Progreso", color: "info" },
              { key: "completed", label: "Completadas", color: "success" },
              { key: "blocked", label: "Bloqueadas", color: "error" },
              { key: "evidence", label: "Con Evidencia", color: "primary" },
              { key: "assigned", label: "Asignadas", color: "secondary" },
            ].map((c) => (
              <Paper key={c.key} variant="outlined" sx={{
                  px: 3,
                  py: 1.25,
                  borderRadius: 4,          // más redondeado
                  minWidth: 160,           // ancho mínimo
                  flex: "1 0 160px",       // crecer para ocupar espacio horizontal
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  textAlign: "center",
                }}>
                <Typography variant="h6" >{c.label}</Typography>
                <Typography variant="h6">{totals[c.key] ?? 0}</Typography>
              </Paper>
            ))}
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
};