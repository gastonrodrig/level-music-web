import { useDispatch, useSelector } from "react-redux";
import {
  refreshProvider,
  selectedProvider,
  setLoadingProvider,
  setPageProvider,
  setRowsPerPageProvider,
  showSnackbar,
  listAllProviders,
} from "../../store";
import { createProviderModel, updateProviderModel } from "../../shared/models";
import { useState } from "react";
import { providerApi } from "../../api";
import { getAuthConfig, getAuthConfigWithParams } from "../../shared/utils";

export const useProviderStore = () => {
  const dispatch = useDispatch();
  const {
    provider,
    selected,
    total,
    loading,
    currentPage,
    rowsPerPage,
  } = useSelector((state) => state.provider);

  const { token } = useSelector((state) => state.auth);

  const [searchTerm, setSearchTerm] = useState("");
  const [orderBy, setOrderBy] = useState("name");
  const [order, setOrder] = useState("asc");

  const openSnackbar = (message) => dispatch(showSnackbar({ message }));

  const startCreateProvider = async (provider) => {
    dispatch(setLoadingProvider(true));
    try {
      const payload = createProviderModel(provider);
      await providerApi.post("/", payload, getAuthConfig(token));
      startLoadingProviderPaginated();
      openSnackbar("El proveedor fue creado exitosamente.");
      return true;
    } catch (error) {
      const message = error.response?.data?.message;
      openSnackbar(message ?? "Ocurrió un error al crear el proveedor.");
      return false;
    } finally {
      dispatch(setLoadingProvider(false));
    }
  };

  const startLoadingAllProviders = async () => {
    dispatch(setLoadingProvider(true));
    try {
      const { data } = await providerApi.get('/all', getAuthConfig(token));
      dispatch(listAllProviders(data));
      return true;
    } catch (error) {
      console.log(error);
      const message = error.response?.data?.message;
      openSnackbar(message ?? "Ocurrió un error al cargar los proveedores.");
      return false;
    } finally {
      dispatch(setLoadingProvider(false));
    }
  };

  const startLoadingProviderPaginated = async () => {
    dispatch(setLoadingProvider(true));
    try {
      const limit = rowsPerPage;
      const offset = currentPage * rowsPerPage;
      const { data } = await providerApi.get("/paginated", 
        getAuthConfigWithParams(token, {
          limit,
          offset,
          search: searchTerm.trim(),
          sortField: orderBy,
          sortOrder: order,
        })
      );
      dispatch(refreshProvider({
        items: data.items,
        total: data.total,
        page: currentPage,
      }));
      return true;
    } catch (error) {
      const message = error.response?.data?.message;
      openSnackbar(message ?? "Ocurrió un error al cargar los tipos de servicio.");
      return false;
    } finally {
      dispatch(setLoadingProvider(false));
    }
  };

  const startUpdateProvider = async (id, provider) => {
    dispatch(setLoadingProvider(true));
    try {
      const payload = updateProviderModel(provider);
      await providerApi.put(`/${id}`, payload, getAuthConfig(token));
      startLoadingProviderPaginated();
      openSnackbar("El proveedor fue actualizado exitosamente.");
      return true;
    } catch (error) {
      const message = error.response?.data?.message;
      openSnackbar(message ?? "Ocurrió un error al actualizar el tipo de servicio.");
      return false;
    } finally {
      dispatch(setLoadingProvider(false));
    }
  };

  const setSelectedProvider = (provider) => {
    dispatch(selectedProvider({ ...provider }));
  };

  const setPageGlobal = (page) => {
    dispatch(setPageProvider(page));
  };

  const setRowsPerPageGlobal = (rows) => {
    dispatch(setRowsPerPageProvider(rows));
  };

  return {
    // state
    provider,
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
    startCreateProvider,
    startLoadingProviderPaginated,
    startUpdateProvider,
    setSelectedProvider,
    startLoadingAllProviders,
  };
}
