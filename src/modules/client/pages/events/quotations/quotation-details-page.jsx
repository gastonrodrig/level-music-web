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
  Person,
  EventAvailable,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useQuotationStore } from "../../../../../hooks";
import { useEffect } from "react";
import { formatDateString, formatTimeRange } from "../../../../../shared/utils";

export const QuotationDetailsPage = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const navigate = useNavigate();

  const { selected } = useQuotationStore();

  useEffect(() => {
    if (!selected) {
      navigate('/client/event-quotes', { replace: true });
      return;
    }
  }, [selected]);

  return (
    <Box sx={{ px: 4, pt: 2, maxWidth: 1200, margin: "0 auto" }}>
      {/* Header principal */}
      <Box mb={2}>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          Evento {selected?.event_type_name} - {formatDateString(selected?.event_date)}
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
                {formatDateString(selected?.event_date)}
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
                {selected?.start_time && selected?.end_time
                  ? formatTimeRange(selected?.start_time, selected?.end_time)
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
                {(selected?.attendees_count) + " personas"}
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

      <Typography variant="caption" sx={{ color: "text.secondary", mb: 2 }}>
        Solicitud creada el {formatDateString(selected?.created_at)}
      </Typography>

      <Divider sx={{ my: 3 }} />

      {/* Secciones principales */}
      <Grid container spacing={3}>
        {/* Ubicación del Evento */}
        <Grid item xs={12} md={6}>
          <Box
            sx={{
              p: 3,
              borderRadius: 3,
              bgcolor: isDark ? "#1f1e1e" : "#f5f5f5",
              height: "100%",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", mb: 2, gap: 1 }}>
              <EventAvailable />
              <Typography sx={{ fontSize: 20, fontWeight: 500 }}>
                Información del Evento
              </Typography>
            </Box>

            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Box>
                  <Typography fontSize={14} color="text.secondary">
                    Tipo de Evento
                  </Typography>
                  <Chip
                    label={selected?.event_type_name}
                    color="primary"
                    size="small"
                    sx={{ fontWeight: 500, fontSize: 13, mt: 0.5, color: '#fff' }}
                  />
                </Box>

                <Box sx={{ mt: 2 }}>
                  <Typography fontSize={14} color="text.secondary">
                    Fecha
                  </Typography>
                  <Typography fontSize={14}>
                    {formatDateString(selected?.event_date)}
                  </Typography>
                </Box>

                <Box sx={{ mt: 2 }}>
                  <Typography fontSize={14} color="text.secondary">
                    Asistentes
                  </Typography>
                  <Typography fontSize={14}>
                    {selected?.attendees_count} personas
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={6}>
                <Box>
                  <Typography fontSize={14} color="text.secondary">
                    Lugar
                  </Typography>
                  <Typography fontSize={14}>{selected?.place_type}</Typography>
                </Box>

                <Box sx={{ mt: 2 }}>
                  <Typography fontSize={14} color="text.secondary">
                    Horario
                  </Typography>
                  <Typography fontSize={14}>
                    {formatTimeRange(selected?.start_time, selected?.end_time)}
                  </Typography>
                </Box>

                <Box sx={{ mt: 2 }}>
                  <Typography fontSize={14} color="text.secondary">
                    Tamaño del lugar
                  </Typography>
                  <Typography fontSize={14}>
                    {selected?.place_size} m²
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={12}>
                <Box>
                  <Typography fontSize={14} color="text.secondary">
                    Ubicación
                  </Typography>
                  <Typography fontSize={14}>{selected?.exact_address}</Typography>
                  <Typography fontSize={13} color="text.secondary">
                    {selected?.location_reference}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Grid>

        {/* Información del Cliente */}
        <Grid item xs={12} md={6}>
          <Box
            sx={{
              p: 3,
              borderRadius: 3,
              bgcolor: isDark ? "#1f1e1e" : "#f5f5f5",
              height: "100%",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", mb: 2, gap: 1 }}>
              <Person />
              <Typography sx={{ fontSize: 20, fontWeight: 500 }}>
                Información del Cliente
              </Typography>
            </Box>
            <Box sx={{ mb: 2 }}>
              <Typography fontSize={14} color="text.secondary">
                Tipo de Cliente
              </Typography>
              <Chip
                label={selected?.client_info.client_type}
                color="primary"
                size="small"
                sx={{ fontWeight: 500, fontSize: 13, mt: 0.5, color: '#fff' }}
              />
            </Box>

            <Grid container spacing={2}>
              {selected?.client_info.client_type === "Persona" ? (
                <>
                  <Grid item xs={12} md={6}>
                    <Typography fontSize={14} color="text.secondary">
                      Nombre
                    </Typography>
                    <Typography fontSize={14}>
                      {selected?.client_info.first_name}
                    </Typography>

                    <Typography fontSize={14} color="text.secondary" mt={2}>
                      Email
                    </Typography>
                    <Typography fontSize={14}>
                      {selected?.client_info.email}
                    </Typography>

                    <Typography fontSize={14} color="text.secondary" mt={2}>
                      Tipo de Documento
                    </Typography>
                    <Typography fontSize={14}>
                      {selected?.client_info.document_type}
                    </Typography>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Typography fontSize={14} color="text.secondary">
                      Apellido
                    </Typography>
                    <Typography fontSize={14}>
                      {selected?.client_info.last_name}
                    </Typography>

                    <Typography fontSize={14} color="text.secondary" mt={2}>
                      Teléfono
                    </Typography>
                    <Typography fontSize={14}>
                      {selected?.client_info.phone}
                    </Typography>

                    <Typography fontSize={14} color="text.secondary" mt={2}>
                      Número
                    </Typography>
                    <Typography fontSize={14}>
                      {selected?.client_info.document_number}
                    </Typography>
                  </Grid>
                </>
              ) : (
                <>
                  <Grid item xs={12} md={6}>
                    <Typography fontSize={14} color="text.secondary">
                      Empresa
                    </Typography>
                    <Typography fontSize={14}>
                      {selected?.client_info.company_name}
                    </Typography>

                    <Typography fontSize={14} color="text.secondary" mt={2}>
                      Email
                    </Typography>
                    <Typography fontSize={14}>
                      {selected?.client_info.email}
                    </Typography>

                    <Typography fontSize={14} color="text.secondary" mt={2}>
                      Tipo de Documento
                    </Typography>
                    <Typography fontSize={14}>
                      {selected?.client_info.document_type}
                    </Typography>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Typography fontSize={14} color="text.secondary">
                      Representante
                    </Typography>
                    <Typography fontSize={14}>
                      {selected?.client_info.contact_person}
                    </Typography>

                    <Typography fontSize={14} color="text.secondary" mt={2}>
                      Teléfono
                    </Typography>
                    <Typography fontSize={14}>
                      {selected?.client_info.phone}
                    </Typography>

                    <Typography fontSize={14} color="text.secondary" mt={2}>
                      Número
                    </Typography>
                    <Typography fontSize={14}>
                      {selected?.client_info.document_number}
                    </Typography>
                  </Grid>
                </>
              )}
            </Grid>
          </Box>
        </Grid>
      </Grid>

      {/* Servicios Solicitados */}
      <Box mt={3}>
        <Card
          elevation={0}
          sx={{
            borderRadius: 3,
            bgcolor: isDark ? "#1f1e1e" : "#f5f5f5",
          }}
        >
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2, display: "flex", alignItems: "center" }}>
              <Category sx={{ mr: 1, color: "primary.main" }} />
              Servicios Solicitados
            </Typography>
            {selected?.services_requested?.length > 0 ? (
              selected?.services_requested.map((service, idx) => (
                <Box key={idx} sx={{ mb: 2 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, color: "primary.main" }}>
                    {service.service_type_name}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    {service.details || "Sin detalles"}
                  </Typography>
                </Box>
              ))
            ) : (
              <Typography variant="body2" sx={{ color: "text.secondary", fontStyle: "italic" }}>
                No hay servicios solicitados
              </Typography>
            )}
          </CardContent>
        </Card>
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
