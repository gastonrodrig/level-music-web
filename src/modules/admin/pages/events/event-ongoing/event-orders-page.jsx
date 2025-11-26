import { useEffect } from "react";
import { Box, Typography, Button, useTheme } from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useQuotationStore } from "../../../../../hooks";
import { useScreenSizes } from "../../../../../shared/constants/screen-width";
import {
  ConfirmationCard,
  EventOrderInfoCard,
  ServicesInfo,
} from "../../../components";

export const EventOrdersPage = () => {
  const navigate = useNavigate();
  const { selected } = useQuotationStore();
  const { isSm } = useScreenSizes();
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  useEffect(() => {
    if (!selected) {
      navigate("/admin/event-ongoing", { replace: true });
    }
  }, [selected, navigate]);

  return (
    <Box sx={{ px: isSm ? 4 : 0, pt: 2 }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}>
        <Button
          variant="contained"
          onClick={() => navigate("/admin/event-ongoing")}
          sx={{
            minWidth: 'auto',
            width: 40,
            height: 40,
            borderRadius: 2,
            p: 0,
            backgroundColor: isDark ? '#1f1e1e' : '#f5f5f5',
            color: isDark ? '#fff' : '#000',
            boxShadow: 'none',
            '&:hover': {
              backgroundColor: isDark ? '#353434' : '#f0f0f0',
              boxShadow: 'none',
            }
          }}
        >
          <ArrowBack />
        </Button>
        <Typography variant="h4">
          Previsualización de Ordenes de Compra
        </Typography>
      </Box>
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
