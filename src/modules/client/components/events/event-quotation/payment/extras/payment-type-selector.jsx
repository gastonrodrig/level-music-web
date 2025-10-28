import {
  Box,
  Typography,
  Stack,
  useTheme,
  Card,
  CardActionArea,
  CardContent,
} from "@mui/material";
import { RadioButtonUnchecked, RadioButtonChecked } from "@mui/icons-material";
import { useFormContext } from "react-hook-form";

export const PaymentTypeSelector = ({
  quotationData,
}) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const { watch, setValue } = useFormContext();

  const paymentType = watch("selectedPaymentType");

  const colors = {
    innerCardBg: isDark ? "#141414" : "#fcfcfc",
    textPrimary: isDark ? "#fff" : "#000",
    textSecondary: isDark ? "#999" : "#666",
    border: isDark ? "#333" : "#e0e0e0",
    borderActive: theme.palette.primary.main,
  };

  return (
    <Box sx={{ p: { xs: 0, md: 1 } }}>
      <Typography
        variant="h6"
        sx={{ mb: 3, fontWeight: 500, color: colors.textPrimary }}
      >
        Selecciona el tipo de pago
      </Typography>

      <Stack spacing={2}>
        {/* Solo Pago Parcial */}
        <Card
          elevation={0}
          sx={{
            border:
              paymentType === "partial"
                ? `2px solid ${colors.borderActive}`
                : `1px solid ${colors.border}`,
            borderRadius: 2,
            bgcolor: colors.innerCardBg,
            transition: "all 0.2s",
          }}
        >
          <CardActionArea onClick={() => {
            setValue("selectedPaymentType", "partial")
            setValue("amount", quotationData?.payment_schedules?.[0]?.total_amount)
          }}>
            <CardContent sx={{ p: 1.5 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                {paymentType === "partial" ? (
                  <RadioButtonChecked sx={{ color: colors.borderActive }} />
                ) : (
                  <RadioButtonUnchecked sx={{ color: colors.textSecondary }} />
                )}
                <Box sx={{ flex: 1 }}>
                  <Typography
                    variant="subtitle1"
                    sx={{ fontWeight: 600, color: colors.textPrimary, mb: 0.5 }}
                  >
                    Solo Pago Parcial (Anticipo)
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{ color: colors.textSecondary }}
                  >
                    Vencimiento: 21/10/2025
                  </Typography>
                  <Typography
                    variant="h5"
                    sx={{ color: "#4caf50", fontWeight: 700, mt: 1 }}
                  >
                    S/ {quotationData?.payment_schedules?.[0]?.total_amount.toFixed(2)}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </CardActionArea>
        </Card>

        {/* Ambos Pagos */}
        <Card
          elevation={0}
          sx={{
            border:
              paymentType === "full"
                ? `2px solid ${colors.borderActive}`
                : `1px solid ${colors.border}`,
            borderRadius: 2,
            bgcolor: colors.innerCardBg,
            transition: "all 0.2s",
          }}
        >
          <CardActionArea onClick={() => {
            setValue("selectedPaymentType", "full")
            setValue("amount", quotationData?.payment_schedules?.reduce((sum, schedule) => sum + schedule.total_amount, 0))
          }}>
            <CardContent sx={{ p: 1.5 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                {paymentType === "full" ? (
                  <RadioButtonChecked sx={{ color: colors.borderActive }} />
                ) : (
                  <RadioButtonUnchecked sx={{ color: colors.textSecondary }} />
                )}
                <Box sx={{ flex: 1 }}>
                  <Typography
                    variant="subtitle1"
                    sx={{ fontWeight: 600, color: colors.textPrimary, mb: 0.5 }}
                  >
                    Ambos Pagos (Parcial + Final)
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{ color: colors.textSecondary }}
                  >
                    Paga el monto total del evento
                  </Typography>
                  <Typography
                    variant="h5"
                    sx={{ color: "#2196f3", fontWeight: 700, mt: 1 }}
                  >
                    S/ {quotationData?.payment_schedules?.reduce((sum, schedule) => sum + schedule.total_amount, 0).toFixed(2)}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </CardActionArea>
        </Card>
      </Stack>
    </Box>
  );
};
