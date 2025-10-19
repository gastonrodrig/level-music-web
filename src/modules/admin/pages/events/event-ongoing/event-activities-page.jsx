
import { Typography, Box,Stack,Button, useTheme } from "@mui/material";
import { useEffect, useState, useMemo } from "react";
import { ActivityProgressHeader } from "../../../components";
import { useQuotationStore } from "../../../../../hooks";
import { useNavigate } from "react-router-dom";
import { useScreenSizes } from "../../../../../shared/constants/screen-width";
import { UseEventTaskStore } from "../../../../../hooks";


export const EventActivitiesPage = () => {
    const {selected} = useQuotationStore();
    const { eventTasks,startLoadingEventTaskByStatus, startLoadingEventsTaskByIdEvent } = UseEventTaskStore();
    const navigate = useNavigate();
    const { isSm } = useScreenSizes();
    const theme = useTheme();
    const isDark = theme.palette.mode === "dark";
    useEffect(() => {
    if (!selected) {
      navigate("/admin/event-ongoing");
      return;
    }
    }, [selected]);

    const mapStatusKey = (status) => {
    if (!status) return "pending";
    const s = String(status).toLowerCase();
    if (s.includes("pend")) return "pending";
    if (s.includes("progr") || s.includes("in_progress") || s.includes("en_progreso")) return "in_progress";
    if (s.includes("complet")) return "completed";
    if (s.includes("bloq")) return "blocked";
    return "pending";
  };
   const counts = useMemo(() => {
    const acc = {
      pending: 0,
      in_progress: 0,
      completed: 0,
      blocked: 0,
      evidence: 0,
      assigned: 0,
      total: 0,
    };
    (eventTasks || []).forEach((t) => {
      const key = mapStatusKey(t.status);
      acc[key] = (acc[key] || 0) + 1;
      if (t.requires_evidence) acc.evidence += 1;
      if (t.worker) acc.assigned += 1;
      if(t.status && key === "Pendiente") acc.pending += 1;
      acc.total += 1;
    });

    return acc;
    }, [eventTasks]);
     const percent = counts.total ? Math.round((counts.completed / counts.total) * 100) : 0;


    useEffect(() => {
        if(selected){
            startLoadingEventsTaskByIdEvent(selected.id??selected._id);
        }
    }, [selected]);


    return (
        <Box >
        <Typography variant="h4" sx={{ pt: 2, pb:1}}>Actividades del Evento</Typography>
                <Typography sx={{ pb: 2}}>
                    Esta página muestra las actividades en curso para el evento seleccionado. Aquí puedes monitorear y gestionar todas las actividades asociadas con el evento.
                </Typography>
                <Box sx={{ p: 3, bgcolor: isDark ? "#1f1e1e" : "#f5f5f5",mb: 2,
                borderRadius: 2,gap: { xs: 1, sm: 0 }, }}>
                    <ActivityProgressHeader  totals={counts} total={counts.total} percent={percent} />
                    <Stack spacing={2}>
                        
                        <Button variant="contained" color="primary">
                            Add New Activity
                        </Button>
                    </Stack>
                </Box>
        </Box>
    );
}