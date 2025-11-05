import {
  Box,
  Grid,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
  IconButton,
  Chip,
} from "@mui/material";
import { Add, Delete, ViewInArSharp } from "@mui/icons-material";
import { useScreenSizes } from "../../../../../shared/constants/screen-width";
import { useMemo } from "react";

export const AssignServiceCard = ({
  isDark,
  services,
  filteredDetails,
  assignedServices,
  addService,
  removeService,
  watch,
  setValue,
  startAppendService,
  from,
  to,
  datesReady,
  guardDates,
  eventCode
}) => {
  const { isSm } = useScreenSizes();

  const resetForm = () => {
    setValue("service_id", "");
    setValue("service_detail_id", "");
    setValue("service_price", "");
    setValue("service_hours", 1);
    setValue("payment_percentage_required", 0);
  };

  const serviceId = watch("service_id");
  const serviceDetailId = watch("service_detail_id");
  const servicePrice = watch("service_price");
  const serviceHours = watch("service_hours");
  const paymentPercentageRequired = watch("payment_percentage_required");

  const selectedService = useMemo(
    () => services.find((s) => s._id === serviceId),
    [services, serviceId]
  );

  const selectedDetail = useMemo(
    () => filteredDetails.find((d) => d._id === serviceDetailId),
    [filteredDetails, serviceDetailId]
  );

  const datesMissing = !datesReady || !from || !to;

  return (
    <Box sx={{ p: 3, borderRadius: 3, bgcolor: isDark ? "#1f1e1e" : "#f5f5f5", my: 2 }}>
      <Box display="flex" alignItems="center" mb={2} gap={1}>
        <ViewInArSharp sx={{ mt: "2px" }} />
        <Typography sx={{ fontSize: 20, fontWeight: 500 }}>
          Asignación de Servicios Adicionales
        </Typography>
      </Box>

      {/* Card interna */}
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
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel id="service-label" shrink>Servicio</InputLabel>
              <Select
                labelId="service-label"
                label="Servicio"
                value={serviceId || ""}
                onChange={(e) => {
                  setValue("service_id", e.target.value, { shouldValidate: true });
                  setValue("service_detail_id", "");
                }}
                inputProps={{ name: "service_id" }}
                sx={{ height: 60 }}
                displayEmpty
                disabled={datesMissing}
              >
                <MenuItem value="">
                  <em>Seleccione un servicio</em>
                </MenuItem>
                {services.map((s) => (
                  <MenuItem key={s._id} value={s._id}>
                    <Box>
                      <Typography fontWeight={500}>{s.service_type_name}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {s.provider_name}
                      </Typography>
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Paquete */}
          <Grid item xs={12} md={6}>
            <FormControl fullWidth size="small">
              <InputLabel id="package-label" shrink>Paquete</InputLabel>
              <Select
                labelId="package-label"
                value={serviceDetailId || ""}
                onChange={(e) => setValue("service_detail_id", e.target.value, { shouldValidate: true })}
                inputProps={{ name: "service_detail_id" }}
                sx={{ height: 60 }}
                disabled={datesMissing || !serviceId}
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
                        <Typography>Paquete – S/. {d.ref_price} (por hora)</Typography>
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
              <InputLabel id="hours-label">Horas</InputLabel>
              <Select
                labelId="hours-label"
                value={serviceHours || 1}
                onChange={(e) => setValue("service_hours", e.target.value)}
                sx={{ height: 60 }}
                disabled={datesMissing}
              >
                {Array.from({ length: 10 }, (_, i) => i + 1).map((h) => (
                  <MenuItem key={h} value={h}>{h} horas</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Precio de referencia */}
          <Grid item xs={12} md={2.5}>
            <TextField
              label="Precio Ref."
              value={selectedDetail?.ref_price || 0}
              fullWidth
              disabled
              InputLabelProps={{ shrink: true }}
              sx={{ "& .MuiInputBase-root": { height: 60 } }}
            />
          </Grid>

          {/* Precio por Hora (editable) */}
          <Grid item xs={12} md={2.5}>
            <TextField
              label="Precio Hora"
              placeholder="Ej: 250"
              value={servicePrice || ""}
              onChange={(e) => {
                const value = e.target.value ? Number(e.target.value) : "";
                setValue("service_price", value);
              }}
              fullWidth
              InputLabelProps={{ shrink: true }}
              sx={{ "& .MuiInputBase-root": { height: 60 } }}
              disabled={datesMissing}
            />
          </Grid>

          {/* % Pago Requerido */}
          <Grid item xs={12} md={2.5}>
            <TextField
              label="% Pago Requerido"
              placeholder="Ej: 50"
              value={paymentPercentageRequired || ""}
              onChange={(e) => {
                let value = e.target.value ? Number(e.target.value) : "";
                // Validación: solo entre 0 y 100
                if (value !== "" && (value < 0 || value > 100)) return;
                setValue("payment_percentage_required", value);
              }}
              fullWidth
              InputLabelProps={{ shrink: true }}
              sx={{ "& .MuiInputBase-root": { height: 60 } }}
              disabled={datesMissing}
              type="number"
              inputProps={{ min: 0, max: 100 }}
            />    
          </Grid>

          {/* Agregar */}
          <Grid item xs={12} md={2.5}>
            <Button
              variant="contained"
              fullWidth
              startIcon={<Add />}
              onClick={async () => {
                if (!guardDates()) return;
                if (!selectedService || !selectedDetail) return;
                //aca se agrega el servicio osea se anida los objetos para mostrarlo supongo 
                await startAppendService({
                  selectedService,
                  selectedDetail,
                  servicePrice,
                  serviceHours,
                  assignedServices,
                  paymentPercentageRequired,
                  append: addService,
                  onSuccess: resetForm,
                  from,
                  to,
                  eventCode
                });
              }}
              disabled={!serviceDetailId}
              sx={{ textTransform: "none", borderRadius: 2, color: "#fff", fontWeight: 600, py: 2 }}
            >
              Agregar
            </Button>
          </Grid>
        </Grid>
      </Box>

      {/* Resumen */}
      <Typography fontSize={15} sx={{ mt: 2, mb: 1 }}>
        Servicios Asignados ({assignedServices.length})
      </Typography>

      {assignedServices.length > 0 ? (
        assignedServices.map((servicio, index) => (
          <Box
            key={servicio.id}
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
              <Grid item xs={6}>
                <Typography fontWeight={600}>{servicio.service_type_name}</Typography>
                <Box
                  display="flex"
                  flexDirection={!isSm ? "column" : "row"}
                  gap={1}
                  mt={1}
                  sx={{ alignItems: "flex-start" }}
                >
                  <Chip label={servicio.provider_name} size="small" />
                  <Chip label={`Horas: ${servicio.service_hours}`} size="small" />
                  <Chip label={`Porcentaje de Pago: ${servicio.payment_percentage_required}%`} size="small" wcolor="info"
                  />
                </Box>
              </Grid>

              <Grid item xs={6} textAlign="right">
                <Typography fontSize={13} sx={{ textDecoration: "line-through", color: "text.secondary" }}>
                  Ref: S/ {servicio.ref_price}/hora × {servicio.service_hours}h
                </Typography>
                <Typography fontSize={14}>
                  S/ {servicio.service_price}/hora × {servicio.service_hours}h
                </Typography>
                <Typography fontWeight={600} color="green">
                  S/. {Number(servicio.service_price) * Number(servicio.service_hours)}
                </Typography>
                <IconButton size="small" color="error" sx={{ ml: 1 }} onClick={() => removeService(index)}>
                  <Delete fontSize="small" />
                </IconButton>
              </Grid>
            </Grid>

            <Grid container spacing={2} mt={0.5}>
              {Object.entries(servicio.details).map(([k, v]) => (
                <Grid item xs={12} sm={6} md={3} key={k}>
                  <InfoBox isDark={isDark} label={k} value={v} />
                </Grid>
              ))}
            </Grid>
          </Box>
        ))
      ) : (
        <Typography fontSize={14} color="text.secondary" align="center" my={5}>
          No hay servicios adicionales asignados aún
        </Typography>
      )}

      {assignedServices.length > 0 && (
        <Typography textAlign="right" fontWeight={600} color="green">
          Total Servicios Adicionales: S/{" "}
          {assignedServices
            .reduce((acc, s) => acc + Number(s.service_price) * Number(s.service_hours), 0)
            .toFixed(2)}
        </Typography>
      )}
    </Box>
  );
};

const InfoBox = ({ isDark, label, value }) => (
  <Box
    sx={{
      border: "1px solid",
      borderColor: isDark ? "#515151ff" : "#e0e0e0",
      borderRadius: 2,
      bgcolor: isDark ? "#2d2d2dff" : "#f5f5f5",
      p: 1,
    }}
  >
    <Typography fontSize={13} color="text.secondary">
      {label}
    </Typography>
    <Typography fontSize={14} fontWeight={500}>
      {String(value)}
    </Typography>
  </Box>
);
