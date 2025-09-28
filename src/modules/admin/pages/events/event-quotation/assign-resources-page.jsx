import {
  Typography,
  Box,
  useTheme,
  TextField,
  Grid,
  Button,
} from "@mui/material";
import {
  useAssignEquipmentStore,
  useAssignServicesStore,
  useAssignWorkerStore,
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
} from "../../../components";
import { useForm } from "react-hook-form";
import { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";

export const AssignResourcesPage = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const navigate = useNavigate();

  const { loading, selected } = useQuotationStore();
  const { serviceDetail } = useServiceDetailStore();
  const { equipments } = useEquipmentStore();
  const { workers } = useWorkerStore();
  const { workerTypes } = useWorkerTypeStore();
  const { services } = useServiceStore();

  const {
    selectedDetail,
    assignedServices,
    setAssignedServices,
    handleSelectService,
    handleSelectDetail,
    handleAddService,
  } = useAssignServicesStore();

  const {
    assignedEquipments,
    handleAddEquipment,
    handleChangeEquipmentType,
    setAssignedEquipments,
    handleSelectEquipment,
  } = useAssignEquipmentStore();

  const {
    assignedWorkers,
    handleAddWorker,
    handleSelectWorkerType,
    setAssignedWorkers,
    handleSelectWorker,
  } = useAssignWorkerStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm({
    defaultValues: {
      provider_id: "",
      service_type_id: "",
      serviceDetails: [],
      name: "",
      description: "",
      service_id: "",
      service_detail_id: "",
      service_hours: 1,
      service_price: "",
      equipment_id: "",
      equipment_hours: 1,
      equipment_price: "",
      worker_id: "",
      worker_hours: 1,
      worker_price: "",
    },
    mode: "onBlur",
  });

  useEffect(() => {
    if (!selected) {
      navigate("/admin/quotations", { replace: true });
      return;
    }
  }, [selected]);

  const onSubmit = (data) => {
    // Aquí iría el submit final con todos los recursos asignados
    console.log("Asignación enviada:", data, {
      assignedServices,
      assignedEquipments,
      assignedWorkers,
    });
  };

  const serviceId = watch("service_id");
  const equipmentType = watch("equipment_type");
  const workerTypeId = watch("worker_type_id");

  const filteredDetails = useMemo(
    () => (serviceDetail || []).filter((d) => d.service_id === serviceId),
    [serviceDetail, serviceId]
  );

  const filteredEquipments = useMemo(
    () => (equipments || []).filter((d) => d.equipment_type === equipmentType),
    [equipments, equipmentType]
  );

  const filteredWorkers = useMemo(
    () => (workers || []).filter((w) => w.worker_type === workerTypeId),
    [workers, workerTypeId]
  );

  return (
    <Box
      component="form"
      sx={{ px: 4, pt: 2 }}
      onSubmit={handleSubmit(onSubmit)}
    >
      <Typography variant="h4" sx={{ mb: 2 }}>
        Asignación de Recursos
      </Typography>
      <Typography sx={{ mb: 2, fontSize: 16 }} color="text.secondary">
        Asigna trabajadores, servicios adicionales y equipos para el evento.
      </Typography>

      {/* Información de la Cotización */}
      <QuotationInfoCard selected={selected} />

      {/* Servicios Adicionales */}
      <AssignServiceCard
        isDark={isDark}
        services={services}
        filteredDetails={filteredDetails}
        assignedServices={assignedServices}
        selectedDetail={selectedDetail}
        handleSelectService={handleSelectService}
        handleSelectDetail={handleSelectDetail}
        handleAddService={handleAddService}
        setAssignedServices={setAssignedServices}
        watch={watch}
        setValue={setValue}
        errors={errors}
        serviceId={serviceId}
      />

      {/* Equipos */}
      <AssignEquipmentCard
        isDark={isDark}
        equipmentType={equipmentType}
        watch={watch}
        setValue={setValue}
        handleSelectEquipment={handleSelectEquipment}
        filteredEquipments={filteredEquipments}
        handleChangeEquipmentType={handleChangeEquipmentType}
        handleAddEquipment={handleAddEquipment}
        assignedEquipments={assignedEquipments}
        setAssignedEquipments={setAssignedEquipments}
      />

      {/* Trabajadores */}
      <AssignWorkerCard
        isDark={isDark}
        workerTypes={workerTypes}
        watch={watch}
        setValue={setValue}
        handleSelectWorker={handleSelectWorker}
        filteredWorkers={filteredWorkers}
        handleSelectWorkerType={handleSelectWorkerType}
        handleAddWorker={handleAddWorker}
        assignedWorkers={assignedWorkers}
        setAssignedWorkers={setAssignedWorkers}
      />

      {/* Información de la asignación */}
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

      {/* Botón de Guardar/Enviar */}
      <Box sx={{ display: "flex", justifyContent: "flex-end", pb: 4 }}>
        <Button
          type="submit"
          variant="contained"
          disabled={loading}
          sx={{ textTransform: "none", borderRadius: 2, fontWeight: 600 }}
        >
          Guardar Asignación
        </Button>
      </Box>
    </Box>
  );
};
