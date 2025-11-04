import { Box, Typography, Button, useTheme } from "@mui/material";
import { useForm, FormProvider, useFieldArray } from "react-hook-form";
import {
  AssignEquipmentCard,
  AssignServiceCard,
  AssignWorkerCard,
  EventDetailsForm,
  PersonalInfoForm,
  QuotationSummary,
  StepHeader,
} from "../../../components";
import { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  useAssignationGuards,
  useEquipmentStore,
  useEventTypeStore,
  useQuotationStore,
  useServiceDetailStore,
  useServiceStore,
  useWorkerStore,
  useWorkerTypeStore,
} from "../../../../../hooks";
import dayjs from "dayjs";
import { useDispatch } from "react-redux";
import { showSnackbar } from "../../../../../store";
import { calcEstimatedPrice } from "../../../../../shared/utils";
import { useScreenSizes } from "../../../../../shared/constants/screen-width";
import { Save } from "@mui/icons-material";

export const EventQuotationEditPage = () => {
  const theme = useTheme();  
  const isDark = theme.palette.mode === "dark";
  
  const openSnackbar = (message) => dispatch(showSnackbar({ message }));
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { serviceDetail } = useServiceDetailStore();
  const { isSm } = useScreenSizes();
  const { equipments } = useEquipmentStore();
  const { workers } = useWorkerStore();
  const { workerTypes } = useWorkerTypeStore();
  const { services } = useServiceStore();
  const { eventTypes } = useEventTypeStore();

  const { 
    loading, 
    selected,
    startUpdateQuotation
   } = useQuotationStore();

  const { 
    startAppendEquipment, 
    startAppendService, 
    startAppendWorker 
  } = useAssignationGuards();

  const selectedTypeId = selected?.event_type_id || selected?.event_type || "";
  const selectedTypeObj = eventTypes?.find(et => et._id === selectedTypeId);
  
  const methods = useForm({
    defaultValues: {
      // Evento
      event_category: selectedTypeObj?.category || "",
      event_type_id: selected?.event_type_id || selected?.event_type || "",
      event_type_name: selectedTypeObj?.type || "",
      eventName: selected?.name || "",
      eventDescription: selected?.description || "",
      startDateTime: selected?.start_time ? dayjs(selected.start_time) : null,
      endDateTime: selected?.end_time ? dayjs(selected.end_time) : null,
      attendeesCount: selected?.attendees_count || 0,
      placeType: selected?.place_type || "",
      exactAddress: selected?.exact_address || "",
      placeReference: selected?.location_reference || "",
      placeCapacity: selected?.place_size || "",
      // Cliente
      client_type: selected?.client_info?.client_type || "Persona",
      email: selected?.client_info?.email || "",
      phone: selected?.client_info?.phone || "",
      document_type: selected?.client_info?.document_type || "Dni",
      document_number: selected?.client_info?.document_number || "",
      first_name: selected?.client_info?.first_name || "",
      last_name: selected?.client_info?.last_name || "",
      company_name: selected?.client_info?.company_name || "",
      contact_person: selected?.client_info?.contact_person || "",
      // Recursos (arrays)
      services: selected?.assignations?.filter(a => a.resource_type === "Servicio Adicional").map(s => ({
        service_type_name: s.service_type_name,
        provider_name: s.service_provider_name,
        service_hours: s.hours,
        service_price: s.hourly_rate,
        ref_price: s.service_ref_price,
        details: s.service_detail || {},
        payment_percentage_required: s.payment_percentage_required || 0,
        service_detail_id: s.resource,
        _id: s._id,
      })) || [],

      equipments: selected?.assignations?.filter(a => a.resource_type === "Equipo").map(e => ({
        name: e.equipment_name,
        equipment_type: e.equipment_type,
        equipment_price: e.hourly_rate,
        equipment_hours: e.hours,
        description: e.equipment_description,
        serial_number: e.equipment_serial_number,
        location: e.equipment_location || "",
        status: e.equipment_status,
        equipment_id: e.resource,
        _id: e._id,
      })) || [],
      
      workers: selected?.assignations?.filter(a => a.resource_type === "Trabajador").map(w => ({
        first_name: w.worker_first_name,
        last_name: w.worker_last_name,
        worker_type_name: w.worker_role,
        worker_hours: w.hours,
        worker_price: w.hourly_rate,
        worker_id: w.resource,
        _id: w._id,
      })) || [],
      estimated_price: selected?.estimated_price || 0,
    },
    mode: "onBlur",
  });

  const { handleSubmit, watch, setValue, control } = methods;

  const servicesWatch = watch("services");
  const equipmentsWatch = watch("equipments");
  const workersWatch = watch("workers");
  const clientType = watch("client_type");
  const serviceId = watch("service_id");
  const equipmentType = watch("equipment_type");
  const workerTypeId = watch("worker_type_id");

  useEffect(() => {
    if(!selected){
      navigate("/admin/quotations");
    } 
  }, [selected, navigate]);

  useEffect(() => {
    const total = calcEstimatedPrice({
      services: servicesWatch || [],
      equipments: equipmentsWatch || [],
      workers: workersWatch || [],
    });
    setValue("estimated_price", total, { shouldValidate: true });
  }, [servicesWatch, equipmentsWatch, workersWatch, setValue]);

  useEffect(() => {
    if (clientType === "Empresa") {
      setValue("document_type", "Ruc");
      setValue("document_number", "");
    }
  }, [clientType, setValue]);

  const {
    fields: assignedServices,
    append: addService,
    remove: removeService,
  } = useFieldArray({ control, name: "services" });
  const {
    fields: assignedEquipments,
    append: addEquipment,
    remove: removeEquipment,
  } = useFieldArray({ control, name: "equipments" });
  const {
    fields: assignedWorkers,
    append: addWorker,
    remove: removeWorker,
  } = useFieldArray({ control, name: "workers" });
  
  const startDT = watch("startDateTime");
  const endDT = watch("endDateTime");
  const datesReady = !!(startDT && endDT);

  const assignmentFromISO = datesReady ? dayjs(startDT).toISOString() : null;
  const assignmentToISO = datesReady ? dayjs(endDT).toISOString() : null;
  
  const guardDates = () => {
    if (!datesReady) {
      openSnackbar(
        "Primero selecciona Fecha y Hora de Inicio y Fin en el Paso 1."
      );
      return false;
    }
    return true;
  };
  
  const filteredDetails = useMemo(
    () => (serviceDetail || []).filter((d) => d.service_id === serviceId),
    [serviceDetail, serviceId]
  );

  const filteredEquipments = useMemo(
    () => (equipments || []).filter((e) => e.equipment_type === equipmentType),
    [equipments, equipmentType]
  );

  const filteredWorkers = useMemo(
    () => (workers || []).filter((w) => w.worker_type === workerTypeId),
    [workers, workerTypeId]
  );

  const onSubmit = async (data) => {
    const success = await startUpdateQuotation(selected._id, data);
    if (success) navigate("/admin/quotations");
  };

  const isButtonDisabled = useMemo(() => loading, [loading]);

  return (
    <FormProvider {...methods}>
      <Box
        component="form"
        sx={{ px: isSm ? 4 : 0, pt: 2 }}
        onSubmit={handleSubmit(onSubmit)}
      >
        <Typography variant="h4" sx={{ mb: 1 }}>
          Editar Cotización
        </Typography>
        <Typography sx={{ mb: 3, fontSize: 16 }} color="text.secondary">
          Crea una nueva cotización completando la información del evento,
          cliente y servicios requeridos.
        </Typography>

        {/* Paso 1: Información del evento */}
        <StepHeader n={1} label="Paso 1" />
        <EventDetailsForm eventTypes={eventTypes} setValue={setValue} />

        {/* Paso 2: Información del cliente */}
        <StepHeader n={2} label="Paso 2" />
        <PersonalInfoForm />

        {/* Paso 3: Recursos */}
        <StepHeader n={3} label="Paso 3" />
        <AssignServiceCard
          isDark={isDark}
          services={services}
          filteredDetails={filteredDetails}
          assignedServices={assignedServices}
          addService={addService}
          removeService={removeService}
          watch={watch}
          setValue={setValue}
          startAppendService={startAppendService}
          from={assignmentFromISO}
          to={assignmentToISO}
          datesReady={datesReady}
          guardDates={guardDates}
          eventId={selected?._id}
        />

        <AssignEquipmentCard
          isDark={isDark}
          equipmentType={equipmentType}
          filteredEquipments={filteredEquipments}
          assignedEquipments={assignedEquipments}
          addEquipment={addEquipment}
          removeEquipment={removeEquipment}
          watch={watch}
          setValue={setValue}
          startAppendEquipment={startAppendEquipment}
          from={assignmentFromISO}
          to={assignmentToISO}
          datesReady={datesReady}
          guardDates={guardDates}
          eventId={selected?._id}
        />

        <AssignWorkerCard
          isDark={isDark}
          workerTypes={workerTypes}
          filteredWorkers={filteredWorkers}
          assignedWorkers={assignedWorkers}
          addWorker={addWorker}
          removeWorker={removeWorker}
          watch={watch}
          setValue={setValue}
          startAppendWorker={startAppendWorker}
          from={assignmentFromISO}
          to={assignmentToISO}
          datesReady={datesReady}
          guardDates={guardDates}
          eventId={selected?._id}
        />

        {/* Resumen */}
        <QuotationSummary
          isDark={isDark}
          assignedServices={assignedServices}
          assignedEquipments={assignedEquipments}
          assignedWorkers={assignedWorkers}
          grandTotal={watch("estimated_price") || 0}
        />

        {/* Botón final */}
        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
          <Button
            type="submit"
            variant="contained"
            startIcon={<Save />}
            sx={{
              fontSize: 16,
              backgroundColor: '#212121',
              color: '#fff',
              borderRadius: 2,
              textTransform: 'none',
              px: 3,
              py: 1.5
            }}
            disabled={isButtonDisabled}
          >
            Editar Cotización
          </Button>
        </Box>
      </Box>
    </FormProvider>
  );
};