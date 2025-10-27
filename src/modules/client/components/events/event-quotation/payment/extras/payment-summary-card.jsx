import {
  Box,
  Typography,
  Button,
  Chip,
  Card,
  CardContent,
  useTheme,
} from "@mui/material";
import { 
  BarChart, 
  Home, 
  Storefront, 
  AccountBalanceWallet,
  CreditCard 
} from "@mui/icons-material";
import { useFormContext } from "react-hook-form";
import { useNavigate } from "react-router-dom";

export const PaymentSummaryCard = ({ quotationData, onRegister }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const navigate = useNavigate();

  const { watch } = useFormContext();

  const paymentType = watch("selectedPaymentType");
  const selectedPaymentTab = watch("selectedPaymentTab");
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
        color: "#9c27b0",
      };
    }
    return {
      label: "En Local (Presencial)",
      icon: <Storefront sx={{ fontSize: 18 }} />,
      color: "#2196f3",
    };
  };

  const getPaymentTypeConfig = () => {
    if (paymentType === "partial") {
      return {
        label: "Solo Pago Parcial",
        icon: <AccountBalanceWallet sx={{ fontSize: 18 }} />,
        color: "#4caf50",
      };
    }
    return {
      label: "Pago Total",
      icon: <CreditCard sx={{ fontSize: 18 }} />,
      color: "#2196f3",
    };
  };

  const locationConfig = getLocationConfig();
  const paymentTypeConfig = getPaymentTypeConfig();

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
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2.5 }}>
          <Box
            sx={{
              width: 32,
              height: 32,
              borderRadius: 1.5,
              bgcolor: "#ff9800",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
            }}
          >
            <BarChart sx={{ fontSize: 20 }} />
          </Box>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, color: colors.textPrimary }}>
            Resumen del Pago
          </Typography>
        </Box>

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
            sx={{
              bgcolor: locationConfig.color,
              color: "#fff",
              fontWeight: 600,
              fontSize: 12,
              height: 28,
              "& .MuiChip-icon": {
                color: "#fff",
              },
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
            sx={{
              bgcolor: paymentTypeConfig.color,
              color: "#fff",
              fontWeight: 600,
              fontSize: 12,
              height: 28,
              "& .MuiChip-icon": {
                color: "#fff",
              },
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
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
          {selectedPaymentTab === "manual" ? (
            <Button
              variant="contained"
              onClick={onRegister}
              fullWidth
              sx={{
                py: 1.2,
                boxShadow: "none",
                textTransform: "none",
                fontWeight: 600,
                fontSize: 14,
                borderRadius: 2,
                bgcolor: "#ff9800",
                color: "#fff",
                "&:hover": {
                  bgcolor: "#f57c00",
                },
              }}
            >
              Registrar Pagos
            </Button>
          ) : (
            <Box
              sx={{
                p: 1.5,
                borderRadius: 2,
                bgcolor: isDark ? "rgba(33, 150, 243, 0.1)" : "rgba(33, 150, 243, 0.05)",
                border: `1px solid ${theme.palette.primary.main}`,
                textAlign: "center",
              }}
            >
              <Typography variant="body2" fontSize={12} sx={{ color: colors.textPrimary, fontWeight: 500 }}>
                El botón de pago está en el formulario de Mercado Pago
              </Typography>
            </Box>
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
        </Box>
      </CardContent>
    </Card>
  );
};
