import { useState, useEffect } from "react";
import { Box, Typography, useTheme, Button } from "@mui/material";
import { useQuotationStore } from "../../../../hooks";
import {
  DashboardIndicators,
  DashboardCharts,
  DashboardCalendar,
} from "../../components";

export const DashboardPage = () => {
  const theme = useTheme();

  const [activeTab, setActiveTab] = useState("indicadores");

  const {
    dashboardData,
    dashboardList,
    graficperMonthList,
    graficperMonth,
    eventTypes,
    eventType,
  } = useQuotationStore();

  useEffect(() => {
    dashboardList();
    eventTypes();
  }, []);

  return (
    <Box
      sx={{
        p: { xs: 0, md: 1.5 },
        display: "flex",
        flexDirection: "column",
        gap: 1,
      }}
    >
      <Box>
        <Typography
          variant="h4"
          sx={{ fontWeight: "bold", color: theme.palette.text.primary }}
        >
          Dashboard de Administrador
        </Typography>
        <Typography
          fontSize={16}
          sx={{ color: theme.palette.text.secondary, mt: 1, fontWeight: 400 }}
        >
          Visualiza en tiempo real el estado de los eventos, citas
          y órdenes pendientes dentro de la plataforma
        </Typography>
      </Box>

      {/* Tabs */}
      <Box
        sx={{
          display: "flex",
          gap: 2,
          py: 2,
        }}
      >
        <Button
          variant="contained"
          onClick={() => setActiveTab("indicadores")}
          sx={{
            borderRadius: 2,
            color: "white",
            bgcolor:
              activeTab === "indicadores"
                ? theme.palette.primary.main
                : "#1f1e1e",
            textTransform: "none",
            fontSize: 15,
            boxShadow: "none",
          }}
        >
          Indicadores
        </Button>

        <Button
          variant="contained"
          onClick={() => setActiveTab("graficos")}
          sx={{
            borderRadius: 2,
            color: "white",
            bgcolor:
              activeTab === "graficos" ? theme.palette.primary.main : "#1f1e1e",
            textTransform: "none",
            fontSize: 15,
            boxShadow: "none",
          }}
        >
          Gráficos
        </Button>

        <Button
          variant="contained"
          onClick={() => setActiveTab("calendario")}
          sx={{
            borderRadius: 2,
            color: "white",
            bgcolor:
              activeTab === "calendario"
                ? theme.palette.primary.main
                : "#1f1e1e",
            textTransform: "none",
            fontSize: 15,
            boxShadow: "none",
          }}
        >
          Calendario
        </Button>
      </Box>

      {/* Indicadores */}
      {activeTab === "indicadores" && (
        <DashboardIndicators dashboardData={dashboardData} />
      )}

      {/* Gráficos */}
      {activeTab === "graficos" && (
        <DashboardCharts
          graficperMonth={graficperMonth}
          eventType={eventType}
          graficperMonthList={graficperMonthList}
          eventTypeList={eventTypes}
        />
      )}

      {/* Calendario */}
      {activeTab === "calendario" && <DashboardCalendar />}
    </Box>
  );
};
