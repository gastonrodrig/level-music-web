import {
  Box,
  Typography,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
  Chip,
  IconButton,
} from "@mui/material";
import { Add, Delete, Speaker } from "@mui/icons-material";
import { useScreenSizes } from "../../../../../shared/constants/screen-width";
import { useMemo } from "react";

export const AssignEquipmentCard = ({
  isDark,
  equipmentType,
  filteredEquipments,
  assignedEquipments,
  addEquipment,
  removeEquipment,
  watch,
  setValue,
  startAppendEquipment,
  from,
  to,
  eventDate,
  datesReady, 
  guardDates,
  eventCode
}) => {
  const { isSm } = useScreenSizes();

  const resetForm = () => {
    setValue("equipment_id", "");
    setValue("equipment_price", "");
    setValue("equipment_hours", 1);
  };

  const equipmentId = watch("equipment_id");
  const equipmentPrice = watch("equipment_price");
  const equipmentHours = watch("equipment_hours") || 1;

  const selectedEquipment = useMemo(
    () => filteredEquipments.find((e) => e._id === equipmentId),
    [filteredEquipments, equipmentId]
  );

  const datesMissing = !datesReady || !from || !to;

  return (
    <Box sx={{ p: 3, borderRadius: 3, bgcolor: isDark ? "#1f1e1e" : "#f5f5f5", mb: 2 }}>
      {/* Título */}
      <Box display="flex" alignItems="center" mb={2} gap={1}>
        <Speaker sx={{ mt: "2px" }} />
        <Typography sx={{ fontSize: 20, fontWeight: 500 }}>
          Asignación de Equipos
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
          {/* Tipo de Equipo */}
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel id="type-equipment-label" shrink>
                Tipo de Equipo
              </InputLabel>
              <Select
                labelId="type-equipment-label"
                label="Tipo de Equipo"
                value={equipmentType || ""}
                onChange={(e) => {
                  setValue("equipment_type", e.target.value, { shouldValidate: true });
                  setValue("equipment_id", "");
                }}
                inputProps={{ name: "equipment_type" }}
                sx={{ height: 60 }}
                displayEmpty
                disabled={datesMissing}   
              >
                <MenuItem value="">
                  <em>Seleccione el tipo</em>
                </MenuItem>
                <MenuItem value="Sonido">Sonido</MenuItem>
                <MenuItem value="Luz">Luz</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* Equipo */}
          <Grid item xs={12} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel id="equipment-label" shrink>
                Equipo
              </InputLabel>
              <Select
                labelId="equipment-label"
                value={equipmentId || ""}
                onChange={(e) => setValue("equipment_id", e.target.value, { shouldValidate: true })}
                inputProps={{ name: "equipment_id" }}
                sx={{ height: 60 }}
                displayEmpty
                disabled={datesMissing || !equipmentType} 
              >
                <MenuItem value="">
                  <em>Seleccionar equipo</em>
                </MenuItem>
                {filteredEquipments.map((e) => (
                  <MenuItem 
                    key={e._id} 
                    value={e._id}
                    onClick={() => {
                      const refPrice = Number(e?.reference_price || 0);
                      const calculatedPrice =
                        Math.round(refPrice * 0.15) + refPrice;
                      setValue("equipment_price", calculatedPrice);
                    }}
                  >
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
            <FormControl fullWidth>
              <InputLabel id="hours-equipment-label">Horas</InputLabel>
              <Select
                labelId="hours-equipment-label"
                value={equipmentHours}
                onChange={(e) => setValue("equipment_hours", e.target.value)}
                sx={{ height: 60 }}
                disabled={datesMissing}   
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
              label="Precio por hora (S/)"
              placeholder="Ej: 250"
              value={equipmentPrice || "S/ -"}
              fullWidth
              disabled
              InputLabelProps={{ shrink: true }}
              sx={{ "& .MuiInputBase-root": { height: 60 } }}
            />
          </Grid>

          {/* Botón */}
          <Grid item xs={12} md={2}>
            <Button
              variant="contained"
              fullWidth
              startIcon={<Add />}
              onClick={async () => {
                if (!guardDates()) return; 
                await startAppendEquipment({
                  selectedEquipment,
                  equipmentPrice,
                  equipmentHours,
                  assignedEquipments,
                  append: addEquipment,
                  onSuccess: resetForm,
                  from,
                  to,
                  eventDate,
                  eventCode
                });
              }}
              disabled={!equipmentId || !equipmentHours || !equipmentPrice}
              sx={{ textTransform: "none", borderRadius: 2, color: "#fff", fontWeight: 600, py: 2 }}
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

      {assignedEquipments.length > 0 ? (
        assignedEquipments.map((equipo, index) => (
          <Box
            key={equipo.id ?? `${equipo._id}-${index}`}
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
                <Typography fontWeight={600}>{equipo.name}</Typography>
                <Box display="flex" flexDirection={!isSm ? "column" : "row"} gap={1} mt={1} sx={{ alignItems: "flex-start" }}>
                  <Chip label={equipo.equipment_type} size="small" />
                </Box>
              </Grid>

              <Grid item xs={6} textAlign="right">
                <Typography fontSize={14}>
                  S/. {equipo.equipment_price}/hora × {equipo.equipment_hours}h
                </Typography>
                <Typography fontWeight={600} color="green">
                  S/. {Number(equipo.equipment_price) * Number(equipo.equipment_hours)}
                </Typography>
                <IconButton size="small" color="error" sx={{ ml: 1 }} onClick={() => removeEquipment(index)}>
                  <Delete fontSize="small" />
                </IconButton>
              </Grid>
            </Grid>

            <Grid container spacing={2} mt={1}>
              <Grid item xs={12} md={3}>
                <InfoBox isDark={isDark} label="Descripción" value={equipo.description} />
              </Grid>
              <Grid item xs={12} md={3}>
                <InfoBox isDark={isDark} label="Número de Serie" value={equipo.serial_number} />
              </Grid>
              <Grid item xs={12} md={3}>
                <InfoBox isDark={isDark} label="Ubicación" value={equipo.location} />
              </Grid>
              <Grid item xs={12} md={3}>
                <InfoBox isDark={isDark} label="Estado" value={equipo.status} />
              </Grid>
            </Grid>
          </Box>
        ))
      ) : (
        <Typography fontSize={14} color="text.secondary" align="center" my={5}>
          No hay equipos asignados aún
        </Typography>
      )}

      {assignedEquipments.length > 0 && (
        <Typography textAlign="right" fontWeight={600} color="green">
          Total Equipos: S/{" "}
          {assignedEquipments
            .reduce((acc, eq) => acc + Number(eq.equipment_price) * Number(eq.equipment_hours), 0)
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
      {value ?? "-"}
    </Typography>
  </Box>
);
