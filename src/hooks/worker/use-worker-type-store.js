import { useDispatch, useSelector } from 'react-redux';
import {
  listAllWorkerTypes,
  refreshWorkerTypes,
  selectedWorkerType,
  setLoadingWorkerType,
  setPageWorkerType,
  setRowsPerPageWorkerType,
  showSnackbar,
} from '../../store';
import { 
  createWorkerTypeModel,
  updateWorkerTypeModel
} from '../../shared/models';
import { useState } from 'react';
import { workerTypeApi } from '../../api';
import { getAuthConfig, getAuthConfigWithParams } from "../../shared/utils";

export const useWorkerTypeStore = () => {
  const dispatch = useDispatch();
  const { 
    workerTypes, 
    selected, 
    total, 
    loading, 
    currentPage, 
    rowsPerPage 
  } = useSelector((state) => state.workerTypes);

  const { token } = useSelector((state) => state.auth);

  const [searchTerm, setSearchTerm] = useState('');
  const [orderBy, setOrderBy] = useState('name');
  const [order, setOrder] = useState('asc');

  const openSnackbar = (message) => dispatch(showSnackbar({ message }));

  const startCreateWorkerType = async (workerType) => {
    dispatch(setLoadingWorkerType(true));
    try {
      const payload = createWorkerTypeModel(workerType);
      await workerTypeApi.post('/', payload, getAuthConfig(token));
      startLoadingWorkerTypePaginated();
      openSnackbar("El tipo de trabajador fue creado exitosamente.");
      return true;
    } catch (error) {
      const message = error.response?.data?.message;
      openSnackbar(message ?? "Ocurrió un error al crear el tipo de trabajador.");
      return false;
    } finally {
      dispatch(setLoadingWorkerType(false));
    }
  };

  const startLoadingAllWorkerTypes = async () => {
    dispatch(setLoadingWorkerType(true));
    try {
      const { data } = await workerTypeApi.get('/all', getAuthConfig(token));
      dispatch(listAllWorkerTypes(data));
      return true;
    } catch (error) {
      const message = error.response?.data?.message;
      openSnackbar(message ?? "Ocurrió un error al cargar los tipos de trabajador.");
      return false;
    } finally {
      dispatch(setLoadingWorkerType(false));
    }
  };

  const startLoadingWorkerTypePaginated = async () => {
    dispatch(setLoadingWorkerType(true));
    try {
      const limit  = rowsPerPage;
      const offset = currentPage * rowsPerPage;
      const { data } = await workerTypeApi.get('/paginated',
        getAuthConfigWithParams(token, {
          limit,
          offset,
          search: searchTerm.trim(),
          sortField: orderBy,
          sortOrder: order,
        })
      );
      dispatch(refreshWorkerTypes({
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
      dispatch(setLoadingWorkerType(false));
    }
  };

  const startUpdateWorkerType = async (id, workerType) => {
    dispatch(setLoadingWorkerType(true));
    try {
      const payload = updateWorkerTypeModel(workerType);
      await workerTypeApi.put(`/${id}`, payload, getAuthConfig(token));
      startLoadingWorkerTypePaginated();
      openSnackbar("El tipo de trabajador fue actualizado exitosamente.");
      return true;
    } catch (error) {
      const message = error.response?.data?.message;
      openSnackbar(message ?? "Ocurrió un error al actualizar el tipo de trabajador.");
      return false;
    } finally {
      dispatch(setLoadingWorkerType(false));
    }
  };

  const setSelectedWorkerType = (workerType) => {
    dispatch(selectedWorkerType({ ...workerType })); 
  };

  const setPageGlobal = (page) => {
    dispatch(setPageWorkerType(page));
  };

  const setRowsPerPageGlobal = (rows) => {
    dispatch(setRowsPerPageWorkerType(rows));
  };

  return {
    // state
    workerTypes,
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
    startCreateWorkerType,
    startLoadingAllWorkerTypes,
    startLoadingWorkerTypePaginated,
    startUpdateWorkerType,
    setSelectedWorkerType,
  };
};