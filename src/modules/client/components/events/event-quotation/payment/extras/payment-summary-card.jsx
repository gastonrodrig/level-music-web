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
  BarChart, 
  Home, 
  Storefront, 
  AccountBalanceWallet,
  CreditCard 
} from "@mui/icons-material";
import { useFormContext } from "react-hook-form";
import { useManualPayment } from "../../../../../../hooks/payment";
import { useNavigate } from "react-router-dom";

export const PaymentSummaryCard = ({ quotationData }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const navigate = useNavigate();

  const { watch, handleSubmit, setValue } = useFormContext();
  const { startCreateManualPayment } = useManualPayment();

  const useMercadoPago = watch("useMercadoPago");
  const paymentType = watch("selectedPaymentType");
  const selectedPaymentLocation = watch("selectedPaymentLocation");

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


  const getLocationConfig = () => {
    if (selectedPaymentLocation === "online") {
      return {
        label: "En Casa (Online)",
        icon: <Home sx={{ fontSize: 18 }} />,
      };
    }
    return {
      label: "En Local (Presencial)",
      icon: <Storefront sx={{ fontSize: 18 }} />,
    };
  };

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

  const locationConfig = getLocationConfig();
  const paymentTypeConfig = getPaymentTypeConfig();

  const onSubmit = async (data) => {
    try {
      const values = data; // form values
      const manualPayments = values.manualPayments || [];

      // send each manual payment separately
      for (const mp of manualPayments) {
        const payload = {
          event_id: quotationData?._id || quotationData?.event_id,
          quotation_id: quotationData?._id,
          amount: mp.amount,
          currency: mp.currency || 'PEN',
          payment_method: mp.method,
          payer_name: values.payer_name || '',
          notes: values.notes || '',
          records: [{ operation_number: mp.operation_number || '' }],
          images: mp.receiptFile ? [mp.receiptFile] : [],
        };

        await startCreateManualPayment(payload);
      }
    } catch (err) {
      console.error('Error registrando pagos:', err);
    }
  };

  const onCancel = () => {
    navigate("/client/quotations", { replace: true });
  };

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

        {/* Ubicación */}
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
            Ubicación
          </Typography>
          <Chip
            label={locationConfig.label}
            icon={locationConfig.icon}
            color="info"
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
            S/ 0.00
          </Typography>
        </Box>

        {/* Botones */}
        <Stack spacing={2}>
          {!useMercadoPago ? (
            <Button
              variant="contained"
              onClick={handleSubmit(onSubmit)}
              fullWidth
              sx={{
                py: 1.2,
                boxShadow: "none",
                textTransform: "none",
                fontWeight: 600,
                fontSize: 14,
                borderRadius: 2,
                color: "#fff",
              }}
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
