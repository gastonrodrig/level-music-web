import { useDispatch, useSelector } from 'react-redux';
import { reprogrammingApi } from '../../api/event/reprogramming-api';
import {
  refreshReprogramings,
  selectedReprograming,
  setLoadingReprogramings,
  setPageReprogramings,
  setRowsPerPageReprogramings,
  showSnackbar,
} from '../../store';
import { createReprogramingModel } from '../../shared/models/event/reprograming-event/create-reprograming-model';
import { useState } from 'react';
import { getAuthConfig, getAuthConfigWithParams } from '../../shared/utils';

export const useReprogramingsEvent = () => {
  const dispatch = useDispatch();
  const {
    reprogramings,
    selected,
    total,
    loading,
    currentPage,
    rowsPerPage,
  } = useSelector((state) => state.reprogramings);

  const { token } = useSelector((state) => state.auth);

  const [searchTerm, setSearchTerm] = useState('');
  const [orderBy, setOrderBy] = useState('created_at');
  const [order, setOrder] = useState('asc');

  const openSnackbar = (message) => dispatch(showSnackbar({ message }));

  // Crear reprogramación
  const startCreateReprograming = async (reprograming) => {
    dispatch(setLoadingReprogramings(true));
    try {
      console.log(reprograming)
      const payload = createReprogramingModel(reprograming);
      console.log(payload)
      await reprogrammingApi.post('/', payload, getAuthConfig(token));
      openSnackbar('Reprogramación solicitada correctamente.');
      return true;
    } catch (error) {
      console.log(error)
      const message = error.response?.data?.message;
      openSnackbar(message ?? 'Error al solicitar reprogramación.');
      return false;
    } finally {
      dispatch(setLoadingReprogramings(false));
    }
  };

  // Listar reprogramaciones paginadas
  const startLoadingUserReprogramings = async (userId) => {
    dispatch(setLoadingReprogramings(true));
    try {
      const limit = rowsPerPage;
      const offset = currentPage * rowsPerPage;
      const { data } = await reprogrammingApi.get(
        `/user/${userId}/paginated`,
        getAuthConfigWithParams(token, {
          limit,
          offset,
          search: searchTerm.trim(),
          sortField: orderBy,
          sortOrder: order,
        })
      );
      dispatch(
        refreshReprogramings({
          items: data.items,
          total: data.total,
          page: currentPage,
        })
      );
      return true;
    } catch (error) {
      const message = error.response?.data?.message;
      openSnackbar(message ?? 'No se pudieron cargar las reprogramaciones.');
      return false;
    } finally {
      dispatch(setLoadingReprogramings(false));
    }
  };

  // Listar todas las reprogramaciones paginadas
  const startLoadingAllReprogramingsPaginated = async () => {
    dispatch(setLoadingReprogramings(true));
    try {
      const limit = rowsPerPage;
      const offset = currentPage * rowsPerPage;
      const { data } = await reprogrammingApi.get(
        '/paginated',
        getAuthConfigWithParams(token, {
          limit,
          offset,
          search: searchTerm.trim(),
          sortField: orderBy,
          sortOrder: order,
        })
      );
      dispatch(
        refreshReprogramings({
          items: data.items,
          total: data.total,
          page: currentPage,
        })
      );
      return true;
    } catch (error) {
      const message = error.response?.data?.message;
      openSnackbar(message ?? 'No se pudieron cargar las reprogramaciones.');
      return false;
    } finally {
      dispatch(setLoadingReprogramings(false));
    }
  };

  const setSelectedReprograming = (reprograming) => {
    dispatch(selectedReprograming({ ...reprograming }));
  };

  const setPageGlobal = (page) => {
    dispatch(setPageReprogramings(page));
  };

  const setRowsPerPageGlobal = (rows) => {
    dispatch(setRowsPerPageReprogramings(rows));
  };

  return {
    // state
    reprogramings,
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
    startCreateReprograming,
    startLoadingUserReprogramings,
    setSelectedReprograming,
    startLoadingAllReprogramingsPaginated,
  };
};