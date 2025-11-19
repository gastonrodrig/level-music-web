import { Box, Typography, CircularProgress,Stack,Button, InputLabel,Select,MenuItem,useTheme,FormControl,Tabs,Tab,Chip,Divider,Grid } from '@mui/material';
import { useQuotationStore, useEventTypeStore } from '../../../../../hooks';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import PersonIcon from '@mui/icons-material/Person';
import DescriptionIcon from '@mui/icons-material/Description';
import { Accordion, AccordionSummary, AccordionDetails, Avatar } from '@mui/material';
import { useScreenSizes } from "../../../../../shared/constants/screen-width";
import { useNavigate } from "react-router-dom";
import { UseEventTaskStore } from "../../../../../hooks";
import { useEffect, useMemo,useState } from 'react';
import { useEffectEvent } from 'react';
import { AddCircleOutline, Edit } from '@mui/icons-material';
import { QuotationAddActivityModal } from './quotation-add-activities-modal';

import { NoEncryption } from '@mui/icons-material';
//falta explicar por que se trae fuera de la constante
const mapStatusKey = (status) => {
  
    if (!status) return "pending";
    const s = String(status).toLowerCase();
    if (s.includes("pend")) return "pending";
    if (s.includes("progr") || s.includes("in_progress") || s.includes("en_progreso")) return "in_progress";
    if (s.includes("complet")) return "completed";
    if (s.includes("bloq")) return "blocked";
    return "pending";
    };

    const statusLabel = {
    all: "Todas",
    pending: "Pendientes",
    in_progress: "En Progreso",
    completed: "Completadas",
    blocked: "Bloqueadas",
    };


