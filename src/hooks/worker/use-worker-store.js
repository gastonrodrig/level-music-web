import { useDispatch, useSelector } from 'react-redux';
import {
  listAllWorkers,
  refreshWorkers,
  selectedWorker,
  setLoadingServiceDetail,
  setLoadingWorker,
  setPageWorker,
  setRowsPerPageWorker,
  showSnackbar,
} from '../../store';
import { 
  createWorkerModel,
  updateWorkerModel
} from '../../shared/models';
import { useState } from 'react';
import { workerApi } from '../../api';
import { getAuthConfig, getAuthConfigWithParams } from '../../shared/utils';

export const useWorkerStore = () => {
  const dispatch = useDispatch();
  const {
    workers,
    selected,
    total,
    loading,
    currentPage,
    rowsPerPage,
  } = useSelector((state) => state.workers);

  const { token } = useSelector((state) => state.auth);

  const [searchTerm, setSearchTerm] = useState("");
  const [orderBy, setOrderBy] = useState("name");
  const [order, setOrder] = useState("asc");

  const openSnackbar = (message) => dispatch(showSnackbar({ message }));

  const startCreateWorker = async (worker) => {
    dispatch(setLoadingWorker(true));
    try {
      const payload = createWorkerModel(worker);
      await workerApi.post('/', payload, getAuthConfig(token));
      startLoadingWorkerPaginated();
      openSnackbar("El trabajador fue creado exitosamente.");
      return true;
    } catch (error) {
      const message = error.response?.data?.message;
      openSnackbar(message ?? "Ocurrió un error al crear el trabajador.");
      return false;
    } finally {
      dispatch(setLoadingWorker(false));
    }
  };
  const startLoadingAllWorkers = async () => {
    dispatch(setLoadingWorker(true));
    try {
      const { data } = await workerApi.get("/all", getAuthConfig(token));
      dispatch(listAllWorkers(data));
      return true;
    } catch (error) {
      const message = error.response?.data?.message;
      openSnackbar(message ?? "Ocurrió un error al cargar los trabajadores.");
      return false;
    } finally {
      dispatch(setLoadingWorker(false));
    }
  };

  const startLoadingWorkerPaginated = async () => {
    dispatch(setLoadingWorker(true));
    try {
      const limit = rowsPerPage;
      const offset = currentPage * rowsPerPage;
      const { data } = await workerApi.get("/paginated", 
        getAuthConfigWithParams(token, {
          limit,
          offset,
          search: searchTerm.trim(),
          sortField: orderBy,
          sortOrder: order,
        })
      );
      dispatch(refreshWorkers({
        items: data.items,
        total: data.total,
        page: currentPage,
      }));
      return true;
    } catch (error) {
      const message = error.response?.data?.message;
      openSnackbar(message ?? "Ocurrió un error al cargar los trabajadores.");
      return false;
    } finally {
      dispatch(setLoadingWorker(false));
    }
  };

  const startUpdateWorker = async (id, worker) => {
    dispatch(setLoadingWorker(true));
    try {
      const payload = updateWorkerModel(worker);
      await workerApi.put(`/${id}`, payload, getAuthConfig(token));
      startLoadingWorkerPaginated();
      openSnackbar("El trabajador fue actualizado exitosamente.");
      return true;
    } catch (error) {
      const message = error.response?.data?.message;
      openSnackbar(message ?? "Ocurrió un error al actualizar el trabajador.");
      return false;
    } finally {
      dispatch(setLoadingWorker(false));
    }
  }

  const setSelectedWorker = (worker) => {
    dispatch(selectedWorker({ ...worker }));
  };

  const setPageGlobal = (page) => {
    dispatch(setPageWorker(page));
  };

  const setRowsPerPageGlobal = (rows) => {
    dispatch(setRowsPerPageWorker(rows));
  };

  return {
    // state
    workers,
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

    //actions
    startCreateWorker,
    startLoadingAllWorkers,
    startLoadingWorkerPaginated,
    startUpdateWorker,
    setSelectedWorker,
  };
};
