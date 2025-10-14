import { Alert, AlertTitle } from "@mui/material";

export const PaymentInfoCard = () => {
  return (
    <Alert
      severity="info"
      variant="filled"
      sx={{
        borderRadius: 2,
        backgroundColor: (theme) =>
          theme.palette.mode === "dark" ? "#1a2430" : "#e8f4fd",
        color: (theme) =>
          theme.palette.mode === "dark" ? "#b3e5fc" : "#01579b",
        mb: 3,
        "& .MuiAlert-icon": {
          color: (theme) =>
            theme.palette.mode === "dark" ? "#29b6f6" : "#0288d1",
        },
      }}
    >
      <AlertTitle sx={{ fontWeight: "bold" }}>
        Política de Pagos - Level Music Corp
      </AlertTitle>
      El sistema aplica por defecto <strong>50% de anticipo</strong> y{" "}
      <strong>50% final</strong> para equipos y trabajadores. <br />
      Los servicios adicionales externos pueden tener un porcentaje de pago
      adelantado mayor cuando lo requieran (ej: 60%, 100%).
    </Alert>
  );
};
