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
  
  const { status } = useSelector((state) => state.auth);

  const { token } = useSelector((state) => state.auth);

  const [searchTerm, setSearchTerm] = useState('');
  const [orderBy, setOrderBy] = useState('description');
  const [order, setOrder] = useState('asc');

  const openSnackbar = (message) => dispatch(showSnackbar({ message }));

  const startCreateQuotationLanding = async (quotation) => {
    if (!validateQuotationsLanding(quotation)) return false;
    dispatch(setLoadingQuotation(true));
    try {
      const payload = createQuotationLandingModel(quotation);
      console.log(payload)
      await eventApi.post('/quotation/landing', payload);
      if (status === 'authenticated') {
        openSnackbar("La cotización fue solicitada exitosamente.");
      } else {
        openSnackbar("La cotización fue solicitada exitosamente. Pronto nos pondremos en contacto contigo.");
      }
      return true;
    } catch (error) {
      console.log(error);
      const message = error.response?.data?.message;
      openSnackbar(message ?? "Ocurrió un error al solicitar la cotización.");
      return false;
    } finally {
      dispatch(setLoadingQuotation(false));
    }
  };

  const startCreateQuotationAdmin = async (quotation) => {
    if (!validateQuotationsLanding(quotation)) return false;
    dispatch(setLoadingQuotation(true));
    try {
      const payload = createQuotationLandingModel(quotation);
      await eventApi.post('/quotation/admin', payload);
      return true;
    } catch (error) {
      const message = error.response?.data?.message;
      openSnackbar(message ?? "Ocurrió un error al agregar la cotización.");
      return false;
    } finally {
      dispatch(setLoadingQuotation(false));
    }
  };
  
  const startLoadingUserEvents = async (userId) => {
    dispatch(setLoadingQuotation(true));
    try {
      const limit  = rowsPerPage;
      const offset = currentPage * rowsPerPage;
      const { data } = await eventApi.get(`/user/${userId}/paginated`,
        getAuthConfigWithParams(token, {
          limit,
          offset,
          search: searchTerm.trim(),
          sortField: orderBy,
          sortOrder: order,
        })
      );
      dispatch(
        refreshQuotations({
          items: data.items,
          total: data.total,
          page: 0,
        })
      );
      return true;
    } catch (error) {
      console.log(error);
      const message = error.response?.data?.message;
      openSnackbar(message ?? "No se pudieron cargar las cotizaciones.");
      return false;
    } finally {
      dispatch(setLoadingQuotation(false));
    }
  };

  const startLoadingQuotationPaginated = async () => {
    dispatch(setLoadingQuotation(true));
    try {
      const limit  = rowsPerPage;
      const offset = currentPage * rowsPerPage;
      const { data } = await eventApi.get('/paginated',
        getAuthConfigWithParams(token, {
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

  const validateQuotationsLanding = (quotation) => {
    if (!quotation.services_requested || quotation.services_requested.length === 0) {
      openSnackbar("Debes seleccionar al menos un tipo de servicio.");
      return false;
    }
    // Validar que cada servicio tenga 'details' lleno (no vacío)
    for (const service of quotation.services_requested) {
      if (!service.details || service.details.trim() === "") {
        openSnackbar("Debes completar el detalle de cada servicio solicitado.");
        return false;
      }
    }
    return true;
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