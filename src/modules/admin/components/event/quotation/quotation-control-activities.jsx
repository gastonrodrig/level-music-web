import { Box, Typography, CircularProgress,Stack,Button, useTheme,Tabs,Tab,Chip,Divider,Grid } from '@mui/material';
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
  eventTasks = [],
  loading = false,
  startLoadById,
  startLoadByStatus,
  onAddActivity,
  onView,
}) => {
    const { isSm } = useScreenSizes();
    const {startLoadingEventTaskByStatus, startLoadingEventsTaskByIdEvent } = UseEventTaskStore();
    
    const navigate = useNavigate();
    const theme = useTheme();
    const isDark = theme.palette.mode === "dark";
    
    
    useEffect(() => {
    if (!selected) {
        navigate("/admin/event-ongoing");
        return;
    }
    }, [selected]);

    useEffect(() => {
        if(selected){
            startLoadingEventsTaskByIdEvent(selected.id??selected._id);
        }
    }, [selected]);

    const [tab, setTab] = useState("all");

    const counts = useMemo(() => {
    const acc = { all: 0, pending: 0, in_progress: 0, completed: 0, blocked: 0, evidence: 0, assigned: 0 };
    (eventTasks || []).forEach((t) => {
      acc.all += 1;
      const key = mapStatusKey(t.status);
      acc[key] = (acc[key] || 0) + 1;
      if (t.requires_evidence) acc.evidence += 1;
      if (t.worker) acc.assigned += 1;
    });
        return acc;
    }, [eventTasks]);

    const filteredTasks = useMemo(() => {
        if (tab === "all") return eventTasks || [];
        return (eventTasks || []).filter((t) => mapStatusKey(t.status) === tab);
    }, [eventTasks, tab]);

    const color = (status) => {
      console.log("Status para color:", status);
        switch(status){
            case 'Pendiente':
                return 'default';
            case 'En Progreso':
                return 'info';
            case 'Completado':
                return 'success';
            case 'Bloqueadas':
                return 'error';
        }
    };

    return (
       <Box>
        <Typography variant="h6" sx={{ mb: 2 }}>Actividades del Evento</Typography>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
        <Tabs
          value={tab}
          onChange={(_, v) => setTab(v)}
          variant="scrollable"
          scrollButtons="auto"
          sx={{borderRadius:4}}
        >
          <Tab sx={{backgroundColor: isDark ? '#2c2b2b' : '#fff',textTransform: 'none'}} label={`${statusLabel.all} (${counts.all || 0})`} value="all" />
          <Tab sx={{backgroundColor: isDark ? '#2c2b2b' : '#fff',textTransform: 'none'}} label={`${statusLabel.pending} (${counts.pending || 0})`} value="pending" />
          <Tab sx={{backgroundColor: isDark ? '#2c2b2b' : '#fff',textTransform: 'none'}} label={`${statusLabel.in_progress} (${counts.in_progress || 0})`} value="in_progress" />
          <Tab sx={{backgroundColor: isDark ? '#2c2b2b' : '#fff',textTransform: 'none'}} label={`${statusLabel.completed} (${counts.completed || 0})`} value="completed" />
          <Tab sx={{backgroundColor: isDark ? '#2c2b2b' : '#fff',textTransform: 'none'}} label={`${statusLabel.blocked} (${counts.blocked || 0})`} value="blocked" />
        </Tabs>

        <Stack direction="row" spacing={1} alignItems="center">
          <Chip label={`Con evidencia ${counts.evidence || 0}`} size="small" />
          <Chip label={`Asignadas ${counts.assigned || 0}`} size="small" />
          <Button variant="outlined" color="primary" size="small">Agregar Actividad</Button>
        </Stack>
      </Stack>

      <Box>
        {loading && (
          <Box display="flex" justifyContent="center" py={6}>
            <CircularProgress />
          </Box>
        )}

        {!loading && (!filteredTasks || filteredTasks.length === 0) && (
          <Typography sx={{ textAlign: "center", py: 4, color: "text.secondary" }}>
            No hay actividades en esta categoría.
          </Typography>
        )}

        {!loading && (filteredTasks || []).map((task) => (
          <Accordion key={task._id || task.id} sx={{ mb: 1 , borderRadius:4,boxShadow: 'none',overflow: 'hidden', }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{backgroundColor: isDark ? '#2c2b2b' : '#fff', borderRadius:4, border: 'none'}}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'start', gap: 1 }}>
                <Typography>{task.title || 'Sin título'}</Typography>
                <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'start', gap: 1}}>
                    <Chip label={task.status} size="small" color={color(task.status)} />
                    <Chip label="Plantilla" size="small" />
                <Typography>{task.worker_name || 'Sin asignar'}</Typography>
                </Box>
                </Box>
            </AccordionSummary>

            {/* Un solo AccordionDetails con Grid de 3 columnas */}
            <AccordionDetails sx={{ mt: 1, mb: 2 }}>

                <Grid container spacing={1}>
                <Grid item xs={12} md={12}>
                    <Box sx={{ p: 2, borderRadius: 2, backgroundColor: isDark ? '#2c2b2b' : '#fff' }}>
                    <Typography
                      variant="subtitle2"
                      sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}
                    >
                      <PersonIcon sx={{ fontSize: 20 }} />
                      Asignar Trabajadores
                    </Typography>
                    <Typography variant="body2" color="text.secondary">{task.worker_name || 'Sin asignar'}</Typography>
                    {/* aquí deja el select / UI de asignación si aplica */}
                    </Box>
                </Grid>

                <Grid item xs={12} md={12}>
                    <Box sx={{ p: 2, borderRadius: 2, backgroundColor: isDark ? '#2c2b2b' : '#fff' }}>
                    <Typography variant="subtitle2" sx={{ mb: 1 }}>Estado de la actividad</Typography>
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                        <Chip label={task.status} size="small" color={color(task.status)} />
                        {task.requires_evidence && <Chip label="Evidencia" size="small" />}
                    </Stack>
                    <Typography variant="body2" color="text.secondary">Actualizado por el personal asignado</Typography>
                    </Box>
                </Grid>

                <Grid item xs={12} md={12}>
                    <Box sx={{ p: 2, borderRadius: 2, backgroundColor: isDark ? '#2c2b2b' : '#fff' }}>
                    <Typography  
                    variant="subtitle2"
                      sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}
                    >
                      <DescriptionIcon sx={{ fontSize: 20 }} />
                      Observaciones y notas
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>{task.notes || 'Sin observaciones'}</Typography>
                    
                    </Box>
                </Grid>
                </Grid>
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>
    </Box>
    );
}
