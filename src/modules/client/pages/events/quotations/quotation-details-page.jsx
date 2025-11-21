import {
  Box,
  Typography,
  Button,
  Divider,
  Grid,
  Card,
  CardContent,
  Chip,
  useTheme,
} from "@mui/material";
import {
  ArrowBack,
  CalendarToday,
  AccessTime,
  People,
  Category,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useQuotationStore } from "../../../../../hooks";
import { useEffect } from "react";
import { formatDateString, formatTimeRange } from "../../../../../shared/utils";
import { ResourceTabs } from "../../../../../shared/ui/components/common";
import {
  EventInfoCard,
} from "../../../../admin/components";

export const QuotationDetailsPage = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const navigate = useNavigate();

  const { selected } = useQuotationStore();

  useEffect(() => {
    if (!selected) {
      navigate("/client/quotations", { replace: true });
    }
  }, [selected, navigate]);

  const assignations = selected?.assignations || [];

  return (
    <Box sx={{ px: 4, pt: 2, maxWidth: 1200, margin: "0 auto" }}>
      {/* Header principal */}
      <Box mb={2}>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          Evento {selected?.event_type_name} -{" "}
          {formatDateString(selected?.event_date)}
        </Typography>
        <Typography variant="body1" sx={{ color: "text.secondary" }}>
          La información del evento y los servicios solicitados se muestran a
          continuación.
        </Typography>
        <Chip
          label={selected?.status || "-"}
          color="primary"
          size="small"
          sx={{ mt: 1 }}
        />
        <Typography variant="body2" sx={{ mt: 1, color: "text.secondary" }}>
          Código: {selected?.event_code}
        </Typography>
      </Box>

      {/* Datos principales */}
      <Card
        elevation={0}
        sx={{
          borderRadius: 3,
          bgcolor: isDark ? "#1f1e1e" : "#f5f5f5",
          mb: 3,
        }}
      >
        <CardContent>
          <Grid container spacing={3}>
            <Grid item xs={12} md={3}>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}
              >
                <CalendarToday sx={{ color: "primary.main" }} />
                <Typography variant="body2" color="text.secondary">
                  Fecha
                </Typography>
              </Box>
              <Typography variant="h6">
                {formatDateString(selected?.event_date)}
              </Typography>
            </Grid>

            <Grid item xs={12} md={3}>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}
              >
                <AccessTime sx={{ color: "primary.main" }} />
                <Typography variant="body2" color="text.secondary">
                  Horario
                </Typography>
              </Box>
              <Typography variant="h6">
                {selected?.start_time && selected?.end_time
                  ? formatTimeRange(selected?.start_time, selected?.end_time)
                  : "-"}
              </Typography>
            </Grid>

            <Grid item xs={12} md={3}>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}
              >
                <People sx={{ color: "primary.main" }} />
                <Typography variant="body2" color="text.secondary">
                  Asistentes
                </Typography>
              </Box>
              <Typography variant="h6">
                {selected?.attendees_count} personas
              </Typography>
            </Grid>

            <Grid item xs={12} md={3}>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}
              >
                <Category sx={{ color: "primary.main" }} />
                <Typography variant="body2" color="text.secondary">
                  Tipo Evento
                </Typography>
              </Box>
              <Typography variant="h6">
                {selected?.event_type_name || "-"}
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Typography variant="caption" sx={{ color: "text.secondary", mb: 2 }}>
        Solicitud creada el {formatDateString(selected?.created_at)}
      </Typography>

      <Divider sx={{ my: 3 }} />

      {/* Información del Evento y Cliente */}
      <EventInfoCard selected={selected} />

      {/* Recursos Asignados o Servicios Solicitados */}
      <Box mt={3}>
        <ResourceTabs assignations={assignations} />
      </Box>

      {/* Footer */}
      <Box
        sx={{
          mt: 4,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Button
          variant="text"
          startIcon={<ArrowBack />}
          onClick={() => navigate(-1)}
        >
          Volver a la lista
        </Button>
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          Última actualización: {formatDateString(selected?.updated_at)}
        </Typography>
      </Box>
    </Box>
  );
};
