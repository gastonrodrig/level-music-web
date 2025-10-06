import { Box, Typography, Button, useTheme } from "@mui/material";
import { useForm, FormProvider, useFieldArray } from "react-hook-form";
import {
  AssignEquipmentCard,
  AssignServiceCard,
  AssignWorkerCard,
  EventDetailsForm,
  PersonalInfoForm,
  QuotationSummary,
  StepHeader 
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

export const EventQuotationAddPage = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const openSnackbar = (message) => dispatch(showSnackbar({ message }));

  const { loading, selected, startCreateQuotationAdmin } = useQuotationStore();
  const { serviceDetail } = useServiceDetailStore();
  const { equipments } = useEquipmentStore();
  const { workers } = useWorkerStore();
  const { workerTypes } = useWorkerTypeStore();
  const { services } = useServiceStore();
  const { eventTypes } = useEventTypeStore();

  const methods = useForm({
    defaultValues: {
      // Evento
      event_category: "",
      event_type_id: "",
      event_type_name: "",
      
      eventName: "",
      eventDescription: "",
      startDateTime: null,
      endDateTime: null,
      attendeesCount: 0,
      placeType: "",
      exactAddress: "",
      placeReference: "",
      placeCapacity: "",
      // Cliente
      client_type: "Persona",
      email: "",
      phone: "",
      document_type: "Dni",
      document_number: "",
      first_name: "",
      last_name: "",
      company_name: "",
      contact_person: "",
      // Recursos
      services: [],
      equipments: [],
      workers: [],
      service_id: "",
      service_detail_id: "",
      service_hours: 1,
      service_price: "",

      equipment_type: "",
      equipment_id: "",
      equipment_hours: 1,
      equipment_price: "",

      worker_type_id: "",
      worker_id: "",
      worker_hours: 1,
      worker_price: "",

      name: "",
      description: "",
      estimated_price: 0,
    },
    mode: "onBlur",
  });

  const { handleSubmit, watch, setValue, control } = methods;
  const servicesWatch = watch("services");
  const equipmentsWatch = watch("equipments");
  const workersWatch = watch("workers");

  useEffect(() => {
    const total = calcEstimatedPrice({
      services: servicesWatch || [],
      equipments: equipmentsWatch || [],
      workers: workersWatch || [],
    });
    setValue("estimated_price", total, { shouldValidate: true, shouldDirty: true });
  }, [servicesWatch, equipmentsWatch, workersWatch, setValue]);

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

  const clientType = watch("client_type");
  const serviceId = watch("service_id");
  const equipmentType = watch("equipment_type");
  const workerTypeId = watch("worker_type_id");

  useEffect(() => {
    if (clientType === "Empresa") {
      setValue("document_type", "Ruc");
      setValue("document_number", "");
    }
  }, [clientType, setValue]);

  const { startAppendEquipment, startAppendService, startAppendWorker } =
    useAssignationGuards();
  
  const startDT = watch("startDateTime");
  const endDT = watch("endDateTime");

  const datesReady = Boolean(startDT && endDT);

  const assignmentFromISO = startDT
    ? dayjs(startDT).toDate().toISOString()
    : null;
  const assignmentToISO = endDT ? dayjs(endDT).toDate().toISOString() : null;

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
    const success = await startCreateQuotationAdmin(data);
    if (success) navigate("/admin/quotations");
  };

  const isButtonDisabled = useMemo(() => loading, [loading]);

  return (
    <FormProvider {...methods}>
      <Box
        component="form"
        sx={{ px: 4, pt: 2 }}
        onSubmit={handleSubmit(onSubmit)}
      >
        <Typography variant="h4" sx={{ mb: 1 }}>
          Agregar Cotización
        </Typography>
        <Typography sx={{ mb: 3, fontSize: 16 }} color="text.secondary">
          Crea una nueva cotización completando la información del evento,
          cliente y servicios requeridos.
        </Typography>

        {/* 1. Información del evento */}
        <StepHeader n={1} label="Paso 1" />
        <EventDetailsForm 
          eventTypes={eventTypes} 
          setValue={setValue}
        />
        {/* 2. Información del cliente */}
        <StepHeader n={2} label="Paso 2" />
        <PersonalInfoForm />

        {/* 3. Asignar recursos */}
        <StepHeader n={3} label="Paso 3" />
        <AssignServiceCard
          isDark={isDark}
          services={services}
          filteredDetails={filteredDetails}
          // useFieldArray
          assignedServices={assignedServices}
          addService={addService}
          removeService={removeService}
          // form
          watch={watch}
          setValue={setValue}
          // availability
          startAppendService={startAppendService}
          from={assignmentFromISO}
          to={assignmentToISO}
          datesReady={datesReady}
          guardDates={guardDates}
        />

        <AssignEquipmentCard
          isDark={isDark}
          equipmentType={equipmentType}
          filteredEquipments={filteredEquipments}
          // useFieldArray
          assignedEquipments={assignedEquipments}
          addEquipment={addEquipment}
          removeEquipment={removeEquipment}
          // form
          watch={watch}
          setValue={setValue}
          // availability
          startAppendEquipment={startAppendEquipment}
          from={assignmentFromISO}
          to={assignmentToISO}
          // event date
          eventDate={selected?.event_date}
          datesReady={datesReady}
          guardDates={guardDates}
        />

        <AssignWorkerCard
          isDark={isDark}
          workerTypes={workerTypes}
          filteredWorkers={filteredWorkers}
          // useFieldArray
          assignedWorkers={assignedWorkers}
          addWorker={addWorker}
          removeWorker={removeWorker}
          // form
          watch={watch}
          setValue={setValue}
          // availability
          startAppendWorker={startAppendWorker}
          from={assignmentFromISO}
          to={assignmentToISO}
          datesReady={datesReady}
          guardDates={guardDates}
        />

        {/* Resumen de la cotización */}
        <QuotationSummary
          isDark={isDark}
          assignedServices={assignedServices}
          assignedEquipments={assignedEquipments}
          assignedWorkers={assignedWorkers}
          grandTotal={watch("estimated_price") || 0}
        />

        {/* Botón de enviar */}
        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
          <Button
            type="submit"
            variant="contained"
            sx={{ textTransform: "none", borderRadius: 2 }}
            disabled={isButtonDisabled}
          >
            Guardar Cotización
          </Button>
        </Box>
      </Box>
    </FormProvider>
  );
};
