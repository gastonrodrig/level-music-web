import { useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  IconButton,
  Modal,
  TextField,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Checkbox,
} from "@mui/material";
import { Close, Delete, Edit } from "@mui/icons-material";
import { useForm, useFieldArray } from "react-hook-form";
import { useServiceTypeStore } from "../../../../../hooks";
import { ServiceTypeFieldModal } from "./service-type-field-modal";

export const ServiceTypeModal = ({
  open,
  onClose,
  serviceType = {},
  setServiceType,
  loading,
}) => {
  const isEditing = Boolean(serviceType?._id);
  const { startCreateServiceType, startUpdateServiceType } =
    useServiceTypeStore();

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    mode: "onBlur",
    defaultValues: {
      name: "",
      description: "",
      status: "Activo",
      attributes: [],
    },
  });

  const { fields, append, remove, update } = useFieldArray({
    control,
    name: "attributes",
  });

  // Cargar valores al abrir para editar
  useEffect(() => {
    if (open) {
      reset({
        name: serviceType?.name ?? "",
        description: serviceType?.description ?? "",
        status: serviceType?.status ?? "Activo",
        attributes: serviceType?.attributes ?? [],
      });
    }
  }, [open, reset, serviceType]);

  const onSubmit = async (data) => {
    setServiceType(data);
    const success = isEditing
      ? await startUpdateServiceType(serviceType._id, data)
      : await startCreateServiceType(data);
    if (success) onClose();
  };

  const isDisabled = useMemo(() => loading, [loading]);

  // Control del modal secundario
  const [fieldModalOpen, setFieldModalOpen] = useState(false);
  const [selectedField, setSelectedField] = useState(null);
  const [editingIndex, setEditingIndex] = useState(null);

  const handleAddField = () => {
    setSelectedField(null);
    setEditingIndex(null);
    setFieldModalOpen(true);
  };

  const handleEditField = (field, index) => {
    setSelectedField(field);
    setEditingIndex(index);
    setFieldModalOpen(true);
  };

  const handleFieldSubmit = (fieldData, index = null) => {
    if (index !== null) {
      update(index, fieldData);
    } else {
      append(fieldData);
    }
    setFieldModalOpen(false);
  };

  return (
    <>
      <ServiceTypeFieldModal
        open={fieldModalOpen}
        onClose={() => setFieldModalOpen(false)}
        onSubmit={handleFieldSubmit}
        field={selectedField}
        index={editingIndex}
      />

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
          {/* Encabezado */}
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h6" fontWeight={600}>
              {isEditing ? "Editar Tipo de Servicio" : "Agregar Tipo de Servicio"}
            </Typography>
            <IconButton onClick={onClose}>
              <Close />
            </IconButton>
          </Box>

          {/* Campos básicos */}
          <Box display="flex" flexDirection="column" gap={2} mb={2}>
            <TextField
              label="Nombre"
              fullWidth
              {...register("name", { required: "El nombre es obligatorio" })}
              error={Boolean(errors.name)}
              helperText={errors.name?.message}
            />
            <TextField
              label="Descripción"
              fullWidth
              {...register("description", { required: "La descripción es obligatoria" })}
              error={Boolean(errors.description)}
              helperText={errors.description?.message}
            />
            <FormControl fullWidth error={Boolean(errors.status)}>
              <InputLabel id="status-label">Estado</InputLabel>
              <Select
                labelId="status-label"
                value={watch("status") || "Activo"}
                {...register("status", { required: "Selecciona un estado" })}
                onChange={(e) => setValue("status", e.target.value)}
              >
                <MenuItem value="Activo">Activo</MenuItem>
                <MenuItem value="Inactivo">Inactivo</MenuItem>
              </Select>
              <FormHelperText>{errors.status?.message}</FormHelperText>
            </FormControl>
          </Box>

          {/* Sección de atributos */}
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2} mt={1}>
            <Typography fontSize={18} fontWeight={500}>
              Estructura de campos
            </Typography>
            <Button
              variant="contained"
              size="small"
              onClick={handleAddField}
              sx={{
                backgroundColor: "#212121",
                color: "#fff",
                textTransform: "none",
                py: 1,
                px: 2,
                borderRadius: 2,
                fontWeight: 600,
              }}
            >
              + Agregar campo
            </Button>
          </Box>

          {/* Lista de atributos */}
          <Box
            sx={{
              maxHeight: 280,
              overflowY: "auto",
              display: "flex",
              flexDirection: "column",
              gap: 2,
              mb: 2,
            }}
          >
            {fields.length === 0 ? (
              <Typography textAlign="center" color="text.secondary" fontSize={14} my={3}>
                No hay campos disponibles. Agrega un nuevo campo.
              </Typography>
            ) : (
              fields.map((field, index) => (
                <Box
                  key={field.id}
                  sx={{
                    border: (theme) =>
                      `1px solid ${theme.palette.mode === "dark" ? "#494949" : "#C4C4C4"}`,
                    display: "flex",
                    justifyContent: "space-between",
                    borderRadius: 3,
                    gap: 2,
                    p: 2,
                  }}
                >
                  <Box display="flex" flexDirection="column" gap={1}>
                    <Typography fontWeight={600} fontSize={14}>
                      Campo
                    </Typography>
                    <Typography>{field.name}</Typography>
                    <Typography fontWeight={600} fontSize={14}>
                      Tipo de dato
                    </Typography>
                    <Typography>{field.type}</Typography>
                  </Box>
                  <Box display="flex" flexDirection="column" justifyContent="space-between">
                    <Box display="flex" gap={1} justifyContent="flex-end">
                      <IconButton onClick={() => handleEditField(field, index)} size="small">
                        <Edit fontSize="small" />
                      </IconButton>
                      <IconButton onClick={() => remove(index)} size="small">
                        <Delete fontSize="small" />
                      </IconButton>
                    </Box>
                    <Box display="flex" gap={1} alignItems="center">
                      <Typography fontWeight={600} fontSize={14}>
                        Requerido:
                      </Typography>
                      <Checkbox checked={field.required} disabled size="small" />
                    </Box>
                  </Box>
                </Box>
              ))
            )}
          </Box>

          {/* Botón enviar */}
          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={isDisabled}
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
    </>
  );
};