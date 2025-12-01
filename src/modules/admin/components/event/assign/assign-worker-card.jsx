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
import { Add, Delete, Work } from "@mui/icons-material";
import { useScreenSizes } from "../../../../../shared/constants/screen-width";
import { useMemo } from "react";
import dayjs from "dayjs";

export const AssignWorkerCard = ({
  isDark,
  workerTypes,
  assignedWorkerTypes,
  addWorkerType,
  removeWorkerType,
  watch,
  setValue,
  startAppendWorkerType,
  from,
  to,
  datesReady,
  guardDates,
}) => {
  const { isSm } = useScreenSizes();

  const calculatedHours = useMemo(() => {
    if (!from || !to) return 1;
    const start = dayjs(from);
    const end = dayjs(to);
    const diff = end.diff(start, "hour", true);
    return Math.max(1, Math.ceil(diff));
  }, [from, to]);

  const resetForm = () => {
    setValue("worker_type_id", "");
    setValue("worker_price", "");
    setValue("worker_quantity", 1);
  };

  const workerTypeId = watch("worker_type_id");
  const workerQuantity = watch("worker_quantity");
  const workerPrice = watch("worker_price");

  const selectedWorkerType = useMemo(
    () => workerTypes.find((w) => w._id === workerTypeId),
    [workerTypes, workerTypeId]
  );

  const datesMissing = !datesReady || !from || !to;

  return (
    <Box sx={{ p: 3, borderRadius: 3, bgcolor: isDark ? "#1f1e1e" : "#f5f5f5", mb: 2 }}>
      {/* Título */}
      <Box display="flex" alignItems="center" mb={2} gap={1}>
        <Work sx={{ mt: "2px" }} />
        <Typography sx={{ fontSize: 20, fontWeight: 500 }}>
          Asignación de Trabajadores
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
          {/* Tipo de Trabajador */}
          <Grid item xs={12} md={4.5}>
            <FormControl fullWidth>
              <InputLabel id="worker-type-label" shrink>
                Tipo de Trabajador
              </InputLabel>
              <Select
                labelId="worker-type-label"
                value={workerTypeId || ""}
                onChange={(e) => {
                  setValue("worker_type_id", e.target.value, { shouldValidate: true });
                }}
                inputProps={{ name: "worker_type_id" }}
                sx={{ height: 60 }}
                displayEmpty
                disabled={datesMissing}
              >
                <MenuItem value="">
                  <em>Seleccione el tipo</em>
                </MenuItem>
                {workerTypes.map((type) => (
                  <MenuItem key={type._id} value={type._id}>
                    <Typography fontWeight={500}>{type.name}</Typography>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Cantidad de Trabajadores */}
          <Grid item xs={12} md={4.5}>
            <TextField
              label="Cantidad de Trabajadores"
              placeholder="Ej: 1"
              type="number"
              value={workerQuantity || ""}
              onChange={(e) => setValue("worker_quantity", Number(e.target.value))}
              fullWidth
              InputLabelProps={{ shrink: true }}
              sx={{ "& .MuiInputBase-root": { height: 60 } }}
            />
          </Grid>

          {/* Precio por hora */}
          <Grid item xs={12} md={3}>
            <TextField
              label="Precio por hora por Trabajador (S/)"
              value={workerPrice || ""}
              onChange={(e) => setValue("worker_price", e.target.value)}
              placeholder="Ej: S/. 100"
              fullWidth
              InputLabelProps={{ shrink: true }}
              sx={{ "& .MuiInputBase-root": { height: 60 } }}
            />
          </Grid>

          {/* Botón */}
          <Grid item xs={12} md={2}>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={async () => {
                if (!guardDates()) return;
                await startAppendWorkerType({
                  selectedWorkerType,
                  workerQuantity,
                  workerPrice,
                  workerHours: calculatedHours,
                  assignedWorkerTypes, 
                  append: addWorkerType,
                  onSuccess: resetForm,
                });
              }}
              disabled={!workerQuantity || !workerPrice || !selectedWorkerType}
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
        Trabajadores Asignados 
      </Typography>

      {assignedWorkerTypes.length > 0 ? (
        assignedWorkerTypes.map((wt, index) => (
          <Box
            key={wt.id}
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
                  Tipo de Trabajador: {wt.worker_type_name}
                </Typography>
                <Box
                  display="flex"
                  flexDirection={!isSm ? "column" : "row"}
                  gap={1}
                  mt={1}
                  sx={{ alignItems: "flex-start" }}
                >
                  <Chip label={"Cantidad: " + wt.worker_quantity} size="small" />
                </Box>
              </Grid>

              <Grid item xs={6} textAlign="right">
                <Typography fontSize={14}>
                  {wt.worker_quantity} trabajador(es) x S/. {wt.worker_price}/hora × {wt.worker_hours}h
                </Typography>
                <Typography fontWeight={600} color="green">
                  S/. {Number(wt.worker_price) * Number(wt.worker_hours) * Number(wt.worker_quantity).toFixed(2)}
                </Typography>
                <IconButton size="small" color="error" sx={{ ml: 1 }} onClick={() => removeWorkerType(index)}>
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

      {assignedWorkerTypes.length > 0 && (
        <Typography textAlign="right" fontWeight={600} color="green">
          Total Trabajadores: S/{" "}
          {assignedWorkerTypes
            .reduce((acc, w) => acc + Number(w.worker_price) * Number(w.worker_hours) * Number(w.worker_quantity), 0)
            .toFixed(2)}
        </Typography>
      )}
    </Box>
  );
};
