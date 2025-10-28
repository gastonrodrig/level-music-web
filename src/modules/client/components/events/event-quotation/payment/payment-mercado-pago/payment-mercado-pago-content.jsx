import {
  Box,
  Typography,
  Card,
  CardContent,
  Skeleton,
  Fade,
} from "@mui/material";
import { useState } from "react";
import { MercadoPagoAlert } from "..";
import { PaymentBrick } from "..";
import { useFormContext } from "react-hook-form";

export const PaymentMercadoPagoContent = ({ colors, quotationData }) => {
  const { watch } = useFormContext();
  const [brickReady, setBrickReady] = useState(false);

  const amount = watch("amount");

  const handleBrickReady = () => {
    setBrickReady(true);
  };

  return (
    <Box>
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
        <CardContent sx={{ p: 2 }}>
          <Typography
            variant="caption"
            sx={{ color: colors.textSecondary, display: "block", mb: 1 }}
          >
            Monto a pagar:
          </Typography>
          <Typography
            variant="h4"
            sx={{ fontWeight: 700, color: colors.textPrimary }}
          >
            S/ {amount.toFixed(2)}
          </Typography>
        </CardContent>
      </Card>

      {/* Brick + Skeleton Loader */}
      <Card
        sx={{
          boxShadow: "none",
          border: `1px solid ${colors.border}`,
          bgcolor: colors.innerCardBg,
          position: "relative",
          width: "100%",
          borderRadius: 5,
          minHeight: 372,
          overflow: "hidden",
        }}
      >
        {/* Payment Brick */}
        <Box
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            opacity: brickReady ? 1 : 0.3,
            transition: "opacity 0.5s ease",
          }}
        >
          <Box sx={{ width: "100%", maxWidth: 600 }}>
            <Box
              sx={{
                position: "relative",
                opacity: brickReady ? 1 : 0,
                transition: "opacity 0.4s ease",
              }}
            >
              <PaymentBrick
                amount={quotationData?.payment_schedules?.[0]?.total_amount}
                onReady={handleBrickReady}
              />
            </Box>
          </Box>
        </Box>

        {/* Skeleton loader */}
        {!brickReady && (
          <Fade in={!brickReady}>
            <Box
              sx={{
                position: "absolute",
                inset: 0,
                p: 3,
                display: "flex",
                flexDirection: "column",
                gap: 2,
                justifyContent: "center",
              }}
            >
              <Skeleton variant="rectangular" width="100%" height={40} sx={{ borderRadius: 2 }} />
              <Skeleton variant="rectangular" width="100%" height={40} sx={{ borderRadius: 2 }} />
              <Skeleton variant="rectangular" width="80%" height={40} sx={{ borderRadius: 2 }} />
              <Skeleton variant="rectangular" width="60%" height={40} sx={{ borderRadius: 2 }} />
              <Skeleton
                variant="rectangular"
                width="40%"
                height={45}
                sx={{ borderRadius: 2, mt: 1 }}
              />
            </Box>
          </Fade>
        )}
      </Card>
    </Box>
  );
};
