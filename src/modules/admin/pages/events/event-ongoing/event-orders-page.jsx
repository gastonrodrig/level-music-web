import { useEffect } from "react";
import { Box, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useQuotationStore } from "../../../../../hooks";
import { useScreenSizes } from "../../../../../shared/constants/screen-width";
import {
  ConfirmationCard,
  EventOrderInfoCard,
  ServicesInfo,
} from "../../../components";
import { useForm } from "react-hook-form";

export const EventOrdersPage = () => {
  const navigate = useNavigate();
  const { selected } = useQuotationStore();
  const { isSm } = useScreenSizes();

  useEffect(() => {
    if (!selected) {
      navigate("/admin/event-ongoing", { replace: true });
    }
  }, [selected, navigate]);

  return (
    <Box sx={{ px: isSm ? 4 : 0, pt: 2 }}>
      <Typography variant="h4" sx={{ mb: 1 }}>
        Previsualización de Ordenes de Compra
      </Typography>
      <Typography sx={{ mb: 3, fontSize: 16 }} color="text.secondary">
        Revisa los servicios adicionales antes de enviar las órdenes de compra
      </Typography>

      {/* Header */}
      <EventOrderInfoCard />

      {/* Services Info */}
      <ServicesInfo />

      {/* Confirmation */}
      <ConfirmationCard />
    </Box>
  );
};