export const QuotationControlActivities = ({
    selected,
    eventTasks = [], // Recibimos las tareas directas desde el padre
}) => {
    const navigate = useNavigate();
    const theme = useTheme();
    const isDark = theme.palette.mode === "dark";

    useEffect(() => {
      console.log("Tareas del evento cargadas 2:", eventTasks);
        if (!selected) {
            navigate("/admin/event-ongoing");
            return;
        }
    }, [selected, navigate]);

    const [tab, setTab] = useState("all");

    // Recalculamos contadores locales para los tabs
    const counts = useMemo(() => {
        const acc = { all: 0, pending: 0, in_progress: 0, completed: 0, blocked: 0 };
        eventTasks.forEach((t) => {
            acc.all += 1;
            const key = mapStatusKey(t.status);
            acc[key] = (acc[key] || 0) + 1;
        });
        return acc;
    }, [eventTasks]);

    const filteredTasks = useMemo(() => {
        if (tab === "all") return eventTasks;
        return eventTasks.filter((t) => mapStatusKey(t.status) === tab);
    }, [eventTasks, tab]);

    const getColor = (status) => {
        const s = mapStatusKey(status);
        switch (s) {
            case 'pending': return 'default';
            case 'in_progress': return 'info';
            case 'completed': return 'success';
            case 'blocked': return 'error';
            default: return 'default';
        }
    };

    return (
        <Box>
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                <Tabs
                    value={tab}
                    onChange={(_, v) => setTab(v)}
                    variant="scrollable"
                    scrollButtons="auto"
                    sx={{ borderRadius: 4 }}
                >
                    {Object.keys(statusLabel).map((key) => (
                        <Tab 
                            key={key}
                            sx={{ backgroundColor: isDark ? '#2c2b2b' : '#fff', textTransform: 'none' }} 
                            label={`${statusLabel[key]} (${counts[key] || 0})`} 
                            value={key} 
                        />
                    ))}
                </Tabs>
                {/* Eliminado el botón de Agregar Actividad */}
            </Stack>

            <Box>
                {(!filteredTasks || filteredTasks.length === 0) && (
                    <Typography sx={{ textAlign: "center", py: 4, color: "text.secondary" }}>
                        No hay actividades en esta categoría.
                    </Typography>
                )}

                {/* PRIMER MAPEO: Tareas Principales (Acordeones) */}
                {filteredTasks.map((task) => (
                    <Accordion key={task._id || task.id} sx={{ mb: 1, borderRadius: 4, boxShadow: 'none', overflow: 'hidden' }}>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ backgroundColor: isDark ? '#2c2b2b' : '#fff', borderRadius: 4, border: 'none' }}>
                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'start', gap: 1 }}>
                                <Typography sx={{ fontWeight: 500 }}>{task.name || task.title || 'Tarea Principal'}</Typography>
                                <Typography variant="caption" color="text.secondary">
                                    {task.subtasks?.length || 0} Subtareas
                                </Typography>
                            </Box>
                        </AccordionSummary>

                        <AccordionDetails sx={{ mt: 1, mb: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
                            
                            {(!task.subtasks || task.subtasks.length === 0) ? (
                                <Typography variant="body2" color="text.secondary" sx={{ p: 2, textAlign: 'center' }}>
                                    No hay subtareas registradas.
                                </Typography>
                            ) : (
                                /* SEGUNDO MAPEO: Subtareas dentro del Acordeón */
                                task.subtasks.map((subtask, index) => (
                                    <Box 
                                        key={subtask._id || index} 
                                        sx={{ 
                                            border: (theme) => `1px solid ${theme.palette.mode === 'dark' ? '#444' : '#e0e0e0'}`,
                                            borderRadius: 2,
                                            p: 2,
                                            backgroundColor: isDark ? '#1e1e1e' : '#fafafa'
                                        }}
                                    >
                                        <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 'bold', color: 'primary.main' }}>
                                            {subtask.name || `Subtarea #${index + 1}`}
                                        </Typography>

                                        <Grid container spacing={2}>
                                            {/* Sección 1: Personal Asignado */}
                                            <Grid item xs={12} md={12}>
                                                <Box sx={{ p: 2, borderRadius: 2, backgroundColor: isDark ? '#2c2b2b' : '#fff' }}>
                                                    <Typography variant="subtitle2" sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                                                        <PersonIcon sx={{ fontSize: 20 }} />
                                                        Personal Asignado
                                                    </Typography>
                                                    <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                                                        {subtask.worker_name || "No hay personal asignado."}
                                                    </Typography>
                                                    {subtask.worker_type_name && (
                                                        <Typography variant="caption" color="text.secondary">
                                                            {subtask.worker_type_name}
                                                        </Typography>
                                                    )}
                                                </Box>
                                            </Grid>

                                            {/* Sección 2: Estado */}
                                            <Grid item xs={12} md={12}>
                                                <Box sx={{ p: 2, borderRadius: 2, backgroundColor: isDark ? '#2c2b2b' : '#fff' }}>
                                                    <Typography variant="subtitle2" sx={{ mb: 1 }}>Estado:</Typography>
                                                    <Stack direction="row" spacing={1} alignItems="center">
                                                        <Chip label={subtask.status || 'Pendiente'} size="small" color={getColor(subtask.status)} />
                                                        {/* Si 'requires_evidence' está en la subtarea */}
                                                        {subtask.requires_evidence && <Chip label="Requiere Evidencia" size="small" variant="outlined" />}
                                                    </Stack>
                                                </Box>
                                            </Grid>

                                            {/* Sección 3: Notas */}
                                            <Grid item xs={12} md={12}>
                                                <Box sx={{ p: 2, borderRadius: 2, backgroundColor: isDark ? '#2c2b2b' : '#fff' }}>
                                                    <Typography variant="subtitle2" sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                                                        <DescriptionIcon sx={{ fontSize: 20 }} />
                                                        Observaciones:
                                                    </Typography>
                                                    <Typography variant="body2">
                                                        {subtask.notes || subtask.storehouse_code || 'Sin observaciones.'}
                                                    </Typography>
                                                </Box>
                                            </Grid>

                                            {/* Sección 4: Evidencias */}
                                            <Grid item xs={12} md={12}>
                                                {(!subtask.evidences || subtask.evidences.length === 0) ? (
                                                    <Box sx={{ p: 2 }}>
                                                        <Typography variant="body2" color="text.secondary">Sin evidencias.</Typography>
                                                    </Box>
                                                ) : (
                                                    <Box sx={{ p: 2, borderRadius: 2, backgroundColor: isDark ? '#2c2b2b' : '#fff' }}>
                                                        <Typography variant="subtitle2" sx={{ mb: 1 }}>Evidencias ({subtask.evidences.length}):</Typography>
                                                        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                                                            {subtask.evidences.map((evidence, idx) => {
                                                                const src = evidence?.file_url || evidence?.url || evidence?.files_url;
                                                                if (!src) return null;
                                                                return (
                                                                    <Box
                                                                        key={evidence._id || idx}
                                                                        component="img"
                                                                        src={src}
                                                                        alt={`evidence-${idx}`}
                                                                        onError={(e) => { e.currentTarget.src = '/placeholder-image.png'; }}
                                                                        sx={{
                                                                            width: 150, // Reduje un poco el tamaño para subtareas
                                                                            height: 100,
                                                                            objectFit: 'cover',
                                                                            borderRadius: 1,
                                                                            border: (theme) => `1px solid ${theme.palette.mode === 'dark' ? '#3c3c3c' : '#e0e0e0'}`,
                                                                        }}
                                                                    />
                                                                );
                                                            })}
                                                        </Stack>
                                                    </Box>
                                                )}
                                            </Grid>
                                        </Grid>
                                    </Box>
                                ))
                            )}
                        </AccordionDetails>
                    </Accordion>
                ))}
            </Box>
        </Box>
    );
};