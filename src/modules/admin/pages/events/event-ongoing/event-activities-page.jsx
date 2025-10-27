
import { Typography, Box,Stack,Button, useTheme } from "@mui/material";
import { useEffect, useState, useMemo } from "react";
import { ActivityProgressHeader,QuotationControlActivities } from "../../../components";
import { useQuotationStore } from "../../../../../hooks";
import { useNavigate } from "react-router-dom";
import { useScreenSizes } from "../../../../../shared/constants/screen-width";
import { UseEventTaskStore,useWorkerStore } from "../../../../../hooks";



export const EventActivitiesPage = () => {
    const {selected} = useQuotationStore();
    const { workers,startLoadingAllWorkers } = useWorkerStore();
    const { eventTasks, loading, startLoadingEventTaskByStatus, startLoadingEventsTaskByIdEvent, startUpdateTaskAssignment, startAddEventTask } = UseEventTaskStore();
    const navigate = useNavigate();
    const { isSm } = useScreenSizes();
    const theme = useTheme();
    const [changedAssignments, setChangedAssignments] = useState({});
    const [newTasks, setNewTasks] = useState([]);
    const handleAssignmentsChange = (assignments) => {
      setChangedAssignments(assignments || {});
    };
    const handleNewTasksChange = (tasks) => setNewTasks(tasks);
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
    const acc = { pending: 0, in_progress: 0, completed: 0, blocked: 0, evidence: 0, assigned: 0, total: 0 };
    
    (eventTasks || []).forEach((t) => {
        
      const key = mapStatusKey(t.status);
      acc[key] = (acc[key] || 0) + 1;
      if (t.requires_evidence) acc.evidence += 1;
      if (t.worker) acc.assigned += 1;
      acc.total += 1;
    });
    return acc;
  }, [eventTasks]);

  const percent = counts.total ? Math.round((counts.completed / counts.total) * 100) : 0;

    useEffect(() => {
        if(selected){
            startLoadingEventsTaskByIdEvent(selected.id??selected._id);
            startLoadingAllWorkers();
        }
    }, [selected]);


    const handleSaveAssignments = async () => {
    // 1. Guarda nuevas actividades
    for (const task of newTasks) {
      // Limpia campos temporales antes de enviar
      const { _id, isNew, ...dto } = task;
      console.log('Guardando nueva tarea:', dto);
      await startAddEventTask(dto);
    }
    // 2. Guarda cambios de asignación
    const entries = Object.entries(changedAssignments).filter(
    ([taskId]) => !String(taskId).startsWith('temp-')
    );
    await Promise.all(
      entries.map(([taskId, workerId]) =>
        startUpdateTaskAssignment(taskId, workerId)
      )
    );
    // 3. Recarga y limpia
    if (selected) startLoadingEventsTaskByIdEvent(selected.id ?? selected._id);
    setChangedAssignments({});
    setNewTasks([]);
  };

    return (
        <Box >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 1, mb: 2 }}>
                <Box>
                <Typography variant="h4" sx={{ pt: 2, pb:1}}>Actividades del Evento</Typography>
                <Typography sx={{ pb: 2}}>
                    Esta página muestra las actividades en curso para el evento seleccionado. Aquí puedes monitorear y gestionar todas las actividades asociadas con el evento.
                </Typography>
                </Box>
                {(Object.keys(changedAssignments).length > 0 || newTasks.length > 0) && (
                  <Button variant="contained" color="primary" onClick={handleSaveAssignments} sx={{height: '70px', backgroundColor: '#212121', color: '#fff', borderRadius: 2, textTransform: 'none', px: 3, py: 1.5 }}>
                    {isSm ? 'Guardar Asignaciones' : 'Guardar'} 
                  </Button>
                )}
                </Box>
                <Box sx={{ p: 3, bgcolor: isDark ? "#1f1e1e" : "#f5f5f5",mb: 2,
                borderRadius: 2,gap: { xs: 1, sm: 0 }, }}>
                    <ActivityProgressHeader  totals={counts} total={counts.total} percent={percent} />
                    {/* ACTIVIDADES DE EVENTOS  */}

                    {/* PARTE DOS DONDE SE LISTAN LOS TASK POR CADA EVENTO JUNTO CON EL TRABAJADOR */}
                    <QuotationControlActivities 
                    selected={selected}
                    eventTasks={eventTasks}
                    loading={loading}
                    workers={workers}
                    onAssignmentsChange={handleAssignmentsChange}
                    onNewTasksChange={handleNewTasksChange}
                    newTasks={newTasks}
                    />
                </Box>
        </Box>
    );
}