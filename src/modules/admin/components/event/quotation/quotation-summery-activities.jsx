import { Box, Typography, IconButton, Collapse } from "@mui/material";
import { useState, useMemo } from "react";
import { useTheme } from "@mui/material/styles";

export const QuotationActivitiesSummery = ({amount = [] }) => {
const theme = useTheme();
const isDark = theme.palette.mode === "dark";

 const total = useMemo(() => {
    if (!amount) return 0;
    
    return amount.reduce((acc, item) => {
      // Opción A: Si 'item' es un número directo (ej: [10, 20])
      if (typeof item === 'number') return acc + item;

      // Opción B: Si 'item' es un objeto (ej: [{price: 10}, {price: 20}])
      // Cambia 'price' por la propiedad real que uses en tu base de datos
      const valor = Number(item.price || item.amount || 0); 
      
      return acc + valor;
    }, 0);
  }, [amount]);

return (
<Box sx={{ p: 3, borderRadius: 3, bgcolor: isDark ? "#1f1e1e" : "#f5f5f5", my: 2 }}>
    <Box sx={{
            display: "flex", justifyContent: "space-between", alignItems: "center",
            cursor: "pointer",
            "&:hover": { bgcolor: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)" },
            p: 1, borderRadius: 1,
          }}>
    <Box sx={{ display: "flex",flexDirection: "column", alignItems: "start", gap: 1  }}>
      <Typography sx={{ fontSize: 18, fontWeight: 500}}>
        Resumen de actividades
      </Typography>
      <Typography sx={{ color: "text.secondary", fontSize: 14 }}>
        Total de actividades con precio      
        </Typography>
</Box>
<Typography fontSize={14}>S/ {total.toFixed(2)}</Typography>
</Box>
</Box>

)
}