import { useDispatch, useSelector } from "react-redux";
import { createServiceModel, updateServiceModel } from "../../shared/models";
import {
  listAllServices,
  refreshService,
  selectedService,
  setLoadingService,
  setPageService,
  setRowsPerPageService,
  showSnackbar,
} from "../../store";
import { useState } from "react";
import { serviceApi } from "../../api";
import { getAuthConfig, getAuthConfigWithParams } from "../../shared/utils";

export const useServiceStore = () => {
  const dispatch = useDispatch();
  const { 
    services, 
    selected, 
    total, 
    loading, 
    currentPage, 
    rowsPerPage 
  } = useSelector((state) => state.service);

  const { token } = useSelector((state) => state.auth);

  const [searchTerm, setSearchTerm] = useState("");
  const [orderBy, setOrderBy] = useState("name");
  const [order, setOrder] = useState("asc");

  const openSnackbar = (message) => dispatch(showSnackbar({ message }));

  const startCreateService = async (serviceType) => {
    if (!validateDetails(serviceType.serviceDetails)) return false;
    dispatch(setLoadingService(true));
    try {
      const payload = createServiceModel(serviceType);
      await serviceApi.post("", payload, getAuthConfig(token));
      openSnackbar("El servicio fue creado exitosamente.");
      return true;
    } catch (error) {
      const message = error.response?.data?.message;
      openSnackbar(message ?? "Ocurrió un error al crear el tipo de servicio.");
      return false;
    } finally {
      dispatch(setLoadingService(false));
    }
  };

  const startLoadingAllServices = async () => {
    dispatch(setLoadingService(true));
    try {
      const { data } = await serviceApi.get("/all");
      dispatch(listAllServices(data));
      return true;
    } catch (error) {
      const message = error.response?.data?.message;
      openSnackbar(message ?? "Ocurrió un error al cargar los servicios.");
      return false;
    } finally {
      dispatch(setLoadingService(false));
    }
  };

  const startLoadingServicePaginated = async () => {
    dispatch(setLoadingService(true));
    try {
      const limit  = rowsPerPage;
      const offset = currentPage * rowsPerPage;
      const { data } = await serviceApi.get('/paginated',
        getAuthConfigWithParams(token, {
          limit,
          offset,
          search: searchTerm.trim(),
          sortField: orderBy,
          sortOrder: order,
        })
      );
      dispatch(refreshService({
        items: data.items,
        total: data.total,
        page: currentPage,
      }));
      return true;
    } catch (error) {
      const message = error.response?.data?.message;
      openSnackbar(message ?? "Ocurrió un error al cargar .");
      return false;
    } finally {
      dispatch(setLoadingService(false));
    }
  };

  const startUpdateService = async (id, serviceType) => {
    if (!validateDetails(serviceType.serviceDetails)) return false;
    dispatch(setLoadingService(true));
    try {
      const payload = updateServiceModel(serviceType);
      await serviceApi.patch(`/${id}`, payload, getAuthConfig(token));
      openSnackbar("El servicio fue actualizado exitosamente.");
      return true;
    } catch (error) {
      const message = error.response?.data?.message;
      openSnackbar(message ?? "Ocurrió un error al actualizar el servicio.");
      return false;
    } finally {
      dispatch(setLoadingService(false));
    }
  };

  const validateDetails = (details) => {
    if (details.length === 0) {
      openSnackbar("Debe agregar al menos un detalle al servicio.");
      return false;
    } 
    return true;
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
    // state
    services,
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
    startCreateService,
    startLoadingServicePaginated,
    startUpdateService,
    setSelectedService,
    startLoadingAllServices,
  };
};
