import { useDispatch, useSelector } from "react-redux";
import { userApi } from "../../api";
import {
  refreshClientsCompany,
  selectedClientCompany,
  setLoadingClientCompany,
  setPageClientCompany,
  setRowsPerPageClientCompany,
  showSnackbar,
} from "../../store";
import { 
  createClientCompanyModel, 
  updateClientCompanyModel, 
} from "../../shared/models";
import { getAuthConfig, getAuthConfigWithParams } from "../../shared/utils";
import { useState } from "react";

export const useClientCompanyStore = () => {
  const dispatch = useDispatch();
  const {
    clientsCompany,
    selected,
    total,
    loading,
    currentPage,
    rowsPerPage,
  } = useSelector((state) => state.clientCompany);
  
  const { token } = useSelector((state) => state.auth);

  const [searchTerm, setSearchTerm] = useState('');
  const [orderBy, setOrderBy] = useState('name');
  const [order, setOrder] = useState('asc');

  const openSnackbar = (message) => dispatch(showSnackbar({ message }));

  const startCreateClientCompany = async (clientCompany) => {
    dispatch(setLoadingClientCompany(true));
    try {
      const payload = createClientCompanyModel(clientCompany);
      await userApi.post("/client-admin", payload, getAuthConfig(token));
      await startLoadingClientsCompanyPaginated();
      openSnackbar("El cliente empresa fue creado exitosamente.");
      return true;
    } catch (error) {
      const message = error.response?.data?.message;
      openSnackbar(message ?? "Ocurrió un error al registrar el cliente empresa.");
      return false;
    } finally {
      dispatch(setLoadingClientCompany(false));
    }
  };

  const startLoadingClientsCompanyPaginated = async () => {
    dispatch(setLoadingClientCompany(true));
    try {
      const limit = rowsPerPage;
      const offset = currentPage * rowsPerPage;
      const { data } = await userApi.get("/customers-paginated", 
        getAuthConfigWithParams(token, {
          limit,
          offset,
          search: searchTerm.trim(),
          sortField: orderBy,
          sortOrder: order,
          clientType: "Empresa",
        })
      );
      dispatch(refreshClientsCompany({
        items: data.items,
        total: data.total,
        page: currentPage,
      }));
      return true;
    } catch (error) {
      const message = error.response?.data?.message;
      openSnackbar(message ?? "Ocurrió un error al cargar los clientes empresa.");
      return false;
    } finally {
      dispatch(setLoadingClientCompany(false));
    }
  };

  const startUpdateClientCompany = async (id, clientCompany) => {
    dispatch(setLoadingClientCompany(true));
    try {
      const payload = updateClientCompanyModel(clientCompany);
      await userApi.patch(`/client-admin/${id}`, payload, getAuthConfig(token));
      await startLoadingClientsCompanyPaginated();
      openSnackbar("El cliente empresa fue actualizado exitosamente.");
      return true;
    } catch (error) {
      const message = error.response?.data?.message;
      openSnackbar(message ?? "Ocurrió un error al actualizar el cliente empresa.");
      return false;
    } finally {
      dispatch(setLoadingClientCompany(false));
    }
  };

  const setSelectedClientCompany = (clientCompany) => {
    dispatch(selectedClientCompany({ ...clientCompany }));
  };

  const setPageGlobal = (page) => {
    dispatch(setPageClientCompany(page));
  };

  const setRowsPerPageGlobal = (rows) => {
    dispatch(setRowsPerPageClientCompany(rows));
  };

  return {
    // state
    clientsCompany,
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
    startCreateClientCompany,
    startLoadingClientsCompanyPaginated,
    startUpdateClientCompany,
    setSelectedClientCompany,
  };
};