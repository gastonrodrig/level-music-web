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
import { useEventFeaturedStore } from "../../../../../hooks";
import { EventFeaturedFieldModal } from "./event-featured-field-modal";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { useEventStore } from "../../../../../hooks/event/use-event-store";

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

  // Previews (File objects o URLs temporales)
  const [previews, setPreviews] = useState([]);

  // Convierte URLs a File/Blob locales
  const urlsToFiles = async (urls) => {
    const files = await Promise.all(
      urls.map(async (url, i) => {
        // Fetch la URL
        const res = await fetch(url);
        const blob = await res.blob();
        const filename = url.split("/").pop(); // Nombre del archivo
        const file = new File([blob], filename, { type: blob.type });
        return file;
      })
    );
    return files;
  };

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
        });
        setPreviews(files.map((f) => URL.createObjectURL(f)));
      })();
    }
  }, [open, reset, eventFeatured]);

  // Limpia blobs al desmontar/cambiar
  useEffect(() => {
    return () => {
      previews.forEach((u) => {
        if (typeof u === "string" && u.startsWith("blob:")) {
          URL.revokeObjectURL(u);
        }
      });
    };
  }, [previews]);

  const handleImagesChange = (e) => {
    const files = Array.from(e.target.files || []);
    const localUrls = files.map((f) => URL.createObjectURL(f));
    setPreviews((prev) => [...prev, ...localUrls]);

    // Añadir los files a RHF
    const currentFiles = watch("images") || [];
    setValue("images", [...currentFiles, ...files], { shouldValidate: true });
  };

  const handleRemoveImage = (index) => {
    // Actualiza previews
    setPreviews((prev) => prev.filter((_, i) => i !== index));
    // Actualiza RHF images
    const currentFiles = watch("images") || [];
    setValue(
      "images",
      currentFiles.filter((_, i) => i !== index),
      { shouldValidate: true }
    );
  };

  const onSubmit = async (data) => {
    const payload = {
      ...data,
      images: Array.from(data.images || []), // FileList -> File[]
    };

    const success = isEditing
      ? await startUpdateEventFeatured(eventFeatured._id, payload)
      : await startCreateEventFeatured(payload);

    if (success) {
      setEventFeatured(data);
      onClose();
    }
  };

  const isButtonDisabled = useMemo(() => loading, [loading]);

  // Modal de servicio (añadir/editar)
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

  // RHF bridge para input file con onChange custom
  const {
    ref: imagesRef,
    onChange: rhfImagesOnChange,
    ...imagesFieldRest
  } = register("images");

  // --- Helpers para el carrusel 4x ---
  const chunk = (arr, size) =>
    arr.reduce(
      (acc, _, i) =>
        i % size === 0 ? acc.concat([arr.slice(i, i + size)]) : acc,
      []
    );

  const groupsOf4 = chunk(previews, 4); // 4 imágenes por slide

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
          {/* Header */}
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h6" fontWeight={600}>
              {isEditing ? "Editar Evento Destacado" : "Agregar Evento Destacado"}
            </Typography>
            <IconButton onClick={onClose}>
              <Close />
            </IconButton>
          </Box>

          {/* Título y descripción */}
          <Box display="flex" flexDirection="column" gap={2} mb={3}>
            <TextField
              label="Código del evento"
              fullWidth
              {...register("eventCode", {
                required: "El código del evento es obligatorio",
                pattern: {
                  value: /^EVT-\d{8}-[A-Z0-9]{6}$/,
                  message: "El código debe tener el formato EVT-YYYYMMDD-XXXXXX",
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

          {/* Servicios incluidos */}
          <Box mb={3}>
            <Typography fontWeight={500} mb={1}>
              Servicios incluidos
            </Typography>
            {fields.map((field, index) => (
              <Box
                key={field.id}
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                mb={1}
              >
                <Typography>{field.name}</Typography>
                <Box>
                  <IconButton onClick={() => handleEditField(field, index)}>
                    <Edit fontSize="small" />
                  </IconButton>
                  <IconButton onClick={() => remove(index)}>
                    <Delete fontSize="small" />
                  </IconButton>
                </Box>
              </Box>
            ))}
            <Button variant="outlined" onClick={handleAddField}>
              Agregar Servicio
            </Button>
          </Box>

          {/* Imágenes */}
          <Box mb={3}>
            <Typography fontWeight={500} mb={1}>
              Imágenes del evento
            </Typography>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => {
                handleImagesChange(e);
                rhfImagesOnChange(e);
              }}
              ref={imagesRef}
              style={{ display: "block", marginBottom: 12 }}
              {...imagesFieldRest}
            />

            {previews.length > 0 && (
              <Swiper
                modules={[Pagination]}
                pagination={{ clickable: true }}
                spaceBetween={10}
                slidesPerView={1}
              >
                {groupsOf4.map((group, gi) => (
                  <SwiperSlide key={gi}>
                    <Box display="grid" gridTemplateColumns="repeat(4,1fr)" gap={1}>
                      {group.map((src, i) => {
                        const globalIndex = gi * 4 + i;
                        return (
                          <Box key={i} sx={{ position: "relative", width: "100%", pt: "100%" }}>
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

          {/* Botones */}
          <Box display="flex" justifyContent="flex-end" gap={2}>
            <Button variant="outlined" onClick={onClose} disabled={isButtonDisabled}>
              Cancelar
            </Button>
            <Button type="submit" variant="contained" disabled={isButtonDisabled}>
              {isEditing ? "Actualizar" : "Crear"}
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
};
