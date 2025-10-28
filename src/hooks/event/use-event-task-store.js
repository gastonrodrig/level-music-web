import { useDispatch, useSelector } from 'react-redux';
import { EventTaskApi } from '../../api';
import {
  listAllEventTasks,
  refreshEventTasks,
    selectedEventTask,
    setLoadingEventTask,
    setPageEventTask,
    setRowsPerPageEventTask,
    showSnackbar,
} from '../../store';
import { useState } from 'react';
import { getAuthConfig, getAuthConfigWithParams } from '../../shared/utils';


export const UseEventTaskStore = () => {
    const dispatch = useDispatch();
    
    const { 
        eventTasks,
        selected,
        total,
        loading,
        currentPage,
        rowsPerPage,
    } =  useSelector((state) => state.eventTasks);
    const [searchTerm, setSearchTerm] = useState('');
    const [orderBy, setOrderBy] = useState('description');
    const [order, setOrder] = useState('asc');

     const { token } = useSelector((state) => state.auth);
     const openSnackbar = (message) => dispatch(showSnackbar({ message }));

     const startAddEventTask = async (data) => {
      try {
        await EventTaskApi.post("/", data, getAuthConfig(token));
        openSnackbar("Actividad agregada correctamente.");
        return true;
      } catch (error) {
        const message = error.response?.data?.message;
        openSnackbar(message ?? "Ocurrió un error al cargar las actividades del evento.");
        return false;
      } finally {
        dispatch(setLoadingEventTask(false));
      }
    };

     const startLoadingEventTaskByStatus = async (status) => {
         dispatch(setLoadingEventTask(true));
        try{
        const {data} = await EventTaskApi.get(`/status/${status}`, getAuthConfig(token));
        dispatch(listAllEventTasks(data));
        return true;
      } catch (error) {
          const message = error.response?.data?.message;
          openSnackbar(message ?? "Ocurrió un error al cargar las actividades del evento.");
          return false;
        } finally {
          dispatch(setLoadingEventTask(false));
            }
    };

    const startLoadingEventsTaskByIdEvent = async (idEvent) => {
        dispatch(setLoadingEventTask(true));
        try{
        const {data} = await EventTaskApi.get(`/event/${idEvent}`, getAuthConfig(token));
        dispatch(listAllEventTasks(data));
        return true;
      } catch (error) {
            const message = error.response?.data?.message;
            openSnackbar(message ?? "Ocurrió un error al cargar las actividades del evento.");
            return false;
        } finally {
          dispatch(setLoadingEventTask(false));
            }
    };

    const startUpdateTaskAssignment = async (taskId, workerId) => {
      try {
        // PATCH al endpoint específico (ajusta la URL si es necesario)
        await EventTaskApi.patch(`/${taskId}/worker`,{ worker_id: workerId },getAuthConfig(token));
        openSnackbar("Asignación actualizada correctamente.");
        return true;
      } catch (error) {
        const message = error.response?.data?.message;
        openSnackbar(message ?? "Ocurrió un error al actualizar la asignación.");
        return false;
      }
    };

    const setSelectedQuotation = (eventTask) => {
        dispatch(selectedEventTask(...eventTask));
    };
    const setPageGlobal = (page) => {
        dispatch(setPageEventTask(page));
      };
    
      const setRowsPerPageGlobal = (rows) => {
        dispatch(setRowsPerPageEventTask(rows));
      };

    return {
    eventTasks,
    selected,
    total,
    loading,
    currentPage,
    rowsPerPage,

    setSelectedQuotation,
    setPageGlobal,
    setRowsPerPageGlobal,

    startAddEventTask,
    startUpdateTaskAssignment,  
    startLoadingEventTaskByStatus,
    startLoadingEventsTaskByIdEvent,
    
}
}