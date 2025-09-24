import { useState } from "react";

export const useAssignResourcesStore = () => {
  // --- Servicios Adicionales ---
  const [selectedService, setSelectedService] = useState(null);
  const [selectedDetail, setSelectedDetail] = useState(null);
  const [hours, setHours] = useState(1);
  const [customPrice, setCustomPrice] = useState("");
  const [assignedServices, setAssignedServices] = useState([]);

  const handleSelectService = (serviceId, serviceDetail) => {
    const s = serviceDetail.find((sd) => sd.service._id === serviceId);
    setSelectedService(s);
    setSelectedDetail(null);
    setCustomPrice("");
  };

  const handleSelectDetail = (detailId) => {
    const d = selectedService?.serviceDetails.find((det) => det._id === detailId);
    setSelectedDetail(d);
    setCustomPrice(d?.ref_price || "");
  };

  const handleAddService = () => {
    if (!selectedService || !selectedDetail) return;
    const newItem = {
      service_type_name: selectedService.service.service_type_name,
      provider_name: selectedService.service.provider_name,
      hours,
      details: selectedDetail.details,
      ref_price: selectedDetail.ref_price,
      customPrice: Math.max(customPrice, selectedDetail.ref_price),
    };
    setAssignedServices((prev) => [...prev, newItem]);
    setSelectedService(null);
    setSelectedDetail(null);
    setHours(1);
    setCustomPrice("");
  };

  const resetServices = () => {
    setAssignedServices([]);
    setSelectedService(null);
    setSelectedDetail(null);
    setHours(1);
    setCustomPrice("");
  };

  // --- Equipos ---
  const [assignedEquipments, setAssignedEquipments] = useState([]);
  const handleAddEquipment = (equipment) => {
    setAssignedEquipments((prev) => [...prev, equipment]);
  };
  const resetEquipments = () => setAssignedEquipments([]);

  // --- Trabajadores ---
  const [assignedWorkers, setAssignedWorkers] = useState([]);
  const handleAddWorker = (worker) => {
    setAssignedWorkers((prev) => [...prev, worker]);
  };
  const resetWorkers = () => setAssignedWorkers([]);

  return {
    // Servicios
    selectedService,
    selectedDetail,
    hours,
    customPrice,
    assignedServices,
    setHours,
    setCustomPrice,
    handleSelectService,
    handleSelectDetail,
    handleAddService,
    resetServices,

    // Equipos
    assignedEquipments,
    handleAddEquipment,
    resetEquipments,

    // Trabajadores
    assignedWorkers,
    handleAddWorker,
    resetWorkers,
  };
};
