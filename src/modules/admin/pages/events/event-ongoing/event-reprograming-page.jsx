import { QuotationInfoCard } from "../../../components";
import { useQuotationStore } from "../../../../../hooks";
import { Typography, Box } from "@mui/material";
import { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useScreenSizes } from "../../../../../shared/constants/screen-width";

export const EventQuotationReprograming = () => {
  const navigate = useNavigate();
  const { isSm } = useScreenSizes();
  const { loading, selected } = useQuotationStore();

  useEffect(() => {
    if (!selected) navigate("/admin/event-ongoing");
  }, [selected, navigate]);

  const isButtonDisabled = useMemo(() => loading, [loading]);

  return (
    <Box
      component="form"
      sx={{ px: isSm ? 4 : 0, pt: 2 }}
    >
      <Typography variant="h4" sx={{ mb: 2 }}>
        Reprogramacion de evento
      </Typography>
      <Typography sx={{ mb: 2, fontSize: 16 }} color="text.secondary">
        Reprograma la fecha y asigna nuevamente los trabajadores, servicios adicionales y equipos necesarios para el evento seleccionado
      </Typography>

      <QuotationInfoCard selected={selected} showAdditionalServices={false} />
    
    </Box>
  );
};