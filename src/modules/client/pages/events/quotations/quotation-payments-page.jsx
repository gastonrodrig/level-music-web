import { useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Divider,
  useTheme,
} from "@mui/material";
import {
  PaymentTypeSelector,
  PaymentMethodSelector,
  PaymentSummaryCard,
  PaymentFormFields,
} from "../../../components";
import { useQuotationStore } from "../../../../../hooks";
import { FormProvider, useForm } from "react-hook-form";

export const QuotationPaymentsPage = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  const [paymentType, setPaymentType] = useState("partial");

  const { selected } = useQuotationStore();

  const formMethods = useForm({
    defaultValues: {
      selectedPaymentTab: "manual",
      selectedPaymentMethod: "yape",
    }
  })

  const { watch } = formMethods;

  const paymentTab = watch("selectedPaymentTab");
  const paymentMethod = watch("selectedPaymentMethod");

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
    cuenta: "194-96138910-008",
    cci: "0021-9419-6138-9100-0894",
    titular: "Level Music Corp S.A.C",
    ruc: "20603023596",
    yapeNumber: "+51 989 160 593",
    yapeName: "Level Music Corp",
    plinNumber: "+51 989 160 593",
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
    <FormProvider {...formMethods}>
      <Box sx={{ px: 4, pt: 2, maxWidth: 1200, margin: "0 auto" }}>
        {/* Header */}
        <Box sx={{ mb: 2 }}>
          <Typography
            variant="h4"
            sx={{ fontWeight: 700, mb: 1, color: colors.textPrimary }}
          >
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
              sx={{
                borderRadius: 3,
                bgcolor: colors.cardBg,
                mb: 3,
                border: `1px solid ${colors.border}`,
              }}
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
              sx={{
                borderRadius: 3,
                bgcolor: colors.cardBg,
                mb: 3,
                border: `1px solid ${colors.border}`,
              }}
            >
              <CardContent>
                <PaymentMethodSelector
                  paymentMethod={paymentMethod}
                  bankData={bankData}
                  onCopy={handleCopy}
                  paymentTab={paymentTab}
                  quotationData={quotationData}
                />

                { paymentTab === "manual" && (
                  <>
                    <Divider sx={{ mx: 1, my: 3, borderColor: colors.border }} />

                    <PaymentFormFields />
                  </>
                )}
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
    </FormProvider>
  );
};
