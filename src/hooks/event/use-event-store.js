import { useDispatch, useSelector } from 'react-redux';
import { eventApi } from '../../api';
// import {
//   refreshEventType,
//   selectedEventType,
//   setLoadingEventType,
//   setPageEventType,
//   setRowsPerPageEventType,
//   showSnackbar,
// } from '../../store';
// import { 
//   createEventTypeModel,
//   updateEventTypeModel
// } from '../../shared/models';
import { useState } from 'react';
import { getAuthConfig } from '../../shared/utils';
import { selectedEventFeatured, showSnackbar } from '../../store';

export const useEventStore = () => {
  const dispatch = useDispatch();
  // const { 
  //   event, 
  //   selected, 
  //   total, 
  //   loading, 
  //   currentPage, 
  //   rowsPerPage 
  // } = useSelector((state) => state.event);

  const { token } = useSelector((state) => state.auth);

  const [searchTerm, setSearchTerm] = useState('');
  const [orderBy, setOrderBy] = useState('description');
  const [order, setOrder] = useState('asc');

  const openSnackbar = (message) => dispatch(showSnackbar({ message }));

  // const startCreateEventType = async (eventType) => {
  //   dispatch(setLoadingEventType(true));
  //   try {
  //     const payload = createEventTypeModel(eventType);
  //     await eventTypeApi.post('/', payload, getAuthConfig(token));
  //     startLoadingEventTypePaginated();
  //     openSnackbar("El tipo de evento fue creado exitosamente.");
  //     return true;
  //   } catch (error) {
  //     const message = error.response?.data?.message;
  //     openSnackbar(message ?? "Ocurrió un error al crear los tipos de evento.");
  //     return false;
  //   } finally {
  //     dispatch(setLoadingEventType(false));
  //   }
  // };

  // const startLoadingEventTypePaginated = async () => {
  //   dispatch(setLoadingEventType(true));
  //   try {
  //     const limit  = rowsPerPage;
  //     const offset = currentPage * rowsPerPage;
  //     const { data } = await eventTypeApi.get('/paginated',
  //       getAuthConfig(token, {
        
  //         limit,
  //         offset,
  //         search: searchTerm.trim(),
  //         sortField: orderBy,
  //         sortOrder: order,
  //       })
  //     );
  //     dispatch(refreshEventType({
  //       items: data.items,
  //       total: data.total,
  //       page:  currentPage,
  //     }));
  //     return true;
  //   } catch (error) {
  //     const message = error.response?.data?.message;
  //     openSnackbar(message ?? "Ocurrió un error al cargar los tipos de evento.");
  //     return false;
  //   } finally {
  //     dispatch(setLoadingEventType(false));
  //   }
  // };

  // const startUpdateEventType = async (id, eventType) => {
  //   dispatch(setLoadingEventType(true));
  //   try {
  //     const payload = updateEventTypeModel(eventType);
  //     await eventTypeApi.put(`/${id}`, payload, getAuthConfig(token));
  //     startLoadingEventTypePaginated();
  //     openSnackbar("El tipo de evento fue actualizado exitosamente.");
  //     return true;
  //   } catch (error) {
  //     const message = error.response?.data?.message;
  //     openSnackbar(message ?? "Ocurrió un error al actualizar los tipos de evento.");
  //     return false;
  //   } finally {
  //     dispatch(setLoadingEventType(false));
  //   }
  // };

  const startSearchingEvent = async (code) => {
    // dispatch(setLoadingEvent(true));
    try {
      const { data } = await eventApi.get(`/code/${code}`, getAuthConfig(token));
      return { data, ok: true };
    } catch (error) {

      const message = error.response?.data?.message;
      openSnackbar(message ?? "Ocurrió un error al buscar el evento.");
      return false;
    } finally {
      // dispatch(setLoadingEvent(false));
    }
  };

  // const setSelectedEvent = (event) => {
  //   dispatch(selectedEvent({ ...event }));
  // };

  // const setPageGlobal = (page) => {
  //   dispatch(setPageEvent(page));
  // };

  // const setRowsPerPageGlobal = (rows) => {
  //   dispatch(setRowsPerPageEvent(rows));
  // };

  return {
    // state
    // event,
    // selected,
    // total,
    // loading,
    // searchTerm,
    // rowsPerPage,
   // currentPage,
    orderBy,
    order,

    // setters
    // setSearchTerm,
    // setOrderBy,
    // setOrder,
    // setPageGlobal,
    // setRowsPerPageGlobal,

    // actions
    // startCreateEvent,
    // startLoadingEventPaginated,
    // startUpdateEvent,
    startSearchingEvent,
    // setSelectedEvent,
  };
};