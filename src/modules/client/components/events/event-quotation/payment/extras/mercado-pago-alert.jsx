import { Alert, AlertTitle, Box, Stack, Typography, useTheme } from "@mui/material";
import { CreditCard, CheckCircle } from "@mui/icons-material";

export const MercadoPagoAlert = () => {
  const theme = useTheme();

  return (
    <Alert
      icon={<CreditCard />}
      severity="info"
      sx={{
        borderRadius: 2,
        mb: 3,
        bgcolor: "rgba(33, 150, 243, 0.08)",
      }}
    >
      <AlertTitle sx={{ fontWeight: 600 }}>
        Pago con Mercado Pago
      </AlertTitle>

      <Typography variant="body2" sx={{ mb: 1 }}>
        Completa el formulario de pago de forma segura.
      </Typography>

      <Stack spacing={0.6}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <CheckCircle sx={{ fontSize: 18, color: "#4caf50" }} />
          <Typography variant="body2">
            Tarjetas de crédito y débito
          </Typography>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <CheckCircle sx={{ fontSize: 18, color: "#4caf50" }} />
          <Typography variant="body2">
            Proceso 100% seguro
          </Typography>
        </Box>
      </Stack>
    </Alert>
  );
};
