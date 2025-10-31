import { useDispatch, useSelector } from 'react-redux';
import {
  refreshWorkerPrices,
  selectedWorkerPrice,
  setLoadingWorkerPrice,
  setPageWorkerPrice,
  setRowsPerPageWorkerPrice,
  showSnackbar,
} from '../../store';
import {
  createSeasonPriceWorkerModel,
} from '../../shared/models';
import { useState } from 'react';
import { workerPriceApi } from '../../api';
import { getAuthConfig, getAuthConfigWithParams } from '../../shared/utils';

export const useWorkerPriceStore = () => {
  const dispatch = useDispatch();
  const {
    workerPrices,
    selected,
    total,
    loading,
    currentPage,
    rowsPerPage,
  } = useSelector((state) => state.workerPrices);

  const { token } = useSelector((state) => state.auth);

  const [searchTerm, setSearchTerm] = useState("");
  const [orderBy, setOrderBy] = useState("season_number");
  const [order, setOrder] = useState("desc");

  const openSnackbar = (message) => dispatch(showSnackbar({ message }));

  const startCreateWorkerPrice = async (seasonPrice) => {
    dispatch(setLoadingWorkerPrice(true));
    try {
      const payload = createSeasonPriceWorkerModel(seasonPrice);
      await workerPriceApi.post('/update-reference-price', payload, getAuthConfig(token));
      startLoadingWorkerPricePaginated(seasonPrice.workerId);
      openSnackbar("El precio de referencia fue creado exitosamente.");
      return true;
    } catch (error) {
      const message = error.response?.data?.message;
      openSnackbar(message ?? "Ocurrió un error al crear el precio de referencia.");
      return false;
    } finally {
      dispatch(setLoadingWorkerPrice(false));
    }
  };

  const startLoadingWorkerPricePaginated = async (workerId) => {
    dispatch(setLoadingWorkerPrice(true));
    try {
      const limit = rowsPerPage;
      const offset = currentPage * rowsPerPage;
      const { data } = await workerPriceApi.get("/paginated",
        getAuthConfigWithParams(token, {
          limit,
          offset,
          sortField: orderBy,
          sortOrder: order,
          worker_id: workerId,
        })
      );
      dispatch(refreshWorkerPrices({
        items: data.items,
        total: data.total,
        page: currentPage,
      }));
      return true;
    } catch (error) {
      const message = error.response?.data?.message;
      openSnackbar(message ?? "Ocurrió un error al cargar los precios del trabajador.");
      return false;
    } finally {
      dispatch(setLoadingWorkerPrice(false));
    }
  };

  const setSelectedWorkerPrice = (workerPrice) => {
    dispatch(selectedWorkerPrice(workerPrice));
  };

  const setPageGlobal = (page) => {
    dispatch(setPageWorkerPrice(page));
  };

  const setRowsPerPageGlobal = (rows) => {
    dispatch(setRowsPerPageWorkerPrice(rows));
  };

  return {
    // state
    workerPrices,
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
    setSelectedWorkerPrice,
    startCreateWorkerPrice,
    startLoadingWorkerPricePaginated,
  };
};
