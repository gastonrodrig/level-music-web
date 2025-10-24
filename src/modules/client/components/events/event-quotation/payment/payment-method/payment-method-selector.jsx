import { Box, Typography, Button, useTheme, Alert } from "@mui/material";
import { CreditCard, PhoneIphone } from "@mui/icons-material";
import { useFormContext } from "react-hook-form";
import { PaymentMercadoPagoContent, PaymentManualContent } from "./";

export const PaymentMethodSelector = ({ bankData, quotationData, onCopy }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const { setValue, watch } = useFormContext();

  const paymentTab = watch("selectedPaymentTab");
  const finalAmount = watch("amount");

  const colors = {
    innerCardBg: isDark ? "#141414" : "#fcfcfc",
    textPrimary: isDark ? "#fff" : "#000",
    textSecondary: isDark ? "#999" : "#666",
    border: isDark ? "#333" : "#e0e0e0",
    borderActive: theme.palette.primary.main,
  };

  const disableMercadoPago = finalAmount >= 30000;
  const showAlert500 = finalAmount > 500 && finalAmount < 30000;
  const showAlert30000 = finalAmount >= 30000;

  return (
    <Box sx={{ p: { xs: 0, md: 1 } }}>
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
          onClick={() =>
            !disableMercadoPago && setValue("selectedPaymentTab", "mercadopago")
          }
          startIcon={<CreditCard />}
          disabled={disableMercadoPago}
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
            opacity: disableMercadoPago ? 0.5 : 1,
            cursor: disableMercadoPago ? "not-allowed" : "pointer",
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

      {/* Alerta si el monto excede el límite */}
      {showAlert500 && (
        <Alert
          severity="warning"
          sx={{
            borderRadius: 2,
            mb: 3,
            bgcolor: isDark
              ? "rgba(255, 179, 0, 0.1)"
              : "rgba(255, 245, 157, 0.3)",
            color: isDark ? "#ffcc80" : "#795548",
            "& .MuiAlert-icon": {
              color: isDark ? "#ffb300" : "#795548",
            },
          }}
        >
          Los pagos mayores a <strong>S/ 500</strong> deben realizarse mediante{" "}
          <strong>Transferencia Bancaria</strong> o{" "}
          <strong>Mercado Pago</strong>.
        </Alert>
      )}

      {showAlert30000 && (
        <Alert
          severity="warning"
          sx={{
            borderRadius: 2,
            mb: 3,
            bgcolor: isDark
              ? "rgba(255, 179, 0, 0.1)"
              : "rgba(255, 245, 157, 0.3)",
            color: isDark ? "#ffcc80" : "#795548",
            "& .MuiAlert-icon": {
              color: isDark ? "#ffb300" : "#795548",
            },
          }}
        >
          Los pagos mayores a <strong>S/ 30,000</strong> deben realizarse mediante{" "}
          <strong>Transferencia Bancaria</strong>.
        </Alert>
      )}

      {/* Contenido dinámico según el tab */}
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
