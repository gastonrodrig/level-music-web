import {
  Typography,
  Box,
  useTheme,
  TextField,
  Chip,
  Grid,
  Button,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  FormHelperText,
} from "@mui/material";
import { Add, Group, Speaker, ViewInArSharp } from "@mui/icons-material";
import {
  useAssignResourcesStore,
  useEquipmentStore,
  useQuotationStore,
  useServiceDetailStore,
  useServiceStore,
  useWorkerStore,
} from "../../../../../hooks";
import { useForm } from "react-hook-form";
import { QuotationInfoCard } from "../../../components/event/quotation";
import { useMemo } from "react";

export const AssignResourcesPage = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  const { loading, selected } = useQuotationStore();
  const { serviceDetail } = useServiceDetailStore();
  const { equipments } = useEquipmentStore();
  const { workers } = useWorkerStore();
  const { services } = useServiceStore();

  const {
    selectedService,
    selectedDetail,
    hours,
    customPrice,
    assignedServices,
    assignedEquipments,
    setHours,
    setCustomPrice,
    handleSelectEquipments,
    handleSelectService,
    handleSelectDetail,
    handleAddService,
    handleAddEquipment,
  } = useAssignResourcesStore();

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
    },
    mode: "onBlur",
  });

  const serviceId = watch("service_id");
  const equipmentType = watch("equipment_type");

  const onSubmit = (data) => {};

  // detalles filtrados por service_id
  const filteredDetails = useMemo(
    () => (serviceDetail || []).filter((d) => d.service_id === serviceId),
    [serviceDetail, serviceId]
  );

  const filteredEquipments = useMemo(
    () => (equipments || []).filter((d) => d.equipment_type === equipmentType),
    [equipments, equipmentType]
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

      {/* ---------------- SERVICIOS ADICIONALES ---------------- */}
      <Box
        sx={{
          p: 3,
          borderRadius: 3,
          bgcolor: isDark ? "#1f1e1e" : "#f5f5f5",
          mb: 3,
          mt: 2,
        }}
      >
        <Box
          flexDirection={"row"}
          display={"flex"}
          alignItems="center"
          mb={2}
          gap={1}
        >
          <ViewInArSharp sx={{ mt: "2px" }} />
          <Typography sx={{ fontSize: 20, fontWeight: 500 }}>
            Asignación de Servicios Adicionales
          </Typography>
        </Box>

        {/* Cartita interna */}
        <Box
          sx={{
            p: 3,
            borderRadius: 2,
            border: "1px solid",
            borderColor: isDark ? "#333" : "#e0e0e0",
            bgcolor: isDark ? "#141414" : "#fcfcfc",
            mb: 2,
          }}
        >
          <Grid container spacing={2} alignItems="center">
            {/* Servicio */}
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel id="service-label" shrink>
                  Servicio
                </InputLabel>
                <Select
                  labelId="service-label"
                  label="Servicio"
                  value={watch("service_id") || ""}
                  onChange={(e) => {
                    const id = e.target.value;
                    setValue("service_id", id, { shouldValidate: true });
                    handleSelectService(id, services);
                  }}
                  inputProps={{ name: "service_id" }}
                  sx={{ height: 60 }}
                  displayEmpty
                >
                  <MenuItem value="">
                    <em>Seleccione un servicio</em>
                  </MenuItem>
                  {services.map((type) => (
                    <MenuItem key={type._id} value={type._id}>
                      <Box>
                        <Typography fontWeight={500}>
                          {type.service_type_name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {type.provider_name}
                        </Typography>
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText>{errors.service_id?.message}</FormHelperText>
              </FormControl>
            </Grid>

            {/* Paquete */}
            <Grid item xs={12} md={4}>
              <FormControl fullWidth size="small">
                <InputLabel id="package-label" shrink>
                  Paquete
                </InputLabel>
                <Select
                  labelId="package-label"
                  value={watch("service_detail_id") || ""}
                  onChange={(e) => {
                    const id = e.target.value;
                    setValue("service_detail_id", id, { shouldValidate: true });
                    handleSelectDetail(id, filteredDetails);
                  }}
                  inputProps={{ name: "service_detail_id" }}
                  sx={{ height: 60 }}
                  disabled={!serviceId}
                  displayEmpty
                >
                  <MenuItem value="">
                    <em>Seleccione un paquete</em>
                  </MenuItem>
                  {filteredDetails.map((d) => {
                    const entries = Object.entries(d.details).slice(0, 2);
                    return (
                      <MenuItem key={d._id} value={d._id}>
                        <Box sx={{ display: "flex", flexDirection: "column" }}>
                          <Typography>
                            Paquete – S/. {d.ref_price} (por hora)
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {entries.map(([k, v]) => `${k}: ${v}`).join(", ")}
                          </Typography>
                        </Box>
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
            </Grid>

            {/* Horas */}
            <Grid item xs={12} md={2}>
              <FormControl fullWidth size="small">
                <InputLabel id="hours-label" shrink>Horas</InputLabel>
                <Select
                  labelId="hours-label"
                  value={hours}
                  onChange={(e) => setHours(Number(e.target.value))}
                  sx={{ height: 60 }}
                >
                  {Array.from({ length: 10 }, (_, i) => i + 1).map((h) => (
                    <MenuItem key={h} value={h}>
                      {h} horas
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Agregar */}
            <Grid item xs={12} md={2}>
              <Button
                variant="contained"
                fullWidth
                startIcon={<Add />}
                onClick={handleAddService}
                disabled={!watch("service_detail_id")}
                sx={{
                  textTransform: "none",
                  borderRadius: 2,
                  color: "#fff",
                  fontWeight: 600,
                  py: 2,
                }}
              >
                Agregar
              </Button>
            </Grid>
          </Grid>
        </Box>

        {/* Resumen de Servicios Adicionales */}
        <Typography fontSize={15} sx={{ mt: 2, mb: 1 }}>
          Servicios Asignados ({assignedServices.length})
        </Typography>
        {assignedServices.length === 0 ? (
          <Typography
            fontSize={14}
            color="text.secondary"
            align="center"
            my={5}
          >
            No hay servicios adicionales asignados aún
          </Typography>
        ) : (
          assignedServices.map((a, i) => {
            const details = Object.entries(a.details).slice(0, 5);
            return (
              <Box
                key={i}
                sx={{
                  border: "1px solid #ddd",
                  borderRadius: 2,
                  p: 2,
                  mb: 2,
                }}
              >
                <Typography fontWeight={600}>
                  {a.service_type_name} – {a.provider_name}
                </Typography>
                <Chip label={`Horas: ${a.hours}`} size="small" sx={{ mr: 1 }} />
                <Chip
                  label={`Precio unit: S/. ${a.customPrice}`}
                  size="small"
                  sx={{ mr: 1 }}
                />
                <Typography color="green">
                  Total: S/. {a.customPrice * a.hours}
                </Typography>

                <Box mt={1}>
                  {details.map(([k, v]) => (
                    <Chip key={k} label={`${k}: ${v}`} sx={{ mr: 1, mb: 1 }} />
                  ))}
                </Box>
              </Box>
            );
          })
        )}
      </Box>

      {/* ---------------- EQUIPOS ---------------- */}
<Box
  sx={{
    p: 3,
    borderRadius: 3,
    bgcolor: isDark ? "#1f1e1e" : "#f5f5f5",
    boxShadow: 1,
    mb: 3,
  }}
>
  <Box
    flexDirection={"row"}
    display={"flex"}
    alignItems="center"
    mb={2}
    gap={1}
  >
    <Speaker sx={{ mt: "2px" }} />
    <Typography sx={{ fontSize: 20, fontWeight: 500 }}>
      Asignación de Equipos
    </Typography>
  </Box>

  {/* Cartita interna */}
  <Box
    sx={{
      p: 3,
      borderRadius: 2,
      border: "1px solid",
      borderColor: isDark ? "#333" : "#e0e0e0",
      bgcolor: isDark ? "#141414" : "#fcfcfc",
      mb: 2,
    }}
  >
    <Grid container spacing={2} alignItems="center">
      {/* Tipo de Equipo */}
      <Grid item xs={12} md={3}>
        <FormControl fullWidth size="small">
          <InputLabel id="type-equipment-label" shrink>Tipo de Equipo</InputLabel>
          <Select
            labelId="type-equipment-label"
            value={equipmentType || ""}
            onChange={(e) =>
              setValue("equipment_type", e.target.value, { shouldValidate: true })
            }
            displayEmpty
          >
            <MenuItem value="">
              <em>Seleccione un tipo de equipo</em>
            </MenuItem>
            <MenuItem value="Sonido">Sonido</MenuItem>
            <MenuItem value="Luz">Luz</MenuItem>
            <MenuItem value="Fotografía">Fotografía</MenuItem>
          </Select>
        </FormControl>
      </Grid>

      {/* Equipo */}
      <Grid item xs={12} md={3}>
        <FormControl fullWidth size="small">
          <InputLabel id="equipment-label" shrink>Equipo</InputLabel>
          <Select
            labelId="equipment-label"
            value={watch("equipment_id") || ""}
            onChange={(e) =>
              setValue("equipment_id", e.target.value, { shouldValidate: true })
            }
            displayEmpty
            disabled={!equipmentType}
          >
            <MenuItem value="">
              <em>Seleccionar equipo</em>
            </MenuItem>
            {filteredEquipments.map((e) => (
              <MenuItem key={e._id} value={e._id}>
                <Box sx={{ display: "flex", flexDirection: "column" }}>
                  <Typography fontWeight={500}>{e.name}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {e.description} – SN: {e.serial_number}
                  </Typography>
                </Box>
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>

      {/* Horas */}
      <Grid item xs={12} md={2}>
        <FormControl fullWidth size="small">
          <InputLabel id="hours-equipment-label">Horas</InputLabel>
          <Select
            labelId="hours-equipment-label"
            value={watch("equipment_hours") || ""}
            onChange={(e) =>
              setValue("equipment_hours", e.target.value, { shouldValidate: true })
            }
            displayEmpty
          >
            {Array.from({ length: 10 }, (_, i) => i + 1).map((h) => (
              <MenuItem key={h} value={h}>
                {h} horas
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>

      {/* Precio por hora */}
      <Grid item xs={12} md={2}>
        <TextField
          fullWidth
          size="small"
          type="number"
          label="Precio por Hora (S/)"
          value={watch("equipment_price") || ""}
          onChange={(e) =>
            setValue("equipment_price", Number(e.target.value), { shouldValidate: true })
          }
          InputLabelProps={{ shrink: true }}
        />
      </Grid>

      {/* Botón */}
      <Grid item xs={12} md={2}>
        <Button
          variant="contained"
          fullWidth
          startIcon={<Add />}
          onClick={() =>
            handleAddEquipment({
              equipment_id: watch("equipment_id"),
              equipments, // lista completa para hacer el find
              hours: watch("equipment_hours"),
              price: watch("equipment_price"),
            })
          }
          disabled={
            !watch("equipment_id") || !watch("equipment_hours") || !watch("equipment_price")
          }
          sx={{
            textTransform: "none",
            borderRadius: 2,
            color: "#fff",
            fontWeight: 600,
            py: 1.3,
          }}
        >
          Agregar
        </Button>

      </Grid>
    </Grid>
  </Box>

  {/* Resumen de equipos asignados */}
  <Typography fontSize={15} sx={{ mt: 2, mb: 1 }}>
    Equipos Asignados ({assignedEquipments.length})
  </Typography>
  {assignedEquipments.length === 0 ? (
    <Typography fontSize={14} color="text.secondary" align="center" my={5}>
      No hay equipos adicionales asignados aún
    </Typography>
  ) : (
    assignedEquipments.map((e, i) => (
      <Box
        key={i}
        sx={{
          border: "1px solid #ddd",
          borderRadius: 2,
          p: 2,
          mb: 2,
        }}
      >
        {/* Encabezado */}
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography fontWeight={600}>{e.name}</Typography>
            <Chip label={e.equipment_type} size="small" sx={{ mr: 1 }} />
            <Chip label={`Horas: ${e.hours}`} size="small" sx={{ mr: 1 }} />
            <Chip
              label={`S/ ${e.price}/h`}
              size="small"
              color="primary"
              sx={{ mr: 1 }}
            />
          </Box>
          <Typography color="green" fontWeight={600}>
            Subtotal: S/ {e.price * e.hours}
          </Typography>
        </Box>

        {/* Detalles */}
        <Grid container spacing={2} mt={1}>
          <Grid item xs={12} md={3}>
            <Typography variant="body2" color="text.secondary">
              Descripción
            </Typography>
            <Typography>{e.description}</Typography>
          </Grid>
          <Grid item xs={12} md={3}>
            <Typography variant="body2" color="text.secondary">
              Número de Serie
            </Typography>
            <Typography>{e.serial_number}</Typography>
          </Grid>
          <Grid item xs={12} md={3}>
            <Typography variant="body2" color="text.secondary">
              Ubicación
            </Typography>
            <Typography>{e.location}</Typography>
          </Grid>
          <Grid item xs={12} md={3}>
            <Typography variant="body2" color="text.secondary">
              Estado
            </Typography>
            <Typography>{e.status}</Typography>
          </Grid>
        </Grid>
      </Box>
    ))
  )}
</Box>

      {/* Botón de Guardar/Enviar (opcional) */}
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
