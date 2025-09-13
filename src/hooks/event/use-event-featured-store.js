import { useDispatch, useSelector } from 'react-redux';
import { eventFeaturedApi } from '../../api';
import {
  listAllEventFeatured,
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
import { getAuthConfig, getAuthConfigWithParams } from '../../shared/utils';

export const useEventFeaturedStore = () => {
  const dispatch = useDispatch();
  const { 
    eventFeatured, 
    selected, 
    total, 
    loading, 
    loadingImages,
    currentPage, 
    rowsPerPage 
  } = useSelector((state) => state.eventFeatured);

  const { token } = useSelector((state) => state.auth);

  const [searchTerm, setSearchTerm] = useState('');
  const [orderBy, setOrderBy] = useState('description');
  const [order, setOrder] = useState('asc');

  const openSnackbar = (message) => dispatch(showSnackbar({ message }));

  const startCreateEventFeatured = async (eventFeatured) => {
    if (!isValidEventFeatured(eventFeatured)) return false;
    dispatch(setLoadingEventFeatured(true));
    try {
      const payload = createEventFeaturedModel(eventFeatured);
      await eventFeaturedApi.post('/', payload, getAuthConfig(token, true));
      startLoadingEventFeaturedPaginated();
      openSnackbar("El evento destacado fue creado exitosamente.");
      return true;
    } catch (error) {
      const message = error.response?.data?.message;
      openSnackbar(message ?? "Ocurrió un error al crear el evento destacado.");
      return false;
    } finally {
      dispatch(setLoadingEventFeatured(false));
    }
  };

  const startLoadingAllEventFeatured = async () => {
    dispatch(setLoadingEventFeatured(true));
    try {
      const { data } = await eventFeaturedApi.get('/all');
      dispatch(listAllEventFeatured(data));
      return true;
    } catch (error) {
      const message = error.response?.data?.message;
      openSnackbar(message ?? "Ocurrió un error al cargar los eventos destacados.");
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
        getAuthConfigWithParams(token, {  
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
    if (!isValidEventFeatured(eventFeatured)) return false;
    dispatch(setLoadingEventFeatured(true));
    try {
      const payload = updateEventFeaturedModel(eventFeatured);
      await eventFeaturedApi.patch(`/${id}`, payload, getAuthConfig(token, true));
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

  const isValidEventFeatured = (eventFeatured) => {
    if (!eventFeatured.services || eventFeatured.services.length === 0) {
      openSnackbar("Debes agregar al menos un servicio.");
      return false;
    }
    if (!eventFeatured.images || eventFeatured.images.length === 0) {
      openSnackbar("Debes agregar al menos una imagen.");
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
    loadingImages,
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
    startLoadingAllEventFeatured,
    startLoadingEventFeaturedPaginated,
    startUpdateEventFeatured,
    setSelectedEventFeatured,
    startDeleteEventFeatured,
  };
};