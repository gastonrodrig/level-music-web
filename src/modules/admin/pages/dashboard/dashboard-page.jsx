import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  useTheme,
  Tabs,
  Tab,
  IconButton,
  Button,
  TextField,
  Skeleton,
} from "@mui/material";
import {
  Description,
  Visibility,
  CheckCircle,
  Search,
  AccessTime,
  TrendingUp,
  CalendarMonth,
  ChevronLeft,
  ChevronRight,
} from "@mui/icons-material";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

export const DashboardPage = () => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === "dark";

  const [activeTab, setActiveTab] = useState("indicadores");
  const [loading, setLoading] = useState(false);

  const handleChangeTab = (_, value) => {
    setActiveTab(value);
  };

  // ------------------- DATA FICTICIA -------------------
  const estadosEventosStats = [
    {
      title: "Borrador",
      value: 12,
      icon: <Description sx={{ fontSize: 36, color: "#FFFFFF" }} />,
      bgColor: "#6b7280",
    },
    {
      title: "En Revisión",
      value: 8,
      icon: <Visibility sx={{ fontSize: 36, color: "#FFFFFF" }} />,
      bgColor: "#eab308",
    },
    {
      title: "Confirmados",
      value: 45,
      icon: <CheckCircle sx={{ fontSize: 36, color: "#FFFFFF" }} />,
      bgColor: "#10b981",
    },
    {
      title: "En Seguimiento",
      value: 18,
      icon: <Search sx={{ fontSize: 36, color: "#FFFFFF" }} />,
      bgColor: "#3b82f6",
    },
  ];

  const citasPendientes = 14;

  const [fechaInicio, setFechaInicio] = useState("2025-01-01");
  const [fechaFin, setFechaFin] = useState("2025-06-30");

  const eventosRealizadosData = [
    { mes: "Enero", eventos: 12 },
    { mes: "Febrero", eventos: 19 },
    { mes: "Marzo", eventos: 15 },
    { mes: "Abril", eventos: 22 },
    { mes: "Mayo", eventos: 18 },
    { mes: "Junio", eventos: 25 },
  ];

  const tipoEventoData = [
    { tipo: "Conciertos", porcentaje: 35 },
    { tipo: "Corporativos", porcentaje: 28 },
    { tipo: "Bodas", porcentaje: 20 },
    { tipo: "Cumpleaños", porcentaje: 10 },
    { tipo: "Otros", porcentaje: 7 },
  ];

  const barColors = ["#9B6F3E", "#8B6F47", "#7A5A8A", "#5A7A5A", "#4A5A7A"];

  // ------------------- CALENDARIO -------------------
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const monthNames = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ];

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    return { firstDay, daysInMonth };
  };

  const previousMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1)
    );
  };

  const nextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1)
    );
  };

  const eventosCalendario = {
    5: { nombre: "Evento Corporativo", estado: "Confirmado", color: "#10b981" },
    12: { nombre: "Boda Premium", estado: "En Revisión", color: "#eab308" },
    18: { nombre: "Concierto Rock", estado: "Confirmado", color: "#10b981" },
    22: { nombre: "Festival Jazz", estado: "Pago Pendiente", color: "#f97316" },
    28: { nombre: "Cumpleaños VIP", estado: "En Seguimiento", color: "#3b82f6" },
  };

  const { firstDay, daysInMonth } = getDaysInMonth(currentMonth);

  // ------------------- RENDER -------------------
  return (
    <Box sx={{ pb: 4 }}>
      {/* HEADER */}
      <Box sx={{ mb: 4, position: "relative", display: "inline-block" }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: "bold",
            color: theme.palette.text.primary,
          }}
        >
          Bienvenido al Dashboard de Administrador
        </Typography>

        {/* highlight underline */}
        <Box
          sx={{
            position: "absolute",
            bottom: -6,
            left: 0,
            width: "100%",
            height: "7px",
            backgroundColor: "#34e39a",
            borderRadius: 2,
          }}
        />
      </Box>

      <Typography
        variant="body1"
        sx={{ color: theme.palette.text.secondary, mt: 1, mb: 3 }}
      >
        Aquí podrás visualizar indicadores claves, métricas y la actividad
        general de la plataforma.
      </Typography>

      {/* TABS */}
      <Card sx={{ mb: 4, borderRadius: 3 }}>
        <Tabs
          value={activeTab}
          onChange={handleChangeTab}
          variant="scrollable"
          sx={{
            px: 2,
            pt: 1,
            "& .MuiTab-root": { textTransform: "none", fontWeight: 600 },
          }}
        >
          <Tab label="Indicadores" value="indicadores" />
          <Tab label="Gráficos" value="graficos" />
          <Tab label="Calendario" value="calendario" />
        </Tabs>

        <CardContent>
          {/* ------------- TAB INDICADORES ------------- */}
          {activeTab === "indicadores" && (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
                  Estados de Eventos
                </Typography>

                <Grid container spacing={3}>
                  {estadosEventosStats.map((stat, index) => (
                    <Grid item xs={12} sm={6} md={3} key={index}>
                      {loading ? (
                        <Skeleton variant="rounded" height={130} />
                      ) : (
                        <Card
                          sx={{
                            backgroundColor: stat.bgColor,
                            borderRadius: 3,
                            color: "#FFF",
                            cursor: "pointer",
                            "&:hover": {
                              transform: "translateY(-4px)",
                              transition: "0.3s",
                            },
                          }}
                        >
                          <CardContent sx={{ textAlign: "center" }}>
                            <Box sx={{ mb: 1 }}>{stat.icon}</Box>
                            <Typography variant="h4">{stat.value}</Typography>
                            <Typography>{stat.title}</Typography>
                          </CardContent>
                        </Card>
                      )}
                    </Grid>
                  ))}
                </Grid>
              </Box>

              <Box>
                <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
                  Citas
                </Typography>

                {loading ? (
                  <Skeleton variant="rounded" height={130} />
                ) : (
                  <Card
                    sx={{
                      backgroundColor: "#a855f7",
                      borderRadius: 3,
                      color: "#FFF",
                      p: 2,
                    }}
                  >
                    <CardContent sx={{ textAlign: "center" }}>
                      <AccessTime sx={{ fontSize: 40 }} />
                      <Typography variant="h4">{citasPendientes}</Typography>
                      <Typography>Citas Pendientes</Typography>
                    </CardContent>
                  </Card>
                )}
              </Box>
            </Box>
          )}

          {/* ------------- TAB GRAFICOS ------------- */}
          {activeTab === "graficos" && (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {/* Filtros */}
              <Card sx={{ p: 3, borderRadius: 3 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <CalendarMonth sx={{ fontSize: 28 }} />
                  <Typography variant="h6">Rango de Fechas</Typography>

                  <TextField
                    label="Inicio"
                    type="date"
                    size="small"
                    value={fechaInicio}
                    onChange={(e) => setFechaInicio(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                  />
                  <TextField
                    label="Fin"
                    type="date"
                    size="small"
                    value={fechaFin}
                    onChange={(e) => setFechaFin(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                  />

                  <Button variant="contained">Aplicar</Button>
                </Box>
              </Card>

              {/* Gráfico 1 */}
              <Card sx={{ p: 3, borderRadius: 3 }}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
                  Cantidad de Eventos Realizados por Mes
                </Typography>

                {loading ? (
                  <Skeleton variant="rounded" height={300} />
                ) : (
                  <Box sx={{ height: 320 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={eventosRealizadosData} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis type="category" dataKey="mes" width={80} />
                        <Tooltip />
                        <Bar dataKey="eventos" fill="#9B6F3E" />
                      </BarChart>
                    </ResponsiveContainer>
                  </Box>
                )}
              </Card>

              {/* Gráfico 2 */}
              <Card sx={{ p: 3, borderRadius: 3 }}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
                  Distribución por Tipo de Evento (%)
                </Typography>

                {loading ? (
                  <Skeleton variant="rounded" height={300} />
                ) : (
                  <Box sx={{ height: 320 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={tipoEventoData} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                          type="number"
                          tickFormatter={(val) => `${val}%`}
                        />
                        <YAxis type="category" dataKey="tipo" width={100} />
                        <Tooltip />
                        <Bar dataKey="porcentaje">
                          {tipoEventoData.map((entry, index) => (
                            <Cell
                              key={index}
                              fill={barColors[index % barColors.length]}
                            />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </Box>
                )}
              </Card>
            </Box>
          )}

          {/* ------------- TAB CALENDARIO ------------- */}
          {activeTab === "calendario" && (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                  Calendario de Eventos
                </Typography>

                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <IconButton onClick={previousMonth}>
                    <ChevronLeft />
                  </IconButton>

                  <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                    {monthNames[currentMonth.getMonth()]}{" "}
                    {currentMonth.getFullYear()}
                  </Typography>

                  <IconButton onClick={nextMonth}>
                    <ChevronRight />
                  </IconButton>
                </Box>
              </Box>

              {/* Días */}
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "repeat(7, 1fr)",
                  gap: 1.5,
                }}
              >
                {[
                  "Domingo",
                  "Lunes",
                  "Martes",
                  "Miércoles",
                  "Jueves",
                  "Viernes",
                  "Sábado",
                ].map((day) => (
                  <Typography
                    key={day}
                    sx={{ textAlign: "center", fontWeight: 600 }}
                  >
                    {day}
                  </Typography>
                ))}
              </Box>

              {/* Celdas */}
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "repeat(7, 1fr)",
                  gap: 1.5,
                }}
              >
                {Array.from({ length: 35 }, (_, i) => {
                  const dayNumber = i - firstDay + 1;
                  const valid = dayNumber > 0 && dayNumber <= daysInMonth;
                  const evento = valid ? eventosCalendario[dayNumber] : null;

                  return (
                    <Box
                      key={i}
                      sx={{
                        height: 90,
                        borderRadius: 2,
                        p: 1,
                        bgcolor: evento
                          ? evento.color
                          : isDarkMode
                          ? "#1f2937"
                          : "#e5e7eb",
                        color: evento ? "#FFF" : theme.palette.text.primary,
                      }}
                    >
                      {valid && (
                        <>
                          <Typography sx={{ fontWeight: "bold" }}>
                            {dayNumber}
                          </Typography>
                          {evento && (
                            <Typography sx={{ fontSize: "0.75rem", mt: 1 }}>
                              {evento.nombre}
                            </Typography>
                          )}
                        </>
                      )}
                    </Box>
                  );
                })}
              </Box>
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};
