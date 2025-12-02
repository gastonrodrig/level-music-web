import React, { useEffect, useState, useCallback } from "react";
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  List,
  ListItem,
  ListItemText,
  Paper,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import { useDispatch } from "react-redux";
import { showSnackbar } from "../../../../store";
import { useStorehouseMovementService } from "../../../../hooks/event/use-storehouse-movement-store";
import { useEquipmentStore } from "../../../../hooks/equipment/use-equipment-store";

export default function MovementsModal({ open, onClose, onCreated }) {
  const [mode, setMode] = useState("lookup");
  const [code, setCode] = useState("");
  const [assignations, setAssignations] = useState([]);
  const [movementType, setMovementType] = useState("");
  const [destination, setDestination] = useState("");
  const [manualSerial, setManualSerial] = useState("");
  const [manualEventCode, setManualEventCode] = useState("");
  const [equipmentId, setEquipmentId] = useState("");
  const [equipmentResults, setEquipmentResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const openSnackbar = useCallback(
    (msg) => dispatch(showSnackbar({ message: msg })),
    [dispatch]
  );

  const { lookupByStorehouseCode, createFromStorehouse, createManual } =
    useStorehouseMovementService();
  const { startSearchingEquipment } = useEquipmentStore();

  // Resetear estado solo al abrir el modal
  useEffect(() => {
    if (!open) return;
    setAssignations([]);
    setEquipmentId("");
    setManualSerial("");
    setManualEventCode("");
    setEquipmentResults([]);
    setCode("");
    setMovementType("");
    setDestination("");
  }, [open]);

  // ==========================
  // Lookup storehouse
  // ==========================
  const handleSearch = useCallback(async () => {
    if (!code) return openSnackbar("Ingrese el código de subtarea");
    setLoading(true);
    try {
      const data = await lookupByStorehouseCode(code);
      setAssignations(data.assignations || []);
    } catch {
      setAssignations([]);
      openSnackbar("Error buscando asignaciones");
    } finally {
      setLoading(false);
    }
  }, [code, lookupByStorehouseCode, openSnackbar]);

  // ==========================
  // Autocomplete equipos manual con debounce
  // ==========================
  useEffect(() => {
    if (!manualSerial || manualSerial.trim().length < 3) {
      setEquipmentResults([]);
      setEquipmentId("");
      return;
    }

    const timeout = setTimeout(() => {
    (async () => {
      try {
        const res = await startSearchingEquipment(manualSerial.trim().toUpperCase());
        setEquipmentResults(res?.data ? (Array.isArray(res.data) ? res.data : [res.data]) : []);
      } catch {
        setEquipmentResults([]);
      }
    })();
  }, 300);

  return () => clearTimeout(timeout);
  // ✅ Solo manualSerial como dependencia
}, [manualSerial]);

  // ==========================
  // Crear movimientos
  // ==========================
  const confirmCreate = useCallback(async () => {
    if (!movementType) return openSnackbar("Seleccione tipo de movimiento");
    if (!destination) return openSnackbar("Seleccione destino");
    setLoading(true);
    try {
      if (mode === "lookup") {
        if (!assignations.length)
          return openSnackbar("No hay asignaciones para crear movimientos");

        for (const a of assignations) {
					
          await createFromStorehouse({
            code,
            movement_type: movementType,
            destination,
          });
        }
        openSnackbar(`${assignations.length} movimientos creados`);
      } else {
        if (!manualSerial) return openSnackbar("Ingrese número de serie");
        if (!manualEventCode) return openSnackbar("Ingrese código de evento");
        if (!equipmentId) return openSnackbar("Seleccione un equipo válido");

        await createManual({
          serial_number: manualSerial,
          movement_type: movementType,
          event_code: manualEventCode,
          destination,
          equipment_id: equipmentId,
        });
        openSnackbar("Movimiento manual creado");
      }
      onCreated?.();
    } catch {
      openSnackbar("Error creando movimiento");
    } finally {
      setLoading(false);
    }
  }, [
    mode,
    assignations,
    code,
    movementType,
    destination,
    manualSerial,
    manualEventCode,
    equipmentId,
    createFromStorehouse,
    createManual,
    openSnackbar,
    onCreated,
  ]);

  const handleSelectEquipment = useCallback((eq) => {
    setManualSerial(eq.serial_number);
    setEquipmentId(eq._id);
    setEquipmentResults([]);
  }, []);

  if (!open) return null;

  return (
    <Modal open={!!open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: { xs: "90%", sm: 500 },
          bgcolor: "background.paper",
          borderRadius: 2,
          p: 3,
          maxHeight: "90vh",
          overflowY: "auto",
        }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Nuevo Movimiento</Typography>
          <IconButton onClick={onClose}>
            <Close />
          </IconButton>
        </Box>

        <Box display="flex" gap={2} mt={2} mb={2}>
          <Button
            variant={mode === "lookup" ? "contained" : "outlined"}
            onClick={() => setMode("lookup")}
          >
            Con código (subtarea)
          </Button>
          <Button
            variant={mode === "manual" ? "contained" : "outlined"}
            onClick={() => setMode("manual")}
          >
            Manual
          </Button>
        </Box>

        {mode === "lookup" && (
          <Box>
            <TextField
              fullWidth
              label="Código de subtarea"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              onBlur={handleSearch}
              sx={{ mb: 2 }}
            />
            {assignations.length > 0 ? (
              <Paper sx={{ maxHeight: 200, overflowY: "auto", mb: 2, p: 1 }}>
                <List dense>
                  {assignations.map((a) => (
                    <ListItem key={a._id}>
                      <ListItemText primary={a.equipment_name} />
                    </ListItem>
                  ))}
                </List>
              </Paper>
            ) : (
              <Typography color="text.secondary">
                Sin asignaciones para este código
              </Typography>
            )}
          </Box>
        )}

        {mode === "manual" && (
          <Box>
            <TextField
              fullWidth
              label="Número de Serie"
              value={manualSerial}
              onChange={(e) => setManualSerial(e.target.value.toUpperCase())}
              sx={{ mb: 1 }}
            />
            {equipmentResults.length > 0 && (
              <Paper sx={{ maxHeight: 150, overflowY: "auto", mb: 2 }}>
                <List dense>
                  {equipmentResults.map((eq) => (
                    <ListItem
                      button
                      key={eq._id}
                      onClick={() => handleSelectEquipment(eq)}
                    >
                      <ListItemText
                        primary={eq.name}
                        secondary={`Serial: ${eq.serial_number} | Tipo: ${eq.equipment_type}`}
                      />
                    </ListItem>
                  ))}
                </List>
              </Paper>
            )}
            <TextField
              fullWidth
              label="Código de Evento"
              value={manualEventCode}
              onChange={(e) => setManualEventCode(e.target.value)}
              sx={{ mb: 2 }}
            />
          </Box>
        )}

        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Tipo de Movimiento</InputLabel>
          <Select
            value={movementType}
            label="Tipo de Movimiento"
            onChange={(e) => setMovementType(e.target.value)}
          >
            <MenuItem value="Entrada de almacén">Entrada de almacén</MenuItem>
            <MenuItem value="Salida de almacén">Salida de almacén</MenuItem>
          </Select>
        </FormControl>

        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Destino</InputLabel>
          <Select
            value={destination}
            label="Destino"
            onChange={(e) => setDestination(e.target.value)}
          >
            <MenuItem value="Evento">Evento</MenuItem>
            <MenuItem value="Almacen">Almacen</MenuItem>
            <MenuItem value="Salida">Salida</MenuItem>
            <MenuItem value="Retorno">Retorno</MenuItem>
          </Select>
        </FormControl>

        <Box display="flex" gap={2}>
          <Button variant="contained" onClick={confirmCreate} disabled={loading}>
            {loading ? "Procesando..." : "Crear movimiento"}
          </Button>
          <Button variant="outlined" onClick={onClose}>
            Cancelar
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}
