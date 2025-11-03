import { useDispatch, useSelector } from 'react-redux';
import {
  refreshAppointments,
  selectedAppointment,
  setLoadingAppointment,
  setPageAppointment,
  setRowsPerPageAppointment,
  showSnackbar,
} from '../../store';
import { 
  createAppointmentModel,
} from '../../shared/models';
import { useState } from 'react';
import { appointmentsApi } from '../../api';
import { getAuthConfig, getAuthConfigWithParams } from "../../shared/utils";

export const useAppointmentStore = () => {
  const dispatch = useDispatch();
  const { 
    appointments, 
    selected, 
    total, 
    loading, 
    currentPage, 
    rowsPerPage 
  } = useSelector((state) => state.appointment);

  const { token } = useSelector((state) => state.auth);

  const [searchTerm, setSearchTerm] = useState('');
  const [orderBy, setOrderBy] = useState('date');
  const [order, setOrder] = useState('asc');

  const openSnackbar = (message) => dispatch(showSnackbar({ message }));

  const startCreateAppointment = async (appointment) => {
    dispatch(setLoadingAppointment(true));
    try {
      const payload = createAppointmentModel(appointment);
      await appointmentsApi.post('/', payload, getAuthConfig(token));
      openSnackbar("La cita fue creada exitosamente, pronto nos pondremos en contacto contigo.");
      return true;
    } catch (error) {
      console.log(error);
      const message = error.response?.data?.message;
      openSnackbar(message ?? "Ocurrió un error al crear la cita.");
      return false;
    } finally {
      dispatch(setLoadingAppointment(false));
    }
  };

  const startLoadingAppointmentPaginated = async (userId) => {
    dispatch(setLoadingAppointment(true));
    try {
      const limit  = rowsPerPage;
      const offset = currentPage * rowsPerPage;
      const { data } = await appointmentsApi.get('/paginated',
        getAuthConfigWithParams(token, {
          limit,
          offset,
          search: searchTerm.trim(),
          sortField: orderBy,
          sortOrder: order,
          ...(userId && { user_id: userId }),
        })
      );
      dispatch(refreshAppointments({
        items: data.items,
        total: data.total,
        page:  currentPage,
      }));
      return true;
    } catch (error) {
      const message = error.response?.data?.message;
      openSnackbar(message ?? "Ocurrió un error al cargar los tipos de trabajador.");
      return false;
    } finally {
      dispatch(setLoadingAppointment(false));
    }
  };

  /*
  const startUpdateAppointmentStatus = async (id, appointment) => {
    dispatch(setLoadingAppointment(true));
    try {
      const payload = updateAppointmentModel(appointment);
      await appointmentsApi.put(`/${id}`, payload, getAuthConfig(token));
      startLoadingAppointmentPaginated();
      openSnackbar("El tipo de trabajador fue actualizado exitosamente.");
      return true;
    } catch (error) {
      const message = error.response?.data?.message;
      openSnackbar(message ?? "Ocurrió un error al actualizar el tipo de trabajador.");
      return false;
    } finally {
      dispatch(setLoadingAppointment(false));
    }
  };
 */
  const setSelectedAppointment = (appointment) => {
    dispatch(selectedAppointment({ ...appointment }));
  };

  const setPageGlobal = (page) => {
    dispatch(setPageAppointment(page));
  };

  const setRowsPerPageGlobal = (rows) => {
    dispatch(setRowsPerPageAppointment(rows));
  };

  return {
    // state
    appointments,
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
    startCreateAppointment,
    startLoadingAppointmentPaginated,
    //startUpdateAppointmentStatus,
    setSelectedAppointment,
  };
};