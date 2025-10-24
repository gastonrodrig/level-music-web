import { useEffect, useState } from "react";
import { Payment } from "@mercadopago/sdk-react";
import { initializeMercadoPago } from "../../../../../../../shared/helpers";
import { usePaymentStore } from "../../../../../../../hooks";
import { useNavigate } from "react-router-dom";
import { useTheme, Box, CircularProgress, Typography } from "@mui/material";

export const PaymentBrick = ({ amount }) => {
  const [sdkReady, setSdkReady] = useState(false);
  const [brickReady, setBrickReady] = useState(false);
  const { startProcessingPayments } = usePaymentStore();
  const navigate = useNavigate();
  const theme = useTheme();

  // 1️⃣ Inicializar MercadoPago SDK
  useEffect(() => {
    try {
      initializeMercadoPago(); // asegúrate de que reciba tu public key
      console.log("✅ SDK de Mercado Pago inicializado");
      setSdkReady(true);
    } catch (err) {
      console.error("❌ Error al inicializar Mercado Pago:", err);
    }
  }, []);

  // 2️⃣ Timeout de seguridad (por si onReady no dispara)
  useEffect(() => {
    if (sdkReady && !brickReady) {
      const timer = setTimeout(() => {
        console.warn("⚠️ Timeout: PaymentBrick no disparó onReady, forzando render...");
        setBrickReady(true);
      }, 8000); // 8 segundos máximo de espera
      return () => clearTimeout(timer);
    }
  }, [sdkReady, brickReady]);

  const initialization = {
    amount: Number(amount),
    payer: { firstName: "", email: "" },
  };

  const customization = {
    visual: {
      style: { theme: theme.palette.mode === "dark" ? "dark" : "default" },
    },
    paymentMethods: {
      creditCard: "all",
      debitCard: "all",
      maxInstallments: 1,
    },
  };

  const onSubmit = async ({ formData }) => {
    try {
      const payload = { ...formData, amount, description: "Pago de evento" };
      console.log("📤 Payload listo:", payload);
      await startProcessingPayments(payload);
      // navigate("/client/pago-exitoso");
    } catch (error) {
      console.error("❌ Error al procesar el pago:", error);
    }
  };

  if (!sdkReady || !brickReady) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          py: 6,
          borderRadius: 3,
          bgcolor:
            theme.palette.mode === "dark"
              ? "rgba(255,255,255,0.05)"
              : "rgba(0,0,0,0.03)",
        }}
      >
        <CircularProgress color="primary" size={32} />
        <Typography variant="body2" sx={{ mt: 2, opacity: 0.7 }}>
          Cargando opciones de pago...
        </Typography>
      </Box>
    );
  }

  // ✅ Render del Brick
  return (
    <Payment
      initialization={initialization}
      customization={customization}
      onSubmit={onSubmit}
      onReady={() => {
        console.log("✅ PaymentBrick listo");
        setBrickReady(true);
      }}
      onError={(error) => console.error("⚠️ Error en Payment Brick:", error)}
    />
  );
};
