import { useDispatch, useSelector } from 'react-redux';
import { eventTypeApi } from '../../api';
import {
  listAllEventTypes,
  refreshEventTypes,
  selectedEventType,
  setLoadingEventType,
  setPageEventType,
  setRowsPerPageEventType,
  showSnackbar,
} from '../../store';
import { 
  createEventTypeModel,
  updateEventTypeModel
} from '../../shared/models';
import { useState } from 'react';
import { getAuthConfig, getAuthConfigWithParams } from '../../shared/utils';

export const useEventTypeStore = () => {
  const dispatch = useDispatch();
  const { 
    eventTypes, 
    selected, 
    total, 
    loading, 
    currentPage, 
    rowsPerPage 
  } = useSelector((state) => state.eventType);

  const { token } = useSelector((state) => state.auth);

  const [searchTerm, setSearchTerm] = useState('');
  const [orderBy, setOrderBy] = useState('description');
  const [order, setOrder] = useState('asc');

  const openSnackbar = (message) => dispatch(showSnackbar({ message }));

  const startCreateEventType = async (eventType) => {
    dispatch(setLoadingEventType(true));
    try {
      const payload = createEventTypeModel(eventType);
      await eventTypeApi.post('/', payload, getAuthConfig(token));
      startLoadingEventTypePaginated();
      openSnackbar("El tipo de evento fue creado exitosamente.");
      return true;
    } catch (error) {
      const message = error.response?.data?.message;
      openSnackbar(message ?? "Ocurrió un error al crear los tipos de evento.");
      return false;
    } finally {
      dispatch(setLoadingEventType(false));
    }
  };

  const startLoadingAllEventTypes = async () => {
    dispatch(setLoadingEventType(true));
    try {
      const { data } = await eventTypeApi.get('/all');
      dispatch(listAllEventTypes(data));
      return true;
    } catch (error) {
      const message = error.response?.data?.message;
      openSnackbar(message ?? "Ocurrió un error al cargar los tipos de evento.");
      return false;
    } finally {
      dispatch(setLoadingEventType(false));
    }
  };

  const startLoadingEventTypePaginated = async () => {
    dispatch(setLoadingEventType(true));
    try {
      const limit  = rowsPerPage;
      const offset = currentPage * rowsPerPage;
      const { data } = await eventTypeApi.get('/paginated',
        getAuthConfigWithParams(token, {
          limit,
          offset,
          search: searchTerm.trim(),
          sortField: orderBy,
          sortOrder: order,
        })
      );
      dispatch(refreshEventTypes({
        items: data.items,
        total: data.total,
        page:  currentPage,
      }));
      return true;
    } catch (error) {
      const message = error.response?.data?.message;
      openSnackbar(message ?? "Ocurrió un error al cargar los tipos de evento.");
      return false;
    } finally {
      dispatch(setLoadingEventType(false));
    }
  };

  const startUpdateEventType = async (id, eventType) => {
    dispatch(setLoadingEventType(true));
    try {
      const payload = updateEventTypeModel(eventType);
      await eventTypeApi.put(`/${id}`, payload, getAuthConfig(token));
      startLoadingEventTypePaginated();
      openSnackbar("El tipo de evento fue actualizado exitosamente.");
      return true;
    } catch (error) {
      const message = error.response?.data?.message;
      openSnackbar(message ?? "Ocurrió un error al actualizar los tipos de evento.");
      return false;
    } finally {
      dispatch(setLoadingEventType(false));
    }
  };

  const validateAttributes = (attributes) => {
    if (attributes.length === 0) {
      openSnackbar("Debe agregar al menos un atributo al tipo de servicio.");
      return false;
    } 
    return true;
  };

  const setSelectedEventType = (eventType) => {
    dispatch(selectedEventType({ ...eventType }));
  };

  const setPageGlobal = (page) => {
    dispatch(setPageEventType(page));
  };

  const setRowsPerPageGlobal = (rows) => {
    dispatch(setRowsPerPageEventType(rows));
  };
  

  return {
    // state
    eventTypes,
    selected,
    total,
    loading,
    searchTerm,
    rowsPerPage,
    currentPage,
    orderBy,
    order,

    // setters
    setSearchTerm,
    setOrderBy,
    setOrder,
    setPageGlobal,
    setRowsPerPageGlobal,

    // actions
    startCreateEventType,
    startLoadingAllEventTypes,
    startLoadingEventTypePaginated,
    startUpdateEventType,
    setSelectedEventType,
    validateAttributes
  };
};