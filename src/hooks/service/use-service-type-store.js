import { useDispatch, useSelector } from "react-redux";
import { createServiceTypeModel, updateServiceTypeModel } from "../../shared/models";
import { 
  refreshServiceType, 
  selectedServiceType, 
  setLoadingServiceType, 
  setPageServiceType, 
  setRowsPerPageServiceType, 
  showSnackbar 
} from "../../store";
import { useState } from "react";
import { serviceTypeApi } from "../../api";

export const useServiceTypeStore = () => {
  const dispatch = useDispatch();
  const{
    serviceTypes,
    selected,
    total,
    loading,
    currentPage,
    rowsPerPage,  
  } = useSelector((state) => state.serviceType);
  const [searchTerm, setSearchTerm] = useState('');
  const [orderBy, setOrderBy] = useState('name');
  const [order, setOrder] = useState('asc');

  const startCreateServiceType = async (serviceType) => {
    if (!validateAttributes(serviceType.attributes)) {
      return false;
    } 
    dispatch(setLoadingServiceType(true));
    try {
      const payload = createServiceTypeModel(serviceType);
      await serviceTypeApi.post('/', payload);
      startLoadingServiceTypePaginated();
      dispatch(showSnackbar({
        message: `El tipo de servicio fue creado exitosamente.`,
        severity: 'success',
      }));
      return true;
    } catch (error) {
      console.log(error);
      dispatch(showSnackbar({
        message: `Ocurrió un error al crear el tipo de servicio.`,
        severity: 'error', 
      }));
      return false;
    } finally {
      dispatch(setLoadingServiceType(false));
    }
  };

  const startLoadingServiceTypePaginated = async () => {
    dispatch(setLoadingServiceType(true));
    try {
      const limit  = rowsPerPage;
      const offset = currentPage * rowsPerPage;
      const { data } = await serviceTypeApi.get('/paginated', {
        params: {
          limit,
          offset,
          search: searchTerm.trim(),
          sortField: orderBy,
          sortOrder: order,
        },
      });
      dispatch(refreshServiceType({
        items: data.items,
        total: data.total,
        page:  currentPage,
      }));
      return true;
    } catch (error) {
      console.log(error);
      return false;
    } finally {
      dispatch(setLoadingServiceType(false));
    }
  };

  const startUpdateServiceType = async (id, serviceType) => {
    if (!validateAttributes(serviceType.attributes)) {
      return false;
  } 
    dispatch(setLoadingServiceType(true));
    try {
      console.log(serviceType);
      const payload = updateServiceTypeModel(serviceType);
      await serviceTypeApi.put(`/${id}`, payload);
      startLoadingServiceTypePaginated();
      dispatch(showSnackbar({
        message: `El tipo de servicio fue actualizado exitosamente.`,
        severity: 'success',
      }));
      return true;
    } catch (error) {
      console.log(error);
      dispatch(showSnackbar({
        message: `Ocurrió un error al actualizar el tipo de servicio.`,
        severity: 'error', 
      }));
      return false;
    } finally {
      dispatch(setLoadingServiceType(false));
    }
  };

  const validateAttributes = (attributes) => {
    if (attributes.length === 0) {
      dispatch(showSnackbar({
        message: 'Debe agregar al menos un atributo al tipo de servicio.',
        severity: 'error',
      }));
      return false;
    }
    return true;
  };

  const setSelectedServiceType = (serviceType) => {
    dispatch(selectedServiceType({ ...serviceType }));
  };

  const setPageGlobal = (page) => {
    dispatch(setPageServiceType(page));
  };

  const setRowsPerPageGlobal = (rows) => {
    dispatch(setRowsPerPageServiceType(rows));
  };

  return {
    serviceTypes,
    selected,
    total,
    loading,
    searchTerm,
    rowsPerPage,
    currentPage,
    orderBy,
    order,

    setSearchTerm,
    setOrderBy,
    setOrder, 
    setPageGlobal,
    setRowsPerPageGlobal,

    startCreateServiceType,
    startLoadingServiceTypePaginated,
    startUpdateServiceType,
    setSelectedServiceType,
  };
};
