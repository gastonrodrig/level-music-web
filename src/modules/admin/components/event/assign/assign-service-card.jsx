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
import { Add, CameraAlt, Delete, ViewInArSharp } from "@mui/icons-material";
import { useScreenSizes } from "../../../../../shared/constants/screen-width";
import { useMemo, useState } from "react";
import { ImagePreviewModal } from "../../../../../shared/ui/components";

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
  eventCode,
  isEditMode = false, // Nueva prop
}) => {
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [selectedPreview, setSelectedPreview] = useState(null);
  const { isSm } = useScreenSizes();

  const resetForm = () => {
    setValue("service_id", "");
    setValue("service_detail_id", "");
    setValue("service_price", "");
    setValue("payment_percentage_required", 0);
  };

  const serviceId = watch("service_id");
  const serviceDetailId = watch("service_detail_id");
  const servicePrice = watch("service_price");
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
    <Box
      sx={{
        p: 3,
        borderRadius: 3,
        bgcolor: isDark ? "#1f1e1e" : "#f5f5f5",
        my: 2,
      }}
    >
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
          <Grid item xs={12} md={4.5}>
            <FormControl fullWidth>
              <InputLabel id="service-label" shrink>
                Servicio
              </InputLabel>
              <Select
                labelId="service-label"
                label="Servicio"
                value={serviceId || ""}
                onChange={(e) => {
                  setValue("service_id", e.target.value, {
                    shouldValidate: true,
                  });
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
                      <Typography fontWeight={500}>
                        {s.service_type_name}
                      </Typography>
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
          <Grid item xs={12} md={4.5}>
            <FormControl fullWidth size="small">
              <InputLabel id="package-label" shrink>
                Paquete
              </InputLabel>
              <Select
                labelId="package-label"
                value={serviceDetailId || ""}
                onChange={(e) =>
                  setValue("service_detail_id", e.target.value, {
                    shouldValidate: true,
                  })
                }
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
                    <MenuItem
                      key={d._id}
                      value={d._id}
                      onClick={() => {
                        const refPrice = Number(d?.ref_price || 0);
                        const calculatedPrice =
                          Math.round(refPrice * 0.15) + refPrice;
                        setValue("service_price", calculatedPrice);
                      }}
                    >
                      <Box sx={{ display: "flex", flexDirection: "column" }}>
                        <Typography>
                          Paquete – S/.{" "}
                          {Math.round(Number(d?.ref_price) * 0.15) +
                            d?.ref_price}{" "}
                          (por día)
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

          {/* Precio de referencia */}
          <Grid item xs={12} md={3}>
            <TextField
              label="Precio por día (S/)"
              value={servicePrice || "S/ -"}
              fullWidth
              disabled
              InputLabelProps={{ shrink: true }}
              sx={{ "& .MuiInputBase-root": { height: 60 } }}
            />
          </Grid>

          {/* Vista previa del paquete seleccionado */}
          {selectedDetail?.photos.length > 0 && (
            <Box
              sx={{
                mt: 2,
                mb: 1,
                p: 3,
                ml: 2,
                borderRadius: 1,
                border: "1px solid",
                borderColor: isDark ? "#555555ff" : "#d4d4d4ff",
                width: "100%",
                transition: "all 0.3s ease",
              }}
            >
              <Grid container spacing={2} alignItems="center">
                {/* Texto e información */}
                <Grid item xs={12}>
                  <Box
                    display="flex"
                    alignItems="center"
                    gap={1}
                    mb={1}
                    justifyContent={"space-between"}
                  >
                    <Typography
                      fontSize={18}
                      sx={{ mb: 0.5, color: isDark ? "#fff" : "#000" }}
                    >
                      {selectedService?.service_type_name}
                    </Typography>

                    <Chip
                      label={`${selectedDetail.photos.length} ${
                        selectedDetail.photos.length > 1 ? "Imágenes" : "Imagen"
                      }`}
                      size="small"
                      sx={{
                        bgcolor: isDark ? "#422b17" : "#ffebd8",
                        color: isDark ? "#ffb97d" : "#7b3f00",
                        fontWeight: 600,
                      }}
                    />
                  </Box>

                  {/* Imágenes */}
                  {selectedDetail?.photos?.length > 0 && (
                    <>
                      <Box
                        sx={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: 1,
                          mb: 1,
                        }}
                      >
                        {selectedDetail.photos.slice(0, 3).map((photo, idx) => (
                          <Box
                            key={photo._id || idx}
                            component="img"
                            src={photo.url}
                            alt={photo.name}
                            sx={{
                              width: 140,
                              height: 120,
                              borderRadius: 2,
                              objectFit: "cover",
                              cursor: "pointer",
                              transition: "transform 0.2s ease",
                              "&:hover": { transform: "scale(1.05)" },
                            }}
                            onClick={() => {
                              setSelectedPreview(photo.url);
                              setPreviewModalOpen(true);
                            }}
                          />
                        ))}
                      </Box>

                      <Box display="flex" alignItems="center" mt={1} gap={0.5}>
                        <CameraAlt fontSize="small" />
                        <Typography
                          variant="caption"
                          display="block"
                          sx={{ mt: 0.5, color: "text.secondary" }}
                        >
                          Click en cualquier imagen para ampliar
                        </Typography>
                      </Box>
                    </>
                  )}
                </Grid>
              </Grid>
            </Box>
          )}

          {/* Agregar */}
          <Grid item xs={12} md={2}>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={async () => {
                if (!guardDates()) return;
                if (!selectedService || !selectedDetail) return;
                await startAppendService({
                  selectedService,
                  selectedDetail,
                  servicePrice,
                  assignedServices,
                  paymentPercentageRequired,
                  append: addService,
                  onSuccess: resetForm,
                  from,
                  to,
                  eventCode,
                });
              }}
              disabled={!serviceDetailId}
              sx={{
                textTransform: "none",
                borderRadius: 2,
                color: "#fff",
                fontWeight: 500,
                py: 2,
                px: 3,
                height: "40px",
              }}
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
                <Typography fontWeight={600}>
                  {servicio.service_type_name}
                </Typography>
                <Box
                  display="flex"
                  flexDirection={!isSm ? "column" : "row"}
                  gap={1}
                  mt={1}
                  sx={{ alignItems: "flex-start" }}
                >
                  <Chip label={servicio.provider_name} size="small" />
                </Box>
              </Grid>

              <Grid item xs={6} textAlign="right">
                <Typography fontWeight={600} color="green">
                  S/. {Number(servicio.service_price)}
                </Typography>
                <IconButton
                  size="small"
                  color="error"
                  sx={{ ml: 1 }}
                  onClick={() => removeService(index)}
                >
                  <Delete fontSize="small" />
                </IconButton>
              </Grid>
            </Grid>

            {/* Campo de Pago Requerido - Solo visible en modo edición */}
            {isEditMode && (
              <Grid container spacing={2} mt={1}>
                <Grid item xs={12} md={3}>
                  <TextField
                    label="% Porcentaje requerido"
                    placeholder="Ej: 50"
                    size="small"
                    name={`services.${index}.payment_percentage_required`}
                    value={
                      (watch &&
                        (watch(`services.${index}.payment_percentage_required`) ??
                          servicio.payment_percentage_required)) ||
                      ""
                    }
                    onChange={(e) => {
                      const raw = e.target.value;
                      const value = raw === "" ? "" : Number(raw);
                      if (value !== "" && (value < 0 || value > 100)) return;

                      setValue(
                        `services.${index}.payment_percentage_required`,
                        value,
                        { shouldValidate: true, shouldDirty: true }
                      );
                    }}
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    sx={{
                      "& .MuiInputBase-root": {
                        height: 45,
                        bgcolor: isDark ? "#1f1e1e" : "#fff",
                      },
                    }}
                    type="number"
                    inputProps={{ min: 0, max: 100 }}
                  />
                </Grid>
              </Grid>
            )}

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
            .reduce((acc, s) => acc + Number(s.service_price), 0)
            .toFixed(2)}
        </Typography>
      )}

      <ImagePreviewModal
        open={previewModalOpen}
        src={selectedPreview}
        onClose={() => setPreviewModalOpen(false)}
      />
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
