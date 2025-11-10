import { Box, Typography, Chip, Grid, useTheme } from "@mui/material";
import { Article, AccessTime } from "@mui/icons-material";

export const EventSummaryBox = ({ data }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  const { version, lastUpdate, client, eventType, eventDate, amount } = data;

  return (
    <Box
      sx={{
        backgroundColor: isDark ? "#1f1e1e" : "#f5f5f5",
        border: `1px solid ${theme.palette.divider}`,
        borderLeft: `6px solid ${theme.palette.primary.main}`,
        borderRadius: 2,
        p: { xs: 2, sm: 3 },
        mb: 3,
      }}
    >
      <Grid container spacing={2} alignItems="center">
        {/* encabezado */}
        <Grid item xs={12} sm={8} md={6}>
          <Box display="flex" alignItems="center" gap={2}>
            <Box
              sx={{
                width: 44,
                height: 44,
                borderRadius: 1,
                backgroundColor: theme.palette.action.selected,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <Article
                fontSize="small"
                sx={{ color: theme.palette.primary.main }}
              />
            </Box>

            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                Versión {version}
              </Typography>
              <Typography
                color="text.secondary"
                sx={{
                  fontSize: 12,
                  mt: 0.5,
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  flexWrap: "wrap",
                }}
              >
                <AccessTime fontSize="small" sx={{ opacity: 0.8 }} />
                Última actualización: {lastUpdate || "—"}
              </Typography>
            </Box>
          </Box>
        </Grid>

        {/* chip */}
        <Grid
          item
          xs={12}
          sm={4}
          md={6}
          sx={{
            textAlign: { xs: "left", sm: "right" },
            mt: { xs: 1, sm: 0 },
          }}
        >
          <Chip label="Actual" color="success" size="small" />
        </Grid>

        {/* datos inferiores */}
        {[
          { label: "Cliente", value: client },
          { label: "Tipo de Evento", value: eventType },
          { label: "Fecha del Evento", value: eventDate },
          {
            label: "Monto Total",
            value: amount ? `S/ ${amount.toFixed(2)}` : "—",
          },
        ].map((item, i) => (
          <Grid item xs={12} sm={6} md={3} key={i}>
            <Typography color="text.secondary" sx={{ fontSize: 12 }}>
              {item.label}
            </Typography>
            <Typography sx={{ fontWeight: 600, mt: 0.5 }}>
              {item.value || "—"}
            </Typography>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};
