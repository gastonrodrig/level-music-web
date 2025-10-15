import { useEffect, useState } from "react";
import { Payment } from "@mercadopago/sdk-react";
import { initializeMercadoPago } from "../../../../../shared/helpers";
import { usePaymentStore } from "../../../../../hooks";
import { useNavigate } from "react-router-dom";
import { Description } from "@mui/icons-material";

export const PaymentBrick = ({ amount, onPaymentResult }) => {
  const [isReady, setIsReady] = useState(false);
  const { startProcessingPayments } = usePaymentStore();
  const navigate = useNavigate();

  useEffect(() => {
    initializeMercadoPago();
    setIsReady(true);
  }, []);

  if (!isReady) return null;

  // Configuración base para el Brick
  const initialization = {
    amount: Number(amount),
    payer: {
      firstName: "",
      email: "",
    },
  };

  // Configuración de métodos de pago
  const customization = {
    visual: {
      style: {
        theme: "default",
      },
    },
    paymentMethods: {
      creditCard: "all",
      debitCard: "all",
      maxInstallments: 1,
    },
  };

  // Lógica de envío del formulario
  const onSubmit = async ({ formData }) => {
    try {
      // Asegura tipos correctos y valores por defecto
      const payload = {
        ...formData,
        amount,
        description : "Pago de evento",
        
      };

      console.log("📤 Payload listo:", payload);
      const result = await startProcessingPayments(payload);
    //   onPaymentResult?.(result);
    //   console.log("✅ Resultado del pago:", result);
    //   // Redirige si el pago fue exitoso
    //   if (result && !result.error) {
    //     navigate("/client/pago-exitoso"); // Cambia la ruta según tu app
    //   }
    } catch (error) {
      console.error("❌ Error al procesar el pago:", error);
    }
  };

  return (
    <Payment
      initialization={initialization}
      customization={customization}
      onSubmit={onSubmit}
      onReady={() => console.log("✅ Payment Brick listo")}
      onError={(error) => console.error("⚠️ Error en el Payment Brick:", error)}
    />
  );
};