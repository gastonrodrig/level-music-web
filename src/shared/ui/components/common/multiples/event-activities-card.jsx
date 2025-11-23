import { Box, Typography, useTheme } from "@mui/material";
import { Description } from "@mui/icons-material";

export const EventActivitiesCard = ({ tasks = [] }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  // Subtotal global
  const subtotal = tasks.reduce(
    (total, task) =>
      total +
      (task.subtasks || []).reduce(
        (sum, sub) => sum + (sub.price || 0),
        0
      ),
    0
  );

  return (
    <Box sx={{ mt: 4 }}>
      <Box
        sx={{
          p: 3,
          borderRadius: 2,
          bgcolor: isDark ? "#1f1e1e" : "#f5f5f5",
          border: `1px solid ${theme.palette.divider}`,
        }}
      >
        {/* Header */}
        <Box sx={{ display: "flex", alignItems: "center", mb: 3, gap: 1 }}>
          <Description />
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Actividades del Evento
          </Typography>
        </Box>

        {/* Si no hay tareas */}
        {tasks.length === 0 ? (
          <Typography color="text.secondary">
            No hay actividades registradas para este evento.
          </Typography>
        ) : (
          <>
            {/* Lista de tareas */}
            {tasks.map((task, idx) => {
              const taskTotal = (task.subtasks || []).reduce(
                (sum, sub) => sum + (sub.price || 0),
                0
              );

              return (
                <Box key={task._id || idx} sx={{ mb: 2 }}>
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
                      <Typography
                        color="text.secondary"
                        sx={{ fontSize: 13, mt: 0.5 }}
                      >
                        {(task.subtasks || []).length} tareas
                      </Typography>
                    </Box>

                    <Typography sx={{ fontWeight: 700, fontSize: 16 }}>
                      {taskTotal === 0 ? "Sin costo" : `S/. ${taskTotal}`}
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
                {subtotal === 0 ? "Sin costo" : `S/. ${subtotal}`}
              </Typography>
            </Box>
          </>
        )}
      </Box>
    </Box>
  );
};
