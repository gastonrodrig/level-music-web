import { useDispatch, useSelector } from "react-redux";
import { showSnackbar } from "../../store";
import { getAuthConfigWithParams } from "../../shared/utils";
import { assignationsApi, equipmentApi } from "../../api";

export const useAssignationGuards = () => {
  const dispatch = useDispatch();
  const { token } = useSelector((s) => s.auth);

  const openSnackbar = (message) => dispatch(showSnackbar({ message }));
  const isPriceValid = (price) => !!price && Number(price) > 0;

  const checkEquipmentMaintenance = async (equipmentId, date) => {
    try {
      await equipmentApi.get(`/availability/${equipmentId}`,
        getAuthConfigWithParams(token, { date })
      );
      return { ok: true };
    } catch (error) {
      const msg = error.response?.data?.message || "Equipo no disponible en ese rango.";
      return { ok: false, message: msg };
    }
  };

  const checkEquipmentAvailability = async (equipmentId, from, to, eventCode) => {
    try {
      const fromUTC = new Date(from).toISOString();
      const toUTC   = new Date(to).toISOString();
      await assignationsApi.get(`/availability/equipment/${equipmentId}`,
        getAuthConfigWithParams(token, 
          { 
            from: fromUTC, 
            to: toUTC,
            eventCode
          }
        )
      );
      return { ok: true };
    } catch (error) {
      const msg = error.response?.data?.message || "Equipo no disponible en ese rango.";
      return { ok: false, message: msg };
    }
  };

  const checkWorkerAvailability = async (workerId, from, to, eventCode) => {
    try {
      const fromUTC = new Date(from).toISOString();
      const toUTC   = new Date(to).toISOString();
      await assignationsApi.get(`/availability/worker/${workerId}`,
        getAuthConfigWithParams(token, 
          { 
            from: fromUTC, 
            to: toUTC,
            eventCode
          }
        )
      );
      return { ok: true };
    } catch (error) {
      const msg = error.response?.data?.message || "Trabajador no disponible en ese rango.";
      return { ok: false, message: msg };
    }
  };

  const checkServiceDetailAvailability = async (serviceDetailId, from, to, eventCode) => {
    try {
      const fromUTC = new Date(from).toISOString();
      const toUTC   = new Date(to).toISOString();
      await assignationsApi.get(`/availability/service-detail/${serviceDetailId}`,
        getAuthConfigWithParams(token, 
          { 
            from: fromUTC, 
            to: toUTC,
            eventCode
          }
        )
      );
      return { ok: true };
    } catch (error) {
      const msg = error.response?.data?.message || "Servicio/paquete no disponible en ese rango.";
      return { ok: false, message: msg };
    }
  };

  const startAppendEquipment = async ({
    selectedEquipment,
    equipmentPrice,
    equipmentHours,
    assignedEquipments,
    append,
    onSuccess,
    from,
    to,
    eventDate,
    eventCode
  }) => {
    if (!selectedEquipment) {
      openSnackbar("Debe seleccionar un equipo."); 
      return false;
    }
    if (!isPriceValid(equipmentPrice)) {
      openSnackbar("Debe ingresar un precio válido."); 
      return false; 
    }

    const existsLocal = assignedEquipments.some(
      (it) => String(it._id) === String(selectedEquipment._id)
    );
    if (existsLocal) { 
      openSnackbar("Este equipo ya ha sido asignado."); 
      return false; 
    }

    const avail = await checkEquipmentAvailability(selectedEquipment._id, from, to, eventCode);
    if (!avail.ok) { 
      openSnackbar(avail.message); 
      return false; 
    }

    const availCheck = await checkEquipmentMaintenance(selectedEquipment._id, eventDate);
    if (!availCheck.ok) { 
      openSnackbar(availCheck.message); 
      return false; 
    }

    append({
      _id: selectedEquipment._id,
      name: selectedEquipment.name,
      description: selectedEquipment.description,
      serial_number: selectedEquipment.serial_number,
      location: selectedEquipment.location,
      status: selectedEquipment.status,
      equipment_type: selectedEquipment.equipment_type,
      equipment_hours: isNaN(Number(equipmentHours)) ? 1 : Number(equipmentHours),
      equipment_price: Number(equipmentPrice),
      equipment_id: String(selectedEquipment._id),
    });
    onSuccess?.();
    return true;
  };

  const startAppendService = async ({
    selectedService,
    selectedDetail,
    servicePrice,
    serviceHours,
    paymentPercentageRequired,
    assignedServices,
    append,
    onSuccess,
    from,
    to,
    eventCode
  }) => {
    if (!selectedDetail) {
      openSnackbar("Debe seleccionar un paquete."); 
      return false; 
    }
    if (!isPriceValid(servicePrice)) {
      openSnackbar("Debe ingresar un precio válido."); 
      return false; 
    }

    const existsLocal = assignedServices.some(
      (it) =>
        String(it.service_id) === String(selectedService._id) &&
        String(it.service_detail_id) === String(selectedDetail._id)
    );
    if (existsLocal) { 
      openSnackbar("Este servicio/paquete ya ha sido asignado."); 
      return false; 
    }

    const avail = await checkServiceDetailAvailability(selectedDetail._id, from, to, eventCode);
    if (!avail.ok) { 
      openSnackbar(avail.message); 
      return false; 
    }

    append({
      service_id: selectedService._id,
      service_detail_id: selectedDetail._id,
      service_type_name: selectedService.service_type_name,
      provider_name: selectedService.provider_name,
      service_hours: isNaN(Number(serviceHours)) ? 1 : Number(serviceHours),
      details: selectedDetail.details,
      ref_price: selectedDetail.ref_price,
      service_price: Number(servicePrice),
      payment_percentage_required: Number(paymentPercentageRequired),
    });
    onSuccess?.();
    return true;
  };

  const startAppendWorker = async ({
    selectedWorker,
    workerPrice,
    workerHours,
    assignedWorkers,
    append,
    onSuccess,
    from,
    to,
    eventCode
  }) => {
    if (!isPriceValid(workerPrice)) {
      openSnackbar("Debe ingresar un precio válido."); 
      return false; 
    }

    const existsLocal = assignedWorkers.some(
      (it) => String(it._id) === String(selectedWorker._id)
    );
    if (existsLocal) {
      openSnackbar("Este trabajador ya ha sido asignado."); 
      return false; 
    }

    const avail = await checkWorkerAvailability(selectedWorker._id, from, to, eventCode);
    if (!avail.ok) {
      openSnackbar(avail.message); 
      return false; 
    }

    append({
      _id: selectedWorker._id,
      first_name: selectedWorker.first_name,
      last_name: selectedWorker.last_name,
      worker_type_name: selectedWorker.worker_type_name,
      worker_price: Number(workerPrice),
      worker_hours: isNaN(Number(workerHours)) ? 1 : Number(workerHours),
      worker_id: String(selectedWorker._id),
    });
    onSuccess?.();
    return true;
  };

  return {
    startAppendEquipment,
    startAppendService,
    startAppendWorker,
  };
};
