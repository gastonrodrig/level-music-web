import { useState } from "react";
import { useDispatch } from "react-redux";
import { showSnackbar } from "../../store";

export const useAssignEquipmentStore = () => {
  const dispatch = useDispatch();

  const [selectedEquipment, setSelectedEquipment] = useState(null);
  const [assignedEquipments, setAssignedEquipments] = useState([]);

  const openSnackbar = (message) => dispatch(showSnackbar({ message }));

  const handleChangeEquipmentType = () => {
    setSelectedEquipment(null);
  };

  const handleSelectEquipment = (equipmentId, equipments) => {
    const eq = equipments.find((e) => e._id === equipmentId);
    setSelectedEquipment(eq);
  };

  const handleAddEquipment = (equipmentPrice, equipmentHours) => {
    if (!validateData(equipmentPrice)) return false;

    const newItem = {
      ...selectedEquipment,
      equipment_hours: equipmentHours,
      equipment_price: equipmentPrice,
    };

    // Agregar el nuevo equipo
    setAssignedEquipments((prev) => [...prev, newItem]);

    setSelectedEquipment(null);

    return true;
  };

  const validateData = (equipmentPrice) => {
    // Verificar si se ha seleccionado un equipo
    if (!selectedEquipment) {
      openSnackbar("Debe seleccionar un equipo.");
      return false;
    }

    // Verificar si el equipo ya ha sido agregado
    const isEquipmentAlreadyAdded = assignedEquipments.some(
      (item) => item._id === selectedEquipment._id
    );
    if (isEquipmentAlreadyAdded) {
      openSnackbar("Este equipo ya ha sido asignado.");
      return false;
    }

    // Validar el precio personalizado
    if (!equipmentPrice || equipmentPrice <= 0) {
      openSnackbar("Debe ingresar un precio personalizado válido.");
      return false;
    }
    return true;
  };

  return {
    selectedEquipment,
    assignedEquipments,
    handleChangeEquipmentType,
    handleSelectEquipment,
    handleAddEquipment,
    setAssignedEquipments
  };
};
