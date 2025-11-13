import { Box, Typography, Collapse,IconButton,useTheme, Button } from "@mui/material";
import { AddCircleOutline, Payments,History, Add, Delete } from "@mui/icons-material";
import { useState, useMemo } from "react";
import { useForm, FormProvider, useFieldArray } from "react-hook-form";
import { useScreenSizes } from "../../../../../shared/constants/screen-width";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { SubActivityItem } from "../../../components";

export const QuotationsFatherSubActivites = ({actividades = []}) => {
const theme = useTheme();
const isDark = theme.palette.mode === "dark";
const navigate = useNavigate();
const dispatch = useDispatch();
const { isMd } = useScreenSizes();

const subactividades = actividades.subactividades || [];

  // --- Funciones de ejemplo para los botones ---
  const handleAddSubActivity = () => {
    console.log("Agregando sub-actividad a:", actividades.nombre);
  };

  const handleDeleteActivity = () => {
    console.log("Eliminando actividad padre:", actividades.nombre);
  };

  const handleEditSub = (sub) => {
    console.log("Editando sub-actividad:", sub.nombre);
  };

  const handleDeleteSub = (sub) => {
    console.log("Eliminando sub-actividad:", sub.nombre);
  };
return (
<Box
      sx={{
        p: 3,
        borderRadius: 3,
        bgcolor: isDark ? "#1f1e1e" : "#f5f5f5",
        mb: 3,
      }}
    >
      {/* === ENCABEZADO === */}
      <Box
        display="flex"
        flexDirection="row"
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", md: "flex-start" }}
        mb={2}
        gap={3}
      >
        {/* Izquierda: título, botón y estado */}
        <Box display="flex" flexDirection="column" alignItems="flex-start">
          <Box display="flex" flexDirection="column" alignItems="start" gap={1} alignContent="center">
            <Typography variant="h6" fontWeight={300}>
            {actividades.nombre}
            </Typography>
            <Typography>
            {actividades.descripcion}
            </Typography>
            <Typography>
            Creada el : {actividades.fechaCreacion}    
            </Typography>
          </Box>
        </Box>

        {/* Contenedor de botones, evita anidar <button> */}
        <Box display="flex" gap={1} flexDirection={"row"}>
          {/* Botón eliminar detalle */}
         
          {/* Botón agregar campo */}
          {!isMd ? (
            <IconButton
              color="primary"
              
              sx={{
                bgcolor: theme.palette.primary.main,
                color: "#fff",
                borderRadius: "12px",
                "&:hover": {
                  bgcolor: theme.palette.primary.dark,
                },
              }}
            >
              <Add />
            </IconButton>
          ) : (
            <Button
              variant="contained"
              
              startIcon={<Add />}
              sx={{
                textTransform: "none",
                borderRadius: 2,
                color: "#fff",
                fontWeight: 200,
              }}
            >
              Agregar Subactividad
            </Button>
          )}
           {!isMd ? (
            <IconButton color="error"  >
              <Delete />
            </IconButton>
          ) : (
            <Button
              variant="contained"
              
              startIcon={<Delete />}
              color="error"
              sx={{
                textTransform: "none",
                borderRadius: 2,
                color: "#fff",
                fontWeight: 600,
              }}
              
            >
              
            </Button>
          )}
        </Box>
        
      </Box>

      <Box sx={{ 
        mt: 3, 
        borderTop: `1px solid ${theme.palette.divider}`, 
        pt: 2 
      }}>
        <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>
          Sub-Actividades ({subactividades.length})
        </Typography>
        
        {subactividades.length > 0 ? (
          // Si hay subactividades, las mapeamos
          subactividades.map((sub, index) => (
            <SubActivityItem 
              key={index} 
              subActivity={sub} 
              onEdit={() => handleEditSub(sub)} 
              onDelete={() => handleDeleteSub(sub)}
            />
          ))
        ) : (
          // Si no hay, mostramos un mensaje
          <Typography color="text.secondary" sx={{ fontStyle: 'italic' }}>
            No hay sub-actividades registradas para esta actividad.
          </Typography>
        )}
      </Box>


</Box>)
}