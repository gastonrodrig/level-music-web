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
  LocationOn,
  CalendarToday,
  AccessTime,
  People,
  Category,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useQuotationStore } from "../../../../../hooks";
import { useEffect } from "react";
import { formatDateString } from "../../../../../shared/utils";

export const EventQuotesDetails = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const navigate = useNavigate();

  const { selected } = useQuotationStore();

  useEffect(() => {
    if (!selected) {
      navigate('/cliente/event-quotes', { replace: true });
      return;
    }
  }, [selected]);

  return (
    <Box sx={{ px: 4, pt: 2, maxWidth: 1200, margin: "0 auto" }}>
      {/* Header principal */}
      <Box mb={2}>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          Evento {selected?.event_type_name} - {formatDateString(selected?.date)}
        </Typography>
        <Typography variant="body1" sx={{ color: "text.secondary" }}>
          La información del evento y los servicios solicitados se muestran a continuación.
        </Typography>
        <Chip label={selected?.status || "-"} color="primary" size="small" sx={{ mt: 1 }} />
        <Typography variant="body2" sx={{ mt: 1, color: "text.secondary" }}>
          Código: {selected?.event_code}
        </Typography>
      </Box>

      {/* Datos principales en una sola card */}
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
            {/* Fecha */}
            <Grid item xs={12} md={3}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                <CalendarToday sx={{ color: "primary.main" }} />
                <Typography variant="body2" color="text.secondary">
                  Fecha 
                </Typography>
              </Box>
              <Typography variant="h6">
                {formatDateString(selected?.date)}
              </Typography>
            </Grid>

            {/* Horario */}
            <Grid item xs={12} md={3}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                <AccessTime sx={{ color: "primary.main" }} />
                <Typography variant="body2" color="text.secondary">
                  Horario
                </Typography>
              </Box>
              <Typography variant="h6">
                {selected?.available_from && selected?.available_to
                  ? `${selected?.available_from} - ${selected?.available_to}`
                  : "-"}
              </Typography>
            </Grid>

            {/* Asistentes */}
            <Grid item xs={12} md={3}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                <People sx={{ color: "primary.main" }} />
                <Typography variant="body2" color="text.secondary">
                  Asistentes
                </Typography>
              </Box>
              <Typography variant="h6">
                {(selected?.place_size ||
                  selected?.attendees_count ||
                  0) + " personas"}
              </Typography>
            </Grid>

            {/* Tipo */}
            <Grid item xs={12} md={3}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
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

      {/* <Typography variant="body2" sx={{ color: "text.secondary", mb: 2 }}>
        ¡Tu evento ha sido aprobado! Nos pondremos en contacto contigo pronto.
      </Typography> */}
      <Typography variant="caption" sx={{ color: "text.secondary", mb: 2 }}>
        Solicitud creada el {formatDateString(selected?.created_at)}
      </Typography>

      <Divider sx={{ my: 3 }} />

      {/* Info principal en tarjetas */}
      <Grid container spacing={2}>
        {/* Ubicación del evento */}
        <Grid item xs={12} md={6}>
          <Card
            elevation={0}
            sx={{
              borderRadius: 3,
              bgcolor: isDark ? "#1f1e1e" : "#f5f5f5",
            }}
          >
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                <LocationOn
                  sx={{
                    mr: 1,
                    verticalAlign: "middle",
                    color: "primary.main",
                  }}
                />
                Ubicación del Evento
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Dirección
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                {selected?.exact_address}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Referencia
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                {selected?.location_reference || "Sin referencia"}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Tipo de lugar
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                {selected?.place_type}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Tamaño
              </Typography>
              <Typography variant="body1">
                {(selected?.place_size || "No especificado") + " m²"}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Servicios solicitados */}
        <Grid item xs={12} md={6}>
          <Card
            elevation={0}
            sx={{
              borderRadius: 3,
              bgcolor: isDark ? "#1f1e1e" : "#f5f5f5",
            }}
          >
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Category sx={{ mr: 1, color: "primary.main" }} />
                <Typography variant="h6">Servicios Solicitados</Typography>
              </Box>
              {selected?.services_requested?.length > 0 ? (
                selected?.services_requested.map((service, idx) => (
                  <Box key={idx} sx={{ mb: 2 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      {service.service_type_name}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: "text.secondary" }}
                    >
                      {service.details || "Sin detalles"}
                    </Typography>
                  </Box>
                ))
              ) : (
                <Typography
                  variant="body2"
                  sx={{ color: "text.secondary", fontStyle: "italic" }}
                >
                  No hay servicios solicitados
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

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
