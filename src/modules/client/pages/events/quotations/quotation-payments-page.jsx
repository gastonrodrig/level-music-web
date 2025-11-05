import { useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  useTheme,
} from "@mui/material";
import {
  PaymentTypeSelector,
  PaymentManualCard,
  PaymentSummaryCard,
  PaymentLocationSelector,
  PaymentInfoAlert,
  PaymentMercadoPagoToggle,
} from "../../../components";
import { useQuotationStore } from "../../../../../hooks";
import { FormProvider, useForm } from "react-hook-form";
import { useScreenSizes } from "../../../../../shared/constants/screen-width";
import { useNavigate } from "react-router-dom";

export const QuotationPaymentsPage = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const navigate = useNavigate();
  const { isMd } = useScreenSizes();

  const { selected } = useQuotationStore();

  const partialAmount = selected?.payment_schedules[0]?.total_amount;

  const formMethods = useForm({
    defaultValues: {
      selectedPaymentType: "partial",
      useMercadoPago: false,
      selectedPaymentMethod: partialAmount > 500 ? "transfer" : "yape",
      selectedPaymentLocation: "online",
      brickReady: false,
      amount: partialAmount,
      operationNumber: "",
      manualPayments: [],
      voucher: null
    },
  });

  const { watch, setValue } = formMethods;

  const useMercadoPago = watch("useMercadoPago");
  const finalAmount = watch("amount");

  useEffect(() => {
    if (!selected) {
      navigate("/client/quotations", { replace: true });
      return;
    }
  }, [selected, navigate]);

  useEffect(() => {
    if (finalAmount > 30000 && useMercadoPago) {
      setValue("useMercadoPago", false);
    }
  }, [finalAmount, useMercadoPago, setValue]);


  const colors = {
    cardBg: isDark ? "#1f1e1e" : "#ffffff",
    textPrimary: isDark ? "#fff" : "#000",
    border: isDark ? "#444" : "#e0e0e0",
  };

  return (
    <FormProvider {...formMethods}>
      <Box sx={{ px: isMd ? 4 : 0, pt: 2, maxWidth: 1200, margin: "0 auto" }}>
        <Box sx={{ mb: 2 }}>

          <Typography
            variant="h4"
            sx={{ fontWeight: 700, mb: 1, color: colors.textPrimary }}
          >
            Procesar Pago: {selected?.event_code}
          </Typography>

          <Typography fontSize={15}>
            <Box component="span" fontWeight="bold">
              Cliente:
            </Box>{" "}
            {selected?.client_type === "Persona"
              ? `${selected?.first_name} ${selected?.last_name}`
              : selected?.business_name}{" "}
            -{" "}
            <Box component="span" fontWeight="bold">
              Evento:
            </Box>{" "}
            {selected?.name}
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {/* Columna Izquierda */}
          <Grid item xs={12} md={7}>
            {/* Ubicación del Pago */}
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
                <PaymentLocationSelector />
              </CardContent>
            </Card>

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
                <PaymentTypeSelector quotationData={selected} />
              </CardContent>
            </Card>

            {/* Toggle de Mercado Pago */}
            {finalAmount < 30000 && (
              <PaymentMercadoPagoToggle quotationData={selected} />
            )}

            {/* Métodos de Pago Manuales - Solo si NO está en modo Mercado Pago */}
            {(!useMercadoPago || finalAmount >= 30000) && (
              <>
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
                    <PaymentManualCard />
                  </CardContent>
                </Card>

                {/* Información Importante - Solo en modo manual */}
                <PaymentInfoAlert />
              </>
            )}
          </Grid>

          {/* Columna Derecha - Resumen */}
          <Grid item xs={12} md={5}>
            <Box sx={{ position: "sticky", top: 20 }}>
              <PaymentSummaryCard quotationData={selected} />
            </Box>
          </Grid>
        </Grid>
      </Box>
    </FormProvider>
  );
};
