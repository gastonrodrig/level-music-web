import { useState } from "react";
import { useDispatch } from "react-redux";
import { showSnackbar } from "../../store";

export const useAssignWorkerStore = () => {
  const dispatch = useDispatch();

  const [selectedWorkerType, setSelectedWorkerType] = useState(null);
  const [selectedWorker, setSelectedWorker] = useState(null);
  const [assignedWorkers, setAssignedWorkers] = useState([]);

  const openSnackbar = (message) => dispatch(showSnackbar({ message }));
  
  const handleSelectWorkerType = (workerTypeId, workerTypes) => {
    const s = workerTypes.find((w) => w._id === workerTypeId);
    setSelectedWorkerType(s);
    setSelectedWorker(null);
  };

  const handleSelectWorker = (workerId, workers) => {
    const w = workers.find((wk) => wk._id === workerId);
    setSelectedWorker(w);
  };

  const handleAddWorker = (workerPrice, workerHours) => {
    if (!validateData(workerPrice)) return false;

    const newItem = {
      ...selectedWorker,
      worker_hours: workerHours,
      worker_price: workerPrice,
    };

    // Agregar el nuevo trabajador
    setAssignedWorkers((prev) => [...prev, newItem]);
    setSelectedWorkerType(null);
    setSelectedWorker(null);

    return true;
  };

  const validateData = (workerPrice) => {
    // Verificar si se ha seleccionado un trabajador
    if (!selectedWorker) {
      openSnackbar("Debe seleccionar un trabajador.");
      return false;
    }

    // Verificar si el trabajador ya ha sido agregado
    const isWorkerAlreadyAdded = assignedWorkers.some(
      (item) => item._id === selectedWorker._id
    );
    if (isWorkerAlreadyAdded) {
      openSnackbar("Este trabajador ya ha sido asignado.");
      return false;
    }

    // Validar el precio personalizado
    if (!workerPrice || workerPrice <= 0) {
      openSnackbar("Debe ingresar un precio personalizado válido.");
      return false;
    }
    return true;
  };

  return {
    selectedWorker,
    assignedWorkers,
    handleSelectWorkerType,
    handleSelectWorker,
    handleAddWorker,
    setAssignedWorkers,
  };
};
