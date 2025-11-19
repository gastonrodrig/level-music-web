import { useDispatch, useSelector } from 'react-redux';
import {
  refreshEquipmentPrices,
  selectedEquipmentPrice,
  setLoadingEquipmentPrice,
  setPageEquipmentPrice,
  setRowsPerPageEquipmentPrice,
  showSnackbar,
} from '../../store';
import {
  createSeasonPriceEquipmentModel,
} from '../../shared/models';
import { useState } from 'react';
import { equipmentPriceApi } from '../../api';
import { getAuthConfig, getAuthConfigWithParams } from '../../shared/utils';

export const useEquipmentPriceStore = () => {
  const dispatch = useDispatch();
  const {
    equipmentPrices,
    selected,
    total,
    loading,
    currentPage,
    rowsPerPage,
  } = useSelector((state) => state.equipmentPrices);

  const { token } = useSelector((state) => state.auth);

  const [searchTerm, setSearchTerm] = useState('');
  const [orderBy, setOrderBy] = useState('season_number');
  const [order, setOrder] = useState('desc');

  const openSnackbar = (message) => dispatch(showSnackbar({ message }));

  const startCreateEquipmentPrice = async (seasonPrice) => {
    dispatch(setLoadingEquipmentPrice(true));
    try {
      const payload = createSeasonPriceEquipmentModel(seasonPrice);
      await equipmentPriceApi.post('/update-reference-price', payload, getAuthConfig(token));
      startLoadingEquipmentPricePaginated(seasonPrice.equipmentId);
      openSnackbar('El precio de referencia fue creado exitosamente.');
      return true;
    } catch (error) {
      const message = error.response?.data?.message;
      openSnackbar(message ?? 'Ocurrió un error al crear el precio de referencia.');
      return false;
    } finally {
      dispatch(setLoadingEquipmentPrice(false));
    }
  };

  const startLoadingEquipmentPricePaginated = async (equipmentId) => {
    dispatch(setLoadingEquipmentPrice(true));
    try {
      const limit = rowsPerPage;
      const offset = currentPage * rowsPerPage;
      const { data } = await equipmentPriceApi.get('/paginated',
        getAuthConfigWithParams(token, {
          limit,
          offset,
          sortField: orderBy,
          sortOrder: order,
          equipment_id: equipmentId,
        })
      );
      dispatch(refreshEquipmentPrices({
        items: data.items,
        total: data.total,
        page: currentPage,
      }));
      return true;
    } catch (error) {
      const message = error.response?.data?.message;
      openSnackbar(message ?? 'Ocurrió un error al cargar los precios del equipo.');
      return false;
    } finally {
      dispatch(setLoadingEquipmentPrice(false));
    }
  };

  const setSelectedEquipmentPrice = (equipmentPrice) => {
    dispatch(selectedEquipmentPrice(equipmentPrice));
  };

  const setPageGlobal = (page) => {
    dispatch(setPageEquipmentPrice(page));
  };

  const setRowsPerPageGlobal = (rows) => {
    dispatch(setRowsPerPageEquipmentPrice(rows));
  };

  return {
    // state
    equipmentPrices,
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

    //actions
    setSelectedEquipmentPrice,
    startCreateEquipmentPrice,
    startLoadingEquipmentPricePaginated,
  };
};