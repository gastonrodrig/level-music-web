import { useDispatch, useSelector } from "react-redux";
import { createEquipmentModel,  updateEquipmentModel } from "../../shared/models";
import {
  refreshEquipment,
  selectedEquipment,
  setLoadingEquipment,
  setPageEquipment,
  setRowsPerPageEquipment,
  showSnackbar,
} from "../../store";
import { useState } from "react";
import { equipmentApi } from "../../api";
import { getAuthConfig, getAuthConfigWithParams } from "../../shared/utils";

export const useEquipmentStore = () => {
  const dispatch = useDispatch();
  const {
    equipments,
    selected,
    total,
    loading,
    currentPage,
    rowsPerPage,
  } = useSelector((state) => state.equipment);

  const { token } = useSelector((state) => state.auth);

  const [searchTerm, setSearchTerm] = useState("");
  const [orderBy, setOrderBy] = useState("name");
  const [order, setOrder] = useState("asc");
  
  const openSnackbar = (message) => dispatch(showSnackbar({ message }));

  const startCreateEquipment = async (equipment) => {
    dispatch(setLoadingEquipment(true));
    try {
      const payload = createEquipmentModel(equipment);
      await equipmentApi.post("/", payload, getAuthConfig(token));
      await startLoadingEquipmentsPaginated();
      openSnackbar("El equipo fue creado exitosamente.");
      return true;
    } catch (error) {
      const message = error.response?.data?.message;
      openSnackbar(message ?? "Ocurrió un error al registrar el equipo.");
      return false;
    } finally {
      dispatch(setLoadingEquipment(false));
    }
  };

  const startLoadingAllEquipments = async () => {
    dispatch(setLoadingEquipment(true));
    try {
      // Implement API call to load service details here
      const { data } = await equipmentApi.get("/all", getAuthConfig(token));
      dispatch(listAllEquipments(data));
      return true;
    } catch (error) {
      const message = error.response?.data?.message;
      openSnackbar(message ?? "Ocurrió un error al cargar los equipos.");
      return false;
    } finally {
      dispatch(setLoadingEquipment(false));
    }
  };

  const startLoadingEquipmentsPaginated = async () => {
    dispatch(setLoadingEquipment(true));
    try {
      const limit = rowsPerPage;
      const offset = currentPage * rowsPerPage;
      const { data } = await equipmentApi.get("/paginated", 
        getAuthConfigWithParams(token, {
          limit,
          offset,
          search: searchTerm.trim(),
          sortField: orderBy,
          sortOrder: order,
        })
      );
      dispatch(
        refreshEquipment({
          items: data.items,
          total: data.total,
          page: currentPage,
        })
      );
      return true;
    } catch (error) {
      const message = error.response?.data?.message;
      openSnackbar(message ?? "Ocurrió un error al cargar los equipos.");
      return false;
    } finally {
      dispatch(setLoadingEquipment(false));
    }
  };

  const startUpdateEquipment = async (id, equipment) => {
    dispatch(setLoadingEquipment(true));
    try {
      const payload = updateEquipmentModel(equipment)
      await equipmentApi.put(`/${id}`, payload, getAuthConfig(token));
      await startLoadingEquipmentsPaginated();
      openSnackbar("El equipo fue actualizado exitosamente.");
      return true;
    } catch (error) {
      const message = error.response?.data?.message;
      openSnackbar(message ?? "Ocurrió un error al actualizar el equipo.");
      return false;
    } finally {
      dispatch(setLoadingEquipment(false));
    }
  };

  const startSearchingEquipment = async (term) => {
    if (term.length !== 12) return;
    dispatch(setLoadingEquipment(true));
    try {
      const { data } = await equipmentApi.get(`/by-serial?serial=${term}`, getAuthConfig(token));
      return { data, ok: true };
    } catch (error) {
      const message = error.response?.data?.message;
      openSnackbar(message ?? "Ocurrió un error al buscar el equipo.");
      return false;
    } finally {
      dispatch(setLoadingEquipment(false));
    }
  };

  const setSelectedEquipment = (equipment) => {
    dispatch(selectedEquipment({ ...equipment }));
  };

  const setPageGlobal = (page) => {
    dispatch(setPageEquipment(page));
  };

  const setRowsPerPageGlobal = (rows) => {
    dispatch(setRowsPerPageEquipment(rows));
  };

  return {
    // state
    equipments,
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
    startCreateEquipment,
    startLoadingAllEquipments,
    startLoadingEquipmentsPaginated,
    startUpdateEquipment,
    setSelectedEquipment,
    startSearchingEquipment               ,
  };
};
