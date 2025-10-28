import { Box, Typography, Card, CardContent, useTheme, Switch } from "@mui/material";
import { useFormContext } from "react-hook-form";
import { PaymentMercadoPagoContent } from "./";

export const PaymentMercadoPagoToggle = ({ quotationData }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const { setValue, watch } = useFormContext();

  const finalAmount = watch("amount");
  const useMercadoPago = watch("useMercadoPago"); 

  const colors = {
    cardBg: isDark ? "#1f1e1e" : "#ffffff",
    innerCardBg: isDark ? "#141414" : "#fcfcfc",
    textPrimary: isDark ? "#fff" : "#000",
    textSecondary: isDark ? "#999" : "#666",
    border: isDark ? "#444" : "#e0e0e0",
  };

  const disableMercadoPago = finalAmount > 30000;

  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: 3,
        bgcolor: colors.cardBg,
        mb: 3,
        border: `1px solid ${colors.border}`,
      }}
    >
      <CardContent>
        <Box sx={{ p: { xs: 0, md: 1 } }}>
          {/* Header con Toggle */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mb: useMercadoPago ? 2 : 0,
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 500, color: colors.textPrimary }}>
              Pago con Mercado Pago
            </Typography>

            <Switch
              checked={useMercadoPago}
              onChange={(e) =>
                !disableMercadoPago && setValue("useMercadoPago", e.target.checked)
              }
              disabled={disableMercadoPago}
              color="primary"
              sx={{
                transform: "scale(1.1)",
                opacity: disableMercadoPago ? 0.5 : 1,
                cursor: disableMercadoPago ? "not-allowed" : "pointer",
              }}
            />
          </Box>

          {/* Descripción del toggle */}
          {!useMercadoPago ? (
            <Typography
              variant="body2"
              sx={{ color: colors.textSecondary, mt: 2, opacity: 0.7 }}
            >
              Activa esta opción para pagar todo con Mercado Pago
            </Typography>
          ) : (
            <Box sx={{ mt: 2 }}>
              <PaymentMercadoPagoContent colors={colors} quotationData={quotationData} />
            </Box>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};
