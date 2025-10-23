import { useState } from "react";
import { Box, Typography, Card, CardContent, Grid, Divider, useTheme } from "@mui/material";
import { useQuotationStore } from "../../../../../hooks";
import {
  PaymentTypeSelector,
  PaymentMethodSelector,
  PaymentSummaryCard,
  PaymentFormFields,
} from "../../../components";

export const QuotationPaymentsPage = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const [paymentType, setPaymentType] = useState("partial");
  const [paymentMethod, setPaymentMethod] = useState("yape");
  const { selected } = useQuotationStore();

  const quotationData = {
    code: selected?.event_code || "COT-001",
    client: selected?.client_name || "María González",
    eventType: selected?.event_type_name || "Fiesta Corporativa",
    totalAmount: selected?.total_amount || 7660.0,
    advancePayment: selected?.advance_payment || 4580.0,
    eventDate: selected?.event_date || "2025-10-21",
    paymentStatus: selected?.payment_status || "Anticipo Pendiente",
  };

  const bankData = {
    banco: "Banco BCP",
    cuenta: "191-2345678-0-90",
    cci: "00219100234567809012",
    titular: "Level Music Corp S.A.C",
    ruc: "20123456789",
    yapeNumber: "+51 987 654 321",
    yapeName: "Level Music Corp",
    plinNumber: "+51 987 654 321",
    plinName: "Level Music Corp",
  };

  const colors = {
    cardBg: isDark ? "#1f1e1e" : "#ffffff",
    textPrimary: isDark ? "#fff" : "#000",
    textSecondary: isDark ? "#999" : "#666",
    border: isDark ? "#444" : "#e0e0e0",
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
  };

  const handleRegister = () => {
    console.log("Registrar pago");
  };

  const handleCancel = () => {
    console.log("Cancelar");
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1400, margin: "0 auto" }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1, color: colors.textPrimary }}>
          Procesar Pago - {quotationData.code}
        </Typography>
        <Typography variant="body2" sx={{ color: colors.textSecondary }}>
          Cliente: {quotationData.client}
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Columna Izquierda */}
        <Grid item xs={12} md={7}>
          {/* Selección de Tipo de Pago */}
          <Card
            elevation={0}
            sx={{ borderRadius: 3, bgcolor: colors.cardBg, mb: 3, border: `1px solid ${colors.border}` }}
          >
            <CardContent>
              <PaymentTypeSelector
                paymentType={paymentType}
                quotationData={quotationData}
                onChange={setPaymentType}
              />
            </CardContent>
          </Card>

          {/* Método de Pago */}
          <Card
            elevation={0}
            sx={{ borderRadius: 3, bgcolor: colors.cardBg, mb: 3, border: `1px solid ${colors.border}` }}
          >
            <CardContent>
              <PaymentMethodSelector
                paymentMethod={paymentMethod}
                bankData={bankData}
                onMethodChange={setPaymentMethod}
                onCopy={handleCopy}
              />

              <Divider sx={{ mx: 1, my: 3, borderColor: colors.border }} />

              <PaymentFormFields />
            </CardContent>
          </Card>
        </Grid>

        {/* Columna Derecha - Resumen */}
        <Grid item xs={12} md={5}>
          <Box sx={{ position: "sticky", top: 20 }}>
            <PaymentSummaryCard
              quotationData={quotationData}
              paymentType={paymentType}
              onRegister={handleRegister}
              onCancel={handleCancel}
            />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};