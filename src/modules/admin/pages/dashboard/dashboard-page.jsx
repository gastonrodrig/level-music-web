import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  useTheme,
  Button,
} from "@mui/material";
import {
  Event,
  People,
  VolumeUp,
  Notifications,
  TrendingUp,
  CalendarMonth,
  ChevronLeft,
  ChevronRight,
  AccessTime,
  Description,
  Visibility,
  CheckCircle,
  Search,
} from "@mui/icons-material";
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

export const DashboardPage = () => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === "dark";

  const [activeTab, setActiveTab] = useState("indicadores");
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [fechaInicio, setFechaInicio] = useState("2025-01-01");
  const [fechaFin, setFechaFin] = useState("2025-06-30");

  // Datos (basados en las imágenes)
  const estados = [
    { title: "Borrador", value: 12, color: "#6b7280", icon: <Description sx={{ color: "white" }} /> },
    { title: "En Revisión", value: 8, color: "#eab308", icon: <Visibility sx={{ color: "white" }} /> },
    { title: "Confirmados", value: 45, color: "#10b981", icon: <CheckCircle sx={{ color: "white" }} /> },
    { title: "En Seguimiento", value: 18, color: "#3b82f6", icon: <Search sx={{ color: "white" }} /> },
  ];

  const citasPendientes = { value: 14, color: "#a855f7", icon: <AccessTime sx={{ color: "white" }} /> };

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

  const barColors = [theme.palette.primary.main, theme.palette.secondary.main, "#7A5A8A", "#5A7A5A", "#4A5A7A"];

  // Calendar helpers
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

  const previousMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  const nextMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));

  const eventosCalendario = {
    5: { nombre: "Evento Corporativo", estado: "Confirmado", color: "#10b981" },
    12: { nombre: "Boda Premium", estado: "En Revisión", color: "#eab308" },
    18: { nombre: "Concierto Rock", estado: "Confirmado", color: "#10b981" },
    22: { nombre: "Festival Jazz", estado: "Pago Pendiente", color: "#f97316" },
    28: { nombre: "Cumpleaños VIP", estado: "En Seguimiento", color: "#3b82f6" },
  };

  const { firstDay, daysInMonth } = getDaysInMonth(currentMonth);

  return (
    <Box sx={{ pb: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: "bold", color: theme.palette.text.primary }}>
          Bienvenido al Dashboard de Administrador
        </Typography>
        <Typography
          variant="body2"
          sx={{ color: theme.palette.text.secondary, mt: 1, fontWeight: 400 }}
        >
          Aquí podrás visualizar todos los indicadores clave, métricas de operación y el estado general de la plataforma.
        </Typography>
      </Box>

      {/* Tabs */}
      <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
        <Button
          variant={activeTab === "indicadores" ? "contained" : "outlined"}
          onClick={() => setActiveTab("indicadores")}
          sx={{ bgcolor: activeTab === "indicadores" ? theme.palette.primary.main : undefined }}
        >
          Indicadores
        </Button>
        <Button
          variant={activeTab === "graficos" ? "contained" : "outlined"}
          onClick={() => setActiveTab("graficos")}
          sx={{ bgcolor: activeTab === "graficos" ? theme.palette.primary.main : undefined }}
        >
          Gráficos
        </Button>
        <Button
          variant={activeTab === "calendario" ? "contained" : "outlined"}
          onClick={() => setActiveTab("calendario")}
          sx={{ bgcolor: activeTab === "calendario" ? theme.palette.primary.main : undefined }}
        >
          Calendario
        </Button>
      </Box>

      <Card
        sx={{
          borderRadius: 2.5,
          p: 3,
          backgroundColor: isDarkMode ? "#3C4050" : "#f8fafc",
          border: `2px solid ${isDarkMode ? "#2A2D35" : "#e5e7eb"}`,
        }}
      >
        {/* Indicadores */}
        {activeTab === "indicadores" && (
          <Box>
            <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2, color: theme.palette.text.primary }}>
              Estados de Eventos
            </Typography>
            <Grid container spacing={3} sx={{ mb: 4 }}>
              {estados.map((s, i) => (
                <Grid item xs={12} sm={6} md={6} lg={3} key={i}>
                  <Card sx={{ backgroundColor: s.color, borderRadius: 2, boxShadow: 3 }}>
                    <CardContent sx={{ textAlign: "center" }}>
                      <Box sx={{ display: "flex", justifyContent: "center", mb: 1 }}>{s.icon}</Box>
                      <Typography variant="h4" sx={{ color: "white", fontWeight: "bold" }}>{s.value}</Typography>
                      <Typography sx={{ color: "rgba(255,255,255,0.9)" }}>{s.title}</Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>

            <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2, color: theme.palette.text.primary }}>
              Citas
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6} lg={4}>
                <Card sx={{ backgroundColor: citasPendientes.color, borderRadius: 2, boxShadow: 3 }}>
                  <CardContent sx={{ textAlign: "center" }}>
                    <Box sx={{ display: "flex", justifyContent: "center", mb: 1 }}>{citasPendientes.icon}</Box>
                    <Typography variant="h4" sx={{ color: "white", fontWeight: "bold" }}>{citasPendientes.value}</Typography>
                    <Typography sx={{ color: "rgba(255,255,255,0.9)" }}>Citas Pendientes</Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        )}

        {/* Graficos */}
        {activeTab === "graficos" && (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {/* Filtro de Rango de Fechas */}
            <Box sx={{ backgroundColor: isDarkMode ? '#2A2D35' : '#f3f4f6', p: 2, borderRadius: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, flexWrap: 'wrap' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CalendarMonth sx={{ color: theme.palette.text.primary }} />
                  <Typography sx={{ color: theme.palette.text.primary }}>Rango de Fechas:</Typography>
                </Box>

                  <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-end', flexWrap: 'wrap' }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    <Typography sx={{ fontSize: 12, color: isDarkMode ? theme.palette.text.tertiary : theme.palette.text.secondary }}>Fecha Inicio</Typography>
                    <input
                      type="date"
                      value={fechaInicio}
                      onChange={(e) => setFechaInicio(e.target.value)}
                      style={{
                        padding: '8px 10px',
                        borderRadius: 8,
                        border: `1px solid ${isDarkMode ? '#4A4D5C' : '#d1d5db'}`,
                        background: isDarkMode ? '#3C4050' : '#fff',
                        color: isDarkMode ? '#fff' : '#000',
                      }}
                    />
                  </Box>

                  <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    <Typography sx={{ fontSize: 12, color: isDarkMode ? theme.palette.text.tertiary : theme.palette.text.secondary }}>Fecha Fin</Typography>
                    <input
                      type="date"
                      value={fechaFin}
                      onChange={(e) => setFechaFin(e.target.value)}
                      style={{
                        padding: '8px 10px',
                        borderRadius: 8,
                        border: `1px solid ${isDarkMode ? '#4A4D5C' : '#d1d5db'}`,
                        background: isDarkMode ? '#3C4050' : '#fff',
                        color: isDarkMode ? '#fff' : '#000',
                      }}
                    />
                  </Box>

                  <Button
                    variant="contained"
                    onClick={() => { /* aplicar filtro: por ahora no hace nada */ }}
                    sx={{ bgcolor: theme.palette.primary.main, '&:hover': { bgcolor: theme.palette.primary.hover } }}
                  >
                    Aplicar
                  </Button>
                </Box>
              </Box>
            </Box>

            <Box sx={{ backgroundColor: isDarkMode ? "#2A2D35" : "#ffffff", p: 2, borderRadius: 2 }}>
              <Box sx={{ display: "flex", gap: 2, alignItems: "center", mb: 2 }}>
                <TrendingUp sx={{ color: theme.palette.text.primary }} />
                <Typography variant="h6" sx={{ color: theme.palette.text.primary }}>Cantidad de Eventos Realizados por Mes</Typography>
              </Box>
              <Box sx={{ height: 350, backgroundColor: isDarkMode ? "#2A2D35" : "#f8fafc", borderRadius: 1, p: 2 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={eventosRealizadosData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
                    <XAxis type="number" stroke={theme.palette.text.tertiary} />
                    <YAxis type="category" dataKey="mes" stroke={theme.palette.text.tertiary} width={80} />
                    <Tooltip
                      contentStyle={{ backgroundColor: isDarkMode ? "#2A2D35" : "#ffffff", borderRadius: 8 }}
                    />
                    <Bar dataKey="eventos" radius={[0, 8, 8, 0]} fill={theme.palette.primary.main} />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </Box>

            <Box sx={{ backgroundColor: isDarkMode ? "#2A2D35" : "#ffffff", p: 2, borderRadius: 2 }}>
              <Box sx={{ display: "flex", gap: 2, alignItems: "center", mb: 2 }}>
                <TrendingUp sx={{ color: theme.palette.text.primary }} />
                <Typography variant="h6" sx={{ color: theme.palette.text.primary }}>Distribución por Tipo de Evento (Porcentaje)</Typography>
              </Box>
              <Box sx={{ height: 350, backgroundColor: isDarkMode ? "#2A2D35" : "#f8fafc", borderRadius: 1, p: 2 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={tipoEventoData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
                    <XAxis type="number" stroke={theme.palette.text.tertiary} tickFormatter={(v) => `${v}%`} />
                    <YAxis type="category" dataKey="tipo" stroke={theme.palette.text.tertiary} width={120} />
                    <Tooltip contentStyle={{ backgroundColor: isDarkMode ? "#2A2D35" : "#ffffff", borderRadius: 8 }} formatter={(v) => `${v}%`} />
                    <Bar dataKey="porcentaje" radius={[0, 8, 8, 0]}>
                      {tipoEventoData.map((entry, idx) => (
                        <Cell key={`cell-${idx}`} fill={barColors[idx % barColors.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </Box>
          </Box>
        )}

        {/* Calendario */}
        {activeTab === "calendario" && (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <CalendarMonth sx={{ color: theme.palette.text.primary }} />
                <Typography variant="h6" sx={{ color: theme.palette.text.primary }}>{monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}</Typography>
              </Box>
              <Box>
                <Button onClick={previousMonth} sx={{ mr: 1 }}><ChevronLeft /></Button>
                <Button onClick={nextMonth}><ChevronRight /></Button>
              </Box>
            </Box>

            <Box>
              <Grid container spacing={1} sx={{ mb: 2 }}>
                {['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'].map((d) => (
                  <Grid item xs key={d}>
                    <Box sx={{ textAlign: 'center', color: isDarkMode ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.7)' }}>{d}</Box>
                  </Grid>
                ))}
              </Grid>

              <Grid container spacing={2}>
                {Array.from({ length: 35 }).map((_, i) => {
                  const dayNumber = i - firstDay + 1;
                  const isValidDay = dayNumber > 0 && dayNumber <= daysInMonth;
                  const evento = isValidDay ? eventosCalendario[dayNumber] : null;

                  return (
                    <Grid item xs={12/7} key={i} sx={{ minHeight: 100 }}>
                      <Box
                        sx={{
                          height: '100%',
                          borderRadius: 1,
                          p: 1.5,
                          backgroundColor: evento ? evento.color : (isDarkMode ? '#2A2D35' : '#f3f4f6'),
                          color: evento ? '#fff' : (isDarkMode ? '#fff' : '#000'),
                        }}
                      >
                        {isValidDay ? (
                          <>
                            <Box sx={{ fontWeight: 'bold' }}>{dayNumber}</Box>
                            {evento && <Box sx={{ mt: 1, fontSize: 12 }}>{evento.nombre}</Box>}
                          </>
                        ) : null}
                      </Box>
                    </Grid>
                  );
                })}
              </Grid>

              <Box sx={{ mt: 3, display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><Box sx={{ width: 18, height: 18, bgcolor: '#10b981', borderRadius: 0.5 }} /> <Typography sx={{ fontSize: 14, color: theme.palette.text.primary }}>Confirmado</Typography></Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><Box sx={{ width: 18, height: 18, bgcolor: '#eab308', borderRadius: 0.5 }} /> <Typography sx={{ fontSize: 14, color: theme.palette.text.primary }}>En Revisión</Typography></Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><Box sx={{ width: 18, height: 18, bgcolor: '#f97316', borderRadius: 0.5 }} /> <Typography sx={{ fontSize: 14, color: theme.palette.text.primary }}>Pago Pendiente</Typography></Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><Box sx={{ width: 18, height: 18, bgcolor: '#3b82f6', borderRadius: 0.5 }} /> <Typography sx={{ fontSize: 14, color: theme.palette.text.primary }}>En Seguimiento</Typography></Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><Box sx={{ width: 18, height: 18, bgcolor: '#6b7280', borderRadius: 0.5 }} /> <Typography sx={{ fontSize: 14, color: theme.palette.text.primary }}>Borrador</Typography></Box>
              </Box>
            </Box>
          </Box>
        )}
      </Card>
    </Box>
  );
};
