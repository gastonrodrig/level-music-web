import { Box, Typography, Button, useTheme } from "@mui/material";
import { Send } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useQuotationStore } from "../../../../../hooks";
import { useScreenSizes } from "../../../../../shared/constants/screen-width";
import {
  EventActivitiesCard,
  EventSummaryCard,
  ResourceTabs,
} from "../../../../../shared/ui/components";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";

export const EventSendProposalPage = () => {
  const { loading, selected, startSendingReadyQuotation } = useQuotationStore();
  const { isMd } = useScreenSizes();
  const theme = useTheme();
  const navigate = useNavigate();
  const isDark = theme.palette.mode === "dark";

  const { handleSubmit } = useForm({
    defaultValues: {
      to: selected?.email
    }
  })

  useEffect(() => {
    if(!selected){
      navigate("/admin/quotations");
    } 
  }, [selected, navigate]);

  const calculateEstimatedPrice = () => {
    if (!selected) return 0;
    
    const tasksTotal = (selected.tasks || []).reduce(
      (total, task) =>
        total + (task.subtasks || []).reduce((sum, sub) => sum + (sub.price || 0), 0),
      0
    );
    
    const assignationsTotal = (selected.assignations || []).reduce(
      (total, assign) => total + (assign.hourly_rate || 0),
      0
    );
    
    return tasksTotal + assignationsTotal;
  };

  const onSubmit = async (data) => {
    const success = await startSendingReadyQuotation(data);
    if (success) navigate("/admin/quotations");
  }

  const isButtonDisabled = useMemo(() => loading, [loading]);

  return (
    <Box 
      sx={{ px: isMd ? 4 : 0, pt: 2, maxWidth: 1200, margin: "0 auto" }}
      component="form"
      onSubmit={handleSubmit(onSubmit)}
    >
      <Typography variant="h4" sx={{ mb: 1 }}>
        Enviar Propuesta
      </Typography>
      <Typography sx={{ mb: 3, fontSize: 16 }} color="text.secondary">
        Revisa y envía la propuesta del evento al cliente.
      </Typography>

      {/* Event summary */}
      <EventSummaryCard selected={selected} />

      {/* Actividades del Evento */}
      <EventActivitiesCard tasks={selected?.tasks} />

      {/* Recursos Asignados */}
      <Box sx={{ mt: 4 }}>
        <ResourceTabs assignations={selected?.assignations || []} />
      </Box>

      {/* Resumen y Acciones */}
      <Box sx={{ mt: 3 }}>
        <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>
          Resumen y Acciones
        </Typography>
        <Box
          sx={{
            p: 3,
            borderRadius: 2,
            bgcolor: isDark ? "#1f1e1e" : "#f5f5f5",
            border: `1px solid ${theme.palette.divider}`,
          }}
        >
          <Typography sx={{ mb: 1 }}>
            Total estimado:{" "}
            <strong>
              S/. {calculateEstimatedPrice()}
            </strong>
          </Typography>

          <Typography color="text.secondary" sx={{ mb: 2 }}>
            Verifica los detalles antes de enviar la propuesta al cliente.
          </Typography>

          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
            <Button
              variant="contained"
              type="submit"
              startIcon={<Send />}
              sx={{
                backgroundColor: theme.palette.primary.main,
                color: theme.palette.getContrastText(theme.palette.primary.main),
                textTransform: "none",
                px: 3,
                py: 1.25,
                borderRadius: 2,
                "&:hover": { backgroundColor: theme.palette.primary.dark },
              }}
              disabled={isButtonDisabled}
            >
              Enviar Propuesta
            </Button>

            <Button
              variant="outlined"
              color="inherit"
              sx={{
                textTransform: "none",
                px: 3,
                py: 1.25,
                borderRadius: 2,
                borderColor: theme.palette.divider,
                color: "text.primary",
              }}
              onClick={() => navigate("/admin/quotations")}
            >
              Volver
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
