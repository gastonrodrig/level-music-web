import { useEffect, useRef } from "react";
import { Payment } from "@mercadopago/sdk-react";
import { initializeMercadoPago } from "../../../../../../../shared/helpers";
import { usePaymentStore } from "../../../../../../../hooks";
import { useTheme } from "@mui/material";
import { useFormContext } from "react-hook-form";

export const PaymentBrick = ({ onReady }) => {
  const { startProcessingPayments } = usePaymentStore();
  const theme = useTheme();
  const initialized = useRef(false);

  const { watch } = useFormContext();
  const amount = watch("amount");

  useEffect(() => {
    if (!initialized.current) {
      initializeMercadoPago();
      initialized.current = true;
    }
  }, []);

  const initialization = {
    amount: Number(amount.toFixed(2)),
    payer: {
      firstName: "Cliente",
      lastName: "LM",
      email: "cliente@example.com",
      entityType: "individual",
    },
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
    } catch (error) {
      console.error("❌ Error al procesar el pago:", error);
    }
  };

  return (
    <Payment
      initialization={initialization}
      customization={customization}
      onSubmit={onSubmit}
      onReady={() => {
        if (onReady) onReady();
      }}
      onError={(error) => console.error("⚠️ Error en Payment Brick:", error)}
    />
  );
};
