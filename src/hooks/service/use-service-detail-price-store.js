import { useDispatch, useSelector } from 'react-redux';
import {
  refreshServiceDetailPrices,
  setLoadingServiceDetailPrice,
  setPageServiceDetailPrice,
  setRowsPerPageServiceDetailPrice,
  showSnackbar,
} from '../../store';
// import { 
//   createSeasonPriceServiceDetailModel
// } from '../../shared/models';
import { useState } from 'react';
import { serviceDetailPriceApi } from '../../api';
import { getAuthConfig, getAuthConfigWithParams } from '../../shared/utils';

export const useServiceDetailPriceStore = () => {
  const dispatch = useDispatch();
  const {
    serviceDetailPrices,
    total,
    loading,
    currentPage,
    rowsPerPage,
  } = useSelector((state) => state.serviceDetailPrice);

  const { token } = useSelector((state) => state.auth);

  const [orderBy, setOrderBy] = useState("season_number");
  const [order, setOrder] = useState("desc");

  const openSnackbar = (message) => dispatch(showSnackbar({ message }));

  const startLoadingServiceDetailPricesPaginated = async (detailId) => {
    dispatch(setLoadingServiceDetailPrice(true));
    try {
      const limit = rowsPerPage;
      const offset = currentPage * rowsPerPage;
      const { data } = await serviceDetailPriceApi.get("/paginated",
        getAuthConfigWithParams(token, {
          limit,
          offset,
          sortField: orderBy,
          sortOrder: order,
          detailId,
        })
      );
      dispatch(refreshServiceDetailPrices({ 
        items: data.items, 
        total: data.total, 
        page: currentPage
      }));
      return true;
    } catch (error) {
      const message = error.response?.data?.message;
      openSnackbar(message ?? "Ocurrió un error al cargar los precios del detalle de servicio.");
      return false;
    } finally {
      dispatch(setLoadingServiceDetailPrice(false));
    }
  }

  const setPageGlobal = (page) => {
    dispatch(setPageServiceDetailPrice(page));
  };

  const setRowsPerPageGlobal = (rows) => {
    dispatch(setRowsPerPageServiceDetailPrice(rows));
  };

  return {
    // state
    serviceDetailPrices,
    total,
    loading,
    rowsPerPage,
    currentPage,
    orderBy,
    order,

    // setters
    setOrderBy,
    setOrder,
    setPageGlobal,
    setRowsPerPageGlobal,

    // actions 
    startLoadingServiceDetailPricesPaginated,
  };
};
