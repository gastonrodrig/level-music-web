import {
  Typography,
  Box,
  useTheme,
  TextField,
  Grid,
  Button,
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
} from "../../../components";
import { useForm, useFieldArray } from "react-hook-form";
import { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAssignationGuards } from "../../../../../hooks";

export const AssignResourcesPage = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const navigate = useNavigate();

  const { loading, selected, startAssigningResources } = useQuotationStore();
  const { serviceDetail } = useServiceDetailStore();
  const { equipments } = useEquipmentStore();
  const { workers } = useWorkerStore();
  const { workerTypes } = useWorkerTypeStore();
  const { services } = useServiceStore();

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

  useEffect(() => {
    if (!selected) navigate("/admin/quotations");
  }, [selected, navigate]);

  const { startAppendEquipment, startAppendService, startAppendWorker } = useAssignationGuards();

  const serviceId = watch("service_id");
  const equipmentType = watch("equipment_type");
  const workerTypeId = watch("worker_type_id");

  const assignmentFromISO = selected?.start_time;
  const assignmentToISO = selected?.end_time;

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
    const success = await startAssigningResources(selected._id, {
      ...data,
      services: data.services,
      equipments: data.equipments,
      workers: data.workers,
      from: assignmentFromISO,
      to: assignmentToISO, 
    })

  };

  return (
    <Box component="form" sx={{ px: 4, pt: 2 }} onSubmit={handleSubmit(onSubmit)}>
      <Typography variant="h4" sx={{ mb: 2 }}>
        Asignación de Recursos
      </Typography>
      <Typography sx={{ mb: 2, fontSize: 16 }} color="text.secondary">
        Asigna trabajadores, servicios adicionales y equipos para el evento.
      </Typography>

      <QuotationInfoCard selected={selected} />

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
      />

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
