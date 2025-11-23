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
  Grid,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import { useWorkerTypeStore, useWorkerStore } from "../../../../hooks";
import { useMemo, useEffect } from "react";
import { useForm } from "react-hook-form";

export const WorkerModal = ({
  open,
  onClose,
  worker = {},
  setWorker,
  loading,
}) => {
  const isEditing = !!worker?._id;
  const { workerTypes } = useWorkerTypeStore();
  const { startCreateWorker, startUpdateWorker } = useWorkerStore();

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
        first_name: worker?.first_name ?? "",
        last_name: worker?.last_name ?? "",
        email: worker?.email ?? "",
        phone: worker?.phone ?? "",
        worker_type_id: worker?.worker_type?._id ?? worker?.worker_type ?? "",
        document_type: worker?.document_type ?? "",
        document_number: worker?.document_number ?? "",
        status: worker?.status,
        create_account: worker?.create_account ?? false,
      });
    }
  }, [open, reset, worker]);

  useEffect(() => {
    if (!isEditing) {
      unregister("status");
    }
  }, [isEditing, unregister]);

  const onSubmit = async (data) => {
    try {
      if (!isEditing) delete data.status;
      const success = isEditing
        ? await startUpdateWorker(worker._id, data)
        : await startCreateWorker(data);
      if (success) {
        setWorker(data);
        onClose();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const isButtonDisabled = useMemo(() => loading, [loading]);

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit, (error) => console.log(error))}
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: { xs: "90%", sm: 550 },
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
            {isEditing ? "Editar trabajador" : "Agregar trabajador"}
          </Typography>
          <IconButton onClick={onClose}>
            <Close />
          </IconButton>
        </Box>

        <Box mb={2}>
          <Grid container spacing={2}>
            {/* Tipo de Trabajador */}
            <Grid item xs={12}>
              <FormControl fullWidth error={!!errors.worker_type_id}>
                <InputLabel id="worker-type-label">
                  Tipo de Trabajador
                </InputLabel>
                <Select
                  labelId="worker-type-label"
                  label="Tipo de Trabajador"
                  value={watch("worker_type_id") || ""}
                  onChange={(e) => {
                    const selectedId = e.target.value;
                    setValue("worker_type_id", selectedId, {
                      shouldValidate: true,
                    });

                    // Buscar el objeto del tipo seleccionado
                    const selectedType = workerTypes.find(
                      (wt) => wt._id === selectedId
                    );
                    setValue("role", selectedType ? selectedType.name : "");
                  }}
                  inputProps={{ name: "worker_type_id" }}
                >
                  {workerTypes.map((type) => (
                    <MenuItem key={type._id} value={type._id}>
                      {type.name}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText>
                  {errors.worker_type_id?.message}
                </FormHelperText>
              </FormControl>
            </Grid>

            {/* Nombres */}
            <Grid item xs={12} sm={6}>
              <TextField
                label="Nombres"
                fullWidth
                {...register("first_name", {
                  required: "El nombre es obligatorio",
                })}
                error={!!errors.first_name}
                helperText={errors.first_name?.message}
              />
            </Grid>

            {/* Apellidos */}
            <Grid item xs={12} sm={6}>
              <TextField
                label="Apellidos"
                fullWidth
                {...register("last_name", {
                  required: "El apellido es obligatorio",
                })}
                error={!!errors.last_name}
                helperText={errors.last_name?.message}
              />
            </Grid>

            {/* Correo */}
            <Grid item xs={12} sm={6}>
              <TextField
                label="Correo"
                fullWidth
                {...register("email", {
                  required: "El correo es obligatorio",
                  pattern: {
                    value: /^[^@\s]+@[^@\s]+\.[^@\s]+$/,
                    message: "Correo inválido",
                  },
                })}
                error={!!errors.email}
                helperText={errors.email?.message}
                type="email"
              />
            </Grid>

            {/* Telefono */}
            <Grid item xs={12} sm={6}>
              <TextField
                label="Teléfono"
                fullWidth
                {...register("phone", {
                  required: "El teléfono es obligatorio",
                })}
                error={!!errors.phone}
                helperText={errors.phone?.message}
                type="tel"
                onInput={(e) => {
                  e.target.value = e.target.value.replace(/[^0-9+\-() ]/g, "");
                }}
              />
            </Grid>

            {/* Tipo de documento y Número de documento */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth error={!!errors.document_type}>
                <InputLabel id="document-type-label">
                  Tipo de Documento
                </InputLabel>
                <Select
                  labelId="document-type-label"
                  label="Tipo de Documento"
                  value={watch("document_type") || ""}
                  {...register("document_type", {
                    required: "Selecciona un tipo de documento",
                  })}
                  onChange={(e) => setValue("document_type", e.target.value)}
                >
                  <MenuItem value="Dni">Dni</MenuItem>
                  <MenuItem value="Ruc">Ruc</MenuItem>
                </Select>
                <FormHelperText>{errors.document_type?.message}</FormHelperText>
              </FormControl>
            </Grid>

            {/* Numero de documento */}
            <Grid item xs={12} sm={6}>
              <TextField
                label="Número de Documento"
                fullWidth
                {...register("document_number", {
                  required: "El número de documento es obligatorio",
                })}
                error={!!errors.document_number}
                helperText={errors.document_number?.message}
                onInput={(e) => {
                  e.target.value = e.target.value.replace(/[^0-9+\-() ]/g, "");
                }}
              />
            </Grid>

            {/* Estado */}
            {isEditing && (
              <Grid item xs={12}>
                <FormControl fullWidth error={!!errors.status}>
                  <InputLabel id="status-label">Estado</InputLabel>
                  <Select
                    labelId="status-label"
                    value={watch("status") || "Activo"}
                    {...register("status", {
                      required: "Selecciona un estado",
                    })}
                    onChange={(e) => setValue("status", e.target.value)}
                  >
                    <MenuItem value="Activo">Activo</MenuItem>
                    <MenuItem value="Inactivo">Inactivo</MenuItem>
                  </Select>
                  <FormHelperText>{errors.status?.message}</FormHelperText>
                </FormControl>
              </Grid>
            )}

            {/* Checkbox para crear cuenta */}
            {!isEditing && (
              <>
              <Grid item xs={12}>
                <FormControl error={!!errors.create_account} fullWidth>
                  <FormControlLabel
                    control={
                      <Checkbox
                        {...register("create_account")}
                        checked={watch("create_account") || false}
                        onChange={(e) =>
                          setValue("create_account", e.target.checked)
                        }
                      />
                    }
                    label="¿Crear cuenta de usuario?"
                  />
                  <FormHelperText>
                    {errors.create_account?.message ||
                      "Si se marca esta opción, se creará una cuenta de acceso para el trabajador"}
                  </FormHelperText>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <FormControl error={!!errors.create_account} fullWidth>
                  <FormControlLabel
                    control={
                      <Checkbox
                        {...register("create_account")}
                        checked={watch("create_account") || false}
                        onChange={(e) =>
                          setValue("create_account", e.target.checked)
                        }
                      />
                    }
                    label="¿Trabaja por horas?"
                  />
                </FormControl>
              </Grid>
              </>

            )}
          </Grid>
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
