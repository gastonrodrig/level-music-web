import { Box, Typography, Chip, Grid, useTheme } from "@mui/material";
import { EventAvailable, Person } from "@mui/icons-material";
import { formatDateString, formatTimeRange } from "../../../../utils";

export const EventSummaryCard = ({ selected }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  if (!selected) return null;

  return (
    <>
      <Grid container spacing={2}>
        {/* Información del Evento */}
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
                label={selected?.client_type}
                color="primary"
                size="small"
                sx={{ fontWeight: 500, fontSize: 13, mt: 0.5, color: '#fff' }}
              />
            </Box>

            <Grid container spacing={2}>
              {selected?.client_type === "Persona" ? (
                <>
                  <Grid item xs={12} md={6}>
                    <Typography fontSize={14} color="text.secondary">
                      Nombre
                    </Typography>
                    <Typography fontSize={14}>
                      {selected?.first_name}
                    </Typography>

                    <Typography fontSize={14} color="text.secondary" mt={2}>
                      Email
                    </Typography>
                    <Typography fontSize={14}>
                      {selected?.email}
                    </Typography>

                    <Typography fontSize={14} color="text.secondary" mt={2}>
                      Tipo de Documento
                    </Typography>
                    <Typography fontSize={14}>
                      {selected?.document_type}
                    </Typography>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Typography fontSize={14} color="text.secondary">
                      Apellido
                    </Typography>
                    <Typography fontSize={14}>
                      {selected?.last_name}
                    </Typography>

                    <Typography fontSize={14} color="text.secondary" mt={2}>
                      Teléfono
                    </Typography>
                    <Typography fontSize={14}>
                      {selected?.phone}
                    </Typography>

                    <Typography fontSize={14} color="text.secondary" mt={2}>
                      Número
                    </Typography>
                    <Typography fontSize={14}>
                      {selected?.document_number}
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
                      {selected?.company_name}
                    </Typography>

                    <Typography fontSize={14} color="text.secondary" mt={2}>
                      Email
                    </Typography>
                    <Typography fontSize={14}>
                      {selected?.email}
                    </Typography>

                    <Typography fontSize={14} color="text.secondary" mt={2}>
                      Tipo de Documento
                    </Typography>
                    <Typography fontSize={14}>
                      {selected?.document_type}
                    </Typography>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Typography fontSize={14} color="text.secondary">
                      Representante
                    </Typography>
                    <Typography fontSize={14}>
                      {selected?.contact_person}
                    </Typography>

                    <Typography fontSize={14} color="text.secondary" mt={2}>
                      Teléfono
                    </Typography>
                    <Typography fontSize={14}>
                      {selected?.phone}
                    </Typography>

                    <Typography fontSize={14} color="text.secondary" mt={2}>
                      Número
                    </Typography>
                    <Typography fontSize={14}>
                      {selected?.document_number}
                    </Typography>
                  </Grid>
                </>
              )}
            </Grid>
          </Box>
        </Grid>
      </Grid>
    </>
  );
};
