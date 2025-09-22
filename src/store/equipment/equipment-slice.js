import { createSlice } from "@reduxjs/toolkit";
import { listAllWorkers } from "../worker";

const initialState = {
  equipment: [],
  selected: null,
  total: 0,
  currentPage: 0,
  rowsPerPage: 5,
  loading: false,
};

export const equipmentSlice = createSlice({
  name: "equipment",
  initialState,
  reducers: {
    refreshEquipment: (state, action) => {
      const { items, total, page } = action.payload;
      state.equipments = items;
      state.total = total;
      state.currentPage = page;
      state.loading = false;
    },
    selectedEquipment: (state, action) => {
      state.selected = action.payload;
    },
    setLoadingEquipment: (state, action) => {
      state.loading = action.payload;
    },
    setPageEquipment: (state, action) => {
      state.currentPage = action.payload;
    },
    setRowsPerPageEquipment: (state, action) => {
      state.rowsPerPage = action.payload;
    },
    listAllEquipments: (state, action) => {
      state.equipment = action.payload;
    }
  },
});

export const {
  refreshEquipment,
  selectedEquipment,
  setLoadingEquipment,
  setPageEquipment,
  setRowsPerPageEquipment,
  listAllEquipments
} = equipmentSlice.actions;
