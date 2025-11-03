import {
  Box,
  Typography,
  Stack,
  Button,
  Chip,
  Divider,
  Paper,
} from "@mui/material";
import { useTheme } from "@emotion/react";
import { Event } from "@mui/icons-material";
import {
  Person,
  Place,
  People,
  InfoOutlined
} from "@mui/icons-material";
import { useFormContext } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useAppointmentStore, useAuthStore } from "../../../../hooks";
import { useMemo } from "react";

export const AppointmentSummary = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const navigate = useNavigate();
  const { startCreateAppointment, loading } = useAppointmentStore();
  const { status } = useAuthStore();

  const {
    watch,
    handleSubmit
  } = useFormContext();

  const attendeesRaw = watch("attendeesCount", 1);
  const attendeesNum = Number(attendeesRaw);
  const attendeesLabel = attendeesRaw === "" || Number.isNaN(attendeesNum)
    ? "Sin especificar"
    : `${attendeesNum} persona${attendeesNum > 1 ? "s" : ""}`;

  const onSubmit = async (data) => {
    const success = await startCreateAppointment(data);
    if (success && status === 'authenticated') navigate('/client', { replace: true });
    else navigate('/', { replace: true });
  }

  const clientType = watch("clientType", "Persona");

  const onCancel = () => {
    navigate('/', { replace: true });
  }

  const isButtonDisabled = useMemo(() => loading, [loading]);

  return (
    <Box
      sx={{
        bgcolor: isDark ? "#1f1e1e" : "#f5f5f5",
        borderRadius: 2,
      }}
    >
      {/* Cabecera más oscura */}
      <Box
        sx={{
          bgcolor: isDark ? "#151515" : "#e0e0e0",
          p: 2,
          display: "flex",
          alignItems: "center",
          gap: 1,
          borderTopLeftRadius: 8,
          borderTopRightRadius: 8,
        }}
      >
        <Event />
        <Typography fontWeight={700}>Información de la Cita</Typography>
      </Box>

      <Box
        sx={{
          px: 3,
          pb: 3,
          pt: 2,
          bgcolor: isDark ? "#1f1e1e" : "#f5f5f5",
          borderBottomLeftRadius: 8,
          borderBottomRightRadius: 8,
        }}
      >
        {/* Contenido: secciones con label + chip/value, botones y nota */}
        <Stack spacing={2}>
          <Box
            sx={{
              bgcolor: isDark ? "#333" : "#fff",
              borderRadius: 2,
              px: 2,
              py: 1.5,
            }}
          >
            <Typography variant="caption" color="text.secondary">
              Tipo de Cliente
            </Typography>
            <Box sx={{ mt: 1, display: "flex", alignItems: "center", gap: 1 }}>
              <Chip
                icon={<Person />}
                label={clientType}
                color="success"
                variant="filled"
                sx={{ fontWeight: 700, mb: 0.5 }}
              />
            </Box>
          </Box>

          <Box
            sx={{
              bgcolor: isDark ? "#333" : "#fff",
              borderRadius: 2,
              px: 2,
              py: 1.5,
            }}
          >
            <Typography variant="caption" color="text.secondary">
              Tipo de Reunión
            </Typography>
            <Box sx={{ mt: 1, display: "flex", alignItems: "center", gap: 1 }}>
              <Chip
                icon={<Place />}
                label={watch("meetingType", "Presencial")}
                color="info"
                variant="filled"
                sx={{ fontWeight: 700, mb: 0.5 }}
              />
            </Box>
          </Box>

          <Box
            sx={{
              bgcolor: isDark ? "#333" : "#fff",
              borderRadius: 2,
              px: 2,
              py: 1.5,
            }}
          >
            <Typography variant="caption" color="text.secondary">
              Asistentes
            </Typography>
            <Box sx={{ mt: 1, display: "flex", alignItems: "center", gap: 1 }}>
              <Chip
                icon={<People />}
                label={attendeesLabel}
                sx={{ fontWeight: 600, mb: 0.5 }}
              />
            </Box>
          </Box>

          <Divider sx={{ my: 1 }} />

          <Box sx={{ display: "flex", gap: 2, flexDirection: "column" }}>
            <Button
              variant="contained"
              onClick={handleSubmit(onSubmit)}
              sx={{
                py: 1,
                boxShadow: "none",
                textTransform: "none",
                fontWeight: 600,
                color: "#fff",
                borderRadius: 2,
              }}
              disabled={isButtonDisabled}
            >
              Agendar Cita
            </Button>

            <Button
              variant="outlined"
              onClick={onCancel}
              sx={{
                py: 1,
                borderColor: isDark ? "#333" : "#e0e0e0",
                color: isDark ? "#fff" : "#000",
                textTransform: "none",
                fontWeight: 600,
                borderRadius: 2,
              }}
              disabled={isButtonDisabled}
            >
              Cancelar
            </Button>
          </Box>

          <Paper
            elevation={0}
            sx={{
              mt: 1,
              p: 2,
              borderRadius: 2,
              bgcolor: isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)",
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <InfoOutlined color="primary" />
              <Typography variant="body2" color="text.secondary">
                Recibirás una confirmación por correo electrónico con los detalles de tu cita
              </Typography>
            </Box>
          </Paper>
        </Stack>
      </Box>
    </Box>

  )
}