import { Box, Typography, useTheme, Alert, Chip, Button, IconButton } from "@mui/material";
import { Add, Delete } from "@mui/icons-material";
import { useFormContext } from "react-hook-form";
import { PaymentManualContent } from "./";
import { useState } from "react";

export const PaymentMethodSelector = ({ bankData, quotationData, onCopy }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const { watch, setValue } = useFormContext();

  const finalAmount = watch("amount");
  const paymentTab = watch("selectedPaymentTab");

  const [payments, setPayments] = useState([
    { id: 1, method: "yape", amount: 0 }
  ]);

  const colors = {
    innerCardBg: isDark ? "#141414" : "#fcfcfc",
    textPrimary: isDark ? "#fff" : "#000",
    textSecondary: isDark ? "#999" : "#666",
    border: isDark ? "#333" : "#e0e0e0",
    borderActive: theme.palette.primary.main,
  };

  const showAlert500 = finalAmount > 500 && finalAmount < 30000 && paymentTab === "manual";
  const showAlert30000 = finalAmount >= 30000 && paymentTab === "manual";

  // No mostrar el selector si está en modo Mercado Pago
  if (paymentTab === "mercadopago") {
    return null;
  }

  const handleAddPayment = () => {
    const newId = Math.max(...payments.map(p => p.id), 0) + 1;
    setPayments([...payments, { id: newId, method: "yape", amount: 0 }]);
  };

  const handleRemovePayment = (id) => {
    if (payments.length > 1) {
      setPayments(payments.filter(p => p.id !== id));
    }
  };

  const handlePaymentChange = (id, field, value) => {
    setPayments(payments.map(p => 
      p.id === id ? { ...p, [field]: value } : p
    ));
  };

  return (
    <Box sx={{ p: { xs: 0, md: 1 } }}>
      {/* Header con badge y botón agregar */}
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 500, color: colors.textPrimary }}>
            Métodos de pago
          </Typography>

          <Chip
            label="Requieren aprobación del administrador"
            size="small"
            icon={<Box component="span" sx={{ fontSize: 16 }}>⏳</Box>}
            sx={{
              bgcolor: isDark ? "rgba(255, 179, 0, 0.15)" : "rgba(255, 179, 0, 0.1)",
              color: isDark ? "#ffb300" : "#f57c00",
              fontWeight: 600,
              fontSize: 11,
              border: `1px solid ${isDark ? "#ffb300" : "#f57c00"}`,
              "& .MuiChip-icon": {
                color: isDark ? "#ffb300" : "#f57c00",
              },
            }}
          />
        </Box>

        <Button
          variant="contained"
          size="small"
          startIcon={<Add />}
          onClick={handleAddPayment}
          sx={{
            bgcolor: "#ff9800",
            color: "#fff",
            textTransform: "none",
            fontWeight: 600,
            boxShadow: "none",
            "&:hover": {
              bgcolor: "#f57c00",
            },
          }}
        >
          Agregar
        </Button>
      </Box>

      

      {/* Lista de pagos */}
      {payments.map((payment, index) => (
        <PaymentManualContent
          key={payment.id}
          paymentNumber={index + 1}
          paymentId={payment.id}
          isDark={isDark}
          colors={colors}
          bankData={bankData}
          quotationData={quotationData}
          onCopy={onCopy}
          onRemove={payments.length > 1 ? () => handleRemovePayment(payment.id) : null}
          payment={payment}
          onPaymentChange={handlePaymentChange}
          totalAmount={finalAmount}
        />
      ))}
    </Box>
  );
};
