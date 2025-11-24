import {
  Box,
  Typography,
  Button,
  Chip,
  Card,
  CardContent,
  useTheme,
  Stack,
} from "@mui/material";
import { 
  AccountBalanceWallet,
  CreditCard 
} from "@mui/icons-material";
import { useFormContext } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useManualPayment } from "../../../../../../../hooks/payment/use-manual-payment";
import { useMemo } from "react";

export const PaymentSummaryCard = ({ quotationData }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const navigate = useNavigate();

  const { watch, handleSubmit } = useFormContext();
  const { startCreateManualPayment, loading } = useManualPayment();

  const useMercadoPago = watch("useMercadoPago");
  const paymentType = watch("selectedPaymentType");
  const manualPayments = watch("manualPayments") || [];
  
  const totalPaid = manualPayments
    .reduce((sum, p) => sum + (Number(p?.amount) || 0), 0)
    .toFixed(2);

  const colors = {
    cardBg: isDark ? "#1f1e1e" : "#ffffff",
    innerCardBg: isDark ? "#2d2d2d" : "#f5f5f5",
    textPrimary: isDark ? "#fff" : "#000",
    textSecondary: isDark ? "#999" : "#666",
    border: isDark ? "#444" : "#e0e0e0",
  };

  const amount =
    paymentType === "partial"
      ? quotationData?.payment_schedules?.[0]?.total_amount.toFixed(2)
      : quotationData?.payment_schedules
          ?.reduce((sum, schedule) => sum + schedule.total_amount, 0)
          .toFixed(2);

  const getPaymentTypeConfig = () => {
    if (paymentType === "partial") {
      return {
        label: "Solo Pago Parcial",
        icon: <AccountBalanceWallet sx={{ fontSize: 18 }} />,
      };
    }
    return {
      label: "Pago Total",
      icon: <CreditCard sx={{ fontSize: 18 }} />,
    };
  };

  const paymentTypeConfig = getPaymentTypeConfig();

  const onSubmit = async (data) => {
    console.log("form submit data:", data);

    // Transformar los datos del formulario al formato esperado por el backend
    const paymentData = {
      payment_type: data.selectedPaymentType === "partial" ? "Parcial" : "Final",
      event_id: quotationData?.event_id || quotationData?._id,
      user_id: quotationData?.user_id || quotationData?.user?._id,
      payments: data.manualPayments.map(payment => ({
        payment_method: payment.method.charAt(0).toUpperCase() + payment.method.slice(1), // 'yape' -> 'Yape'
        amount: Number(payment.amount),
        operation_number: payment.operationNumber || undefined,
      })),
      images: data.manualPayments.map(payment => payment.voucher), // Array de File objects
    };

    console.log("Datos a enviar:", paymentData);

    const result = await startCreateManualPayment(paymentData);
    
    if (result) {
      console.log("Pagos creados exitosamente:", result);
      // Redirigir o mostrar mensaje de éxito
      navigate("/client/quotations", { replace: true });
    }
  };

  const onSubmitError = (errors) => {
    console.log("form validation errors:", errors);
  };

  const onCancel = () => {
    navigate("/client/quotations", { replace: true });
  };

  const isButtonDisabled = useMemo(() => loading, [loading]);

  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: 3,
        bgcolor: colors.cardBg,
        border: `1px solid ${colors.border}`,
      }}
    >
      <CardContent sx={{ p: 2.5 }}>
        {/* Header */}
        <Typography variant="h6" sx={{ mb: 2, p: 0.5 }}>
          Resumen del Pago
        </Typography>

        {/* Cotización */}
        <Box
          sx={{
            mb: 1.5,
            p: 1.5,
            borderRadius: 2,
            bgcolor: colors.innerCardBg,
            border: `1px solid ${colors.border}`,
          }}
        >
          <Typography fontSize={12} sx={{ color: colors.textSecondary, mb: 0.5 }}>
            Cotización
          </Typography>
          <Typography variant="body2" sx={{ fontWeight: 600, color: colors.textPrimary }}>
            {quotationData?.event_code}
          </Typography>
        </Box>

        {/* Tipo de Pago */}
        <Box
          sx={{
            mb: 1.5,
            p: 1.5,
            borderRadius: 2,
            bgcolor: colors.innerCardBg,
            border: `1px solid ${colors.border}`,
          }}
        >
          <Typography fontSize={12} sx={{ color: colors.textSecondary, mb: 1 }}>
            Tipo de Pago
          </Typography>
          <Chip
            label={paymentTypeConfig.label}
            icon={paymentTypeConfig.icon}
            color="success"
            sx={{
              fontWeight: 600,
              fontSize: 12,
              height: 28,
              "& .MuiChip-label": {
                px: 1.5,
              },
            }}
          />
        </Box>

        {/* Monto Requerido */}
        <Box
          sx={{
            mb: 1.5,
            p: 2,
            borderRadius: 2,
            bgcolor: colors.innerCardBg,
            border: `1px solid ${colors.border}`,
          }}
        >
          <Typography fontSize={12} sx={{ color: colors.textSecondary, mb: 0.5 }}>
            Monto Requerido
          </Typography>
          <Typography variant="h5" sx={{ fontWeight: 700, color: colors.textPrimary }}>
            S/ {amount}
          </Typography>
        </Box>

        {/* Total Pagado */}
        <Box
          sx={{
            mb: 2.5,
            p: 2,
            borderRadius: 2,
            bgcolor: colors.innerCardBg,
            border: `1px solid ${colors.border}`,
          }}
        >
          <Typography fontSize={12} sx={{ color: colors.textSecondary, mb: 0.5 }}>
            Total Pagado
          </Typography>
          <Typography variant="h5" sx={{ fontWeight: 700, color: colors.textPrimary }}>
            S/ {totalPaid}
          </Typography>
        </Box>

        {/* Botones */}
        <Stack spacing={2}>
          {!useMercadoPago ? (
            <Button
              variant="contained"
              onClick={handleSubmit(onSubmit, onSubmitError)}
              fullWidth
              sx={{
                fontSize: 16,
                backgroundColor: 'theme.palette.primary.main',
                color: '#fff',
                borderRadius: 2,
                textTransform: 'none',
                px: 3,
                py: 1.5
              }}
              disabled={isButtonDisabled}
            >
              Registrar Pagos
            </Button>
          ) : (
            <Typography align={'center'}>
              El botón de pago está en el formulario de Mercado Pago
            </Typography>
          )}

          <Button
            variant="outlined"
            onClick={onCancel}
            fullWidth
            sx={{
              py: 1.2,
              borderColor: colors.border,
              color: colors.textPrimary,
              textTransform: "none",
              fontWeight: 600,
              fontSize: 14,
              borderRadius: 2,
              "&:hover": {
                borderColor: colors.textPrimary,
                bgcolor: isDark ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.02)",
              },
            }}
          >
            Cancelar
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
};
