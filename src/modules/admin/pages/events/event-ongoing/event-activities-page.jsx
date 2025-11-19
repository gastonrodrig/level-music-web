
import { Typography, Box,Stack,Button, useTheme } from "@mui/material";
import { useEffect, useState, useMemo, use } from "react";
import { ActivityProgressHeader,QuotationControlActivities } from "../../../components";
import { useQuotationStore } from "../../../../../hooks";
import { useNavigate } from "react-router-dom";
import { useScreenSizes } from "../../../../../shared/constants/screen-width";
import { UseEventTaskStore,useWorkerStore } from "../../../../../hooks";


export const EventActivitiesPage = () => {
    const { selected } = useQuotationStore();
    const navigate = useNavigate();
    const theme = useTheme();
    const isDark = theme.palette.mode === "dark";

    // Validación: Si no hay evento seleccionado, regresar
    useEffect(() => {
        if (!selected) {
            navigate("/admin/event-ongoing");
            return;
        }
    }, [selected, navigate]);

    // Extraemos las tareas directamente del objeto selected
    // Asumimos que la propiedad se llama 'tasks' o 'event_tasks' dentro de selected.
    // Ajusta 'selected.tasks' si tu propiedad tiene otro nombre en la base de datos.
    const eventTasks = selected?.tasks || []; 
    useEffect(() => {
        console.log("Tareas del evento cargadas:", eventTasks);
        console.log("Evento seleccionado:", selected);
    }, [eventTasks]);

    // Lógica de mapeo de estados para las estadísticas
    const mapStatusKey = (status) => {
        if (!status) return "pending";
        const s = String(status).toLowerCase();
        if (s.includes("pend")) return "pending";
        if (s.includes("progr") || s.includes("in_progress") || s.includes("en_progreso")) return "in_progress";
        if (s.includes("complet")) return "completed";
        if (s.includes("bloq")) return "blocked";
        return "pending";
    };

    // Calculamos los contadores basados en las tareas que ya tenemos en memoria
    const counts = useMemo(() => {
        const acc = { pending: 0, in_progress: 0, completed: 0, blocked: 0, evidence: 0, assigned: 0, total: 0 };

        eventTasks.forEach((t) => {
            const key = mapStatusKey(t.status);
            acc[key] = (acc[key] || 0) + 1;
            if (t.requires_evidence) acc.evidence += 1;
            if (t.worker || t.worker_id) acc.assigned += 1; // Ajuste para detectar si hay trabajador
            acc.total += 1;
        });
        return acc;
    }, [eventTasks]);

    const percent = counts.total ? Math.round((counts.completed / counts.total) * 100) : 0;

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 1, mb: 2 }}>
                <Box>
                    <Typography variant="h4" sx={{ pt: 2, pb: 1 }}>Actividades del Evento</Typography>
                    <Typography sx={{ pb: 2 }}>
                        Esta página muestra el seguimiento de las actividades para el evento seleccionado.
                    </Typography>
                </Box>
                {/* Se eliminó el botón de Guardar Asignaciones */}
            </Box>

            <Box sx={{
                p: 3, 
                bgcolor: isDark ? "#1f1e1e" : "#f5f5f5", 
                mb: 2,
                borderRadius: 2, 
                gap: { xs: 1, sm: 0 },
            }}>
                <ActivityProgressHeader totals={counts} total={counts.total} percent={percent} />

                {/* Pasamos las tareas directamente */}
                <QuotationControlActivities
                    selected={selected}
                    eventTasks={eventTasks}
                />
            </Box>
        </Box>
    );
};