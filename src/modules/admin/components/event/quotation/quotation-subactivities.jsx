

import { Box, Typography, IconButton, Paper, useTheme,Chip } from "@mui/material";
import { Edit, Delete, LocalOffer, AccountCircle } from "@mui/icons-material";

export const SubActivityItem = ({ subActivity, onEdit, onDelete }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  return (
    <Paper 
      elevation={0}
      sx={{
        p: 2, // Padding interno
        mb: 1.5, // Margen inferior
        borderRadius: 2,
        bgcolor: isDark ? "#2d2d2d" : "#f9f9f9", // Un color ligeramente diferente al fondo
        border: `1px solid ${theme.palette.divider}`
      }}
    >
      <Box 
        display="flex" 
        justifyContent="space-between" 
        alignItems="center"
      >
        {/* --- Lado Izquierdo: Información de la subactividad --- */}
        <Box>

          {/* --- Fila 1: Nombre y Chip de Precio --- */}
          <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1.5, // <-- Espacio entre nombre y chip
              mb: 1 // <-- Margen inferior
            }}
          >
            <Typography variant="h6" fontSize={16} fontWeight={600} sx={{ m: 0 }}>
              {subActivity.nombre}
            </Typography>
            
            {/* ESTE ES EL CHIP DE PRECIO */}
            <Chip
              icon={<LocalOffer sx={{ fontSize: '1rem', ml: 0.5 }} />}
              label={`S/ ${Number(subActivity.precio).toFixed(2)}`}
              size="small"
              color="success" // Verde para el precio
              variant="outlined"
              sx={{ fontWeight: 600 }}
            />
          </Box>

          {/* --- Fila 2: Chip de Trabajador --- */}
          <Chip
            icon={<AccountCircle />}
            label={subActivity.trabajador}
            size="small"
            variant="outlined"
            sx={{ 
              bgcolor: isDark ? theme.palette.grey[700] : theme.palette.grey[200],
              color: 'text.primary',
              border: 'none',
              fontWeight: 500,
            }}
          />
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