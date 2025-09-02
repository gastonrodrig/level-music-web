import { useDispatch, useSelector } from 'react-redux';
import { eventFeaturedApi } from '../../api';
import {
  refreshEventFeatured,
  selectedEventFeatured,
  setLoadingEventFeatured,
  setPageEventFeatured,
  setRowsPerPageEventFeatured,
  showSnackbar,
} from '../../store';
import { 
  createEventFeaturedModel,
  updateEventFeaturedModel
} from '../../shared/models';
import { useState } from 'react';
import { getAuthConfig } from '../../shared/utils';

export const useEventFeaturedStore = () => {
  const dispatch = useDispatch();
  const { 
    eventFeatured, 
    selected, 
    total, 
    loading, 
    currentPage, 
    rowsPerPage 
  } = useSelector((state) => state.eventFeatured);

  const { token } = useSelector((state) => state.auth);

  const [searchTerm, setSearchTerm] = useState('');
  const [orderBy, setOrderBy] = useState('description');
  const [order, setOrder] = useState('asc');

  const openSnackbar = (message) => dispatch(showSnackbar({ message }));

  const startCreateEventFeatured = async (eventType) => {
    dispatch(setLoadingEventFeatured(true));
    try {
      const payload = createEventFeaturedModel(eventType);
      await eventFeaturedApi.post('/', payload, getAuthConfig(token, true));
      startLoadingEventFeaturedPaginated();
      openSnackbar("El evento destacado fue creado exitosamente.");
      return true;
    } catch (error) {
      console.log(error);
      const message = error.response?.data?.message;
      openSnackbar(message ?? "Ocurrió un error al crear el evento destacado.");
      return false;
    } finally {
      dispatch(setLoadingEventFeatured(false));
    }
  };

  const startLoadingEventFeaturedPaginated = async () => {
    dispatch(setLoadingEventFeatured(true));
    try {
      const limit  = rowsPerPage;
      const offset = currentPage * rowsPerPage;
      const { data } = await eventFeaturedApi.get('/paginated',
        getAuthConfig(token, {  
          limit,
          offset,
          search: searchTerm.trim(),
          sortField: orderBy,
          sortOrder: order,
        })
      );
      dispatch(refreshEventFeatured({
        items: data.items,
        total: data.total,
        page:  currentPage,
      }));
      return true;
    } catch (error) {
      const message = error.response?.data?.message;
      openSnackbar(message ?? "Ocurrió un error al cargar los eventos destacados.");
      return false;
    } finally {
      dispatch(setLoadingEventFeatured(false));
    }
  };

  const startUpdateEventFeatured = async (id, eventFeatured) => {
    dispatch(setLoadingEventFeatured(true));
    try {
      const payload = updateEventFeaturedModel(eventFeatured);
      const isFormData = payload instanceof FormData;
      await eventFeaturedApi.patch(`/${id}`, payload, getAuthConfig(token, isFormData));
      startLoadingEventFeaturedPaginated();
      openSnackbar("El evento destacado fue actualizado exitosamente.");
      return true;
    } catch (error) {
      const message = error.response?.data?.message;
      openSnackbar(message ?? "Ocurrió un error al actualizar el evento destacado.");
      return false;
    } finally {
      dispatch(setLoadingEventFeatured(false));
    }
  };

  const startDeleteEventFeatured = async (id) => {
    dispatch(setLoadingEventFeatured(true));
    try {
      await eventFeaturedApi.delete(`/${id}`, getAuthConfig(token));
      startLoadingEventFeaturedPaginated();
      openSnackbar("El evento destacado fue eliminado exitosamente.");
      return true;
    } catch (error) {
      const message = error.response?.data?.message;
      openSnackbar(message ?? "Ocurrió un error al eliminar el evento destacado.");
      return false;
    } finally {
      dispatch(setLoadingEventFeatured(false));
    }
  };

  const validateAttributes = (attributes) => {
    if (attributes.length === 0) {
      openSnackbar("Debe agregar al menos un atributo al tipo de servicio.");
      return false;
    } 
    return true;
  };

  const setSelectedEventFeatured = (eventFeatured) => {
    dispatch(selectedEventFeatured({ ...eventFeatured }));
  };

  const setPageGlobal = (page) => {
    dispatch(setPageEventFeatured(page));
  };

  const setRowsPerPageGlobal = (rows) => {
    dispatch(setRowsPerPageEventFeatured(rows));
  };
  

  return {
    // state
    eventFeatured,
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
    startCreateEventFeatured,
    startLoadingEventFeaturedPaginated,
    startUpdateEventFeatured,
    setSelectedEventFeatured,
    startDeleteEventFeatured,
    validateAttributes
  };
};