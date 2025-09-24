import {
  Typography,
  Box,
  useTheme,
  TextField,
  Chip,
  Grid,
  Button,
  MenuItem,
} from "@mui/material";
import {
  Add,
  EventAvailable,
  Group,
  Person,
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
import { formatDateString } from "../../../../../shared/utils";

export const AssignResourcesPage = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  const { loading, selected } = useQuotationStore();
  const { serviceDetail } = useServiceDetailStore();
  const { equipments } = useEquipmentStore();
  const { workers } = useWorkerStore();
  const { services } = useServiceStore(); // si luego lo usas para más filtros

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
  } = useForm({
    defaultValues: {
      provider_id: "",
      service_type_id: "",
      serviceDetails: [],
      name: "",
      description: "",
    },
    mode: "onBlur",
  });

  const onSubmit = (data) => {
    console.log("Submit asignación:", {
      form: data,
      serviciosAsignados: assignedServices,
      // equiposAsignados, trabajadoresAsignados si los agregas en el hook
    });
  };

  return (
    <Box component="form" sx={{ px: 4, pt: 2 }} onSubmit={handleSubmit(onSubmit)}>
      <Typography variant="h4" sx={{ mb: 2 }}>
        Asignación de Recursos
      </Typography>
      <Typography sx={{ mb: 2, fontSize: 16 }} color="text.secondary">
        Asigna trabajadores, servicios adicionales y equipos para el evento.
      </Typography>

      {/* ---------------- INFORMACIÓN ---------------- */}
      <Grid container spacing={2}>
        {/* Información del Evento */}
        <Grid item xs={12} md={6}>
          <Box
            sx={{
              p: 3,
              borderRadius: 3,
              bgcolor: isDark ? "#1f1e1e" : "#f5f5f5",
              height: "100%",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", mb: 2, gap: 1 }}>
              <EventAvailable />
              <Typography sx={{ fontSize: 20, fontWeight: 500 }}>
                Información del Evento
              </Typography>
            </Box>

            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Box>
                  <Typography fontSize={14} color="text.secondary">
                    Tipo de Evento
                  </Typography>
                  <Chip
                    label={selected?.event_type_name}
                    color="primary"
                    size="small"
                    sx={{ fontWeight: 500, fontSize: 13, mt: 0.5 }}
                  />
                </Box>

                <Box sx={{ mt: 2 }}>
                  <Typography fontSize={14} color="text.secondary">
                    Fecha
                  </Typography>
                  <Typography fontSize={14}>
                    {formatDateString(selected?.date)}
                  </Typography>
                </Box>

                <Box sx={{ mt: 2 }}>
                  <Typography fontSize={14} color="text.secondary">
                    Asistentes
                  </Typography>
                  <Typography fontSize={14}>
                    {selected?.attendees_count} personas
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={6}>
                <Box>
                  <Typography fontSize={14} color="text.secondary">
                    Lugar
                  </Typography>
                  <Typography fontSize={14}>{selected?.place_type}</Typography>
                </Box>

                <Box sx={{ mt: 2 }}>
                  <Typography fontSize={14} color="text.secondary">
                    Horario
                  </Typography>
                  <Typography fontSize={14}>
                    {selected?.start_time} - {selected?.end_time}
                  </Typography>
                </Box>

                <Box sx={{ mt: 2 }}>
                  <Typography fontSize={14} color="text.secondary">
                    Tamaño del lugar
                  </Typography>
                  <Typography fontSize={14}>
                    {selected?.place_size} m²
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={12}>
                <Box>
                  <Typography fontSize={14} color="text.secondary">
                    Ubicación
                  </Typography>
                  <Typography fontSize={14}>
                    {selected?.exact_address}
                  </Typography>
                  <Typography fontSize={13} color="text.secondary">
                    {selected?.location_reference}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Grid>

        {/* Información del Cliente */}
        <Grid item xs={12} md={6}>
          <Box
            sx={{
              p: 3,
              borderRadius: 3,
              bgcolor: isDark ? "#1f1e1e" : "#f5f5f5",
              height: "100%",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", mb: 2, gap: 1 }}>
              <Person />
              <Typography sx={{ fontSize: 20, fontWeight: 500 }}>
                Información del Cliente
              </Typography>
            </Box>
            <Box sx={{ mb: 2 }}>
              <Typography fontSize={14} color="text.secondary">
                Tipo de Cliente
              </Typography>
              <Chip
                label={selected?.client_info.client_type}
                color="primary"
                size="small"
                sx={{ fontWeight: 500, fontSize: 13, mt: 0.5 }}
              />
            </Box>

            <Grid container spacing={2}>
              {selected?.client_info.client_type === "Persona" ? (
                <>
                  <Grid item xs={12} md={6}>
                    <Box sx={{ mb: 2 }}>
                      <Typography fontSize={14} color="text.secondary">
                        Nombre
                      </Typography>
                      <Typography fontSize={14}>
                        {selected?.client_info.first_name}
                      </Typography>
                    </Box>
                    <Box sx={{ mb: 2 }}>
                      <Typography fontSize={14} color="text.secondary">
                        Email
                      </Typography>
                      <Typography fontSize={14}>
                        {selected?.client_info.email}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography fontSize={14} color="text.secondary">
                        Tipo de Documento
                      </Typography>
                      <Typography fontSize={14}>
                        {selected?.client_info.document_type}
                      </Typography>
                    </Box>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Box sx={{ mb: 2 }}>
                      <Typography fontSize={14} color="text.secondary">
                        Apellido
                      </Typography>
                      <Typography fontSize={14}>
                        {selected?.client_info.last_name}
                      </Typography>
                    </Box>
                    <Box sx={{ mb: 2 }}>
                      <Typography fontSize={14} color="text.secondary">
                        Teléfono
                      </Typography>
                      <Typography fontSize={14}>
                        {selected?.client_info.phone}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography fontSize={14} color="text.secondary">
                        Número
                      </Typography>
                      <Typography fontSize={14}>
                        {selected?.client_info.document_number}
                      </Typography>
                    </Box>
                  </Grid>
                </>
              ) : (
                <>
                  <Grid item xs={12} md={6}>
                    <Box sx={{ mb: 2 }}>
                      <Typography fontSize={14} color="text.secondary">
                        Empresa
                      </Typography>
                      <Typography fontSize={14}>
                        {selected?.client_info.company_name}
                      </Typography>
                    </Box>
                    <Box sx={{ mb: 2 }}>
                      <Typography fontSize={14} color="text.secondary">
                        Email
                      </Typography>
                      <Typography fontSize={14}>
                        {selected?.client_info.email}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography fontSize={14} color="text.secondary">
                        Tipo de Documento
                      </Typography>
                      <Typography fontSize={14}>
                        {selected?.client_info.document_type}
                      </Typography>
                    </Box>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Box sx={{ mb: 2 }}>
                      <Typography fontSize={14} color="text.secondary">
                        Representante
                      </Typography>
                      <Typography fontSize={14}>
                        {selected?.client_info.contact_person}
                      </Typography>
                    </Box>
                    <Box sx={{ mb: 2 }}>
                      <Typography fontSize={14} color="text.secondary">
                        Teléfono
                      </Typography>
                      <Typography fontSize={14}>
                        {selected?.client_info.phone}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography fontSize={14} color="text.secondary">
                        Número
                      </Typography>
                      <Typography fontSize={14}>
                        {selected?.client_info.document_number}
                      </Typography>
                    </Box>
                  </Grid>
                </>
              )}
            </Grid>
          </Box>
        </Grid>
      </Grid>

      {/* ---------------- SERVICIOS SOLICITADOS EN LA COTIZACIÓN ---------------- */}
      <Box
        sx={{
          p: 3,
          borderRadius: 3,
          bgcolor: isDark ? "#1f1e1e" : "#f5f5f5",
          mt: 2,
        }}
      >
        <Typography sx={{ fontSize: 20, fontWeight: 500, mb: 2 }}>
          Servicios Solicitados en la Cotización
        </Typography>

        {selected?.services_requested?.map((service) => (
          <Box
            key={service.service_type_id}
            sx={{
              border: "1px solid",
              borderColor: isDark ? "#333" : "#e0e0e0",
              borderRadius: 2,
              p: 2,
              mb: 2,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Box>
              <Typography fontSize={15} fontWeight={600}>
                {service.service_type_name}
              </Typography>
              <Typography fontSize={13} color="text.secondary">
                {service.details}
              </Typography>
            </Box>

            <Chip
              label="Solicitado"
              color="default"
              variant="outlined"
              size="small"
            />
          </Box>
        ))}
      </Box>

      {/* ---------------- INFORMACIÓN DE LA ASIGNACIÓN ---------------- */}
      <Box
        sx={{
          p: 3,
          borderRadius: 3,
          bgcolor: isDark ? "#1f1e1e" : "#f5f5f5",
          my: 2,
        }}
      >
        <Typography fontSize={18} sx={{ mb: 3 }}>
          Información de la Asignación
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

      {/* ---------------- SERVICIOS ADICIONALES ---------------- */}
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
              <TextField
                select
                label="Servicio"
                fullWidth
                size="small"
                value={selectedService?.service._id || ""}
                onChange={(e) => handleSelectService(e.target.value, serviceDetail)}
              >
                <MenuItem value="">Seleccionar servicio</MenuItem>
                {serviceDetail.map((s) => (
                  <MenuItem key={s.service._id} value={s.service._id}>
                    <Box>
                      <Typography>{s.service.service_type_name}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {s.service.provider_name}
                      </Typography>
                    </Box>
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            {/* Paquete */}
            <Grid item xs={12} md={3}>
              <TextField
                select
                label="Paquete"
                fullWidth
                size="small"
                value={selectedDetail?._id || ""}
                onChange={(e) => handleSelectDetail(e.target.value)}
                disabled={!selectedService}
              >
                <MenuItem value="">Seleccionar paquete</MenuItem>
                {selectedService?.serviceDetails.map((d) => {
                  const entries = Object.entries(d.details).slice(0, 2);
                  return (
                    <MenuItem key={d._id} value={d._id}>
                      <Typography>Paquete – S/. {d.ref_price}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {entries.map(([k, v]) => `${k}: ${v}`).join(", ")}
                      </Typography>
                    </MenuItem>
                  );
                })}
              </TextField>
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
