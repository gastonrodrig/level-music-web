import {
  Box,
  Typography,
  Button,
  Chip,
  Divider,
  Stack,
  useTheme,
} from "@mui/material";
import { CalendarToday } from "@mui/icons-material";
import { useFormContext } from "react-hook-form";
import { useNavigate } from "react-router-dom";

export const PaymentSummaryCard = ({
  quotationData
}) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const navigate = useNavigate();

  const { watch } = useFormContext();

  const paymentType = watch("selectedPaymentType");
  const selectedPaymentTab = watch("selectedPaymentTab");

  const colors = {
    cardBg: isDark ? "#1f1e1e" : "#f5f5f5",
    textPrimary: isDark ? "#fff" : "#000",
    textSecondary: isDark ? "#999" : "#666",
    border: isDark ? "#333" : "#e0e0e0",
  };

  const amount =
    paymentType === "partial"
      ? quotationData?.payment_schedules?.[0]?.total_amount.toFixed(2)
      : quotationData?.payment_schedules?.reduce((sum, schedule) => sum + schedule.total_amount, 0).toFixed(2);

  const onSubmit = (data) => {
    console.log(data);
  }

  const onCancel = () => {
    navigate('/client/quotations', { replace: true });
  }

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, borderRadius: 3, bgcolor: colors.cardBg }}>
      <Typography
        variant="h6"
        sx={{ mb: 3, fontWeight: 500, color: colors.textPrimary }}
      >
        Resumen del Pago
      </Typography>

      <Box sx={{ mb: 2 }}>
        <Typography fontSize={13} sx={{ color: colors.textSecondary }}>
          Cotización
        </Typography>
        <Typography
          variant="h6"
          sx={{ fontWeight: 700, color: colors.textPrimary }}
        >
          {quotationData?.event_code}
        </Typography>
      </Box>

      <Box sx={{ mb: 2 }}>
        <Typography fontSize={13} sx={{ color: colors.textSecondary }}>
          Tipo de Pago
        </Typography>
        <Chip
          label={
            paymentType === "partial" ? "Pago Parcial (Anticipo)" : "Pago Total"
          }
          size="small"
          sx={{
            mt: 0.5,
            bgcolor: paymentType === "partial" ? "#4caf50" : "#2196f3",
            color: "#fff",
          }}
        />
      </Box>

      <Box sx={{ mb: 3, display: "flex", alignItems: "center", gap: 1 }}>
        <CalendarToday sx={{ fontSize: 16, color: colors.textSecondary }} />
        <Box>
          <Typography fontSize={13} sx={{ color: colors.textSecondary }}>
            Fecha de Vencimiento
          </Typography>
          <Typography
            fontSize={14}
            sx={{ color: colors.textPrimary, fontWeight: 500 }}
          >
            {new Date(quotationData?.event_date).toLocaleDateString("es-PE", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ my: 3, borderColor: colors.border }} />

      <Box sx={{ mb: 3 }}>
        <Typography fontSize={13} sx={{ color: colors.textSecondary }}>
          Monto a Pagar
        </Typography>
        <Typography
          variant="h4"
          sx={{ fontWeight: 700, color: colors.textPrimary }}
        >
          S/ {amount}
        </Typography>
      </Box>

      <Stack spacing={2}>
        { selectedPaymentTab === "manual" ? (
          <Button
            variant="contained"
            sx={{
              py: 1,
              boxShadow: "none",
              textTransform: "none",
              fontWeight: 600,
              borderRadius: 2,
            }}
          >
            Registrar Pago
          </Button>
        ) : (
          <Typography align={'center'}>
            El botón de pago está en el formulario de Mercado Pago
          </Typography>
        )}
        <Button
          variant="outlined"
          onClick={onCancel}
          sx={{
            py: 1,
            borderColor: colors.border,
            color: colors.textPrimary,
            textTransform: "none",
            fontWeight: 600,
            borderRadius: 2,
          }}
        >
          Cancelar
        </Button>
      </Stack>
    </Box>
  );
};
