import { Box, Typography, useTheme, Alert, Chip, Button, IconButton } from "@mui/material";
import { Add, Delete } from "@mui/icons-material";
import { useFormContext, useFieldArray } from "react-hook-form";
import { bankData } from "../../../../../constants";
import { PaymentManualContent } from ".";
import { useEffect } from "react";

export const PaymentManualCard = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const { control, getValues, setValue } = useFormContext();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "manualPayments",
  });

  useEffect(() => {
    const currentPayments = getValues("manualPayments");
    if (!currentPayments || currentPayments.length === 0) {
      append({ method: "yape", amount: 0 });
    }
  }, [])

  const colors = {
    innerCardBg: isDark ? "#141414" : "#fcfcfc",
    textPrimary: isDark ? "#fff" : "#000",
    textSecondary: isDark ? "#999" : "#666",
    border: isDark ? "#333" : "#e0e0e0",
    borderActive: theme.palette.primary.main,
  };

  const handleAddPayment = () => {
    append({ method: "yape", amount: 0 });
  };

  const handleRemovePayment = (index) => {
    if (fields.length > 1) {
      remove(index);
    }
  };

  const handlePaymentChange = (index, fieldName, value) => {
    setValue(`manualPayments.${index}.${fieldName}`, value, { shouldDirty: true });
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
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
            sx={{
              fontWeight: 600,
              fontSize: 11,
            }}
          />
        </Box>

        <Button
          variant="contained"
          size="small"
          startIcon={<Add />}
          onClick={handleAddPayment}
          sx={{
            color: "#fff",
            textTransform: "none",
            fontWeight: 600,
            boxShadow: "none",
          }}
        >
          Agregar
        </Button>
      </Box>

      {/* Lista de pagos */}
      {fields.map((field, index) => (
        <PaymentManualContent
          key={field.id}
          paymentNumber={index + 1}
          paymentId={field.id}
          colors={colors}
          bankData={bankData}
          onCopy={handleCopy}
          onRemove={fields.length > 1 ? () => handleRemovePayment(index) : null}
          payment={field}
          onPaymentChange={(fName, val) =>
            handlePaymentChange(index, fName, val)
          }
          isLast={index === fields.length - 1}
        />
      ))}
    </Box>
  );
};
