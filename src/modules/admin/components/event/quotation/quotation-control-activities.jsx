import { Box, Typography, Stack, Tabs, Tab, Chip, Grid, useTheme } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import PersonIcon from '@mui/icons-material/Person';
import DescriptionIcon from '@mui/icons-material/Description';
import { Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import { useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from 'react';

// Definición de Fases
const TAB_PHASES = {
    ALL: 'all',
    PLANIFICACION: 'Planificación',
    EJECUCION: 'Ejecución',
    SEGUIMIENTO: 'Seguimiento'
};

export const QuotationControlActivities = ({
    selected,
    eventTasks = [], 
}) => {
    const navigate = useNavigate();
    const theme = useTheme();
    const isDark = theme.palette.mode === "dark";
    const [tab, setTab] = useState(TAB_PHASES.ALL);

    useEffect(() => {
        if (!selected) {
            navigate("/admin/event-ongoing");
        }
    }, [selected, navigate]);

    // CÁLCULO DE CONTADORES POR FASE
    const phaseCounts = useMemo(() => {
        const acc = { all: 0, [TAB_PHASES.PLANIFICACION]: 0, [TAB_PHASES.EJECUCION]: 0, [TAB_PHASES.SEGUIMIENTO]: 0 };
        
        eventTasks.forEach(task => {
            (task.subtasks || []).forEach(sub => {
                acc.all += 1;
                // Normalizamos la fase por si viene undefined o null
                const p = sub.phase || TAB_PHASES.PLANIFICACION;
                if (acc[p] !== undefined) acc[p] += 1;
            });
        });
        return acc;
    }, [eventTasks]);

    // FILTRADO DE TAREAS Y SUBTAREAS
    const filteredTasks = useMemo(() => {
        if (tab === TAB_PHASES.ALL) return eventTasks;

        return eventTasks.map(task => {
            // Filtramos las subtareas que coincidan con la fase seleccionada
            const matchingSubtasks = (task.subtasks || []).filter(sub => sub.phase === tab);
            
            // Retornamos una copia de la tarea padre con SOLO las subtareas filtradas
            return { ...task, subtasks: matchingSubtasks };
        }).filter(task => task.subtasks && task.subtasks.length > 0); // Ocultamos tareas padres vacías
    }, [eventTasks, tab]);

    // HELPERS DE COLOR
    const getPhaseColor = (phase) => {
        switch(phase) {
            case TAB_PHASES.PLANIFICACION: return 'info';
            case TAB_PHASES.EJECUCION: return 'warning';
            case TAB_PHASES.SEGUIMIENTO: return 'success'; // Cambiado a success para diferenciarlo mejor
            default: return 'default';
        }
    };

    const getStatusColor = (status) => (status === 'Completado' ? 'success' : 'default');

    return (
        <Box>
            {/* TABS DE NAVEGACIÓN POR FASE */}
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                <Tabs
                    value={tab}
                    onChange={(_, v) => setTab(v)}
                    variant="scrollable"
                    scrollButtons="auto"
                    sx={{ borderRadius: 4 }}
                >
                    <Tab label={`Todas (${phaseCounts.all})`} value={TAB_PHASES.ALL} sx={{ textTransform: 'none' }} />
                    <Tab label={`Planificación (${phaseCounts[TAB_PHASES.PLANIFICACION]})`} value={TAB_PHASES.PLANIFICACION} sx={{ textTransform: 'none' }} />
                    <Tab label={`Ejecución (${phaseCounts[TAB_PHASES.EJECUCION]})`} value={TAB_PHASES.EJECUCION} sx={{ textTransform: 'none' }} />
                    <Tab label={`Seguimiento (${phaseCounts[TAB_PHASES.SEGUIMIENTO]})`} value={TAB_PHASES.SEGUIMIENTO} sx={{ textTransform: 'none' }} />
                </Tabs>
            </Stack>

            <Box>
                {/* MENSAJE SI NO HAY TAREAS */}
                {(!filteredTasks || filteredTasks.length === 0) && (
                    <Typography sx={{ textAlign: "center", py: 4, color: "text.secondary" }}>
                        No hay actividades en esta categoría.
                    </Typography>
                )}

                {/* LISTADO DE TAREAS PRINCIPALES (ACORDEONES) */}
                {filteredTasks.map((task) => (
                    <Accordion key={task._id || task.id} sx={{ mb: 1, borderRadius: 4, boxShadow: 'none', overflow: 'hidden' }}>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ backgroundColor: isDark ? '#2c2b2b' : '#fff', borderRadius: 4 }}>
                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'start', gap: 1 }}>
                                <Typography sx={{ fontWeight: 600 }}>{task.name || task.title || 'Tarea Principal'}</Typography>
                                <Typography variant="caption" color="text.secondary">
                                    {task.subtasks?.length || 0} Subtareas visibles
                                </Typography>
                            </Box>
                        </AccordionSummary>

                        <AccordionDetails sx={{ mt: 1, mb: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
                            
                            {(!task.subtasks || task.subtasks.length === 0) ? (
                                <Typography variant="body2" color="text.secondary" sx={{ p: 2, textAlign: 'center' }}>
                                    No hay subtareas registradas.
                                </Typography>
                            ) : (
                                /* MAPEO DE SUBTAREAS */
                                task.subtasks.map((subtask, index) => (
                                    <Box 
                                        key={subtask._id || index} 
                                        sx={{ 
                                            border: (theme) => `1px solid ${theme.palette.divider}`,
                                            borderRadius: 2,
                                            p: 2,
                                            backgroundColor: isDark ? '#1e1e1e' : '#fafafa',
                                            position: 'relative',
                                            overflow: 'hidden'
                                        }}
                                    >
                                        {/* Borde lateral de color según fase */}
                                        <Box sx={{
                                            position: 'absolute', left: 0, top: 0, bottom: 0, width: 4,
                                            bgcolor: `${getPhaseColor(subtask.phase)}.main`
                                        }} />

                                        <Grid container spacing={2}>
                                            {/* Header Subtarea */}
                                            <Grid item xs={12}>
                                                <Stack direction={{xs: 'column', sm: 'row'}} justifyContent="space-between" alignItems="start" spacing={1}>
                                                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                                                        {subtask.name || `Subtarea #${index + 1}`}
                                                    </Typography>
                                                    
                                                    <Stack direction="row" spacing={1}>
                                                        <Chip label={subtask.phase || 'Planificación'} size="small" color={getPhaseColor(subtask.phase)} variant="outlined" />
                                                        <Chip label={subtask.status || 'Pendiente'} size="small" color={getStatusColor(subtask.status)} />
                                                        {subtask.requires_evidence && <Chip label="Evidencia Req." size="small" variant="outlined" color="primary" />}
                                                    </Stack>
                                                </Stack>
                                            </Grid>

                                            {/* Personal Asignado */}
                                            <Grid item xs={12} md={6}>
                                                <Box sx={{ p: 2, borderRadius: 2, backgroundColor: isDark ? '#2c2b2b' : '#fff', height: '100%' }}>
                                                    <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                        <PersonIcon sx={{ fontSize: 16 }} /> Asignado a:
                                                    </Typography>
                                                    
                                                    <Typography variant="body2" fontWeight="medium" mt={0.5}>
                                                        {subtask.worker_name || "Sin asignar"}
                                                    </Typography>
                                                    {subtask.worker_type_name && (
                                                        <Typography variant="caption" color="text.secondary">
                                                            {subtask.worker_type_name}
                                                        </Typography>
                                                    )}
                                                </Box>
                                            </Grid>

                                            {/* Notas / Almacén */}
                                            <Grid item xs={12} md={6}>
                                                <Box sx={{ p: 2, borderRadius: 2, backgroundColor: isDark ? '#2c2b2b' : '#fff', height: '100%' }}>
                                                    <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                        <DescriptionIcon sx={{ fontSize: 16 }} /> Notas / Ref:
                                                    </Typography>
                                                    <Typography variant="body2" mt={0.5}>
                                                        {subtask.notes || subtask.storehouse_code || 'Sin notas registradas.'}
                                                    </Typography>
                                                </Box>
                                            </Grid>

                                            {/* Evidencias */}
                                            <Grid item xs={12}>
                                                {(!subtask.evidences || subtask.evidences.length === 0) ? (
                                                    <Box sx={{ px: 1, py: 1 }}>
                                                        <Typography variant="caption" color="text.secondary">Sin evidencias adjuntas.</Typography>
                                                    </Box>
                                                ) : (
                                                    <Box sx={{ p: 2, borderRadius: 2, backgroundColor: isDark ? '#2c2b2b' : '#fff' }}>
                                                        <Typography variant="subtitle2" sx={{ mb: 1 }}>
                                                            Evidencias ({subtask.evidences.length})
                                                        </Typography>
                                                        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                                                            {subtask.evidences.map((evidence, idx) => {
                                                                // Aquí extraemos la URL correcta del objeto de evidencia
                                                                const src = evidence?.file_url || evidence?.url; 
                                                                
                                                                if (!src) return null;
                                                                
                                                                return (
                                                                    <Box
                                                                        key={evidence._id || idx}
                                                                        component="img"
                                                                        src={src}
                                                                        alt={`evidence-${idx}`}
                                                                        onError={(e) => { e.currentTarget.src = '/placeholder-image.png'; }}
                                                                        sx={{
                                                                            width: 120, 
                                                                            height: 90,
                                                                            objectFit: 'cover',
                                                                            borderRadius: 1,
                                                                            border: (theme) => `1px solid ${theme.palette.divider}`,
                                                                            cursor: 'pointer',
                                                                            transition: 'transform 0.2s',
                                                                            '&:hover': { transform: 'scale(1.05)' }
                                                                        }}
                                                                        // Opcional: Aquí podrías agregar un onClick para abrir un modal con la imagen grande
                                                                        onClick={() => window.open(src, '_blank')}
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