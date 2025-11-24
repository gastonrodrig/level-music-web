import { useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  useTheme,
} from "@mui/material";
import { CalendarMonth, TrendingUp } from "@mui/icons-material";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from "recharts";
import { Controller, useForm } from "react-hook-form";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { monthNames as monthsArray } from "../../constants";
import dayjs from "dayjs";

const DEFAULT_START = dayjs("2025-01-01");
const DEFAULT_END   = dayjs("2025-12-31");

export const DashboardCharts = ({
  graficperMonth,
  eventType,
  graficperMonthList,
  eventTypeList
}) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  const { control, handleSubmit } = useForm({
    defaultValues: {
      startDate: DEFAULT_START,
      endDate: DEFAULT_END,
    },
  });

  useEffect(() => {
    const start = DEFAULT_START.format("YYYY-MM-DD");
    const end   = DEFAULT_END.format("YYYY-MM-DD");

    graficperMonthList(start, end);
    eventTypeList(start, end); 
  }, []);

  const onSubmitFechas = ({ startDate, endDate }) => {
    const start = dayjs(startDate).format("YYYY-MM-DD");
    const end   = dayjs(endDate).format("YYYY-MM-DD");

    graficperMonthList(start, end);
    eventTypeList(start, end);
  };

  const barColors = [
    theme.palette.primary.main,
    theme.palette.secondary.main,
    "#7A5A8A",
    "#5A7A5A",
    "#4A5A7A",
  ];

  const eventosRealizadosData = Array.isArray(graficperMonth)
    ? graficperMonth.map((item) => ({
        mes: monthsArray?.[item.month - 1] ?? `Mes ${item.month}`,
        eventos: item.cantidad,
        type: item.type,
        status: item.status,
        year: item.year,
      }))
    : [];

  const tipoEventoData = Array.isArray(eventType)
    ? (() => {
        const total = eventType.reduce((acc, it) => acc + (it.cantidad || 0), 0) || 1;
        return eventType.map((it) => ({
          tipo: it.type,
          porcentaje: Number(((it.cantidad / total) * 100).toFixed(2)),
          cantidad: it.cantidad,
          year: it.year,
          month: it.month,
          status: it.status,
        }));
      })()
    : [];

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>

      {/* Filtro */}
      <Box
        sx={{
          backgroundColor: isDark ? "#1f1e1e" : "#f3f4f6",
          p: 2,
          borderRadius: 2.5,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 3, flexWrap: "wrap" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <CalendarMonth sx={{ color: theme.palette.text.primary }} />
            <Typography sx={{ color: theme.palette.text.primary }}>
              Rango de Fechas:
            </Typography>
          </Box>

          <Box sx={{ display: "flex", gap: 2, alignItems: "center", flexWrap: "wrap" }}>
            <Box sx={{ display: "flex", flexDirection: "column", minWidth: 220 }}>
              <Controller
                name="startDate"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    {...field}
                    label="Fecha de inicio"
                    value={field.value}
                    onChange={(newValue) => field.onChange(newValue)}
                    slotProps={{
                      textField: { fullWidth: true, size: "small" },
                    }}
                  />
                )}
              />
            </Box>

            <Box sx={{ display: "flex", flexDirection: "column", minWidth: 220 }}>
              <Controller
                name="endDate"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    {...field}
                    label="Fecha fin"
                    value={field.value}
                    onChange={(newValue) => field.onChange(newValue)}
                    slotProps={{
                      textField: { fullWidth: true, size: "small" },
                    }}
                  />
                )}
              />
            </Box>

            <Button
              variant="contained"
              onClick={handleSubmit(onSubmitFechas)}
              sx={{
                color: "white",
                bgcolor: theme.palette.primary.main,
                textTransform: "none",
                fontSize: 14,
                boxShadow: "none",
              }}
            >
              Aplicar
            </Button>
          </Box>
        </Box>
      </Box>

      {/* Gráficos */}
      <Box
        sx={{
          display: "flex",
          gap: 2,
          width: "100%",
          flexDirection: { xs: "column", md: "row" },
          flexWrap: { xs: "wrap", md: "nowrap" },
        }}
      >

        {/* Gráfico 1 */}
        <Box
          sx={{
            flex: 1,
            minWidth: 0,
            backgroundColor: isDark ? "#1f1e1e" : "#f3f4f6",
            p: 2,
            borderRadius: 2.5,
          }}
        >
          <Box sx={{ display: "flex", gap: 2, alignItems: "center", mb: 2 }}>
            <TrendingUp sx={{ color: theme.palette.text.primary }} />
            <Typography sx={{ color: theme.palette.text.primary, fontSize: 18 }}>
              Cantidad de Eventos Realizados por Mes
            </Typography>
          </Box>

          <Box
            sx={{
              height: 350,
              backgroundColor: isDark ? "#2A2D35" : "#f8fafc",
              borderRadius: 1,
              p: 2,
            }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={eventosRealizadosData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
                <XAxis type="number" stroke={theme.palette.text.tertiary} />
                <YAxis
                  type="category"
                  dataKey="mes"
                  stroke={theme.palette.text.tertiary}
                  width={90}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: isDark ? "#2A2D35" : "#fff",
                    borderRadius: 8,
                  }}
                />
                <Bar
                  dataKey="eventos"
                  radius={[0, 8, 8, 0]}
                  fill={theme.palette.primary.main}
                />
              </BarChart>
            </ResponsiveContainer>
          </Box>
        </Box>

        {/* Gráfico 2 */}
        <Box
          sx={{
            flex: 1,
            minWidth: 0,
            backgroundColor: isDark ? "#1f1e1e" : "#f3f4f6",
            p: 2,
            borderRadius: 2.5,
          }}
        >
          <Box sx={{ display: "flex", gap: 2, alignItems: "center", mb: 2 }}>
            <TrendingUp sx={{ color: theme.palette.text.primary }} />
            <Typography sx={{ color: theme.palette.text.primary, fontSize: 18 }}>
              Distribución por Tipo de Evento (Porcentaje)
            </Typography>
          </Box>

          <Box
            sx={{
              height: 350,
              backgroundColor: isDark ? "#2A2D35" : "#f8fafc",
              borderRadius: 1,
              p: 2,
            }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={tipoEventoData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
                <XAxis
                  type="number"
                  stroke={theme.palette.text.primary}
                  tickFormatter={(v) => `${v}%`}
                />
                <YAxis
                  type="category"
                  dataKey="tipo"
                  stroke={theme.palette.text.primary}
                  width={140}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const d = payload[0].payload;
                      return (
                        <Box
                          sx={{
                            p: 1.2,
                            minWidth: 180,
                            backgroundColor: isDark ? "#2A2D35" : "#ffffff",
                            border: `1px solid ${isDark ? "#4A4D5C" : "#d1d5db"}`,
                            borderRadius: 1,
                            color: isDark ? "white" : "black",   // 👈 TEXTO SIEMPRE LEGIBLE
                          }}
                        >
                          <Typography fontWeight={600} sx={{ color: "inherit" }}>
                            {d.tipo}
                          </Typography>

                          <Typography variant="body2" sx={{ color: "inherit" }}>
                            Cantidad: {d.cantidad}
                          </Typography>

                          <Typography variant="body2" sx={{ color: "inherit" }}>
                            Porcentaje: {d.porcentaje}%
                          </Typography>
                        </Box>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="porcentaje" radius={[0, 8, 8, 0]}>
                  {tipoEventoData.map((entry, idx) => (
                    <Cell
                      key={`cell-${idx}`}
                      fill={barColors[idx % barColors.length]}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Box>
        </Box>

      </Box>
    </Box>
  );
};
