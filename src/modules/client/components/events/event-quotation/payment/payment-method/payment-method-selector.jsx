import { Box, Typography, Button, useTheme } from "@mui/material";
import { CreditCard, PhoneIphone } from "@mui/icons-material";
import { useFormContext } from "react-hook-form";
import { PaymentMercadoPagoContent, PaymentManualContent } from "./";

export const PaymentMethodSelector = ({ bankData, quotationData, onCopy }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  // Acceso al contexto del formulario
  const { setValue, watch } = useFormContext();
  const paymentTab = watch("selectedPaymentTab");

  const colors = {
    innerCardBg: isDark ? "#141414" : "#fcfcfc",
    textPrimary: isDark ? "#fff" : "#000",
    textSecondary: isDark ? "#999" : "#666",
    border: isDark ? "#333" : "#e0e0e0",
    borderActive: theme.palette.primary.main,
  };

  return (
    <Box sx={{ p: 1 }}>
      <Typography
        variant="h6"
        sx={{ mb: 3, fontWeight: 500, color: colors.textPrimary }}
      >
        Método de pago
      </Typography>

      {/* Tabs */}
      <Box
        sx={{
          display: "flex",
          gap: 1,
          mb: 3,
          bgcolor: isDark ? "#2d2d2d" : "#e0e0e0",
          borderRadius: 2,
          p: 0.5,
        }}
      >
        {/* Tab Mercado Pago */}
        <Button
          fullWidth
          variant={paymentTab === "mercadopago" ? "contained" : "text"}
          onClick={() => setValue("selectedPaymentTab", "mercadopago")}
          startIcon={<CreditCard />}
          sx={{
            bgcolor:
              paymentTab === "mercadopago"
                ? isDark
                  ? "#1a1a1a"
                  : "#fff"
                : "transparent",
            color:
              paymentTab === "mercadopago"
                ? colors.textPrimary
                : colors.textSecondary,
            textTransform: "none",
            fontWeight: 600,
            boxShadow: "none",
            "&:hover": {
              bgcolor:
                paymentTab === "mercadopago"
                  ? isDark
                    ? "#2a2a2a"
                    : "#f9f9f9"
                  : "transparent",
            },
          }}
        >
          Mercado Pago
        </Button>

        {/* Tab Pago Manual */}
        <Button
          fullWidth
          variant={paymentTab === "manual" ? "contained" : "text"}
          onClick={() => setValue("selectedPaymentTab", "manual")}
          startIcon={<PhoneIphone />}
          sx={{
            bgcolor:
              paymentTab === "manual"
                ? isDark
                  ? "#1a1a1a"
                  : "#fff"
                : "transparent",
            color:
              paymentTab === "manual"
                ? colors.textPrimary
                : colors.textSecondary,
            textTransform: "none",
            fontWeight: 600,
            boxShadow: "none",
            "&:hover": {
              bgcolor:
                paymentTab === "manual"
                  ? isDark
                    ? "#2a2a2a"
                    : "#f9f9f9"
                  : "transparent",
            },
          }}
        >
          Pago Manual
        </Button>
      </Box>

      {/* Contenido dinámico segun el tab */}
      {paymentTab === "mercadopago" ? (
        <PaymentMercadoPagoContent
          colors={colors}
          bankData={bankData}
          quotationData={quotationData}
        />
      ) : (
        <PaymentManualContent
          isDark={isDark}
          colors={colors}
          bankData={bankData}
          quotationData={quotationData}
          onCopy={onCopy}
        />
      )}
    </Box>
  );
};
