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
  FormHelperText,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import { useEffect, useMemo, useState } from "react";
import { useMaintenanceStore, useEquipmentStore } from "../../../../hooks";
import { useForm } from "react-hook-form";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { formatDay } from "../../../../shared/utils";
import dayjs from "dayjs";

export const MaintenanceModal = ({ 
  open,
  onClose,
  maintenance = {},
  setMaintenance,
  loading,
}) => {
  const isChangingStatus = !!maintenance?._id; 
  const { startSearchingEquipment } = useEquipmentStore();
  const { startCreateMaintenance, startChangeMaintenanceStatus } = useMaintenanceStore();
  
  // Estados para el manejo de la funcionalidad de reagendado y cancelado
  const [showRescheduleOptions, setShowRescheduleOptions] = useState(false);

  const {
    register,
    unregister,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm({
    mode: "onBlur",
  });

  useEffect(() => {
    if (open) {
      reset({
        type: maintenance.type ?? "Correctivo",
        equipmentName: maintenance.equipment_name ?? "",
        description: maintenance.description ?? "",
      });
      // Resetear estados locales
      setShowRescheduleOptions(false);
    }
    if (isChangingStatus) {
      unregister('serialNumber');
      unregister('date');
    }
  }, [open, isChangingStatus, maintenance, reset, unregister]);

  const handleSerialChange = async (value) => {
    const formattedValue = value.toUpperCase();
    setValue("serialNumber", formattedValue);
    if (/^[A-Z0-9]{12}$/.test(formattedValue)) {
      const { ok, data } = await startSearchingEquipment(formattedValue);
      if (ok) {
        setValue("equipment_id", data._id);
        setValue("equipmentName", data.name);
        setValue("equipmentType", data.equipment_type);
      } else {
        setValue("equipment_id", "");
        setValue("equipmentName", "");
        setValue("equipmentType", "");
      }
    } else {
      setValue("equipment_id", "");
      setValue("equipmentName", "");
      setValue("equipmentType", "");
    }
  };

  const getStatusOptions = (currentStatus, maintenanceType) => {
    // Opciones base según el estado actual
    if (currentStatus === 'Programado') {
      // Para mantenimiento Correctivo: En Progreso
      if (maintenanceType === 'Correctivo') {
        return ['En Progreso'];
      }
      // Para mantenimiento Preventivo: En Progreso, Reagendar
      if (maintenanceType === 'Preventivo') {
        return ['En Progreso', 'Reagendar'];
      }
    }
    
    if (currentStatus === 'En Progreso') {
      return ['Finalizado'];
    }

    if (currentStatus === 'Reagendado') {
      // Desde Reagendado solo se puede regresar a En Progreso
      return ['En Progreso'];
    }
    
    return [];
  };

  // Función para mapear los valores mostrados en UI a los valores del backend
  const mapStatusToBackend = (uiStatus) => {
    const statusMap = {
      'Reagendar': 'Reagendado',
    };
    return statusMap[uiStatus] || uiStatus;
  };

  const onSubmit = async (data) => {
    console.log('🔍 Datos originales del formulario:', data);
    
    // Mapear el status a los valores que espera el backend
    const mappedData = {
      ...data,
      status: mapStatusToBackend(data.status)
    };

    console.log('📤 Datos que se enviarán al backend:', mappedData);

    try {
      const success = isChangingStatus
        ? await startChangeMaintenanceStatus(maintenance._id, mappedData)
        : await startCreateMaintenance(mappedData)
      if (success) {
        setMaintenance(data);
        onClose();
      }
    } catch (error) {
      console.error("Error in form submission:", error);
    }
  };

  const isButtonDisabled = useMemo(() => loading, [loading]);

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        key={open ? "mounted" : "unmounted"}
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
          mb={isChangingStatus ? 2 : 1}
        >
          <Typography variant="h6" fontWeight={600}>
            {isChangingStatus
              ? "Cambiar estado de mantenimiento"
              : "Registrar mantenimiento"}
          </Typography>
          <IconButton onClick={onClose}>
            <Close />
          </IconButton>
        </Box>

        {!isChangingStatus && (
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={2}
          >
            <Typography sx={{ fontWeight: 300, fontSize: 16 }}>
              Los mantenimientos registrados en el sistema son exclusivamente de
              tipo <span style={{ fontWeight: 600 }}>Correctivo</span>.
            </Typography>
          </Box>
        )}

        <Box display="flex" gap={2} mb={2} sx={{ flexDirection: "column" }}>
          {!isChangingStatus && (
            <>
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
                disabled={isChangingStatus}
              />

              {/* Numero de serie */}
              <TextField
                label="Número de serie del equipo"
                fullWidth
                {...register("serialNumber", {
                  required: "El número de serie es obligatorio",
                })}
                inputProps={{
                  maxLength: 12,
                  style: { textTransform: "uppercase" },
                }}
                onChange={(e) => handleSerialChange(e.target.value)}
                helperText={
                  errors.serialNumber?.message ??
                  "Debe tener 12 caracteres alfanuméricos en mayúsculas."
                }
                error={
                  !!errors.serialNumber ||
                  (!!watch("serialNumber") &&
                    watch("serialNumber") !== "" &&
                    !/^[A-Z0-9]{12}$/.test(watch("serialNumber")))
                }
                disabled={isChangingStatus}
              />

              {/* Nombre del equipo ingresado */}
              <TextField
                label="Nombre del Equipo"
                fullWidth
                value={watch("equipmentName") || ""}
                InputProps={{
                  readOnly: true,
                  style: {
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  },
                }}
                disabled
              />

              {/* Tipo del equipo ingresado */}
              <TextField
                label="Tipo del Equipos"
                fullWidth
                value={watch("equipmentType") || ""}
                InputProps={{
                  readOnly: true,
                  style: {
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  },
                }}
                disabled
              />


            </>
          )}

          {/* Estado del mantenimiento */}
          {isChangingStatus && (
            <>
              <Box mb={1}>
                <Typography mb={1} variant="body2">
                  <strong>Tipo:</strong> {maintenance.type}
                </Typography>
                <Typography mb={1} variant="body2">
                  <strong>Descripción:</strong> {maintenance.description}
                </Typography>
                <Typography mb={1} variant="body2">
                  <strong>Fecha:</strong> {formatDay(maintenance.date)}
                </Typography>
                <Typography mb={1} variant="body2">
                  <strong>Equipo:</strong> {maintenance.equipment_name}
                </Typography>
              </Box>
              <Box>
                <FormControl fullWidth error={!!errors.status}>
                  <InputLabel id="status-label">
                    Estado del mantenimiento
                  </InputLabel>
                  <Select
                    labelId="status-label"
                    value={watch("status") || ""}
                    displayEmpty
                    {...register("status", {
                      required: "Selecciona un estado de mantenimiento",
                    })}
                    onChange={(e) => {
                      setValue("status", e.target.value);
                      setShowRescheduleOptions(e.target.value === "Reagendar");
                      if (e.target.value !== "Reagendar") {
                        setValue("reagendation_reason", "");
                        setValue("rescheduled_date", "");
                      }
                    }}
                    renderValue={(selected) => selected}
                  >
                    {getStatusOptions(maintenance?.status, maintenance?.type).map((status) => (
                      <MenuItem key={status} value={status}>
                        {status}
                      </MenuItem>
                    ))}
                  </Select>
                  <FormHelperText>{errors.status?.message}</FormHelperText>
                </FormControl>
                

                {/* Opciones que aparecen cuando se selecciona "Reagendar" */}
                {showRescheduleOptions && (
                  <Box mt={2}>
                    {/* Campo de motivo de reagendamiento */}
                    <TextField
                      label="Motivo de reagendamiento"
                      fullWidth
                      multiline
                      minRows={2}
                      {...register("reagendation_reason", {
                        required: showRescheduleOptions ? "El motivo de reagendamiento es obligatorio" : false,
                      })}
                      error={!!errors.reagendation_reason}
                      helperText={errors.reagendation_reason?.message}
                      sx={{ mb: 2 }}
                    />
                    
                    {/* Campo de fecha de reagendamiento */}
                    <DemoContainer components={["DatePicker"]} >
                      <DatePicker
                        label="Fecha de reagendamiento"
                        value={watch("rescheduled_date") ? dayjs(watch("rescheduled_date")) : null}
                        onChange={(date) =>
                          setValue("rescheduled_date", date ? date.format("YYYY-MM-DD") : "")
                        }
                        minDate={
                          maintenance.type === 'Preventivo' 
                            ? dayjs(maintenance.date).subtract(7, 'day')
                            : dayjs().add(1, 'day')
                        }
                        maxDate={
                          maintenance.type === 'Preventivo' 
                            ? dayjs(maintenance.date).add(7, 'day')
                            : dayjs().add(7, 'day')
                        }
                        slotProps={{
                          textField: {
                            fullWidth: true,
                            ...register("rescheduled_date", {
                              required: showRescheduleOptions ? "La fecha de reagendamiento es obligatoria" : false,
                            }),
                            error: !!errors.rescheduled_date,
                            helperText: errors.rescheduled_date?.message ?? 
                              (maintenance.type === 'Preventivo' 
                                ? "Selecciona una fecha entre una semana antes y después de la fecha original"
                                : "Selecciona una fecha entre mañana y los próximos 7 días"),
                          },
                        }}
                      />
                    </DemoContainer>
                  </Box>
                )} 
              </Box>
            </>
          )}
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
          {isChangingStatus ? "Cambiar estado" : "Registrar mantenimiento"}
        </Button>
      </Box>
    </Modal>
  );
};
