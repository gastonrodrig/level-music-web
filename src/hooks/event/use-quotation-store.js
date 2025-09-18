import { useDispatch, useSelector } from 'react-redux';
import { eventApi } from '../../api';
import {
  listAllQuotations,
  selectedQuotation,
  setLoadingQuotation,
  setPageQuotation,
  setRowsPerPageQuotation,
  refreshQuotations,

  showSnackbar,
} from '../../store';
import{
  createQuotationLandingModel,
} from '../../shared/models';
import { useState } from 'react';
import { getAuthConfig, getAuthConfigWithParams } from '../../shared/utils';

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
const startLoadingUserEvents = async (userId) => {
  dispatch(setLoadingQuotation(true));
  try {
    const { data } = await eventApi.get(`/user/${userId}`, getAuthConfig(token));
    
    console.log("DATA del backend:", data);

     dispatch(
       refreshQuotations({
         items: data,
        total: data.length,
         page: 0,
       })
     );


  } catch (error) {
    const message = error.response?.data?.message;
    console.error("Error cargando eventos del usuario:", error);
    openSnackbar(message ?? "No se pudieron cargar las cotizaciones.");
  } finally {
    dispatch(setLoadingQuotation(false));
  }
};


const startLoadingQuotationPaginated = async () => {
  dispatch(setLoadingQuotation(true));
  try {
    const limit  = rowsPerPage;
    const offset = currentPage * rowsPerPage;
    const { data } = await eventApi.get('/quotation/paginated',
      getAuthConfig(token, {
        limit,
        offset,
        search: searchTerm.trim(),
        sortField: orderBy,
        sortOrder: order,
      })
    );

    dispatch(refreshQuotations({
      items: data.items,
      total: data.total,
      page:  currentPage,
    }));

    return true;
  } catch (error) {
    const message = error.response?.data?.message;
    openSnackbar(message ?? "Ocurrió un error al cargar las cotizaciones.");
    return false;
  } finally {
    dispatch(setLoadingQuotation(false));
  }
};

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
  
    startLoadingUserEvents,
    startCreateQuotationLanding,
    startLoadingQuotationPaginated,
    setSelectedQuotation,
  };
};