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
  FormHelperText,
  IconButton,
  Chip,
  useTheme,
} from "@mui/material";
import { Add, Delete, ViewInArSharp } from "@mui/icons-material";
import { useScreenSizes } from "../../../../../shared/constants/screen-width";

export const ServiceAssignment = ({
  services,
  filteredDetails,
  assignedServices,
  selectedDetail,
  handleSelectService,
  handleSelectDetail,
  handleAddService,
  setAssignedServices,
  watch,
  setValue,
  errors,
  serviceId,
}) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const { isSm } = useScreenSizes();

  const resetForm = () => {
    setValue("service_id", "");
    setValue("service_detail_id", "");
    setValue("custom_price", "");
    setValue("hours", 1);
  };

  const customPrice = watch("custom_price");
  const hours = watch("hours");

  return (
    <Box
      sx={{
        p: 3,
        borderRadius: 3,
        bgcolor: isDark ? "#1f1e1e" : "#f5f5f5",
        mb: 3,
        mt: 2
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
                        <Typography>Paquete – S/. {d.ref_price} (por hora)</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {entries.map(([k, v]) => `${k}: ${v}`).join(", ")}
                        </Typography>
                      </Box>
                    </MenuItem>
                  );
                })}
              </Select>

              <FormHelperText>{errors.service_detail_id?.message}</FormHelperText>
            </FormControl>
          </Grid>

          {/* Horas */}
          <Grid item xs={12} md={1.5}>
            <FormControl fullWidth size="small">
              <InputLabel id="hours-label">Horas</InputLabel>
              <Select
                labelId="hours-label"
                value={hours}
                onChange={(e) => setValue("hours", e.target.value)}
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

          {/* Precio de referencia (deshabilitado) */}
          <Grid item xs={12} md={1.5}>
            <TextField
              label="Precio Ref."
              value={selectedDetail?.ref_price || 0}
              fullWidth
              disabled
              InputLabelProps={{ shrink: true }}
              sx={{
                "& .MuiInputBase-root": {
                  height: 60,
                },
              }}
            />
          </Grid>

          {/* Precio por Hora (editable) */}
          <Grid item xs={12} md={1.5}>
            <TextField
              label="Precio Hora"
              placeholder="Ej: 250"
              value={watch("custom_price")}
              onChange={(e) => {
                const value = e.target.value ? Number(e.target.value) : "";  // Convertimos el valor
                setValue("custom_price", value);
              }}
              fullWidth
              InputLabelProps={{ shrink: true }}
              sx={{
                "& .MuiInputBase-root": {
                  height: 60,
                },
              }}
            />
          </Grid>

          {/* Agregar */}
          <Grid item xs={12} md={1.5}>
            <Button
              variant="contained"
              fullWidth
              startIcon={<Add />}
              onClick={() => {
                const success = handleAddService(customPrice, hours); 
                if (success) resetForm(); 
              }}
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

      {/* Resumen de Servicios Asignados */}
      <Typography fontSize={15} sx={{ mt: 2, mb: 1 }}>
        Servicios Asignados ({assignedServices.length})
      </Typography>

      {/* Cartita interna */}
      {assignedServices.length > 0 ? (
        assignedServices.map((servicio, index) => (
          <Box
            key={index}
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
              {/* Encabezado */}
              <Grid item xs={6} >
                <Typography fontWeight={600}>{servicio.service_type_name}</Typography>
                <Box display="flex" flexDirection={!isSm ? "column" : "row"} gap={1} mt={1} sx={{ alignItems: "flex-start" }}>
                  <Chip label={servicio.provider_name} size="small" />
                  <Chip label={`Horas: ${servicio.hours}`} size="small" />
                </Box>
              </Grid>

              {/* Precio */}
              <Grid item xs={6} textAlign="right">
                <Typography fontSize={13} sx={{ textDecoration: "line-through", color: "text.secondary" }}>
                  Ref: S/ {servicio.ref_price}/hora × {servicio.hours}h
                </Typography>
                <Typography fontSize={14}>S/ {servicio.customPrice}/hora × {servicio.hours}h</Typography>
                <Typography fontWeight={600} color="green">
                  S/ {(servicio.customPrice) * servicio.hours}
                </Typography>
                <IconButton
                  size="small"
                  color="error"
                  sx={{ ml: 1 }}
                  onClick={() => {
                    // Eliminar servicio de assignedServices
                    const updatedServices = assignedServices.filter((s, i) => i !== index);
                    setAssignedServices(updatedServices);
                  }}
                >
                  <Delete fontSize="small" />
                </IconButton>
              </Grid>
            </Grid>

            {/* Detalles */}
            <Grid container spacing={2} mt={0.5}>
              {Object.entries(servicio.details).map(([k, v]) => (
                <Grid item xs={12} sm={6} md={3} key={k}>
                  <Box 
                    sx={{ 
                      border: "1px solid", 
                      borderColor: isDark ? "#515151ff" : "#e0e0e0",
                      borderRadius: 2,
                      bgcolor: isDark ? "#2d2d2dff" : "#f5f5f5",
                      p: 1 
                    }}
                  >
                    <Typography fontSize={13} color="text.secondary">{k}</Typography>
                    <Typography fontSize={14} fontWeight={500}>{v}</Typography>
                  </Box>
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

      {/* Total */}
      {assignedServices.length > 0 && (
        <Typography textAlign="right" fontWeight={600} color="green">
          Total Servicios Adicionales: S/{" "}
          {assignedServices.reduce((acc, servicio) => acc + servicio.customPrice * servicio.hours, 0).toFixed(2)}
        </Typography>
      )}
    </Box>
  );
};
