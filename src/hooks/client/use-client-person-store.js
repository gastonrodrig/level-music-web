import { useDispatch, useSelector } from "react-redux";
import { userApi } from "../../api";
import {
  refreshClientsPerson,
  selectedClientPerson,
  setLoadingClientPerson,
  setPageClientPerson,
  setRowsPerPageClientPerson,
  showSnackbar,
} from "../../store";
import { 
  createClientPersonModel, 
  updateClientPersonModel, 
} from "../../shared/models";
import { getAuthConfig, getAuthConfigWithParams } from "../../shared/utils";
import { useState } from "react";

export const useClientPersonStore = () => {
  const dispatch = useDispatch();
  const {
    clientsPerson,
    selected,
    total,
    loading,
    currentPage,
    rowsPerPage,
  } = useSelector((state) => state.clientPerson);
  
  const { token } = useSelector((state) => state.auth);

  const [searchTerm, setSearchTerm] = useState('');
  const [orderBy, setOrderBy] = useState('name');
  const [order, setOrder] = useState('asc');

  const openSnackbar = (message) => dispatch(showSnackbar({ message }));

  const startCreateClientPerson = async (clientPerson) => {
    dispatch(setLoadingClientPerson(true));
    try {
      const payload = createClientPersonModel(clientPerson, persona);
      await userApi.post("/client-admin", payload, getAuthConfig(token));
      await startLoadingClientsPersonPaginated();
      openSnackbar("El cliente persona fue creado exitosamente.");
      return true;
    } catch (error) {
      const message = error.response?.data?.message;
      openSnackbar(message ?? "Ocurrió un error al registrar el cliente persona.");
      return false;
    } finally {
      dispatch(setLoadingClientPerson(false));
    }
  };

  const startLoadingClientsPersonPaginated = async () => {
    dispatch(setLoadingClientPerson(true));
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
          clientType: "Persona", 
        })
      );
      dispatch(refreshClientsPerson({
        items: data.items,
        total: data.total,
        page: currentPage,
      }));
      return true;
    } catch (error) {
      const message = error.response?.data?.message;
      openSnackbar(message ?? "Ocurrió un error al cargar los clientes persona.");
      return false;
    } finally {
      dispatch(setLoadingClientPerson(false));
    }
  };

  const startUpdateClientPerson = async (id, client) => {
    dispatch(setLoadingClientPerson(true));
    try {
      const payload = updateClientPersonModel(client);
      await userApi.put(`/${id}`, payload, getAuthConfig(token));
      await startLoadingClientsPersonPaginated();
      openSnackbar("El cliente persona fue actualizado exitosamente.");
      return true;
    } catch (error) {
      const message = error.response?.data?.message;
      openSnackbar(message ?? "Ocurrió un error al actualizar el cliente.");
      return false;
    } finally {
      dispatch(setLoadingClientPerson(false));
    }
  };

  const setSelectedClientPerson = (client) => {
    dispatch(selectedClientPerson({ ...client }));
  };

  const setPageGlobal = (page) => {
    dispatch(setPageClientPerson(page));
  };

  const setRowsPerPageGlobal = (rows) => {
    dispatch(setRowsPerPageClientPerson(rows));
  };

  return {
    // state
    clientsPerson,
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
    startCreateClientPerson,
    startLoadingClientsPersonPaginated,
    startUpdateClientPerson,
    setSelectedClientPerson,
  };
};