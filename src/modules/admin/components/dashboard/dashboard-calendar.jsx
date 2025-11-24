import { useState, useEffect, useMemo } from "react";
import {
  Box,
  Typography,
  Button,
  useTheme,
  Skeleton,
} from "@mui/material";
import { CalendarMonth, ChevronLeft, ChevronRight } from "@mui/icons-material";
import { useQuotationStore } from "../../../../hooks";
import { monthNames, daysOfWeek } from "../../constants";


export const DashboardCalendar = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  const [currentMonth, setCurrentMonth] = useState(new Date());

  const { eventByDate, eventDate, loading } = useQuotationStore();

  const getMonthMeta = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const totalCells = Math.ceil((firstDay + daysInMonth) / 7) * 7;
    return { firstDay, daysInMonth, totalCells };
  };

  const { firstDay, daysInMonth, totalCells } = getMonthMeta(currentMonth);

  const previousMonth = () =>
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1)
    );

  const nextMonth = () =>
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1)
    );

  useEffect(() => {
    const y = currentMonth.getFullYear();
    const m = currentMonth.getMonth() + 1;
    eventDate(y, m);
  }, [currentMonth]);

  const statusColors = {
    Confirmado: "#10b981",
    Finalizado: "#10b981",
    "En Revisión": "#eab308",
    "Pago Pendiente": "#f97316",
    "En Seguimiento": "#3b82f6",
    Borrador: "#6b7280",
  };

  const eventosLista = Array.isArray(eventByDate)
    ? eventByDate
    : Array.isArray(eventByDate?.data)
    ? eventByDate.data
    : [];

  const eventosPorDia = useMemo(() => {
    const map = {};
    for (const item of eventosLista) {
      const day = item.day;
      const eventos = item.eventos ?? [];
      const count = item.cantidad ?? eventos.length ?? 0;
      const first = eventos[0];
      const status = first?.status ?? item.status ?? "Finalizado";
      const color = statusColors[status];

      if (!map[day]) {
        map[day] = {
          count: 0,
          names: [],
          status,
          color,
        };
      }
      map[day].count += count || 0;
      const newNames = eventos.map((e) => e.name).filter(Boolean);
      map[day].names = [...map[day].names, ...newNames].slice(0, 2);
      map[day].status = status;
      map[day].color = color;
    }
    return map;
  }, [eventosLista, isDark]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 3,
        bgcolor: isDark ? "#1f1e1e" : "#f5f5f5",
        p: { xs: 2, md: 3 },
        borderRadius: 2.5,
      }}
    >
      {/* Header mes + flechas */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 2,
          flexWrap: "wrap",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <CalendarMonth sx={{ color: theme.palette.text.primary }} />
          <Typography
            variant="h6"
            sx={{
              color: theme.palette.text.primary,
              fontSize: { xs: 18, md: 20 },
            }}
          >
            {monthNames[currentMonth.getMonth()]}{" "}
            {currentMonth.getFullYear()}
          </Typography>
        </Box>

        <Box sx={{ display: "flex", gap: 1 }}>
          <Button
            onClick={previousMonth}
            sx={{ minWidth: 0, px: 1.2, borderRadius: 999 }}
          >
            <ChevronLeft />
          </Button>
          <Button
            onClick={nextMonth}
            sx={{ minWidth: 0, px: 1.2, borderRadius: 999 }}
          >
            <ChevronRight />
          </Button>
        </Box>
      </Box>

      {/* Cabecera de días */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(7, minmax(0, 1fr))",
          gap: { xs: 0.5, sm: 1, md: 1.5 },
          mb: 1,
        }}
      >
        {daysOfWeek.map((d) => (
          <Box
            key={d}
            sx={{
              textAlign: "center",
              fontSize: { xs: 11, sm: 12, md: 14 },
              fontWeight: 500,
              color: isDark
                ? "rgba(226, 226, 226, 0.8)"
                : "rgba(19, 14, 14, 0.7)",
            }}
          >
            {d}
          </Box>
        ))}
      </Box>

      {/* Cuadrícula de días o skeleton */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(7, minmax(0, 1fr))",
          gap: { xs: 0.5, sm: 1.2, md: 2 },
        }}
      >
        {loading
          ? // Skeleton por cada celda mientras carga
            Array.from({ length: totalCells }).map((_, i) => (
              <Skeleton
                key={i}
                variant="rounded"
                sx={{
                  width: "100%",
                  minHeight: { xs: 52, sm: 70, md: 90 },
                  borderRadius: 1.4,
                  bgcolor: isDark ? "#363636ff" : "#e5e7eb",
                }}
              />
            ))
          : // Celdas reales
            Array.from({ length: totalCells }).map((_, i) => {
              const dayNumber = i - firstDay + 1;
              const isValidDay = dayNumber > 0 && dayNumber <= daysInMonth;
              const evento = isValidDay ? eventosPorDia[dayNumber] : null;

              return (
                <Box
                  key={i}
                  sx={{
                    minHeight: { xs: 52, sm: 70, md: 90 },
                    borderRadius: 1.4,
                    p: { xs: 0.9, sm: 1.3 },
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-start",
                    backgroundColor: evento
                      ? evento.color
                      : isDark
                      ? "#2A2D35"
                      : "#e5e5e5ff",
                    color: evento ? "#fff" : isDark ? "#fff" : "#000",
                    transition: "background-color .15s",
                    overflow: "hidden",
                  }}
                  title={
                    evento
                      ? `${evento.count} evento(s)` +
                        (evento.names?.length
                          ? ` • ${evento.names.join(", ")}`
                          : "")
                      : undefined
                  }
                >
                  {isValidDay && (
                    <>
                      <Typography
                        sx={{
                          fontWeight: 700,
                          fontSize: { xs: 12, sm: 13, md: 14 },
                          mb: 0.5,
                        }}
                      >
                        {dayNumber}
                      </Typography>

                      {evento && (
                        <Box
                          sx={{
                            fontSize: { xs: 9.5, sm: 11, md: 12 },
                            lineHeight: 1.25,
                            wordBreak: "break-word",
                          }}
                        >
                          {evento.count > 1 && evento.names?.length <= 1
                            ? `${evento.count} eventos`
                            : (evento.names || []).map((n, idx) => (
                                <div key={idx}>{n}</div>
                              ))}
                        </Box>
                      )}
                    </>
                  )}
                </Box>
              );
            })}
      </Box>

      {/* Leyenda */}
      <Box
        sx={{
          mt: 2,
          display: "flex",
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        {[
          { label: "Confirmado", color: "#10b981" },
          { label: "En Revisión", color: "#eab308" },
          { label: "Pago Pendiente", color: "#f97316" },
          { label: "En Seguimiento", color: "#3b82f6" },
          { label: "Borrador", color: "#6b7280" },
        ].map((item) => (
          <Box
            key={item.label}
            sx={{ display: "flex", alignItems: "center", gap: 1 }}
          >
            <Box
              sx={{
                width: 18,
                height: 18,
                bgcolor: item.color,
                borderRadius: 0.8,
              }}
            />
            <Typography
              sx={{
                fontSize: { xs: 12, sm: 13, md: 14 },
                color: theme.palette.text.primary,
              }}
            >
              {item.label}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
};
