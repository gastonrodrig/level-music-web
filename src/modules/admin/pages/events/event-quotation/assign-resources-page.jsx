import {
  Typography,
  Box,
  TextField,
  Grid,
  Button,
  IconButton,
  Collapse,
  useTheme,
} from "@mui/material";
import { ExpandMore, ExpandLess } from "@mui/icons-material";
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
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAssignationGuards } from "../../../../../hooks";
import {
  calcEstimatedPrice,
  calcServicesTotal,
  calcEquipmentsTotal,
  calcWorkersTotal,
} from "../../../../../shared/utils";
import dayjs from "dayjs";
import { useScreenSizes } from "../../../../../shared/constants/screen-width";


export const AssignResourcesPage = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const navigate = useNavigate();

  const [expandedServices, setExpandedServices] = useState(false);
  const [expandedEquipments, setExpandedEquipments] = useState(false);
  const [expandedWorkers, setExpandedWorkers] = useState(false);
  const { isSm } = useScreenSizes();
  const { loading, selected, startAssigningResources } = useQuotationStore();
  const { serviceDetail } = useServiceDetailStore();
  const { equipments } = useEquipmentStore();
  const { workers } = useWorkerStore();
  const { workerTypes } = useWorkerTypeStore();
  const { services } = useServiceStore();

  // si no hay selected, volvemos a lista (esta pantalla es SOLO para asignar)
  useEffect(() => {
    if (!selected) navigate("/admin/quotations");
  }, [selected, navigate]);

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

  // field arrays
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

  // totales dinámicos
  const servicesWatch = watch("services");
  const equipmentsWatch = watch("equipments");
  const workersWatch = watch("workers");
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

  // filtros por selección
  const serviceId = watch("service_id");
  const equipmentType = watch("equipment_type");
  const workerTypeId = watch("worker_type_id");

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

  // fechas vienen del selected (no del form)
  const fromISO = selected?.start_time
    ? dayjs(selected.start_time).toISOString()
    : null;
  const toISO = selected?.end_time
    ? dayjs(selected.end_time).toISOString()
    : null;
  const datesReady = !!(fromISO && toISO);

  const { startAppendEquipment, startAppendService, startAppendWorker } =
    useAssignationGuards();
  const guardDates = () => datesReady;

  // totales para el resumen
  const servicesTotal = calcServicesTotal(assignedServices);
  const equipmentsTotal = calcEquipmentsTotal(assignedEquipments);
  const workersTotal = calcWorkersTotal(assignedWorkers);
  const grandTotal = watch("estimated_price") || 0;

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

      <QuotationInfoCard selected={selected} />

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
      <Box
        sx={{
          p: 3,
          borderRadius: 3,
          bgcolor: isDark ? "#1f1e1e" : "#f5f5f5",
          my: 2,
        }}
      >
        <Typography sx={{ fontSize: 20, fontWeight: 500, mb: 2 }}>
          Resumen de la Asignación
        </Typography>

        {/* Servicios */}
        <Box sx={{ mb: 2 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              cursor: "pointer",
              "&:hover": {
                bgcolor: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)",
              },
              p: 1,
              borderRadius: 1,
            }}
            onClick={() => setExpandedServices((s) => !s)}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Typography fontSize={14} color="text.secondary">
                + Servicios adicionales ({assignedServices.length})
              </Typography>
              <IconButton size="small">
                {expandedServices ? <ExpandLess /> : <ExpandMore />}
              </IconButton>
            </Box>
            <Typography fontSize={14}>S/ {servicesTotal.toFixed(2)}</Typography>
          </Box>

          <Collapse in={expandedServices}>
            <Box sx={{ ml: 2, mt: 1 }}>
              {assignedServices.length ? (
                assignedServices.map((service, i) => (
                  <Box
                    key={i}
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      py: 0.5,
                    }}
                  >
                    <Typography fontSize={13} color="text.secondary">
                      • {service.name} ({service.service_hours}h)
                    </Typography>
                    <Typography fontSize={13}>
                      S/{" "}
                      {(
                        (+service.service_price || 0) * service.service_hours
                      ).toFixed(2)}
                    </Typography>
                  </Box>
                ))
              ) : (
                <Typography
                  fontSize={13}
                  color="text.secondary"
                  sx={{ fontStyle: "italic" }}
                >
                  No hay servicios asignados
                </Typography>
              )}
            </Box>
          </Collapse>
        </Box>

        {/* Equipos */}
        <Box sx={{ mb: 2 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              cursor: "pointer",
              "&:hover": {
                bgcolor: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)",
              },
              p: 1,
              borderRadius: 1,
            }}
            onClick={() => setExpandedEquipments((e) => !e)}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Typography fontSize={14} color="text.secondary">
                + Equipos ({assignedEquipments.length})
              </Typography>
              <IconButton size="small">
                {expandedEquipments ? <ExpandLess /> : <ExpandMore />}
              </IconButton>
            </Box>
            <Typography fontSize={14}>
              S/ {equipmentsTotal.toFixed(2)}
            </Typography>
          </Box>

          <Collapse in={expandedEquipments}>
            <Box sx={{ ml: 2, mt: 1 }}>
              {assignedEquipments.length ? (
                assignedEquipments.map((equipment, i) => (
                  <Box
                    key={i}
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      py: 0.5,
                    }}
                  >
                    <Typography fontSize={13} color="text.secondary">
                      • {equipment.name} ({equipment.equipment_hours}h)
                    </Typography>
                    <Typography fontSize={13}>
                      S/{" "}
                      {(
                        (+equipment.equipment_price || 0) *
                        equipment.equipment_hours
                      ).toFixed(2)}
                    </Typography>
                  </Box>
                ))
              ) : (
                <Typography
                  fontSize={13}
                  color="text.secondary"
                  sx={{ fontStyle: "italic" }}
                >
                  No hay equipos asignados
                </Typography>
              )}
            </Box>
          </Collapse>
        </Box>

        {/* Trabajadores */}
        <Box sx={{ mb: 3 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              cursor: "pointer",
              "&:hover": {
                bgcolor: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)",
              },
              p: 1,
              borderRadius: 1,
            }}
            onClick={() => setExpandedWorkers((w) => !w)}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Typography fontSize={14} color="text.secondary">
                + Trabajadores ({assignedWorkers.length})
              </Typography>
              <IconButton size="small">
                {expandedWorkers ? <ExpandLess /> : <ExpandMore />}
              </IconButton>
            </Box>
            <Typography fontSize={14}>S/ {workersTotal.toFixed(2)}</Typography>
          </Box>

          <Collapse in={expandedWorkers}>
            <Box sx={{ ml: 2, mt: 1 }}>
              {assignedWorkers.length ? (
                assignedWorkers.map((worker, i) => (
                  <Box
                    key={i}
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      py: 0.5,
                    }}
                  >
                    <Typography fontSize={13} color="text.secondary">
                      • {worker.name} ({worker.worker_hours}h)
                    </Typography>
                    <Typography fontSize={13}>
                      S/{" "}
                      {(
                        (+worker.worker_price || 0) * worker.worker_hours
                      ).toFixed(2)}
                    </Typography>
                  </Box>
                ))
              ) : (
                <Typography
                  fontSize={13}
                  color="text.secondary"
                  sx={{ fontStyle: "italic" }}
                >
                  No hay trabajadores asignados
                </Typography>
              )}
            </Box>
          </Collapse>
        </Box>

        <Box
          sx={{
            p: 2,
            borderRadius: 2,
            bgcolor: isDark ? "#2a2a2a" : "#e0e0e0",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography fontSize={16} fontWeight={600}>
            Total Estimado
          </Typography>
          <Typography fontSize={16} fontWeight={600}>
            S/ {grandTotal.toFixed(2)}
          </Typography>
        </Box>
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
