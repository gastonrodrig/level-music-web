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

// --- Firebase imports ---
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";

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
      title: "",
      featured_description: "",
      services: [],
      images: [],
    },
  });

  // Estado para URLs de imágenes persistentes (Firebase)
  const [imageUrls, setImageUrls] = useState([]);
  const [uploading, setUploading] = useState(false);

  const previews = imageUrls;

  // Al abrir el modal, carga imágenes existentes (modo edición)
  useEffect(() => {
    if (open) {
      reset({
        title: eventFeatured?.title ?? "",
        featured_description: eventFeatured?.featured_description ?? "",
        services: eventFeatured?.services ?? [],
        images: eventFeatured?.images ?? [],
      });
      setImageUrls(eventFeatured?.images ?? []);
    }
  }, [open, reset, eventFeatured]);

  // RHF bridge para input file con onChange custom
  const {
    ref: imagesRef,
    onChange: rhfImagesOnChange,
    ...imagesFieldRest
  } = register("images");

  // Subir imágenes a Firebase Storage y actualizar el estado
  const handleImagesChange = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setUploading(true);
    const storage = getStorage();

    const uploadPromises = files.map(async (file) => {
      const ext = file.name.split(".").pop();
      const uniqueName = `event-featured/${Date.now()}-${Math.floor(
        Math.random() * 1000000
      )}.${ext}`;
      const storageRef = ref(storage, uniqueName);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      return url;
    });

    try {
      const newUrls = await Promise.all(uploadPromises);
      const updatedUrls = [...imageUrls, ...newUrls];
      setImageUrls(updatedUrls);
      setValue("images", updatedUrls, { shouldValidate: true });
    } finally {
      setUploading(false);
    }
  };

  // Eliminar imagen de Firebase y del estado
  const handleRemoveImage = async (urlToRemove) => {
    setUploading(true);
    try {
      const matches = urlToRemove.match(/\/o\/(.*?)\?alt/);
      if (matches && matches[1]) {
        const path = decodeURIComponent(matches[1]);
        const storage = getStorage();
        const imageRef = ref(storage, path);
        await deleteObject(imageRef);
      }
    } catch (err) {
      // Ignora el error pero elimina igual del estado
    }
    const updatedUrls = imageUrls.filter((url) => url !== urlToRemove);
    setImageUrls(updatedUrls);
    setValue("images", updatedUrls, { shouldValidate: true });
    setUploading(false);
  };

  const { fields, append, remove, update } = useFieldArray({
    control,
    name: "services",
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

  const onSubmit = async (data) => {
    const payload = {
      ...data,
      images: imageUrls,
    };

    const success = isEditing
      ? await startUpdateEventFeatured(eventFeatured._id, payload)
      : await startCreateEventFeatured(payload);

    if (success) {
      setEventFeatured(data);
      onClose();
    }
  };

  const isButtonDisabled = useMemo(
    () => loading || uploading,
    [loading, uploading]
  );

  // Modal de servicio
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

  // Helpers para carrusel
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
          {/* Header */}
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={3}
          >
            <Typography variant="h6" fontWeight={600}>
              {isEditing ? "Editar Evento Destacado" : "Agregar Evento Destacado"}
            </Typography>
            <IconButton onClick={onClose}>
              <Close />
            </IconButton>
          </Box>

          {/* Código + Título + Descripción */}
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

          {/* Servicios */}
          <Box mb={3}>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mb={2}
            >
              <Typography fontWeight={600}>Servicios incluidos</Typography>
              <Button
                variant="contained"
                size="small"
                onClick={handleAddField}
                disabled={isButtonDisabled}
                sx={{
                  backgroundColor: "#212121",
                  color: "#fff",
                  textTransform: "none",
                  borderRadius: 2,
                }}
              >
                + Añadir servicio
              </Button>
            </Box>

            {fields.length === 0 ? (
              <Typography
                color="text.secondary"
                fontSize={14}
                textAlign="center"
                my={2}
              >
                No hay servicios agregados.
              </Typography>
            ) : (
              fields.map((field, index) => (
                <Box
                  key={field.id}
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  border="1px solid #494949"
                  borderRadius={2}
                  p={2}
                  mb={1}
                >
                  <Box>
                    <Typography fontWeight={600}>{field.title}</Typography>
                    <Typography fontSize={14} color="text.secondary">
                      {field.description}
                    </Typography>
                  </Box>
                  <Box display="flex" gap={1}>
                    <IconButton
                      size="small"
                      onClick={() => handleEditField(field, index)}
                    >
                      <Edit fontSize="small" />
                    </IconButton>
                    <IconButton size="small" onClick={() => remove(index)}>
                      <Delete fontSize="small" />
                    </IconButton>
                  </Box>
                </Box>
              ))
            )}
          </Box>

          {/* Imágenes */}
          <Box mb={1}>
            <Typography fontWeight={600} mb={1}>
              Imágenes
            </Typography>

            <Button
              variant="outlined"
              component="label"
              sx={{ mr: 2 }}
              disabled={uploading}
            >
              Seleccionar imágenes
              <input
                type="file"
                hidden
                multiple
                ref={imagesRef}
                {...imagesFieldRest}
                onChange={async (e) => {
                  rhfImagesOnChange(e);
                  await handleImagesChange(e);
                }}
              />
            </Button>

            <Typography
              variant="caption"
              sx={{ display: "block", mt: 1, color: "text.secondary" }}
            >
              La primera imagen se tomará como <strong>portada</strong>; las demás
              se enviarán a la <strong>galería</strong>.
            </Typography>
          </Box>

          {/* Carrusel */}
          {previews.length > 0 && (
            <Box
              mt={2}
              sx={{
                "& .swiper-pagination-bullet": {
                  width: 8,
                  height: 8,
                  bgcolor: "text.disabled",
                  opacity: 1,
                },
                "& .swiper-pagination-bullet-active": {
                  bgcolor: "primary.main",
                },
              }}
            >
              <Swiper
                modules={[Pagination]}
                pagination={{ clickable: true }}
                slidesPerView={1}
                spaceBetween={12}
                grabCursor
                loop={groupsOf4.length > 1}
                style={{ width: "100%", maxWidth: 540, borderRadius: 12 }}
              >
                {groupsOf4.map((group, gi) => (
                  <SwiperSlide key={gi}>
                    <Box
                      display="grid"
                      gridTemplateColumns="repeat(4, 1fr)"
                      gap={1}
                      sx={{
                        width: "100%",
                        height: 170,
                        "@media (max-width:600px)": {
                          gridTemplateColumns: "repeat(2, 1fr)",
                          height: 200,
                        },
                      }}
                    >
                      {group.map((src, i) => (
                        <Box
                          key={`${gi}-${i}`}
                          sx={{
                            position: "relative",
                            width: "100%",
                            height: "100%",
                          }}
                        >
                          <Box
                            component="img"
                            src={src}
                            alt={`preview-${gi}-${i}`}
                            sx={{
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
                            onClick={() => handleRemoveImage(src)}
                            sx={{
                              position: "absolute",
                              top: 4,
                              right: 4,
                              bgcolor: "rgba(0,0,0,0.6)",
                              color: "white",
                              "&:hover": { bgcolor: "rgba(0,0,0,0.8)" },
                            }}
                            disabled={uploading}
                          >
                            <Delete fontSize="small" />
                          </IconButton>
                        </Box>
                      ))}
                    </Box>
                  </SwiperSlide>
                ))}
              </Swiper>
            </Box>
          )}

          {/* Guardar */}
          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={isButtonDisabled}
            sx={{
              mt: 3,
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
