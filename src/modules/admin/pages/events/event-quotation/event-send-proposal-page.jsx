import React from "react";
import { Box, Typography, Grid, Button, useTheme } from "@mui/material";
import { Send, Description } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useQuotationStore } from "../../../../../hooks";
import { useScreenSizes } from "../../../../../shared/constants/screen-width";
import { EventSummaryCard } from "../../../../../shared/ui/components/common/multiples/event-summary-card";
import { ResourceTabs } from "../../../../../shared/ui/components/common/multiples/resource-tabs-card";

export const EventSendProposalPage = () => {
  const { selected } = useQuotationStore();
  const { isSm, isMd } = useScreenSizes();
  const theme = useTheme();
  const navigate = useNavigate();
  const isDark = theme.palette.mode === "dark";

  const formatCurrency = (v) =>
    `S/ ${Number(v || 0).toLocaleString("es-PE", { minimumFractionDigits: 2 })}`;

  // Console log para ver toda la estructura de selected
  React.useEffect(() => {
    if (selected) {
      console.log("=== SELECTED COMPLETO ===");
      console.log(JSON.stringify(selected, null, 2));
      console.log("=== TASKS ===");
      console.log(selected.tasks);
      console.log("=== ASSIGNATIONS ===");
      console.log(selected.assignations);
      
      console.log("\n=== ANÁLISIS DE PRECIOS ===");
      
      // Calcular total de tasks
      const tasksTotal = selected.tasks?.reduce(
        (total, task) => {
          const taskSubtotal = (task.subtasks || []).reduce((sum, sub) => sum + (sub.price || 0), 0);
          console.log(`Task: ${task.name} - Subtotal: S/ ${taskSubtotal}`);
          return total + taskSubtotal;
        },
        0
      ) || 0;
      console.log(`Total de TASKS: S/ ${tasksTotal}`);
      
      // Calcular total de assignations
      const assignationsTotal = selected.assignations?.reduce((total, assign) => {
        const assignPrice = (assign.hours || 0) * (assign.hourly_rate || 0);
        console.log(`Assignation: ${assign.service_provider_name || assign.name} - Hours: ${assign.hours}, Rate: ${assign.hourly_rate}, Total: S/ ${assignPrice}`);
        return total + assignPrice;
      }, 0) || 0;
      console.log(`Total de ASSIGNATIONS: S/ ${assignationsTotal}`);
      
      console.log(`\nESTIMATED_PRICE del backend: S/ ${selected.estimated_price}`);
      console.log(`Suma manual (tasks + assignations): S/ ${tasksTotal + assignationsTotal}`);
     }
  }, [selected]);

  if (!selected) {
    return (
      <Box sx={{ px: { xs: 2, sm: 4 }, py: 6, maxWidth: 1200, mx: "auto" }}>
        <Typography variant="h5">Enviar Propuesta</Typography>
        <Typography color="text.secondary" sx={{ mt: 1 }}>
          Selecciona una cotización para continuar.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ px: { xs: 2, sm: 4 }, py: { xs: 3, md: 4 }, maxWidth: 1200, mx: "auto" }}>
      <Typography variant="h4" sx={{ mb: 1, fontWeight: 700 }}>
        Enviar Propuesta
      </Typography>
      <Typography sx={{ color: "text.secondary", mb: 3 }}>
        Revisa y envía la propuesta del evento al cliente.
      </Typography>

      {/* Event summary */}
      <EventSummaryCard selected={selected} />

      {/* Actividades del Evento */}
      <Box sx={{ mt: 4 }}>
        <Box
          sx={{
            p: 3,
            borderRadius: 2,
            bgcolor: isDark ? "#1f1e1e" : "#f5f5f5",
            border: `1px solid ${theme.palette.divider}`,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", mb: 3, gap: 1 }}>
            <Description />
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Actividades del Evento
            </Typography>
          </Box>

          {Array.isArray(selected?.tasks) && selected.tasks.length > 0 ? (
            <>
              {selected.tasks.map((task, taskIdx) => {
                const taskTotal = (task.subtasks || []).reduce(
                  (sum, sub) => sum + (sub.price || 0),
                  0
                );
                return (
                  <Box key={task._id || taskIdx} sx={{ mb: 2 }}>
                    {/* Tarea principal */}
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        p: 2,
                        borderRadius: 2,
                        bgcolor: isDark ? "#141414" : "#fff",
                        borderLeft: `4px solid ${theme.palette.primary.main}`,
                      }}
                    >
                      <Box>
                        <Typography sx={{ fontWeight: 600, fontSize: 15 }}>
                          {task.name || "Tarea"}
                        </Typography>
                        <Typography color="text.secondary" sx={{ fontSize: 13, mt: 0.5 }}>
                          {(task.subtasks || []).length} tareas
                        </Typography>
                      </Box>
                      <Typography sx={{ fontWeight: 700, fontSize: 16 }}>
                        {formatCurrency(taskTotal)}
                      </Typography>
                    </Box>
                  </Box>
                );
              })}

              {/* Subtotal */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  pt: 2,
                  mt: 3,
                  borderTop: `1px solid ${theme.palette.divider}`,
                }}
              >
                <Typography sx={{ fontWeight: 700, fontSize: 16 }}>
                  Subtotal Actividades
                </Typography>
                <Typography sx={{ fontWeight: 700, fontSize: 18 }}>
                  {formatCurrency(
                    selected.tasks.reduce(
                      (total, task) =>
                        total +
                        (task.subtasks || []).reduce((sum, sub) => sum + (sub.price || 0), 0),
                      0
                    )
                  )}
                </Typography>
              </Box>
            </>
          ) : (
            <Typography color="text.secondary">
              No hay actividades registradas para este evento.
            </Typography>
          )}
        </Box>
      </Box>

      {/* Recursos Asignados */}
      <Box sx={{ mt: 4 }}>
        <ResourceTabs assignations={selected?.assignations || []} />
      </Box>

      {/* Resumen y Acciones */}
      <Box sx={{ mt: 3 }}>
        <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>
          Resumen y Acciones
        </Typography>
        <Box
          sx={{
            p: 3,
            borderRadius: 2,
            bgcolor: isDark ? "#1f1e1e" : "#f5f5f5",
            border: `1px solid ${theme.palette.divider}`,
          }}
        >
          <Typography sx={{ mb: 1 }}>
            Total estimado:{" "}
            <strong>
              S/ {(selected?.estimated_price || 0).toLocaleString("es-PE", { minimumFractionDigits: 2 })}
            </strong>
          </Typography>

          <Typography color="text.secondary" sx={{ mb: 2 }}>
            Verifica los detalles antes de enviar la propuesta al cliente.
          </Typography>

          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
            <Button
              variant="contained"
              startIcon={<Send />}
              sx={{
                backgroundColor: theme.palette.primary.main,
                color: theme.palette.getContrastText(theme.palette.primary.main),
                textTransform: "none",
                px: 3,
                py: 1.25,
                borderRadius: 2,
                "&:hover": { backgroundColor: theme.palette.primary.dark },
              }}
              onClick={() => navigate(`/admin/quotations/send-proposal/preview`)}
            >
              Enviar Propuesta
            </Button>

            <Button
              variant="outlined"
              color="inherit"
              sx={{
                textTransform: "none",
                px: 3,
                py: 1.25,
                borderRadius: 2,
                borderColor: theme.palette.divider,
                color: "text.primary",
              }}
              onClick={() => navigate("/admin/quotations")}
            >
              Volver
            </Button>
          </Box>
        </Box>
      </Box>

      {/* Floating action button */}
      {!isSm && (
        <Box
          sx={{
            position: "fixed",
            right: 24,
            bottom: 24,
            zIndex: 1300,
          }}
        >
          <Button
            variant="contained"
            startIcon={<Send />}
            sx={{
              backgroundColor: theme.palette.primary.main,
              color: theme.palette.getContrastText(theme.palette.primary.main),
              boxShadow: "0 6px 18px rgba(0,0,0,0.25)",
              borderRadius: 3,
              textTransform: "none",
              px: 2.5,
              py: 1.25,
              "&:hover": { backgroundColor: theme.palette.primary.dark },
            }}
            onClick={() => navigate(`/admin/quotations/send-proposal/preview`)}
          >
            Enviar Propuesta
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default EventSendProposalPage;
