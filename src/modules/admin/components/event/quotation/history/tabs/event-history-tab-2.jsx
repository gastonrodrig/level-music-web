import { Box, Typography, Divider, useTheme } from "@mui/material";
import {
  CalendarMonth,
  MonetizationOn,
  Place,
  Groups,
  Notes,
} from "@mui/icons-material";
import { formatEventVersions } from "../../../../../../../shared/utils";

export const EventHistoryTab2 = ({ version = {} }) => {
  const theme = useTheme();

  return (
    <Box>
      <Typography
        color="text.secondary"
        sx={{ mb: 1, display: "flex", alignItems: "center", gap: 1 }}
      >
        <CalendarMonth fontSize="small" /> Información del evento
      </Typography>
      <Divider sx={{ my: 1 }} />

      <Box
        sx={{
          backgroundColor: theme.palette.background.default,
          p: 2,
          borderRadius: 2,
          border: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
          <MonetizationOn fontSize="small" />
          <Box>
            <Typography variant="body2" color="text.secondary">
              Tipo de Evento
            </Typography>
            <Typography sx={{ fontWeight: 700 }}>
              {version?.event_type_name || "-"}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
          <CalendarMonth fontSize="small" />
          <Box>
            <Typography variant="body2" color="text.secondary">
              Fecha y Hora
            </Typography>
            <Typography sx={{ fontWeight: 700 }}>
              {formatEventVersions(version)}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
          <Place fontSize="small" />
          <Box>
            <Typography variant="body2" color="text.secondary">
              Lugar
            </Typography>
            <Typography sx={{ fontWeight: 700 }}>
              {version?.exact_address || "-"}
            </Typography>
            {version?.location_reference && (
              <Typography color="text.secondary" sx={{ fontSize: 12 }}>
                {version.location_reference}
              </Typography>
            )}
          </Box>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
          <Groups fontSize="small" />
          <Box>
            <Typography variant="body2" color="text.secondary">
              Número de Asistentes
            </Typography>
            <Typography sx={{ fontWeight: 700 }}>
              {version?.attendees_count ?? 0} personas
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <CalendarMonth fontSize="small" />
          <Box>
            <Typography variant="body2" color="text.secondary">
              Tipo/Tamaño del lugar
            </Typography>
            <Typography sx={{ fontWeight: 700 }}>
              {version?.place_type || "-"} / {version?.place_size ?? "-"} m²
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Additional meta */}
      <Box sx={{ mt: 2 }}>
        <Typography
          color="text.secondary"
          sx={{ mb: 1, display: "flex", alignItems: "center", gap: 1 }}
        >
          <Notes fontSize="small" /> Detalles adicionales
        </Typography>
        <Divider sx={{ my: 1 }} />
        <Box
          sx={{
            backgroundColor: theme.palette.background.default,
            p: 2,
            borderRadius: 2,
            border: `1px solid ${theme.palette.divider}`,
          }}
        >
          <Typography>
            <strong>Nombre:</strong> {version?.name || "-"}
          </Typography>
          <Typography>
            <strong>Descripción:</strong> {version?.description || "-"}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};
