import {
  Typography,
  Box,
  TextField,
  Grid,
  Button,
  useTheme,
} from "@mui/material";
import {
  useEquipmentStore,
  useQuotationStore,
  useServiceDetailStore,
  useServiceStore,
  useWorkerStore,
  useWorkerTypeStore,
} from "../../../../../hooks";
import {
  QuotationInfoCard,
  AssignServiceCard,
  AssignEquipmentCard,
  AssignWorkerCard,
  QuotationSummary,
} from "../../../components";
import { useForm, useFieldArray } from "react-hook-form";
import { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAssignationGuards } from "../../../../../hooks";
import { calcEstimatedPrice } from "../../../../../shared/utils";
import { useScreenSizes } from "../../../../../shared/constants/screen-width";
import dayjs from "dayjs";
import { Save } from "@mui/icons-material";

export const AssignResourcesPage = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const navigate = useNavigate();

  const { isSm } = useScreenSizes();
  const { loading, selected, startAssigningResources } = useQuotationStore();
  const { serviceDetail } = useServiceDetailStore();
  const { equipments } = useEquipmentStore();
  const { workers } = useWorkerStore();
  const { workerTypes } = useWorkerTypeStore();
  const { services } = useServiceStore();

  const { 
    startAppendEquipment, 
    startAppendService, 
    startAppendWorker 
  } = useAssignationGuards();

  const guardDates = () => datesReady;

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    control,
  } = useForm({
    defaultValues: {
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
      services: [],
      equipments: [],
      workers: [],
      name: "",
      description: "",
      estimated_price: 0,
    },
    mode: "onBlur",
  });

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

  const serviceId = watch("service_id");
  const equipmentType = watch("equipment_type");
  const workerTypeId = watch("worker_type_id");
  const servicesWatch = watch("services");
  const equipmentsWatch = watch("equipments");
  const workersWatch = watch("workers");

  useEffect(() => {
    if (!selected) navigate("/admin/quotations");
  }, [selected, navigate]);

  useEffect(() => {
    setValue(
      "estimated_price",
      calcEstimatedPrice({
        services: servicesWatch || [],
        equipments: equipmentsWatch || [],
        workers: workersWatch || [],
      })
    );
  }, [servicesWatch, equipmentsWatch, workersWatch, setValue]);

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

  const fromISO = selected?.start_time
    ? dayjs(selected.start_time).toISOString()
    : null;
  const toISO = selected?.end_time
    ? dayjs(selected.end_time).toISOString()
    : null;
  const datesReady = !!(fromISO && toISO);

  const onSubmit = async (data) => {
    if (!selected) return;
    const success = await startAssigningResources(selected._id, {
      ...data,
      services: data.services,
      equipments: data.equipments,
      workers: data.workers,
      from: fromISO,
      to: toISO,
    });
    if (success) navigate("/admin/quotations");
  };

  const isButtonDisabled = useMemo(() => loading, [loading]);

  return (
    <Box
      component="form"
      sx={{ px: isSm ? 4 : 0, pt: 2 }}
      onSubmit={handleSubmit(onSubmit)}
    >
      <Typography variant="h4" sx={{ mb: 2 }}>
        Asignación de Recursos
      </Typography>
      <Typography sx={{ mb: 2, fontSize: 16 }} color="text.secondary">
        Asigna trabajadores, servicios adicionales y equipos para el evento.
      </Typography>

      <QuotationInfoCard selected={selected} showAdditionalServices={true} />

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
        from={fromISO}
        to={toISO}
        datesReady={datesReady}
        guardDates={guardDates}
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
        from={fromISO}
        to={toISO}
        eventDate={selected?.event_date}
        datesReady={datesReady}
        guardDates={guardDates}
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
        from={fromISO}
        to={toISO}
        datesReady={datesReady}
        guardDates={guardDates}
      />

      {/* Info nombre/descripcion */}
      <Box
        sx={{
          p: 3,
          borderRadius: 3,
          bgcolor: isDark ? "#1f1e1e" : "#f5f5f5",
          my: 2,
        }}
      >
        <Typography fontSize={18} sx={{ mb: 3 }}>
          Información de la Asignación (Nombre del evento y su descripción)
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Nombre del Evento"
              placeholder="Ingrese el nombre"
              InputLabelProps={{ shrink: true }}
              {...register("name", { required: true })}
              error={!!errors.name}
              helperText={errors.name && "Requerido"}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Descripción del Evento"
              placeholder="Ingrese una breve descripción"
              InputLabelProps={{ shrink: true }}
              {...register("description", { required: true })}
              error={!!errors.description}
              helperText={errors.description && "Requerido"}
            />
          </Grid>
        </Grid>
      </Box>

      {/* Resumen */}
      <QuotationSummary
        isDark={isDark}
        assignedServices={assignedServices}
        assignedEquipments={assignedEquipments}
        assignedWorkers={assignedWorkers}
        grandTotal={watch("estimated_price") || 0}
      />

      <Box sx={{ display: "flex", justifyContent: "flex-end", pb: 4 }}>
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
          Asignar Recursos
        </Button>
      </Box>
    </Box>
  );
};
