import { Box, Typography, Card, CardContent } from "@mui/material";
import { MercadoPagoAlert } from "..";
import { PaymentBrick } from "../";

export const PaymentMercadoPagoContent = ({ colors, quotationData }) => {
  return (
    <Box>
      {/* Alerta informativa */}
      <MercadoPagoAlert />

      {/* Monto a pagar */}
      <Card
        elevation={0}
        sx={{
          border: `1px solid ${colors.border}`,
          borderRadius: 2,
          bgcolor: colors.innerCardBg,
          mb: 3,
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Typography
            variant="caption"
            sx={{ color: colors.textSecondary, display: "block", mb: 1 }}
          >
            Monto a pagar:
          </Typography>
          <Typography
            variant="h4"
            sx={{ fontWeight: 700, color: colors.textPrimary, mb: 2 }}
          >
            S/ {quotationData?.advancePayment?.toFixed(2) || "4580.00"}
          </Typography>

          {/* Brick de Mercado Pago */}
          <Box
            sx={{
              mt: 2,
              py: 2,
              borderRadius: 2,
              bgcolor: colors.infoBg,
              border: `1px dashed ${colors.infoBorder}`,
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {/* Aquí se monta el componente del Brick */}
              <Box sx={{ width: "100%" }}>
                <PaymentBrick
                  amount={quotationData?.advancePayment || 4580}
                />
              </Box>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};
