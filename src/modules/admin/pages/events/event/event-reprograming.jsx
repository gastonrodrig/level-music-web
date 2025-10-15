import {
  QuotationInfoCard,
  AssignServiceCard,
  AssignEquipmentCard,
  AssignWorkerCard,
  QuotationSummary,
} from "../../../components";
import {
  useEquipmentStore,
  useQuotationStore,
  useServiceDetailStore,
  useServiceStore,
  useWorkerStore,
  useWorkerTypeStore,
} from "../../../../../hooks";
import {
  Typography,
  Box,
  TextField,
  Grid,
  Button,
  useTheme,
} from "@mui/material";
import { useForm, useFieldArray } from "react-hook-form";
import { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useScreenSizes } from "../../../../../shared/constants/screen-width";


export const EventQuotationReprograming = () => {
      const theme = useTheme();
      const isDark = theme.palette.mode === "dark";
      const navigate = useNavigate();
      const { isSm } = useScreenSizes();
      const { loading, selected, startAssigningResources } = useQuotationStore();

      useEffect(() => {
            if (!selected) navigate("/admin/event-on-going");
        }, [selected, navigate]);

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