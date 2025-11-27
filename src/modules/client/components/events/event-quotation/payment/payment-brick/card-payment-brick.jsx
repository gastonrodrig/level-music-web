import { useEffect, useRef, useState } from "react";
import { Payment } from "@mercadopago/sdk-react";
import { initializeMercadoPago } from "../../../../../../../shared/helpers";
import { usePaymentStore, useAuthStore, useQuotationStore } from "../../../../../../../hooks";
import { createMercadoPagoPaymentModel } from "../../../../../../../shared/models/payment";
import { ConfirmDialog } from "../../../../../../../shared/ui/components/common"; // ✅ Importar el componente
import { useTheme } from "@mui/material";
import { useFormContext } from "react-hook-form";

export const PaymentBrick = ({ onReady }) => {
  const { startProcessingPayments } = usePaymentStore();
  const { _id: userId } = useAuthStore();
  const { selected: quotation } = useQuotationStore();
  const theme = useTheme();
  const initialized = useRef(false);

  const { watch } = useFormContext();
  const amount = watch("amount");
  const selectedPaymentType = watch("selectedPaymentType") || "partial";

  const [dialogState, setDialogState] = useState({
    open: false,
    type: "success", // 'success' | 'error' | 'warning'
    title: "",
    message: "",
  });

  useEffect(() => {
    if (!initialized.current) {
      initializeMercadoPago();
      initialized.current = true;
    }
  }, []);

  const initialization = {
    amount: Number(amount?.toFixed(2) || 0),
    payer: {
      firstName: quotation?.client_type === "Persona" 
        ? quotation?.first_name 
        : quotation?.business_name || "Cliente",
      lastName: quotation?.client_type === "Persona" 
        ? quotation?.last_name 
        : "LM",
      email: quotation?.email || "cliente@example.com",
      entityType: quotation?.client_type === "Persona" ? "individual" : "association",
    },
  };

  const customization = {
    visual: {
      style: { 
        theme: theme.palette.mode === "dark" ? "dark" : "default" 
      },
    },
    paymentMethods: {
      creditCard: "all",
      debitCard: "all",
      maxInstallments: 1,
    },
  };

  // ✅ Función para mostrar diálogos
  const showDialog = (type, title, message) => {
    setDialogState({
      open: true,
      type,
      title,
      message,
    });
  };

  const closeDialog = () => {
    setDialogState(prev => ({ ...prev, open: false }));
  };

  const onSubmit = async ({ formData }) => {
    try {
      console.log("📋 Datos recibidos del Payment Brick:", formData);

      // ✅ Determinar tipo de pago
      let paymentType = "Parcial";
      if (selectedPaymentType === "final") {
        paymentType = "Final";
      } else if (selectedPaymentType === "both") {
        paymentType = "Ambos";
      }

      // ✅ Preparar datos para el modelo
      const paymentData = {
        payment_type: paymentType,
        event_id: quotation?._id,
        user_id: userId,
        transaction_amount: formData.transaction_amount,
        token: formData.token,
        description: `Pago ${paymentType} - Evento: ${quotation?.name || "Sin nombre"}`,
        installments: formData.installments || 1,
        payment_method_id: formData.payment_method_id,
        payer: {
          email: formData.payer.email,
          identification: {
            type: formData.payer.identification?.type || "DNI",
            number: formData.payer.identification?.number || "",
          },
        },
      };

      // ✅ Usar el modelo para construir el payload
      const payload = createMercadoPagoPaymentModel(paymentData);

      console.log("📤 Payload preparado con el modelo:", payload);

      // ✅ Enviar al backend
      const result = await startProcessingPayments(payload);

      console.log("✅ Resultado del backend:", result);

      // ✅ Mostrar diálogo según el resultado
      if (result?.success) {
        showDialog(
          "success",
          "¡Pago procesado exitosamente!",
          `Tu pago de S/ ${formData.transaction_amount.toFixed(2)} ha sido aprobado correctamente.`
        );
        // TODO: Aquí puedes redirigir después de cerrar el diálogo
      } else {
        showDialog(
          "warning",
          "Pago no aprobado",
          result?.message || "El pago no pudo ser procesado. Por favor, intenta nuevamente."
        );
      }
    } catch (error) {
      console.error("❌ Error al procesar el pago:", error);
      
      showDialog(
        "error",
        "Error al procesar el pago",
        error.message || "Ocurrió un error inesperado. Por favor, intenta nuevamente."
      );
    }
  };

  const onError = (error) => {
    console.error("⚠️ Error en Payment Brick:", error);
    
    showDialog(
      "error",
      "Error al cargar el formulario",
      "No se pudo cargar el formulario de pago. Por favor, recarga la página."
    );
  };

  return (
    <>
      <Payment
        initialization={initialization}
        customization={customization}
        onSubmit={onSubmit}
        onReady={() => {
          console.log("✅ Payment Brick cargado");
          if (onReady) onReady();
        }}
        onError={onError}
      />

      {/* ✅ Diálogo de confirmación/resultado */}
      <ConfirmDialog
        open={dialogState.open}
        onClose={closeDialog}
        onConfirm={closeDialog}
        title={dialogState.title}
        message={dialogState.message}
        type={dialogState.type}
        confirmText="Aceptar"
        cancelText="" // Sin botón cancelar
        confirmColor={dialogState.type === "success" ? "success" : "primary"}
      />
    </>
  );
};
