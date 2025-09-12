import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
} from "@mui/material";
import { Close, Delete, Edit } from "@mui/icons-material";
import { useForm, useFieldArray } from "react-hook-form";
import { useEffect, useMemo, useState } from "react";
import {
  useEventFeaturedStore,
  useImageManager,
  useEventStore,
} from "../../../../../hooks";
import { EventFeaturedFieldModal } from "./event-featured-field-modal";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

export const EventFeaturedModal = ({
  open,
  onClose,
  eventFeatured = {},
  setEventFeatured,
  loading,
}) => {
  const isEditing = !!eventFeatured?._id;
  const { startSearchingEvent } = useEventStore();
  const { startCreateEventFeatured, startUpdateEventFeatured } =
    useEventFeaturedStore();

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    mode: "onBlur",
    defaultValues: {
      eventCode: "",
      title: "",
      featured_description: "",
      services: [],
      images: [],
    },
  });

  const {
    previews,
    setPreviews,
    urlsToFiles,
    handleImagesChange,
    handleRemoveImage,
    imageError,
    setImageError,
  } = useImageManager(watch, setValue);

  // Limpiar error de imagen al abrir/cerrar modal
  useEffect(() => {
    if (!open) setImageError("");
  }, [open, setImageError]);

  const handleCodeChange = async (value) => {
    const formattedValue = value.toUpperCase();
    setValue("eventCode", formattedValue);
    const { ok, data } = await startSearchingEvent(formattedValue);
    if (ok) {
      setValue("event_id", data._id);
      setValue("title", data.name ?? "");
    } else {
      setValue("event_id", "");
      setValue("title", "");
    }
  };

  const { fields, append, remove, update } = useFieldArray({
    control,
    name: "services",
  });

  useEffect(() => {
    if (open) {
      (async () => {
        const initialImages = eventFeatured?.images ?? [];
        const files = await urlsToFiles(initialImages);


        reset({
          eventCode: eventFeatured?.event_code ?? "",
          title: eventFeatured?.title ?? "",
          featured_description: eventFeatured?.featured_description ?? "",
          services: eventFeatured?.services ?? [],
          images: files,
          event_id: eventFeatured?.event_id ?? eventFeatured?.event?._id ?? "",
        });

        setPreviews(files.map((f) => URL.createObjectURL(f)));
      })();
    }
  }, [open, eventFeatured]);

  const onSubmit = async (data) => {
    // Log para depuración de event_id
    console.log('onSubmit event_id:', data.event_id, '| data:', data);

    const payload = {
      ...data,
      images: Array.from(data.images || []),
    };

    const success = isEditing
      ? await startUpdateEventFeatured(eventFeatured?._id, payload)
      : await startCreateEventFeatured(payload);

    if (success) {
      // Solo guardamos metadata serializable
      const safeImages = (data.images || []).map((file) => ({
        name: file.name,
        size: file.size,
        type: file.type,
        previewUrl: URL.createObjectURL(file),
      }));

      setEventFeatured({
        ...data,
        images: safeImages,
      });

      onClose();
    }
  };

  const isButtonDisabled = useMemo(() => loading, [loading]);

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

  const {
    ref: imagesRef,
    onChange: rhfImagesOnChange,
    ...imagesFieldRest
  } = register("images");

  const chunk = (arr, size) =>
    arr.reduce(
      (acc, _, i) =>
        i % size === 0 ? acc.concat([arr.slice(i, i + size)]) : acc,
      []
    );

  const groupsOf4 = chunk(previews, 4);

  return (
    <>
      <EventFeaturedFieldModal
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
            width: { xs: "90%", sm: 600 },
            bgcolor: "background.paper",
            borderRadius: 4,
            boxShadow: 24,
            p: 4,
            maxHeight: "90vh",
            overflowY: "auto",
          }}
        >
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={3}
          >
            <Typography variant="h6" fontWeight={600}>
              {isEditing
                ? "Editar Evento Destacado"
                : "Agregar Evento Destacado"}
            </Typography>
            <IconButton onClick={onClose}>
              <Close />
            </IconButton>
          </Box>

          <Box display="flex" flexDirection="column" gap={2} mb={3}>
            <TextField
              label="Código del evento"
              fullWidth
              {...register("eventCode", {
                required: "El código del evento es obligatorio",
                pattern: {
                  value: /^EVT-\d{8}-[A-Z0-9]{6}$/,
                  message:
                    "El código debe tener el formato EVT-YYYYMMDD-XXXXXX",
                },
              })}
              inputProps={{
                maxLength: 19,
                style: { textTransform: "uppercase" },
              }}
              onChange={(e) => handleCodeChange(e.target.value.toUpperCase())}
              helperText={
                errors.eventCode?.message ??
                "Formato esperado: EVT-YYYYMMDD-XXXXXX (ej: EVT-20231231-5F07RS)"
              }
              error={!!errors.eventCode}
            />

            <TextField
              label="Título del Evento"
              fullWidth
              value={watch("title") || ""}
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

            <TextField
              label="Descripción destacada"
              multiline
              rows={3}
              fullWidth
              {...register("featured_description")}
            />
          </Box>

          <Box mb={3}>
            <Typography fontWeight={500} mb={1}>
              Servicios incluidos
            </Typography>
            {fields.length === 0 ? (
              <Typography color="text.secondary" mb={2}>
                No hay servicios añadidos aún.
              </Typography>
            ) : (
              fields.map((field, index) => (
                <Box
                  key={field.id}
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                  mb={1}
                  p="15px"
                  bgcolor="background.paper"
                  boxShadow={1}
                   sx={{
                              
                                borderRadius: 1.5,
                                border: (theme) =>
                                  `1px solid ${
                                    theme.palette.mode === "dark"
                                      ? "#3c3c3c"
                                      : "#e0e0e0"
                                  }`,
                              }}
                >
                  <Box sx={{ maxWidth: '70%', flex: 1, overflow: 'hidden' }}>
                    <Typography fontWeight={500} sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {field.title || <span style={{ color: '#aaa' }}>[Sin título]</span>}
                    </Typography>
                    {field.description && (
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {field.description}
                      </Typography>
                    )}
                  </Box>
                  <Box>
                    <IconButton aria-label="Editar servicio" size="small" onClick={() => handleEditField(field, index)}>
                      <Edit fontSize="small" />
                    </IconButton>
                    <IconButton aria-label="Eliminar servicio" size="small" onClick={() => remove(index)}>
                      <Delete fontSize="small" />
                    </IconButton>
                  </Box>
                </Box>
              ))
            )}
            <Button variant="outlined" onClick={handleAddField} sx={{ mt: 2 }}>
              Agregar Servicio
            </Button>
          </Box>

          <Box mb={3}>
            <Typography fontWeight={500} mb={1}>
              Imágenes del evento
            </Typography>
            <Box sx={{ position: 'relative', display: 'inline-block', mb: 2 }}>
              <Button
                variant="outlined"
                component="label"
                sx={{ textTransform: 'none', fontWeight: 500 }}
              >
                ELEGIR IMÁGENES
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImagesChange}
                  style={{ display: 'none' }}
                />
              </Button>
            </Box>
            {imageError && (
              <Typography color="error" variant="body2" sx={{ mb: 1 , fontSize: '1rem', fontWeight: 500}}>
                {imageError}
              </Typography>
            )}

            {previews.length > 0 && (
              <Swiper
                modules={[Pagination]}
                pagination={{ clickable: true }}
                spaceBetween={10}
                slidesPerView={1}
              >
                {groupsOf4.map((group, gi) => (
                  <SwiperSlide key={gi}>
                    <Box
                      display="grid"
                      gridTemplateColumns="repeat(4,1fr)"
                      gap={1}
                    >
                      {group.map((src, i) => {
                        const globalIndex = gi * 4 + i;
                        return (
                          <Box
                            key={i}
                            sx={{
                              position: "relative",
                              width: "100%",
                              pt: "100%",
                            }}
                          >
                            <Box
                              component="img"
                              src={src}
                              alt={`preview-${i}`}
                              sx={{
                                position: "absolute",
                                top: 0,
                                left: 0,
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                                borderRadius: 1.5,
                                border: (theme) =>
                                  `1px solid ${
                                    theme.palette.mode === "dark"
                                      ? "#3c3c3c"
                                      : "#e0e0e0"
                                  }`,
                              }}
                            />
                            <IconButton
                              size="small"
                              sx={{
                                position: "absolute",
                                top: 4,
                                right: 4,
                                bgcolor: "rgba(0,0,0,0.5)",
                                "&:hover": { bgcolor: "rgba(0,0,0,0.7)" },
                              }}
                              onClick={() => handleRemoveImage(globalIndex)}
                            >
                              <Close fontSize="small" sx={{ color: "#fff" }} />
                            </IconButton>
                          </Box>
                        );
                      })}
                    </Box>
                  </SwiperSlide>
                ))}
              </Swiper>
            )}
          </Box>

          <Box display="flex" justifyContent="flex-end" gap={2}>
            <Button
              variant="outlined"
              onClick={onClose}
              disabled={isButtonDisabled}
             
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={isButtonDisabled}
            >
              {isEditing ? "Actualizar" : "Crear"}
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
};
