import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Box, Typography, Grid, Button, Stack, useTheme } from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import dayjs from "dayjs";

export const EventRescheduleCard = ({
  initialStart = null,
  initialEnd = null,
  minDateTime = dayjs().add(2, "day"),
  onChange,
}) => {
  const [start, setStart] = useState(initialStart ? dayjs(initialStart) : null);
  const [end, setEnd] = useState(initialEnd ? dayjs(initialEnd) : null);
  const [error, setError] = useState("");
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  useEffect(() => {
    setStart(initialStart ? dayjs(initialStart) : null);
    setEnd(initialEnd ? dayjs(initialEnd) : null);
  }, [initialStart, initialEnd]);

  useEffect(() => {
    setError("");
    if (!start || !end) return;
    if (!end.isAfter(start)) setError("La fecha de fin debe ser posterior a la fecha de inicio.");
    if (start && start.isBefore(minDateTime)) setError("La fecha de inicio debe ser como mínimo " + minDateTime.format("DD/MM/YYYY HH:mm"));
  }, [start, end, minDateTime]);

  useEffect(() => {
    onChange?.({
      start: start?.toISOString() ?? null,
      end: end?.toISOString() ?? null,
      isValid: !!start && !!end && !error,
      error: error || null,
    });
    // dependemos solo de los valores locales para evitar loops si el padre memoiza onChange
  }, [start, end, error, onChange]);


  return (
    <Box sx={{ p: 2, borderRadius: 2, bgcolor: isDark ? "#1f1e1e" : "#f5f5f5", boxShadow: 1 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Reprogramar Evento
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <DateTimePicker
            label="Fecha y Hora de Inicio"
            value={start}
            onChange={(v) => setStart(v)}
            minDateTime={minDateTime}
            slotProps={{
              textField: { fullWidth: true }
            }}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <DateTimePicker
            label="Fecha y Hora de Fin"
            value={end}
            onChange={(v) => setEnd(v)}
            minDateTime={start ?? minDateTime}
            slotProps={{
              textField: { fullWidth: true }
            }}
          />
        </Grid>
      </Grid>

      {error && (
        <Typography color="error" variant="body2" sx={{ mt: 1 }}>
          {error}
        </Typography>
      )}

    </Box>
  );
};

// EventRescheduleCard.propTypes = {
//   initialStart: PropTypes.string,
//   initialEnd: PropTypes.string,
//   minDateTime: PropTypes.object,
//   onApply: PropTypes.func.isRequired,
//   onCancel: PropTypes.func,
//   submitLabel: PropTypes.string,
// };