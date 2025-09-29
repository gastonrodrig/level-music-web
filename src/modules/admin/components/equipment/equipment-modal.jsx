import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  FormHelperText,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import dayjs from "dayjs";
import { useEquipmentStore } from "../../../../hooks";

export const EquipmentModal = ({
  open,
  onClose,
  equipment = {},
  setEquipment,
  loading,
}) => {
  const isEditing = !!equipment?._id;
  const { startCreateEquipment, startUpdateEquipment } = useEquipmentStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm({
    mode: "onBlur",
  });

  const [showLastMaintenanceDate, setShowLastMaintenanceDate] = useState(
    !!equipment?.last_maintenance_date
  );

  useEffect(() => {
    if (open) {
      const today = new Date().toISOString().split("T")[0];
      
      let last = '';
      if (equipment.last_maintenance_date) {
        last = new Date(equipment.last_maintenance_date)
          .toISOString()
          .split('T')[0];
      }

      let next = today;
      if (equipment.next_maintenance_date) {
        next = new Date(equipment.next_maintenance_date)
          .toISOString()
          .split('T')[0];
      }

      reset({
        name: equipment.name ?? '',
        description: equipment.description ?? '',
        equipment_type: equipment.equipment_type ?? 'Sonido',
        maintenance_interval_days: equipment.maintenance_interval_days ?? 0,
        last_maintenance_date: last,
        next_maintenance_date: next,
      });

      setShowLastMaintenanceDate(!!last);
    }
  }, [open, reset, equipment]);

  useEffect(() => {
    const intervalDays = parseInt(watch("maintenance_interval_days"), 10);
    const lastMaintenanceDate = watch("last_maintenance_date");

    if (!isNaN(intervalDays) && intervalDays >= 30) {
      if (showLastMaintenanceDate && lastMaintenanceDate) {
        const lastDate = dayjs(lastMaintenanceDate);
        const nextDate = lastDate.add(intervalDays, 'day');
        setValue("next_maintenance_date", nextDate.format("YYYY-MM-DD"));
      } else {
        const today = dayjs();
        const nextDate = today.add(intervalDays, 'day');
        setValue("next_maintenance_date", nextDate.format("YYYY-MM-DD"));
      }
    } else {
      setValue("next_maintenance_date", "");
    }
  }, [
    watch("maintenance_interval_days"),
    watch("last_maintenance_date"),
    showLastMaintenanceDate,
    setValue
  ]);

  const onSubmit = async (data) => {
    try {
      if (!showLastMaintenanceDate) delete data.last_maintenance_date;
      const success = isEditing
        ? await startUpdateEquipment(equipment._id, data)
        : await startCreateEquipment(data);
      if (success) {
        setEquipment(data); 
        onClose();
      } 
    } catch (error) {
      console.log(error)
    }
  };

  const isButtonDisabled = useMemo(() => loading, [loading]);

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: { xs: "90%", sm: 500 },
          bgcolor: "background.paper",
          borderRadius: 4,
          boxShadow: 24,
          p: 4,
        }}
      >
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={3}
        >
          <Typography variant="h6" fontWeight={600}>
            {isEditing ? "Editar equipo" : "Agregar equipo"}
          </Typography>
          <IconButton onClick={onClose}>
            <Close />
          </IconButton>
        </Box>

        <Box display="flex" gap={2} mb={2} sx={{ flexDirection: "column" }}>
          {/* Nombre */}
          <TextField
            label="Nombre"
            fullWidth
            {...register("name", {
              required: "El nombre es obligatorio",
            })}
            error={!!errors.name}
            helperText={errors.name?.message}
          />

          {/* Descripción */}
          <TextField
            label="Descripción"
            fullWidth
            multiline
            minRows={4}
            {...register("description", {
              required: "La descripción es obligatoria",
            })}
            error={!!errors.description}
            helperText={errors.description?.message}
          />

          {/* Tipo de equipo */}
          <FormControl fullWidth error={!!errors.equipment_type}>
            <InputLabel id="type-label">Tipo de equipo</InputLabel>
            <Select
              labelId="type-label"
              value={watch("equipment_type") || "Sonido"}
              {...register("equipment_type", {
                required: "Selecciona un tipo de equipo",
              })}
              onChange={(e) => setValue("equipment_type", e.target.value)}
            >
              <MenuItem value="Sonido">Sonido</MenuItem>
              <MenuItem value="Luz">Luz</MenuItem>
            </Select>
            <FormHelperText>{errors.equipment_type?.message}</FormHelperText>
          </FormControl>

          {/* Intervalo de mantenimiento */}
          <TextField
            label="Intervalo de mantenimiento (días)"
            type="number"
            fullWidth
            {...register("maintenance_interval_days", {
              required: "El intervalo de mantenimiento es obligatorio",
              valueAsNumber: true,
              min: {
                value: 30,
                message: "El intervalo debe ser de al menos 30 días",
              },
              validate: value =>
                Number.isInteger(value) || "Debe ingresar un número válido",
            })}
            error={!!errors.maintenance_interval_days}
            helperText={errors.maintenance_interval_days?.message}
          />

          {/* Última fecha de mantenimiento */}
          { (!isEditing || equipment.maintenance_count <= 1) && (
            <FormControlLabel
              control={
                <Checkbox
                  checked={showLastMaintenanceDate}
                  onChange={(e) => {
                    setShowLastMaintenanceDate(e.target.checked);
                    if (!e.target.checked) setValue("last_maintenance_date", "");
                  }}
                />
              }
              label="¿Registrar última fecha de mantenimiento? Si no la recuerda, se usará la fecha actual."
            />
          )}

          {showLastMaintenanceDate && (
            <DemoContainer components={["DatePicker"]}>
              <DatePicker
                label="Última fecha de mantenimiento"
                value={
                  watch("last_maintenance_date") ? dayjs(watch("last_maintenance_date")) : null
                }
                onChange={(date) => {
                  const formatted = date ? date.format("YYYY-MM-DD") : "";
                  setValue("last_maintenance_date", formatted);
                }}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    ...register("last_maintenance_date", {
                      required: "La fecha es obligatoria"
                    }),
                    error: !!errors.last_maintenance_date,
                    helperText: errors.last_maintenance_date?.message ?? "",
                  },
                }}
              />
            </DemoContainer>
          )}

          {/* Próxima fecha de mantenimiento */}
          <DemoContainer components={["DatePicker"]}>
            <DatePicker
              label="Próxima fecha de mantenimiento"
              value={watch("next_maintenance_date") ? dayjs(watch("next_maintenance_date")) : null}
              onChange={(date) => setValue("next_maintenance_date", date ? date.format("YYYY-MM-DD") : "")}
              slotProps={{ textField: { fullWidth: true } }}
              disabled
            />
          </DemoContainer>

        </Box>

        <Button
          type="submit"
          variant="contained"
          fullWidth
          disabled={isButtonDisabled}
          sx={{
            mt: 1,
            backgroundColor: "#212121",
            color: "#fff",
            textTransform: "none",
            py: 1.5,
            borderRadius: 2,
            fontWeight: 600,
          }}
        >
          {isEditing ? "Guardar cambios" : "Agregar"}
        </Button>
      </Box>
    </Modal>
  );
};
