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
  FormHelperText,
} from "@mui/material";
import { Add, Delete, Work } from "@mui/icons-material";
import { useScreenSizes } from "../../../../../shared/constants/screen-width";

export const AssignWorkerCard = ({
  isDark,
  workerTypes,
  watch,
  setValue,
  filteredWorkers,
  assignedWorkers,
  handleSelectWorkerType,
  handleSelectWorker,
  handleAddWorker,
  setAssignedWorkers,
  errors,
}) => {
  const { isSm } = useScreenSizes();
  console.log(workerTypes)

  const resetForm = () => {
    setValue("worker_type_id", "");
    setValue("worker_id", "");
    setValue("worker_price", "");
    setValue("worker_hours", 1);
  };

  const workerPrice = watch("worker_price");
  const workerHours = watch("worker_hours");

  return (
    <Box
      sx={{
        p: 3,
        borderRadius: 3,
        bgcolor: isDark ? "#1f1e1e" : "#f5f5f5",
        mb: 2,
      }}
    >
      {/* Título */}
      <Box
        flexDirection="row"
        display="flex"
        alignItems="center"
        mb={2}
        gap={1}
      >
        <Work sx={{ mt: "2px" }} />
        <Typography sx={{ fontSize: 20, fontWeight: 500 }}>
          Asignación de Trabajadores
        </Typography>
      </Box>

      {/* Selección */}
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
          {/* Tipo de Trabajador */}
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel id="worker-type-label" shrink>
                Tipo de Trabajador
              </InputLabel>
              <Select
                labelId="worker-type-label"
                value={watch("worker_type_id") || ""}
                onChange={(e) => {
                  const id = e.target.value;
                  setValue("worker_type_id", id, { shouldValidate: true });
                  handleSelectWorkerType(id, workerTypes);
                }}
                inputProps={{ name: "worker_type_id" }}
                sx={{ height: 60 }}
                displayEmpty
              >
                <MenuItem value="">
                  <em>Seleccione un tipo de trabajador</em>
                </MenuItem>
                {workerTypes.map((type) => (
                  <MenuItem key={type._id} value={type._id}>
                    <Box>
                      <Typography fontWeight={500}>
                        {type.name}
                      </Typography>
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Trabajador */}
          <Grid item xs={12} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel id="worker-label" shrink>
                Trabajador
              </InputLabel>
              <Select
                labelId="worker-label"
                value={watch("worker_id") || ""}
                onChange={(e) => {
                  const id = e.target.value;
                  setValue("worker_id", id, {
                    shouldValidate: true,
                  });
                  handleSelectWorker(id, filteredWorkers);
                }}
                inputProps={{ name: "worker_id" }}
                sx={{ height: 60 }}
                displayEmpty
                disabled={!workerTypes}
              >
                <MenuItem value="">
                  <em>Seleccionar trabajador</em>
                </MenuItem>
                {filteredWorkers.map((w) => (
                  <MenuItem key={w._id} value={w._id}>
                    <Box sx={{ display: "flex", flexDirection: "column" }}>
                      <Typography fontWeight={500}>{w.first_name}, {w.last_name}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {w.worker_type_name}
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
              <InputLabel id="hours-worker-label">Horas</InputLabel>
              <Select
                labelId="hours-worker-label"
                value={workerHours}
                onChange={(e) => setValue("worker_hours", e.target.value)}
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

          {/* Precio por hora */}
          <Grid item xs={12} md={2}>
            <TextField
              label="Precio por hora (S/)"
              placeholder="Ej: 50"
              value={workerPrice}
              onChange={(e) => {
                const value = e.target.value ? Number(e.target.value) : "";
                setValue("worker_price", value);
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

          {/* Botón */}
          <Grid item xs={12} md={2}>
            <Button
              variant="contained"
              fullWidth
              startIcon={<Add />}
              onClick={() => {
                const success = handleAddWorker(workerPrice, workerHours);
                if (success) resetForm();
              }}
              disabled={
                !watch("worker_id") ||
                !watch("worker_hours") ||
                !watch("worker_price")
              }
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

      {/* Resumen de trabajadores asignados */}
      <Typography fontSize={15} sx={{ mt: 2, mb: 1 }}>
        Trabajadores Asignados ({assignedWorkers.length})
      </Typography>

      {assignedWorkers.length > 0 ? (
        assignedWorkers.map((trabajador, index) => (
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
              {/* Encabezado: nombre + tipo */}
              <Grid item xs={6}>
                <Typography fontWeight={600}>{trabajador.first_name}, {trabajador.last_name}</Typography>
                <Box
                  display="flex"
                  flexDirection={!isSm ? "column" : "row"}
                  gap={1}
                  mt={1}
                  sx={{ alignItems: "flex-start" }}
                >
                  <Chip label={trabajador.worker_type_name} size="small" />
                </Box>
              </Grid>

              {/* Precio */}
              <Grid item xs={6} textAlign="right">
                <Typography fontSize={14}>
                  S/ {trabajador.worker_price}/hora × {trabajador.worker_hours}h
                </Typography>
                <Typography fontWeight={600} color="green">
                  S/. {trabajador.worker_price * trabajador.worker_hours}
                </Typography>
                <IconButton
                  size="small"
                  color="error"
                  sx={{ ml: 1 }}
                  onClick={() => {
                    const updatedWorkers = assignedWorkers.filter(
                      (_, i) => i !== index
                    );
                    setAssignedWorkers(updatedWorkers);
                  }}
                >
                  <Delete fontSize="small" />
                </IconButton>
              </Grid>
            </Grid>
          </Box>
        ))
      ) : (
        <Typography fontSize={14} color="text.secondary" align="center" my={5}>
          No hay trabajadores asignados aún
        </Typography>
      )}

      {/* Total */}
      {assignedWorkers.length > 0 && (
        <Typography textAlign="right" fontWeight={600} color="green">
          Total Trabajadores: S/{" "}
          {assignedWorkers
            .reduce(
              (acc, trabajador) =>
                acc + trabajador.worker_price * trabajador.worker_hours,
              0
            )
            .toFixed(2)}
        </Typography>
      )}
    </Box>
  );
};
