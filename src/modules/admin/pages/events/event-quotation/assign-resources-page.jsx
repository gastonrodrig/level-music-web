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
import {
  Add,
  Group,
  Speaker,
  ViewInArSharp,
} from "@mui/icons-material";
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

  console.log({ serviceDetail, equipments, workers, services });

  const {
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
  } = useAssignResourcesStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue
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

  const onSubmit = (data) => {
    console.log("Submit asignación:", {
      form: data,
      serviciosAsignados: assignedServices,
    });
  };
    // id del servicio elegido en el select
  const serviceId = watch("service_id");

  // objeto servicio seleccionado (solo para referencia/mostrar en store)
  const selectedServiceObj = useMemo(
    () => (services || []).find((s) => s._id === serviceId) || null,
    [services, serviceId]
  );

  // detalles filtrados por service_id
  const filteredDetails = useMemo(
    () => (serviceDetail || []).filter((d) => d.service_id === serviceId),
    [serviceDetail, serviceId]
  );

  console.log("Servicios:", services);
  console.log("Servicio seleccionado:", serviceDetail);

  return (
    <Box component="form" sx={{ px: 4, pt: 2 }} onSubmit={handleSubmit(onSubmit)}>
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
          boxShadow: 1,
          mb: 3,
          mt: 2
        }}
      >
        <Box flexDirection={"row"} display={"flex"} alignItems="center" mb={2} gap={1}>
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
            <Grid item xs={12} md={3}>
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

                    // Actualiza el store con el objeto servicio
                    if (handleSelectService) handleSelectService(selectedServiceObj);

                    // Limpia selección de detalle y precio
                    if (handleSelectDetail) handleSelectDetail(null);
                    if (setCustomPrice) setCustomPrice(0);
                  }}
                  inputProps={{ name: "service_id" }}
                  size="small"
                >
                  {services.map((type) => (
                    <MenuItem key={type._id} value={type._id}>
                      <Box>
                        <Typography fontWeight={500}>{type.service_type_name}</Typography>
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
            <Grid item xs={12} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel id="package-label">Paquete</InputLabel>
                <Select
                  labelId="package-label"
                  value={selectedDetail?._id || ""}
                  onChange={(e) => {
                    const id = e.target.value
                    setValue("service_detail_id", id, { shouldValidate: true })
                    const det = filteredDetails.find((d) => d._id === id)
                    handleSelectDetail(det)
                    setCustomPrice(det.ref_price)
                  }}
                  inputProps={{ name: "service_detail_id" }}
                  disabled={!serviceId}
                >
                  {filteredDetails.map((d) => {
                    const entries = Object.entries(d.details).slice(0, 2)
                    return (
                      <MenuItem key={d._id} value={d._id}>
                        <Box sx={{ display: "flex", flexDirection: "column" }}>
                          <Typography>Paquete – S/. {d.ref_price}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            {entries.map(([k, v]) => `${k}: ${v}`).join(", ")}
                          </Typography>
                        </Box>
                      </MenuItem>
                    )
                  })}
                </Select>
              </FormControl>
            </Grid>

            {/* Horas */}
            <Grid item xs={12} md={2}>
              <TextField
                select
                label="Horas"
                fullWidth
                size="small"
                value={hours}
                onChange={(e) => setHours(Number(e.target.value))}
              >
                {Array.from({ length: 10 }, (_, i) => i + 1).map((h) => (
                  <MenuItem key={h} value={h}>
                    {h} horas
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            {/* Precio */}
            <Grid item xs={12} md={2}>
              <TextField
                type="number"
                label="Precio"
                fullWidth
                size="small"
                value={customPrice}
                onChange={(e) => setCustomPrice(Number(e.target.value))}
                inputProps={{
                  min: selectedDetail?.ref_price || 0,
                }}
                disabled={!selectedDetail}
              />
            </Grid>

            {/* Agregar */}
            <Grid item xs={12} md={2}>
              <Button
                variant="contained"
                fullWidth
                startIcon={<Add />}
                onClick={handleAddService}
                disabled={!selectedDetail}
                sx={{
                  textTransform: "none",
                  borderRadius: 2,
                  color: "#fff",
                  fontWeight: 600,
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
          <Typography fontSize={14} color="text.secondary" align="center" my={5}>
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
        <Box flexDirection={"row"} display={"flex"} alignItems="center" mb={2} gap={1}>
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
            <Grid item xs={12} md={3}>
              <TextField select label="Tipo de Equipo" fullWidth size="small">
                <MenuItem value="">Todos los tipos</MenuItem>
                {/* map de tipos si lo tienes */}
              </TextField>
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField select label="Equipo" fullWidth size="small">
                <MenuItem value="">Seleccionar equipo</MenuItem>
                {/* {equipments.map(e => <MenuItem key={e._id} value={e._id}>{e.name}</MenuItem>)} */}
              </TextField>
            </Grid>
            <Grid item xs={12} md={2}>
              <TextField select label="Horas" fullWidth size="small">
                {Array.from({ length: 10 }, (_, i) => i + 1).map((h) => (
                  <MenuItem key={h} value={h}>
                    {h} horas
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} md={4}>
              <Button
                variant="contained"
                fullWidth
                startIcon={<Add />}
                sx={{
                  textTransform: "none",
                  borderRadius: 2,
                  color: "#fff",
                  fontWeight: 600,
                }}
              >
                Agregar
              </Button>
            </Grid>
          </Grid>
        </Box>

        <Typography fontSize={15} sx={{ mt: 2, mb: 1 }}>
          Equipos Asignados (0)
        </Typography>
        <Typography fontSize={14} color="text.secondary" align="center" my={5}>
          No hay equipos adicionales asignados aún
        </Typography>
      </Box>

      {/* ---------------- TRABAJADORES ---------------- */}
      <Box
        sx={{
          p: 3,
          borderRadius: 3,
          bgcolor: isDark ? "#1f1e1e" : "#f5f5f5",
          boxShadow: 1,
          mb: 3,
        }}
      >
        <Box flexDirection={"row"} display={"flex"} alignItems="center" mb={2} gap={1}>
          <Group sx={{ mt: "2px" }} />
          <Typography sx={{ fontSize: 20, fontWeight: 500 }}>
            Asignación de Trabajadores
          </Typography>
        </Box>

        {/* Cartita interna */}
        <Box
          sx={{
            p: 2,
            borderRadius: 2,
            border: "1px solid",
            borderColor: isDark ? "#333" : "#e0e0e0",
            bgcolor: isDark ? "#141414" : "#fcfcfc",
            mb: 2,
          }}
        >
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={3}>
              <TextField select label="Rol en el evento" fullWidth size="small">
                <MenuItem value="">Seleccionar rol</MenuItem>
                {/* map roles */}
              </TextField>
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField select label="Trabajador" fullWidth size="small">
                <MenuItem value="">Seleccionar trabajador</MenuItem>
                {/* {workers.map(w => <MenuItem key={w._id} value={w._id}>{w.first_name} {w.last_name}</MenuItem>)} */}
              </TextField>
            </Grid>
            <Grid item xs={12} md={2}>
              <TextField label="Horas" fullWidth size="small" defaultValue="8" />
            </Grid>
            <Grid item xs={12} md={4}>
              <Button
                variant="contained"
                fullWidth
                startIcon={<Add />}
                sx={{
                  textTransform: "none",
                  borderRadius: 2,
                  color: "#fff",
                  fontWeight: 600,
                }}
              >
                Agregar
              </Button>
            </Grid>
          </Grid>
        </Box>

        <Typography fontSize={15} sx={{ mt: 2, mb: 1 }}>
          Trabajadores Asignados (0)
        </Typography>
        <Typography fontSize={14} color="text.secondary" align="center" my={5}>
          No hay trabajadores adicionales asignados aún
        </Typography>
      </Box>

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
              placeholder="Ingrese una descripción"
              InputLabelProps={{ shrink: true }}
              {...register("description", { required: true })}
              error={!!errors.description}
              helperText={errors.description && "Requerido"}
            />
          </Grid>
        </Grid>
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
