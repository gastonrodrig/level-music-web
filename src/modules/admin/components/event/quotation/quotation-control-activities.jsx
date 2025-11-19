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
const TAB_PHASES = {
    ALL: 'all',
    PLANIFICACION: 'Planificación',
    EJECUCION: 'Ejecución',
    SEGUIMIENTO: 'Seguimiento'
};

export const QuotationControlActivities = ({
    selected,
    eventTasks = [], // Recibimos las tareas directas desde el padre
}) => {
    const navigate = useNavigate();
    const theme = useTheme();
    const isDark = theme.palette.mode === "dark";
    const [tab, setTab] = useState(TAB_PHASES.ALL);

    useEffect(() => {
      
        if (!selected) {
            navigate("/admin/event-ongoing");
            return;
        }
    }, [selected, navigate]);


    const phaseCounts = useMemo(() => {
        const acc = { all: 0, [TAB_PHASES.PLANIFICACION]: 0, [TAB_PHASES.EJECUCION]: 0, [TAB_PHASES.SEGUIMIENTO]: 0 };
        eventTasks.forEach(task => {
            (task.subtasks || []).forEach(sub => {
                acc.all += 1;
                const p = sub.phase || TAB_PHASES.PLANIFICACION;
                if (acc[p] !== undefined) acc[p] += 1;
            });
        });
        return acc;
    }, [eventTasks]);

    const filteredTasks = useMemo(() => {
        if (tab === TAB_PHASES.ALL) return eventTasks;

        return eventTasks.map(task => {
            // Filtramos las subtareas
            const matchingSubtasks = (task.subtasks || []).filter(sub => sub.phase === tab);
            // Retornamos una copia de la tarea con SOLO las subtareas que coinciden
            return { ...task, subtasks: matchingSubtasks };
        }).filter(task => task.subtasks.length > 0); // Eliminamos tareas padre que se quedaron vacías
    }, [eventTasks, tab]);

    const getPhaseColor = (phase) => {
        if(phase === TAB_PHASES.PLANIFICACION) return 'info';
        if(phase === TAB_PHASES.EJECUCION) return 'warning';
        if(phase === TAB_PHASES.SEGUIMIENTO) return 'success';
        return 'default';
    };

    const getStatusColor = (status) => (status === 'Completado' ? 'success' : 'default');

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
                    <Tab label={`Todas (${phaseCounts.all})`} value={TAB_PHASES.ALL} sx={{ textTransform: 'none' }} />
                    <Tab label={`Planificación (${phaseCounts[TAB_PHASES.PLANIFICACION]})`} value={TAB_PHASES.PLANIFICACION} sx={{ textTransform: 'none' }} />
                    <Tab label={`Ejecución (${phaseCounts[TAB_PHASES.EJECUCION]})`} value={TAB_PHASES.EJECUCION} sx={{ textTransform: 'none' }} />
                    <Tab label={`Seguimiento (${phaseCounts[TAB_PHASES.SEGUIMIENTO]})`} value={TAB_PHASES.SEGUIMIENTO} sx={{ textTransform: 'none' }} />
                </Tabs>
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
                                            backgroundColor: isDark ? '#393938' : '#fafafa'
                                        }}
                                    >
                                        <Grid container spacing={2}>
                                        <Grid item xs={12} md={12}>
                                                
                                                <Box sx={{ p: 2, borderRadius: 2, backgroundColor: isDark ? '#2c2b2b' : '#fff', gap: 1 }}>
                                                    <Typography variant="subtitle1" sx={{  fontWeight: 'semibold' }}>
                                                       Nombre Sub tarea :  {subtask.name || `Subtarea #${index + 1}`}
                                                    </Typography>
                                                <Box sx={{ pt:1, borderRadius: 2, display: 'flex', flexDirection: 'row', gap: 1 }}>
                                                    <Typography variant="subtitle1" >Estado: </Typography>
                                                    <Stack  spacing={1} direction={'row'} alignItems="center">
                                                        <Chip label={subtask.status} size="small" color={getStatusColor(subtask.status)} />
                                                        {/* Si 'requires_evidence' está en la subtarea */}
                                                        {subtask.requires_evidence && <Chip label="Requiere Evidencia" size="small" variant="outlined" />}
                                                        
                                                    </Stack>
                                                    
                                                    </Box>
                                                    <Box sx={{ pt:1, borderRadius: 2, display: 'flex', flexDirection: 'row', gap: 1 }}>
                                                    <Typography variant="subtitle1" >Fase: </Typography>
                                                    <Chip label={subtask.phase} size="small" color={getPhaseColor(subtask.phase)} />
                                                    </Box>
                                                </Box>
                                        </Grid>


                                            {/* Sección 1: Personal Asignado */}
                                            <Grid item xs={12} md={12}>
                                                <Box sx={{ p: 2, borderRadius: 2, backgroundColor: isDark ? '#2c2b2b' : '#fff' }}>
                                                    <Typography variant="subtitle1" sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                                                        <PersonIcon sx={{ fontSize: 20 }} />
                                                        Personal Asignado
                                                    </Typography>
                                                   
                                                    <Typography variant="subtitle1" sx={{ fontWeight: 'medium' }}>
                                                        {subtask.worker_name || "No hay personal asignado."}
                                                    </Typography>
                                                    {subtask.worker_type_name && (
                                                        <Typography variant="caption" color="text.secondary" sx={{mt:0.5, fontSize:14}}>
                                                            ( {subtask.worker_type_name} )
                                                        </Typography>
                                                    )}
                                                    
                                                </Box>
                                            </Grid>

                                           

                                            {/* Sección 3: Notas */}
                                            <Grid item xs={12} md={12}>
                                                <Box sx={{ p: 2, borderRadius: 2, backgroundColor: isDark ? '#2c2b2b' : '#fff' }}>
                                                    <Typography variant="subtitle1" sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                                                        <DescriptionIcon sx={{ fontSize: 20 }} />
                                                        Codigo de Almacén:
                                                    </Typography>
                                                    <Typography variant="subtitle1">
                                                        {subtask.storehouse_code || 'Codigo de almacén no disponible.'}
                                                    </Typography>
                                                </Box>
                                            </Grid>

                                            {/* Sección 4: Evidencias */}
                                            <Grid item xs={12} md={12}>
                                                {(!subtask.evidences || subtask.evidences.length === 0) ? (
                                                    <Box sx={{ px: 2, py:1 }}>
                                                        <Typography variant="subtitle1" color="text.secondary">Sin evidencias.</Typography>
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