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
  CircularProgress,
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

export const EventQuotesDetails = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const navigate = useNavigate();

  const { selected: selectedQuotation, loading } = useQuotationStore();

  console.log("selectedQuotation:", selectedQuotation);

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "60vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!selectedQuotation) {
    return (
      <Box
        sx={{
          px: 4,
          py: 5,
          textAlign: "center",
          minHeight: "60vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Typography variant="h5" sx={{ mb: 2, color: "text.secondary" }}>
          No hay cotización seleccionada
        </Typography>
        <Button
          variant="contained"
          sx={{
            backgroundColor: "#212121",
            color: "#fff",
            borderRadius: 2,
            textTransform: "none",
            px: 3,
            py: 1.5,
          }}
          startIcon={<ArrowBack />}
          onClick={() => navigate(-1)}
        >
          Volver
        </Button>
      </Box>
    );
  }

  const formatDate = (dateString) =>
    dateString
      ? new Date(dateString).toLocaleDateString("es-PE", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : "Sin fecha";

  return (
    <Box sx={{ px: 4, pt: 2, maxWidth: 1200, margin: "0 auto" }}>
      {/* Header principal */}
      <Box mb={2}>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          Boda de Aniversario
        </Typography>
        <Typography variant="body1" sx={{ color: "text.secondary" }}>
          Celebración de 25 años de matrimonio
        </Typography>
        <Chip label="Aprobado" color="success" size="small" sx={{ mt: 1 }} />
        <Typography variant="body2" sx={{ mt: 1, color: "text.secondary" }}>
          Cod: {selectedQuotation.event_code}
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
                {formatDate(selectedQuotation.date)}
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
                {selectedQuotation.start_time && selectedQuotation.end_time
                  ? `${selectedQuotation.start_time} - ${selectedQuotation.end_time}`
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
                {(selectedQuotation.place_size ||
                  selectedQuotation.attendees_count ||
                  0) + " personas"}
              </Typography>
            </Grid>

            {/* Tipo */}
            <Grid item xs={12} md={3}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                <Category sx={{ color: "primary.main" }} />
                <Typography variant="body2" color="text.secondary">
                  Tipo
                </Typography>
              </Box>
              <Typography variant="h6">
                {selectedQuotation.place_type || "-"}
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Typography variant="body2" sx={{ color: "text.secondary", mb: 2 }}>
        ¡Tu evento ha sido aprobado! Nos pondremos en contacto contigo pronto.
      </Typography>
      <Typography variant="caption" sx={{ color: "text.secondary", mb: 2 }}>
        Solicitud creada el {formatDate(selectedQuotation.created_at)}
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
                {selectedQuotation.exact_address}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Referencia
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                {selectedQuotation.location_reference || "Sin referencia"}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Tipo de lugar
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                {selectedQuotation.place_type}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Tamaño
              </Typography>
              <Typography variant="body1">
                {(selectedQuotation.place_size || "No especificado") + " m²"}
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
              {selectedQuotation.services_requested?.length > 0 ? (
                selectedQuotation.services_requested.map((service, idx) => (
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
          Última actualización: {formatDate(selectedQuotation.updated_at)}
        </Typography>
      </Box>
    </Box>
  );
};
