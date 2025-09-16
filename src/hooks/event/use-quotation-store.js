import { useDispatch, useSelector } from 'react-redux';
import { eventApi } from '../../api';
import {
  selectedQuotation,
  setLoadingQuotation,
  setPageQuotation,
  setRowsPerPageQuotation,
  showSnackbar,
} from '../../store';
import{
  createQuotationLandingModel,
} from '../../shared/models';
import { useState } from 'react';
import { getAuthConfig } from '../../shared/utils';

export const useQuotationStore = () => {
  const dispatch = useDispatch();
  const { 
    quotations, 
    selected, 
    total, 
    loading, 
    currentPage, 
    rowsPerPage 
  } = useSelector((state) => state.quotation);

  const { token } = useSelector((state) => state.auth);

  const [searchTerm, setSearchTerm] = useState('');
  const [orderBy, setOrderBy] = useState('description');
  const [order, setOrder] = useState('asc');

  const openSnackbar = (message) => dispatch(showSnackbar({ message }));

  const startCreateQuotationLanding = async (quotation) => {
    // Validación: mínimo un tipo de servicio seleccionado
    if (!quotation.services_requested || quotation.services_requested.length === 0) {
      openSnackbar("Debes seleccionar al menos un tipo de servicio.");
      return false;
    }
    dispatch(setLoadingQuotation(true));
    try {
      const payload = createQuotationLandingModel(quotation);
      await eventApi.post('/quotation', payload);
      openSnackbar("La cotización fue solicitada exitosamente.");
      return true;
    } catch (error) {
      const message = error.response?.data?.message;
      openSnackbar(message ?? "Ocurrió un error al solicitar la cotización.");
      return false;
    } finally {
      dispatch(setLoadingQuotation(false));
    }
  };

  // const startLoadingQuotationPaginated = async () => {
  //   dispatch(setLoadingQuotation(true));
  //   try {
  //     const limit  = rowsPerPage;
  //     const offset = currentPage * rowsPerPage;
  //     const { data } = await eventApi.get('/paginated',
  //       getAuthConfigWithParams(token, {
  //         limit,
  //         offset,
  //         search: searchTerm.trim(),
  //         sortField: orderBy,
  //         sortOrder: order,
  //       })
  //     );
  //     dispatch(refreshQuotations({
  //       items: data.items,
  //       total: data.total,
  //       page:  currentPage,
  //     }));
  //     return true;
  //   } catch (error) {
  //     const message = error.response?.data?.message;
  //     openSnackbar(message ?? "Ocurrió un error al cargar las cotizaciones.");
  //     return false;
  //   } finally {
  //     dispatch(setLoadingQuotation(false));
  //   }
  // };

  const setSelectedQuotation = (quotation) => {
    dispatch(selectedQuotation({ ...quotation }));
  };

  const setPageGlobal = (page) => {
    dispatch(setPageQuotation(page));
  };

  const setRowsPerPageGlobal = (rows) => {
    dispatch(setRowsPerPageQuotation(rows));
  };
  

  return {
    // state
    quotations,
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
    startCreateQuotationLanding,
    // startLoadingQuotationPaginated,
    setSelectedQuotation,
  };
};