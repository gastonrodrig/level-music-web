
import { Typography, Box,Stack,Button, useTheme } from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
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

    const counts = useMemo(() => {
        // Inicializamos contadores
        const acc = { 
            totalSubtasks: 0,
            // Estados
            completed: 0, 
            pending: 0, 
            // Fases
            planning: 0, 
            execution: 0, 
            tracking: 0,
            // Extras
            evidence: 0, 
            assigned: 0 
        };

        // Iteramos sobre Tareas Principales -> Subtareas
        eventTasks.forEach((task) => {
            const subtasks = task.subtasks || [];
            subtasks.forEach((sub) => {
                acc.totalSubtasks += 1;

                // Contar por Estado
                if (sub.status === 'Completado') {
                    acc.completed += 1;
                } else {
                    acc.pending += 1;
                }

                // Contar por Fase (Normalizamos string por si acaso)
                const phase = sub.phase || 'Planificación'; 
                if (phase === 'Planificación') acc.planning += 1;
                else if (phase === 'Ejecución') acc.execution += 1;
                else if (phase === 'Seguimiento') acc.tracking += 1;

                // Extras
                if (sub.requires_evidence) acc.evidence += 1;
                if (sub.worker_id) acc.assigned += 1;
            });
        });

        return acc;
    }, [eventTasks]);

        const percent = counts.totalSubtasks > 0 
                ? Math.round((counts.completed / counts.totalSubtasks) * 100) 
                : 0;
    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 1, mb: 2 }}>
                <Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2, pt: 2, pb: 1 }}>
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
                        <Typography variant="h4">Actividades del Evento</Typography>
                    </Box>
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
                <ActivityProgressHeader totals={counts} total={counts.totalSubtasks} percent={percent} />

                {/* Pasamos las tareas directamente */}
                <QuotationControlActivities
                    selected={selected}
                    eventTasks={eventTasks}
                />
            </Box>
        </Box>
    );
};