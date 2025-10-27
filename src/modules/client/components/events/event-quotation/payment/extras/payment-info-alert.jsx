import { Box, Typography, Card, CardContent, useTheme } from "@mui/material";
import { Info, CheckCircle } from "@mui/icons-material";

export const PaymentInfoAlert = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  const colors = {
    innerCardBg: isDark ? "#1a2332" : "#e3f2fd",
    textPrimary: isDark ? "#fff" : "#000",
    textSecondary: isDark ? "#90caf9" : "#1976d2",
    border: isDark ? "#2196f3" : "#64b5f6",
  };

  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: 2,
        bgcolor: colors.innerCardBg,
        border: `1px solid ${colors.border}`,
      }}
    >
      <CardContent sx={{ p: 2.5 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
          <Info sx={{ color: colors.textSecondary, fontSize: 20 }} />
          <Typography variant="subtitle2" sx={{ fontWeight: 600, color: colors.textPrimary }}>
            Información importante
          </Typography>
        </Box>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
          <Box sx={{ display: "flex", gap: 1 }}>
            <Typography sx={{ color: "#f57c00", fontSize: 20 }}>⏳</Typography>
            <Typography variant="body2" sx={{ color: colors.textPrimary }}>
              Todos estos pagos quedan en estado{" "}
              <Box component="span" sx={{ color: "#ff9800", fontWeight: 600 }}>
                Pendiente
              </Box>{" "}
              hasta que el administrador los revise y apruebe.
            </Typography>
          </Box>

          <Box sx={{ display: "flex", gap: 1 }}>
            <CheckCircle sx={{ color: "#4caf50", fontSize: 20 }} />
            <Typography variant="body2" sx={{ color: colors.textPrimary }}>
              Si prefieres aprobación automática, usa{" "}
              <Box component="span" sx={{ color: colors.textSecondary, fontWeight: 600 }}>
                Mercado Pago
              </Box>{" "}
              (disponible arriba).
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};