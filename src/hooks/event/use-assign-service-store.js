import { useState } from "react";
import { useDispatch } from "react-redux";
import { showSnackbar } from "../../store";

export const useAssignServicesStore = () => {
  const dispatch = useDispatch();

  const [selectedService, setSelectedService] = useState(null);
  const [selectedDetail, setSelectedDetail] = useState(null);
  const [assignedServices, setAssignedServices] = useState([]);

  const openSnackbar = (message) => dispatch(showSnackbar({ message }));

  const handleSelectService = (serviceId, services) => {
    const s = services.find((srv) => srv._id === serviceId);
    setSelectedService(s);
    setSelectedDetail(null);
  };

  const handleSelectDetail = (detailId, filteredDetails) => {
    const d = filteredDetails.find((det) => det._id === detailId);
    setSelectedDetail(d);
  };

  const handleAddService = (servicePrice, serviceHours) => {
    if (!validateData(servicePrice)) return false; 

    const newItem = {
      service_type_name: selectedService.service_type_name,
      provider_name: selectedService.provider_name,
      service_hours: serviceHours,
      details: selectedDetail.details,
      ref_price: selectedDetail.ref_price,
      service_price: servicePrice,
    };

    // Agrega el nuevo servicio
    setAssignedServices((prev) => [...prev, newItem]);

    setSelectedService(null);
    setSelectedDetail(null);

    return true; 
  };

  const validateData = (servicePrice) => {
    // Verificar si se ha seleccionado un servicio
    if (!selectedService) {
      openSnackbar("Debe seleccionar un servicio.");
      return false;
    } 

    // Verificar si el servicio ya ha sido agregado
    if (!selectedDetail) {
      openSnackbar("Debe seleccionar un paquete.");
      return false;
    }

    // Verificar si el servicio ya ha sido agregado
    const isServiceAlreadyAdded = assignedServices.some(
      (item) =>
        item.service_type_name === selectedService.service_type_name &&
        item.details === selectedDetail.details
    );
    if (isServiceAlreadyAdded) {
      openSnackbar("Este servicio ya ha sido asignado.");
      return false;
    }

    // Validar el precio personalizado
    if (!servicePrice || servicePrice <= 0) {
      openSnackbar("Debe ingresar un precio personalizado válido.");
      return false;
    }
    return true;
  };

  return {
    selectedService,
    selectedDetail,
    assignedServices,
    setAssignedServices,
    handleSelectService,
    handleSelectDetail,
    handleAddService,
  };
};
