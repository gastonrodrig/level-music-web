import { useDispatch, useSelector } from "react-redux";
import { createServiceTypeModel, updateServiceTypeModel } from "../../shared/models";
import { 
  listAllServiceTypes,
  refreshServiceType, 
  selectedServiceType, 
  setLoadingServiceType, 
  setPageServiceType, 
  setRowsPerPageServiceType, 
  showSnackbar 
} from "../../store";
import { useState } from "react";
import { serviceTypeApi } from "../../api";
import { getAuthConfig, getAuthConfigWithParams } from "../../shared/utils";

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

  const { token } = useSelector((state) => state.auth);

  const [searchTerm, setSearchTerm] = useState('');
  const [orderBy, setOrderBy] = useState('name');
  const [order, setOrder] = useState('asc');

  const openSnackbar = (message) => dispatch(showSnackbar({ message }));

  const startCreateServiceType = async (serviceType) => {
    if (!validateAttributes(serviceType.attributes)) return false;
    dispatch(setLoadingServiceType(true));
    try {
      const payload = createServiceTypeModel(serviceType);
      await serviceTypeApi.post('/', payload, getAuthConfig(token));
      startLoadingServiceTypePaginated();
      openSnackbar("El tipo de servicio fue creado exitosamente.");
      return true;
    } catch (error) {
      const message = error.response?.data?.message;
      openSnackbar(message ?? "Ocurrió un error al crear el tipo de servicio.");
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
      const { data } = await serviceTypeApi.get('/paginated', 
        getAuthConfigWithParams(token, {
          limit,
          offset,
          search: searchTerm.trim(),
          sortField: orderBy,
          sortOrder: order,
        })
      );
      dispatch(refreshServiceType({
        items: data.items,
        total: data.total,
        page:  currentPage,
      }));
      return true;
    } catch (error) {
      const message = error.response?.data?.message;
      openSnackbar(message ?? "Ocurrió un error al cargar los tipos de servicio.");
      return false;
    } finally {
      dispatch(setLoadingServiceType(false));
    }
  };

  const startUpdateServiceType = async (id, serviceType) => {
    if (!validateAttributes(serviceType.attributes)) return false;
    dispatch(setLoadingServiceType(true));
    try {
      const payload = updateServiceTypeModel(serviceType);
      await serviceTypeApi.put(`/${id}`, payload, getAuthConfig(token));
      startLoadingServiceTypePaginated();
      openSnackbar("El tipo de servicio fue actualizado exitosamente.");
      return true;
    } catch (error) {
      const message = error.response?.data?.message;
      openSnackbar(message ?? "Ocurrió un error al actualizar el tipo de servicio.");
      return false;
    } finally {
      dispatch(setLoadingServiceType(false));
    }
  };

  const validateAttributes = (attributes) => {
    if (attributes.length === 0) {
      openSnackbar("Debe agregar al menos un atributo al tipo de servicio.");
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

  const startLoadingAllServiceTypes = async () => {
    dispatch(setLoadingServiceType(true));
    try {
      const { data } = await serviceTypeApi.get('/all');
      dispatch(listAllServiceTypes(data));
    } catch (error) {
      console.log(error);
      const message = error.response?.data?.message;
      openSnackbar(message ?? "Ocurrió un error al cargar los tipos de servicio.");
    } finally {
      dispatch(setLoadingServiceType(false));
    }
  };

  return {
    // state
    serviceTypes,
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
    startCreateServiceType,
    startLoadingServiceTypePaginated,
    startUpdateServiceType,
    setSelectedServiceType,
    startLoadingAllServiceTypes,
  };
};
