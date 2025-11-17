import { useFormContext, Controller } from "react-hook-form";
import {
  Box,
  Typography,
  TextField,
  Grid,
  MenuItem,
  useTheme,
  FormControl,
  InputLabel,
  Select,
} from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import dayjs from "dayjs";
import { EventAvailable } from "@mui/icons-material";
import { useMemo } from "react";

export const EventDetailsForm = ({ eventTypes = [], setValue }) => {
  const {
    register,
    control,
    formState: { errors },
    watch,
  } = useFormContext();
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  const startTime = watch("startDateTime");
  const eventCategory = watch("event_category");
  const eventTypeId = watch("event_type_id");

  const filteredEventTypes = useMemo(() => {
    return (eventTypes || []).filter((et) => et?.category === eventCategory);
  }, [eventTypes, eventCategory]);

  return (
    <>
      <Box
        sx={{
          borderRadius: 2,
          borderColor: "divider",
          overflow: "hidden",
          mb: 3,
        }}
      >
        <Box
          sx={{
            bgcolor: isDark ? "#151515" : "#e0e0e0",
            p: 2,
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <EventAvailable />
          <Typography fontWeight={700}>Información del Evento</Typography>
        </Box>

        {/* Contenido más claro */}
        <Box sx={{ p: 3, bgcolor: isDark ? "#1f1e1e" : "#f5f5f5" }}>
          <Grid container spacing={2}>
            {/* === SELECTOR DE CATEGORÍA === */}
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel id="event-category-label" shrink>
                  Categoría
                </InputLabel>
                <Controller
                  name="event_category"
                  control={control}
                  rules={{ required: "La categoría es obligatoria" }}
                  render={({ field }) => (
                    <Select
                      labelId="event-category-label"
                      label="Categoría"
                      value={field.value || ""}
                      onChange={(e) => {
                        field.onChange(e.target.value);
                        // Limpiar tipo al cambiar categoría
                        setValue("event_type_id", "");
                      }}
                      inputProps={{ name: "event_category" }}
                      sx={{ height: 60 }}
                      displayEmpty
                      error={!!errors.event_category}
                    >
                      <MenuItem value="">
                        <em>Seleccione una categoría</em>
                      </MenuItem>
                      <MenuItem value="Social">Social</MenuItem>
                      <MenuItem value="Corporativo">Corporativo</MenuItem>
                    </Select>
                  )}
                />
                {errors?.event_category?.message && (
                  <Typography variant="caption" color="error">
                    {errors.event_category.message}
                  </Typography>
                )}
              </FormControl>
            </Grid>

            {/* === SELECTOR DE TIPO (filtrado por categoría) === */}
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel id="event-type-label" shrink>
                  Tipo de Evento
                </InputLabel>
                <Controller
                  name="event_type_id"
                  control={control}
                  rules={{ required: "El tipo de evento es obligatorio" }}
                  render={({ field }) => (
                    <Select
                      labelId="event-type-label"
                      label="Tipo de Evento"
                      value={field.value || ""}
                      onChange={(e) => {
                        const id = e.target.value;
                        field.onChange(id);
                        const selected = filteredEventTypes.find(
                          (et) => et._id === id
                        );
                        setValue(
                          "event_type_name",
                          selected ? selected.type : ""
                        );
                      }}
                      inputProps={{ name: "event_type_id" }}
                      sx={{ height: 60 }}
                      displayEmpty
                      disabled={!eventCategory} // Espera categoría
                      error={!!errors.event_type_id}
                    >
                      <MenuItem value="">
                        <em>
                          {!eventCategory
                            ? "Seleccione una categoría primero"
                            : "Seleccione un tipo"}
                        </em>
                      </MenuItem>

                      {filteredEventTypes.map((et) => (
                        <MenuItem key={et._id} value={et._id}>
                          <Box
                            sx={{ display: "flex", flexDirection: "column" }}
                          >
                            <Typography fontWeight={500}>{et.type}</Typography>
                            {et.description && (
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                {et.description}
                              </Typography>
                            )}
                          </Box>
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                />
                {errors?.event_type_id?.message && (
                  <Typography variant="caption" color="error">
                    {errors.event_type_id.message}
                  </Typography>
                )}
              </FormControl>
            </Grid>

            {/* Nombre del Evento */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Nombre del Evento"
                placeholder="Ej: Festival de Verano 2024"
                {...register("eventName", {
                  required: "El nombre es obligatorio",
                })}
                error={!!errors.eventName}
                helperText={errors.eventName?.message}
              />
            </Grid>

            {/* Descripción */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Descripción del Evento"
                placeholder="Describe brevemente el evento..."
                {...register("eventDescription", {
                  required: "La descripción es obligatoria",
                })}
                error={!!errors.eventDescription}
                helperText={errors.eventDescription?.message}
              />
            </Grid>

            {/* Fecha y hora de inicio */}
            <Grid item xs={12} md={6}>
              <Controller
                name="startDateTime"
                control={control}
                rules={{ required: "La fecha de inicio es obligatoria" }}
                render={({ field }) => (
                  <DateTimePicker
                    label="Fecha y Hora de Inicio"
                    value={field.value}
                    onChange={field.onChange}
                    minDateTime={dayjs().add(2, "day")}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        error: !!errors.startDateTime,
                        helperText: errors.startDateTime?.message,
                      },
                    }}
                  />
                )}
              />
            </Grid>

            {/* Fecha y hora de fin */}
            <Grid item xs={12} md={6}>
              <Controller
                name="endDateTime"
                control={control}
                rules={{
                  required: "La fecha de fin es obligatoria",
                  validate: (value) => {
                    if (!startTime || !value) return true;

                    // Debe ser posterior al inicio
                    if (!value.isAfter(startTime)) {
                      return "Debe ser posterior a la hora de inicio";
                    }

                    // Máximo 5 horas
                    const diffHours = value.diff(startTime, "hour", true);
                    if (diffHours > 5) {
                      return "El evento no puede durar más de 5 horas";
                    }

                    return true;
                  },
                }}
                render={({ field }) => (
                  <DateTimePicker
                    label="Fecha y Hora de Fin"
                    value={field.value}
                    onChange={field.onChange}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        error: !!errors.endDateTime,
                        helperText: errors.endDateTime?.message,
                      },
                    }}
                  />
                )}
              />
            </Grid>

            {/* Cantidad de Asistentes */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="number"
                label="Cantidad de Asistentes"
                placeholder="Ej: 100"
                {...register("attendeesCount", {
                  required: "Campo obligatorio",
                  min: { value: 1, message: "Debe ser al menos 1" },
                })}
                error={!!errors.attendeesCount}
                helperText={errors.attendeesCount?.message}
              />
            </Grid>

            {/* Tipo de lugar */}
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <Controller
                  name="placeType"
                  control={control}
                  rules={{ required: "Campo obligatorio" }}
                  render={({ field }) => (
                    <TextField
                      select
                      fullWidth
                      label="Tipo de Lugar"
                      {...field}
                      value={field.value ?? ""}
                      error={!!errors.placeType}
                      helperText={errors.placeType?.message}
                    >
                      <MenuItem value="Abierto">Abierto</MenuItem>
                      <MenuItem value="Cerrado">Cerrado</MenuItem>
                    </TextField>
                  )}
                />
              </FormControl>
            </Grid>

            {/* Tamaño del Lugar */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="number"
                label="Tamaño del Lugar (m²)"
                placeholder="Ej: 500"
                {...register("placeCapacity", {
                  required: "Campo obligatorio",
                })}
                error={!!errors.placeCapacity}
                helperText={errors.placeCapacity?.message}
              />
            </Grid>

            {/* Dirección Exacta */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Dirección Exacta"
                placeholder="Av. Principal 123, Distrito, Ciudad"
                {...register("exactAddress", { required: "Campo obligatorio" })}
                error={!!errors.exactAddress}
                helperText={errors.exactAddress?.message}
              />
            </Grid>

            {/* Referencia */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Referencia de Ubicación"
                placeholder="Ej: Frente al banco"
                {...register("placeReference", {
                  required: "Campo obligatorio",
                })}
                error={!!errors.placeReference}
                helperText={errors.placeReference?.message}
              />
            </Grid>
          </Grid>
        </Box>
      </Box>
    </>
  );
};
