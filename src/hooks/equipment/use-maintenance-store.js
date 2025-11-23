import { useDispatch, useSelector } from "react-redux";
import { createMaintenanceModel, updateMaintenanceStatusModel } from "../../shared/models";
import {
  refreshMaintenance,
  selectedMaintenance,
  setLoadingMaintenance,
  setPageMaintenance,
  setRowsPerPageMaintenance,
  showSnackbar,
} from "../../store";
import { useState } from "react";
import { maintenanceApi } from "../../api";
import { getAuthConfig, getAuthConfigWithParams } from "../../shared/utils";

export const useMaintenanceStore = () => {
  const dispatch = useDispatch();
  const {
    maintenances,
    selected,
    total,
    loading,
    currentPage,
    rowsPerPage,
  } = useSelector((state) => state.maintenance);

  const { token } = useSelector((state) => state.auth);

  const [searchTerm, setSearchTerm] = useState('');
  const [orderBy, setOrderBy] = useState('date');
  const [order, setOrder] = useState('desc');

  const openSnackbar = (message) => dispatch(showSnackbar({ message }));

  const startCreateMaintenance = async (maintenance) => {
    dispatch(setLoadingMaintenance(true));
    try {
      const payload = createMaintenanceModel(maintenance)
      await maintenanceApi.post("/", payload, getAuthConfig(token));
      await startLoadingMaintenancesPaginated();
      openSnackbar("El mantenimiento fue creado exitosamente.");
      return true;
    } catch (error) {
      const message = error.response?.data?.message;
      openSnackbar(message ?? "Ocurrió un error al registrar el mantenimiento.");
      return false;
    } finally {
      dispatch(setLoadingMaintenance(false));
    }
  };

  const startLoadingMaintenancesPaginated = async () => {
    dispatch(setLoadingMaintenance(true));
    try {
      const limit = rowsPerPage;
      const offset = currentPage * rowsPerPage;
      const { data } = await maintenanceApi.get("/paginated", 
        getAuthConfigWithParams(token, {
          limit,
          offset,
          search: searchTerm.trim(),
          sortField: orderBy,
          sortOrder: order,
        })
      );
      dispatch(
        refreshMaintenance({
          items: data.items,
          total: data.total,
          page: currentPage,
        })
      );
      return true;
    } catch (error) {
      const message = error.response?.data?.message;
      openSnackbar(message ?? "Ocurrió un error al cargar los mantenimientos.");
      return false;
    } finally {
      dispatch(setLoadingMaintenance(false));
    }
  };

  const startChangeMaintenanceStatus = async (id, maintenance) => {
    dispatch(setLoadingMaintenance(true));
    try {
      const payload = updateMaintenanceStatusModel(maintenance)
      await maintenanceApi.patch(`/${id}/status`, payload, getAuthConfig(token))
      await startLoadingMaintenancesPaginated();
      openSnackbar("El estado del mantenimiento fue modificado exitosamente.");
      return true;
    } catch (error) {
      const message = error.response?.data?.message;
      openSnackbar(message ?? "Ocurrió un error al modificar el estado del mantenimiento.");
      return false;
    } finally {
      dispatch(setLoadingMaintenance(false));
    }
  }

  const setSelectedMaintenance = (maintenance) => {
    dispatch(selectedMaintenance({ ...maintenance }));
  };

  const setPageGlobal = (page) => {
    dispatch(setPageMaintenance(page));
  };

  const setRowsPerPageGlobal = (rows) => {
    dispatch(setRowsPerPageMaintenance(rows));
  };

  return {
    // state
    maintenances,
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
    startCreateMaintenance,
    startLoadingMaintenancesPaginated,
    startChangeMaintenanceStatus,
    setSelectedMaintenance,
  };
};
