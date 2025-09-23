import {
  Typography,
  Box,
  useTheme,
  TextField,
  Chip,
  Grid,
  Button,
} from "@mui/material";
import { useForm } from "react-hook-form";
import {
  Add,
  EventAvailable,
  Group,
  Person,
  Speaker,
  ViewInArSharp,
} from "@mui/icons-material";
import {
  useEquipmentStore,
  useQuotationStore,
  useServiceDetailStore,
  useWorkerStore,
} from "../../../../../hooks";
import { useMemo } from "react";
import { formatDateString } from "../../../../../shared/utils";

export const AssignResourcesPage = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  const { loading, selected } = useQuotationStore();
  const { serviceDetail } = useServiceDetailStore();
  const { equipments } = useEquipmentStore();
  const { workers } = useWorkerStore();

  console.log({ serviceDetail, equipments, workers });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      provider_id: "",
      service_type_id: "",
      serviceDetails: [],
    },
    mode: "onBlur",
  });

  const onSubmit = (e) => {
    console.log("ola");
  };

  const isButtonDisabled = useMemo(() => loading, [loading]);

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

      {/* Información */}
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

      {/* Servicios Adicionales Solicitados */}
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

      {/* Información de la Asignacion (llena nombre y descripcion) */}
      <Box
        sx={{
          p: 3,
          borderRadius: 3,
          bgcolor: isDark ? "#1f1e1e" : "#f5f5f5",
          my: 2,
        }}
      >
        <Typography fontSize={18} sx={{ mb: 3 }}>
          Información de la Asignacion
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Nombre del Evento"
              placeholder="Ingrese el nombre"
              InputLabelProps={{ shrink: true }}
              {...register("Nombre del Evento", { required: true })}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Descripción del Evento"
              placeholder="Ingrese una descripción"
              InputLabelProps={{ shrink: true }}
              {...register("description", { required: true })}
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
            <Grid item xs={12} md={3}>
              <TextField
                select
                label="Servicio"
                fullWidth
                size="small"
                SelectProps={{ native: true }}
              >
                <option>Seleccionar servicio</option>
              </TextField>
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                select
                label="Paquete"
                fullWidth
                size="small"
                SelectProps={{ native: true }}
              >
                <option>Seleccionar paquete</option>
              </TextField>
            </Grid>
            <Grid item xs={12} md={2}>
              <TextField
                select
                label="Horas"
                fullWidth
                size="small"
                SelectProps={{ native: true }}
              >
                <option>4 horas</option>
                <option>8 horas</option>
                <option>12 horas</option>
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
          Servicios Asignados (0)
        </Typography>
        <Typography fontSize={14} color="text.secondary" align="center" my={5}>
          No hay servicios adicionales asignados aún
        </Typography>
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
              <TextField
                select
                label="Tipo de Equipo"
                fullWidth
                size="small"
                SelectProps={{ native: true }}
              >
                <option>Todos los tipos</option>
              </TextField>
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                select
                label="Equipo"
                fullWidth
                size="small"
                SelectProps={{ native: true }}
              >
                <option>Seleccionar equipo</option>
              </TextField>
            </Grid>
            <Grid item xs={12} md={2}>
              <TextField
                select
                label="Horas"
                fullWidth
                size="small"
                SelectProps={{ native: true }}
              >
                <option>4 horas</option>
                <option>8 horas</option>
                <option>12 horas</option>
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
              <TextField
                select
                label="Rol en el evento"
                fullWidth
                size="small"
                SelectProps={{ native: true }}
              >
                <option>Seleccionar rol</option>
              </TextField>
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                select
                label="Trabajador"
                fullWidth
                size="small"
                SelectProps={{ native: true }}
              >
                <option>Seleccionar trabajador</option>
              </TextField>
            </Grid>
            <Grid item xs={12} md={2}>
              <TextField
                label="Horas"
                fullWidth
                size="small"
                defaultValue="8"
              />
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
    </Box>
  );
};
