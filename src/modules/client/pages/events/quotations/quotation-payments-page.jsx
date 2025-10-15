import { useState } from "react";
import { Box, Typography, Alert } from "@mui/material";
import { PaymentBrick } from "../../../components";

export const QuotationPaymentsPage = () => {
  const [result, setResult] = useState(null);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Pago con Tarjeta 💳
      </Typography>

      <PaymentBrick
        amount={150}
      
      />

      {result && (
        <Alert severity={result.error ? "error" : "success"} sx={{ mt: 3 }}>
          {result.error ? "Error al procesar el pago" : `Pago ${result.status}`}
        </Alert>
      )}
    </Box>
  );
};