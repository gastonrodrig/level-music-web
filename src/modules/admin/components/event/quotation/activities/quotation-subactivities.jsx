import {
  Box,
  Typography,
  IconButton,
  Paper,
  useTheme,
  Chip,
} from "@mui/material";
import { Edit, Delete, LocalOffer, AccountCircle, Inventory, Person } from "@mui/icons-material";

export const SubActivityItem = ({ subActivity, onEdit, onDelete }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const phase = {
    Planificación: "info",
    Ejecución: "success",
    Seguimiento: "warning",
  };
  console.log("SubActivityItem render:", subActivity);

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        mb: 1.5, 
        borderRadius: 2,
        bgcolor: isDark ? "#2d2d2d" : "#f9f9f9",
        border: `1px solid ${theme.palette.divider}`,
      }}
    >
      <Box display="flex" justifyContent="space-between" alignItems="center">
        {/* --- Lado Izquierdo: Información de la subactividad --- */}
        <Box>
          {/* Nombre y Chip de Precio */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5, 
              mb: 1,
            }}
          >
            <Typography
              variant="h6"
              fontSize={16}
              fontWeight={600}
              sx={{ m: 0 }}
            >
              {subActivity.subtask_name || subActivity.name}
            </Typography>

            <Chip
              label={subActivity.phase}
              size="small"
              color={phase[subActivity.phase]} 
              variant="outlined"
              sx={{ fontWeight: 400 }}
            />

            {/* ESTE ES EL CHIP DE PRECIO */}
            { subActivity.is_for_storehouse ? (
              <Chip
                icon={<Inventory sx={{ fontSize: "1rem", ml: 0.5 }} />}
                label={subActivity.subtask_name}
                size="small"
                color="primary" 
                variant="outlined"
                sx={{ fontWeight: 400, p: 1 }}
              />
            ) : (
              <Chip
                icon={<LocalOffer sx={{ fontSize: "1rem", ml: 0.5 }} />}
                label={`S/ ${Number(subActivity.price).toFixed(2)}`}
                size="small"
                color="success" 
                variant="outlined"
                sx={{ fontWeight: 400 }}
              />
            )}
          </Box>

          {/* --- Fila 2: Chip de Trabajador --- */}
          { subActivity.is_for_storehouse ? (
            <Box sx={{ display: "flex", gap: 1 }}>
              <Chip
                icon={<AccountCircle />}
                label={'Almacenero'}
                size="small"
                variant="outlined"
                sx={{
                  bgcolor: isDark
                    ? theme.palette.grey[700]
                    : theme.palette.grey[200],
                  color: "text.primary",
                  border: "none",
                  fontWeight: 500,
                  p: 1
                }}
              />

              {subActivity.storehouse_code && (
                <Chip
                  icon={<Inventory />}
                  label={subActivity.storehouse_code}
                  size="small"
                  color="warning"
                  variant="outlined"
                  sx={{ fontWeight: 500, p: 1 }}
                />
              )}
            </Box>
          ) : (
            <Chip
              icon={<AccountCircle />}
              label={subActivity.worker_name}
              size="small"
              variant="outlined"
              sx={{
                bgcolor: isDark
                  ? theme.palette.grey[700]
                  : theme.palette.grey[200],
                color: "text.primary",
                border: "none",
                fontWeight: 500,
              }}
            />
          )}
        </Box>

        {/* --- Lado Derecho: Botones de Acción --- */}
        <Box>
          <IconButton color="error" onClick={onDelete} title="Eliminar">
            <Delete />
          </IconButton>
        </Box>
      </Box>
    </Paper>
  );
};
