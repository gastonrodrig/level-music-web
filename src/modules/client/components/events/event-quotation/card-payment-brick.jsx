import { useEffect, useState } from "react";
import { CardPayment } from "@mercadopago/sdk-react";
import { initializeMercadoPago } from "../../../../../shared/helpers";
import { usePaymentStore } from "../../../../../hooks"; 

export const CardPaymentBrick = ({ amount, email, onPaymentResult }) => {
  const [showBrick, setShowBrick] = useState(false);
  const { startProcessingPayments } = usePaymentStore();

  useEffect(() => {
    initializeMercadoPago();
    setShowBrick(true);
  }, []);

  if (!showBrick) return null;

  const initialization = {
    amount,
    payer: {
      email,
    },
  };

  const customization = {
    visual: {
      style: {
        theme: "default", // 'dark' | 'flat' | 'bootstrap'
      },
    },
    paymentMethods: {
      maxInstallments: 1,
    },
  };

  const onSubmit = async (cardFormData) => {
    const success = await startProcessingPayments(cardFormData);
  };

  return (
    <CardPayment
      initialization={initialization}
      customization={customization}
      onSubmit={onSubmit}
      onReady={() => console.log(" Brick listo")}
      onError={(error) => console.error("Error en el Brick:", error)}
    />
  );
};