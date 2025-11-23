import { useDispatch, useSelector } from 'react-redux';
import { eventApi } from '../../api';
import {
  selectedQuotation,
  setLoadingQuotation,
  setPageQuotation,
  setRowsPerPageQuotation,
  refreshQuotations,
  showSnackbar,
  setDashboardData,
  setGraficsperMonth,
  setEventType,
  setEventByDate,
} from '../../store';
import{
  createQuotationModel,
  updateQuotationModel,
  evaluateQuotationModel,
  createMailReadyQuotationModel,
} from '../../shared/models';
import { useState } from 'react';
import { getAuthConfig, getAuthConfigWithParams } from '../../shared/utils';

export const useQuotationStore = () => {
  const dispatch = useDispatch();
  const { 
    quotations, 
    selected, 
    total, 
    loading, 
    currentPage, 
    rowsPerPage,
    dashboardData,
    graficperMonth,
    eventType,
    eventByDate,
  } = useSelector((state) => state.quotation);

  const { token } = useSelector((state) => state.auth);

  const [searchTerm, setSearchTerm] = useState('');
  const [orderBy, setOrderBy] = useState('description');
  const [order, setOrder] = useState('asc');

  const openSnackbar = (message) => dispatch(showSnackbar({ message }));

  const startCreateQuotation = async (quotation) => {
    dispatch(setLoadingQuotation(true));
    try {
      const payload = createQuotationModel(quotation);
      await eventApi.post('/quotation', payload, getAuthConfig(token));
      return true;
    } catch (error) {
      const message = error.response?.data?.message;
      openSnackbar(message ?? "Ocurrió un error al agregar la cotización.");
      return false;
    } finally {
      dispatch(setLoadingQuotation(false));
    }
  };

  const startUpdateQuotation = async (quotationId, quotation) => {
    dispatch(setLoadingQuotation(true));
    try {
      const payload = updateQuotationModel(quotation);
      await eventApi.patch(`quotation/${quotationId}`, payload, getAuthConfig(token));
      openSnackbar("La cotización fue editada exitosamente.");
      return true;
    } catch (error) {
      const message = error.response?.data?.message;
      openSnackbar(message ?? "Ocurrió un error al editar la cotización.");
      return false;
    } finally {
      dispatch(setLoadingQuotation(false));
    }
  };

  const startTimeUpdateQuotationAdmin = async (quotationId, partial) => {
    dispatch(setLoadingQuotation(true));
    try {
      await eventApi.patch(`quotation/admin/${quotationId}`, partial, getAuthConfig(token));
      openSnackbar("La cotización fue editada exitosamente.");
      return true;
    } catch (error) {
      const message = error.response?.data?.message;
      openSnackbar(message ?? "Ocurrió un error al editar la cotización.");
      return false;
    } finally {
      dispatch(setLoadingQuotation(false));
    }
  };

  const startLoadingQuotationPaginated = async (userId, caseFilter) => {
    dispatch(setLoadingQuotation(true));
    try {
      const limit  = rowsPerPage;
      const offset = currentPage * rowsPerPage;
      const { data } = await eventApi.get('/paginated',
        getAuthConfigWithParams(token, {
          limit,
          offset,
          search: searchTerm.trim(),
          sortField: orderBy,
          sortOrder: order,
          ...(userId && { user_id: userId }),
          ...(caseFilter && { case: caseFilter }),
        })
      );
      dispatch(refreshQuotations({
        items: data.items,
        total: data.total,
        page:  currentPage,
      }));
      return true;
    } catch (error) {
      const message = error.response?.data?.message;
      openSnackbar(message ?? "Ocurrió un error al cargar las cotizaciones.");
      return false;
    } finally {
      dispatch(setLoadingQuotation(false));
    }
  };

  const startLoadingQuotationVersionsByCode = async (eventCode) => {
    dispatch(setLoadingQuotation(true));
    try {
      const { data } = await eventApi.get(`/versions/${eventCode}`, getAuthConfig(token));

      dispatch(refreshQuotations({
        items: data,
        total: data.length,
        page: 0,
      }));
      
      return true;
    } catch (error) {
      const message = error.response?.data?.message;
      openSnackbar(message ?? "Ocurrió un error al cargar las versiones de la cotización.");
      return false;
    } finally {
      dispatch(setLoadingQuotation(false));
    }
  };

  const startSendingReadyQuotation = async (data) => {
    dispatch(setLoadingQuotation(true));
    try {
      const payload = createMailReadyQuotationModel(data);
      await eventApi.post(`send-quotation-ready-email`, payload, getAuthConfig(token));
      openSnackbar("El cliente fue notificado para revisar la cotización.");
      return true;
    } catch (error) {
      const message = error.response?.data?.message;
      openSnackbar(message ?? "No se pudo notificar al cliente sobre la cotización.");
      return false;
    } finally {
      dispatch(setLoadingQuotation(false));
    }
  }

  const startEvaluateQuotation = async (quotationId, evaluation, userId) => {
    dispatch(setLoadingQuotation(true));
    try {
      const payload = evaluateQuotationModel(evaluation);
      const { data } = await eventApi.patch(`${quotationId}/status`, payload, getAuthConfig(token));
      startLoadingQuotationPaginated(userId);
      if (data.status === 'Confirmado') {
        openSnackbar("La cotización fue confirmada exitosamente.");
      } else {
        openSnackbar("La cotización fue rechazada.");
      }
      return true;
    } catch (error) {
      const message = error.response?.data?.message;
      openSnackbar(message ?? "Ocurrió un error al evaluar la cotización.");
      return false; 
    } finally {
      dispatch(setLoadingQuotation(false));
    }
  }

  const dashboardList = async () => {
    dispatch(setLoadingQuotation(true));
    try {
      const { data } = await eventApi.get('/dashboard/appointments-count', getAuthConfig(token));
      dispatch(setDashboardData(data));
      console.log(data);
      return true;
    } catch (error) {
      const message = error.response?.data?.message;
      openSnackbar(message ?? "Ocurrió un error al cargar las cotizaciones.");
      return false;
    } finally {
      dispatch(setLoadingQuotation(false));
    }
  }

  const graficperMonthList = async (fechaInicio, fechaFin) => {
    dispatch(setLoadingQuotation(true));
    try {
      const params = fechaInicio && fechaFin
      ? `?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`
      : '';
      const { data } = await eventApi.get(`/eventsperMonths${params}`, getAuthConfig(token));
      dispatch(setGraficsperMonth(data));
      console.log(data);
      return true;
    } catch (error) {
      const message = error.response?.data?.message;
      openSnackbar(message ?? "Ocurrió un error al cargar las cotizaciones.");
      return false;
    } finally {
      dispatch(setLoadingQuotation(false));
    }
  };

  const eventTypes = async () => {
    dispatch(setLoadingQuotation(true));
    try {
      const { data } = await eventApi.get('/eventTypes', getAuthConfig(token));
      dispatch(setEventType(data));
      return true;
    } catch (error) {
      const message = error.response?.data?.message;
      openSnackbar(message ?? "Ocurrió un error al cargar los tipos de evento.");
      return false;
    } finally {
      dispatch(setLoadingQuotation(false));
    }
  };

  const eventDate = async (year, month) => {
    dispatch(setLoadingQuotation(true));
    try {
      const params = year && month
        ? `?year=${year}&month=${month}`
        : '';
      const { data } = await eventApi.get(`/getEventByDate${params}`, getAuthConfig(token));
      console.log('Calendario respuesta raw:', data);
      dispatch(setEventByDate(Array.isArray(data) ? data : data?.data ?? [])); // Asegura array
      return true;
    } catch (error) {
      console.error('Error getEventByDate:', error);
      const message = error.response?.data?.message;
      openSnackbar(message ?? "Error al cargar eventos del calendario.");
      return false;
    } finally {
      dispatch(setLoadingQuotation(false));
    }
  };

  const setSelectedQuotation = (quotation) => {
    dispatch(selectedQuotation({ ...quotation }));
  };

  const setPageGlobal = (page) => {
    dispatch(setPageQuotation(page));
  };

  const setRowsPerPageGlobal = (rows) => {
    dispatch(setRowsPerPageQuotation(rows));
  };

  return {
    // state
    quotations,
    selected,
    total,
    loading,
    searchTerm,
    rowsPerPage,
    currentPage,
    orderBy,
    order,
    dashboardData,
    graficperMonth,
    eventType,
    eventByDate,

    // setters
    setSearchTerm,
    setOrderBy,
    setOrder,
    setPageGlobal,
    setRowsPerPageGlobal,
    
    // actions
    startCreateQuotation,
    startLoadingQuotationPaginated,
    startLoadingQuotationVersionsByCode,
    setSelectedQuotation,
    startUpdateQuotation,
    startEvaluateQuotation,
    startSendingReadyQuotation,
    startTimeUpdateQuotationAdmin,
    dashboardList,
    graficperMonthList,
    eventTypes,
    eventDate,
  };
};