import { Box, Typography, Card, CardContent, useTheme } from "@mui/material";
import { useFormContext } from "react-hook-form";
import { PaymentMercadoPagoContent } from "../payment-method";

export const PaymentMercadoPagoToggle = ({ quotationData }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const { setValue, watch } = useFormContext();

  const paymentTab = watch("selectedPaymentTab");
  const finalAmount = watch("amount");

  const colors = {
    cardBg: isDark ? "#1f1e1e" : "#ffffff",
    innerCardBg: isDark ? "#141414" : "#fcfcfc",
    textPrimary: isDark ? "#fff" : "#000",
    textSecondary: isDark ? "#999" : "#666",
    border: isDark ? "#444" : "#e0e0e0",
  };

  const disableMercadoPago = finalAmount >= 30000;

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
              mb: paymentTab === "mercadopago" ? 2 : 0,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  bgcolor: theme.palette.primary.main,
                }}
              />
              <Typography variant="subtitle1" sx={{ fontWeight: 600, color: colors.textPrimary }}>
                Pago con Mercado Pago
              </Typography>
            </Box>

            {/* Toggle Switch */}
            <Box
              component="label"
              sx={{
                position: "relative",
                display: "inline-block",
                width: 48,
                height: 24,
                cursor: disableMercadoPago ? "not-allowed" : "pointer",
                opacity: disableMercadoPago ? 0.5 : 1,
              }}
            >
              <input
                type="checkbox"
                checked={paymentTab === "mercadopago"}
                disabled={disableMercadoPago}
                onChange={(e) =>
                  !disableMercadoPago &&
                  setValue("selectedPaymentTab", e.target.checked ? "mercadopago" : "manual")
                }
                style={{ opacity: 0, width: 0, height: 0 }}
              />
              <Box
                sx={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  bgcolor: paymentTab === "mercadopago" ? theme.palette.primary.main : "#ccc",
                  borderRadius: 24,
                  transition: "0.3s",
                  "&::before": {
                    content: '""',
                    position: "absolute",
                    height: 18,
                    width: 18,
                    left: paymentTab === "mercadopago" ? 26 : 3,
                    bottom: 3,
                    bgcolor: "white",
                    borderRadius: "50%",
                    transition: "0.3s",
                  },
                }}
              />
            </Box>
          </Box>

          {/* Descripción del toggle */}
          {paymentTab !== "mercadopago" && (
            <Typography variant="body2" sx={{ color: colors.textSecondary, mt: 2, opacity: 0.7 }}>
              Activa esta opción para pagar todo con Mercado Pago
            </Typography>
          )}

          {/* Contenido expandido cuando está activado */}
          {paymentTab === "mercadopago" && (
            <Box sx={{ mt: 2 }}>
              <PaymentMercadoPagoContent colors={colors} quotationData={quotationData} />
            </Box>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};