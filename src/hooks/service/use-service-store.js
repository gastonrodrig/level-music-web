import { useDispatch, useSelector } from "react-redux";
import { createServiceModel, updateServiceModel } from "../../shared/models";
import { 
  refreshService, 
  selectedService, 
  setLoadingService, 
  setPageService, 
  setRowsPerPageService, 
  showSnackbar 
} from "../../store";
import { useState } from "react";
import { serviceApi } from "../../api";
import { getAuthConfig, getAuthConfigWithParams } from "../../shared/utils";


export const useServiceStore = () => {
  const dispatch = useDispatch();
  const{
    services,
    selected,
    total,
    loading,
    currentPage,
    rowsPerPage,  
  } = useSelector((state) => state.service);
  const { token } = useSelector((state) => state.auth);
  const [searchTerm, setSearchTerm] = useState('');
  const [orderBy, setOrderBy] = useState('name');
  const [order, setOrder] = useState('asc');
  const listAllServices = async () => {
    dispatch(setLoadingService(true));
    try{
      const {data }= await serviceApi.get('/all');
      dispatch(refreshService({
        items: data.items,
        total: data.total,
      }));
    return true;
    } catch (error) {
      console.log(error);
      return false;
    } finally {
      dispatch(setLoadingService(false));
    }
  };

  const startCreateService = async (serviceType) => {
    dispatch(setLoadingService(true));
    try {
      const payload = createServiceModel(serviceType);
      await serviceApi.post('', payload);
      dispatch(showSnackbar({
        message: `El servicio fue creado exitosamente.`,
        severity: 'success',
      }));
      return true;
    } catch (error) {
      dispatch(showSnackbar({
        message: `Ocurrió un error al crear el servicio.`,
        severity: 'error', 
      }));
      return false;
    } finally {
      dispatch(setLoadingService(false));
    }
  };
  
  const startLoadingServicePaginated = async () => {
    dispatch(setLoadingService(true));
    try {
      const limit = Number(rowsPerPage) || 5;
    const page = Number(currentPage) || 0;
    const offset = page * limit;
      const { data } = await serviceApi.get('/paginated', 
        getAuthConfigWithParams(token, {
                limit,
                offset,
                search: searchTerm.trim(),
                sortField: orderBy,
                sortOrder: order,
              })
            );
      console.log(data);
      dispatch(refreshService({
        items: data.items,
        total: data.total,
        page: page,
      }));
      console.log('refreshService dispatched:', { items: data.items, total: data.total });
      return true;
    } catch (error) {
      console.log(error);
      return false;
    } finally {
      dispatch(setLoadingService(false));
    }
  };

  const startUpdateService = async (id, serviceType) => {
    dispatch(setLoadingService(true));
    try {
      const payload = updateServiceModel(serviceType);
      await serviceApi.patch(`/${id}`, payload);
      dispatch(showSnackbar({
        message: `El servicio fue actualizado exitosamente.`,
        severity: 'success',
      }));
      return true;
    } catch (error) {
      dispatch(showSnackbar({
        message: `Ocurrió un error al actualizar el servicio.`,
        severity: 'error', 
      }));
      return false;
    } finally {
      dispatch(setLoadingService(false));
    }
  };


  const setSelectedService = (serviceType) => {
    dispatch(selectedService({ ...serviceType }));
  };

  const setPageGlobal = (page) => {
    dispatch(setPageService(page));
  };

  const setRowsPerPageGlobal = (rows) => {
    dispatch(setRowsPerPageService(rows));
  };

  return {
    services,
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

    startCreateService,
    startLoadingServicePaginated,
    startUpdateService,
    setSelectedService,
    listAllServices,
  };
};
