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
  eventTasks = [],
  loading = false,
  workers = [],
  onAssignmentsChange = () => {},
  onNewTasksChange = () => {},
  newTasks = [],
}) => {
     
    const {startLoadingEventTaskByStatus, startLoadingEventsTaskByIdEvent } = UseEventTaskStore();
    const { isLg } = useScreenSizes();
    const navigate = useNavigate();
    const theme = useTheme();
    const isDark = theme.palette.mode === "dark";
    const [addModalOpen, setAddModalOpen] = useState(false);
   
    const handleAddActivity = () => setAddModalOpen(true);

    const handleAddActivitySubmit = (activityName) => {
    const newTask = {
        event_id: selected._id,           // o selected.id
        title: activityName,
        status: "Pendiente",              // o TaskStatusType.PENDIENTE si usas enums
        worker_id:  null,
        worker_type_id:  null,
        event_type_id: selected.event_type || null,
      };
      
      const tempTask = {
        ...newTask,
        _id: `temp-${Date.now()}`,
        isNew: true,
      };
      const updatedNewTasks = [...newTasks, tempTask];
      onNewTasksChange(updatedNewTasks); // Actualiza el estado del padre
      setAddModalOpen(false);
    };
  const allTasks = [...newTasks, ...(eventTasks || [])];

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
    if (tab === "all") return allTasks || [];
    return (allTasks || []).filter((t) => mapStatusKey(t.status) === tab);
    }, [allTasks, tab]);

    const color = (status) => {
      
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

    const [localAssignments, setLocalAssignments] = useState({}); // { taskId: workerId }
    const [originalAssignments, setOriginalAssignments] = useState({});




  const nombre = (name,lastname) => {
      return `${name} ${lastname}`;
  };

  const handleWorkerChange = (taskId, workerId) => {
  const strWorkerId = String(workerId || '');
  // 1. Actualiza el estado local de asignaciones (para la UI del Select)
  // Usamos el callback para seguridad
  setLocalAssignments(prev => ({ ...prev, [taskId]: strWorkerId }));
  // 2. Calcula los cambios de asignación PARA EL PADRE
  // Lo hacemos *fuera* del callback, usando el estado actual + el nuevo cambio
  // (React procesará esto después de que el estado local se actualice)
  const nextAssignments = { ...localAssignments, [taskId]: strWorkerId };
  const changed = {};
  Object.keys(nextAssignments).forEach(id => {
    if (nextAssignments[id] !== originalAssignments[id] && !String(id).startsWith('temp-')) {
      changed[id] = nextAssignments[id];
    }
  });
  onAssignmentsChange(changed);
  // 3. Actualiza el estado local de nuevas tareas (para la UI)
  // Calculamos la nueva lista
  const updatedNewTasks = newTasks.map(t =>
    t._id === taskId
      ? {
          ...t,
          worker_id: workerId,
          worker_type_id: workers.find(w => w._id === workerId)?.worker_type || "",
        }
      : t
  );
  // 4. Llama al padre con la nueva lista de tareas
  // (¡Esto también es seguro!)
  onNewTasksChange(updatedNewTasks);
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
          <Button  variant="contained" onClick={handleAddActivity}  color="primary" size="small" sx={{ backgroundColor: '#212121', color: '#fff', borderRadius: 2, textTransform: 'none', px: 3, py: 1.5 }}
            startIcon={<AddCircleOutline />}
            >
              {isLg ? 'Agregar Actividad' : 'Agregar'}</Button>
        </Stack>
      </Stack>
      <QuotationAddActivityModal
        open={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onAdd={handleAddActivitySubmit}
      />

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
                   <FormControl size="small" sx={{ minWidth: 180 }}>
                       <Select
                          displayEmpty
                          // usar id del estado local (inicializado) — fallback a '' si no hay id
                          value={String(localAssignments[task._id] ?? '')}
                          onChange={(e) => handleWorkerChange(task._id, String(e.target.value))}
                          renderValue={(val) => {
                            if (val) {
                              const w = workers.find(x => String(x._id ?? x.id) === String(val));
                              if (w) return nombre(w.first_name, w.last_name);
                            }
                            // si no hay id mostrar el nombre que viene en la task (worker_name)
                            return task.worker_name || 'Sin asignar';
                          }}
                          sx={{ backgroundColor: isDark ? '#2c2b2b' : '#fff' }}
                        >

                          {workers.map((w) => (
                            <MenuItem key={w._id || w.id} value={String(w._id || w.id)}>
                              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                <Typography variant="body2">{nombre(w.first_name, w.last_name)}</Typography>
                                {w.worker_type_name && (<Typography variant="caption" color="text.secondary">{w.worker_type_name}</Typography>)}
                              </Box>
                            </MenuItem>
                          ))}
                        </Select>
                       
                      </FormControl>
                    </Box>
                </Grid>

                <Grid item xs={12} md={12}>
                    <Box sx={{ p: 2, borderRadius: 2, backgroundColor: isDark ? '#2c2b2b' : '#fff' }}>
                    <Typography variant="subtitle2" sx={{ mb: 1 }}>Estado de la actividad: </Typography>
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
                      Observaciones y notas:
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>{task.notes || 'Sin observaciones'}</Typography>
                    
                    </Box>
                </Grid>

                <Grid item xs={12} md={12}>
                  {(!task.evidences || task.evidences.length === 0) ? (
                    <Typography>
                      Evidencias: {0}
                    </Typography>
                  ) : (
                    <Box sx={{ p: 2, borderRadius: 2, backgroundColor: isDark ? '#2c2b2b' : '#fff' }}>
                      <Typography variant="subtitle2" sx={{ mb: 1 }}>Evidencias ({task.evidences.length}):</Typography>
                      <Stack direction="row" spacing={1} flexWrap="wrap">
                        {Array.isArray(task.evidences) && task.evidences.map((evidence, idx) => {
                          const src = evidence?.file_url || evidence?.url || evidence?.files_url || null;
                          if (!src) return null;
                          return (
                            <Box
                              key={evidence._id || evidence.id || idx}
                              component="img"
                              src={src}
                              alt={`evidence-${idx}`}
                              onError={(e) => { e.currentTarget.src = '/placeholder-image.png'; }}
                              sx={{
                                width: 250,
                                height: 200,
                                objectFit: 'cover',
                                borderRadius: 1,
                                border: (theme) => `1px solid ${theme.palette.mode === 'dark' ? '#3c3c3c' : '#e0e0e0'}`,
                                cursor: 'pointer'
                              }}
                            />
                          );
                        })}
                      </Stack>
                    </Box>
                  )}
                </Grid>
                </Grid>
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>
    </Box>
    );
}
