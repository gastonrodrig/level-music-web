import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
} from "@mui/material";
import { Close, CloudUpload, Delete, Edit } from "@mui/icons-material";
import { useForm, useFieldArray } from "react-hook-form";
import { useEffect, useMemo, useState } from "react";
import {
  useEventFeaturedStore,
  useImageManager,
  useEventStore,
} from "../../../../../hooks";
import { EventFeaturedFieldModal } from "./event-featured-field-modal";
import { ImagePreviewModal } from "../../../../../shared/ui/components/common";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { useDispatch } from "react-redux";
import { setLoadingImagesEventFeatured } from "../../../../../store";

export const EventFeaturedModal = ({
  open,
  onClose,
  eventFeatured = {},
  setEventFeatured,
  loading,
}) => {
  const dispatch = useDispatch();
  const isEditing = !!eventFeatured?._id;
  const { startSearchingEvent } = useEventStore();
  const { loadingImages, startCreateEventFeatured, startUpdateEventFeatured } =
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
  } = useImageManager(watch, setValue);

  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const handleOpenPreview = (imageUrl) => {
    setSelectedImage(imageUrl);
    setPreviewModalOpen(true);
  };

  const handleClosePreview = () => {
    setSelectedImage(null);
    setPreviewModalOpen(false);
  };

  const handleCodeChange = async (value) => {
    if (!value) {
      setValue("eventCode", "");
      return;
    }
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
        dispatch(setLoadingImagesEventFeatured(true));
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
        await handleCodeChange(eventFeatured.event_code);
        dispatch(setLoadingImagesEventFeatured(false));
      })();
    }
  }, [open, eventFeatured]);

  const onSubmit = async (data) => {
    const payload = {
      ...data,
      images: Array.from(data.images || []),
    };

    const success = isEditing
      ? await startUpdateEventFeatured(eventFeatured?._id, payload)
      : await startCreateEventFeatured(payload);

    if (success) {
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

  // Para agrupar las imágenes de 4 en 4 dentro del carrusel
  const chunk = (arr, size) =>
    arr.reduce(
      (acc, _, i) =>
        i % size === 0 ? acc.concat([arr.slice(i, i + size)]) : acc,
      []
    );

  const getPreviewSrc = (item) => {
    if (!item) return "";
    if (typeof item === "string") return item;
    if (item.previewUrl) return item.previewUrl;
    if (item.preview) return item.preview;
    if (item.url) return item.url;
    return "";
  };

  const normalizedPreviews = (previews || [])
    .map(getPreviewSrc)
    .filter(Boolean);

  const groupsOf4 = chunk(normalizedPreviews, 4);

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
          {/* Encabezado */}
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

          {/* Campos principales */}
          <Box display="flex" flexDirection="column" gap={2} mb={3}>
            <TextField
              label="Código del evento"
              fullWidth
              InputLabelProps={{ shrink: true }}
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
              InputLabelProps={{ shrink: true }}
              rows={3}
              fullWidth
              {...register("featured_description", {
                required: "La descripción es obligatoria",
              })}
              error={Boolean(errors.featured_description)}
              helperText={errors.featured_description?.message}
            />
          </Box>

          {/* Sección de servicios */}
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={2}
            mt={1}
          >
            <Typography fontSize={18} fontWeight={500}>
              Servicios Incluidos
            </Typography>
            <Button
              variant="contained"
              size="small"
              onClick={handleAddField}
              disabled={isButtonDisabled}
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
              + Agregar servicio
            </Button>
          </Box>

          {/* Lista de servicios */}
          <Box
            sx={{
              maxHeight: 190,
              overflowY: "auto",
              display: "flex",
              flexDirection: "column",
              gap: 2,
              mb: 2,
            }}
          >
            {fields.length === 0 ? (
              <Typography
                textAlign="center"
                color="text.secondary"
                fontSize={14}
                my={2}
              >
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
                        theme.palette.mode === "dark" ? "#3c3c3c" : "#e0e0e0"
                      }`,
                  }}
                >
                  <Box sx={{ maxWidth: "70%", flex: 1, overflow: "hidden" }}>
                    <Typography
                      fontWeight={500}
                      sx={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {field.title || (
                        <span style={{ color: "#aaa" }}>[Sin título]</span>
                      )}
                    </Typography>
                    {field.description && (
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          mt: 0.5,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {field.description}
                      </Typography>
                    )}
                  </Box>
                  <Box>
                    <IconButton
                      aria-label="Editar servicio"
                      size="small"
                      onClick={() => handleEditField(field, index)}
                    >
                      <Edit fontSize="small" />
                    </IconButton>
                    <IconButton
                      aria-label="Eliminar servicio"
                      size="small"
                      onClick={() => remove(index)}
                    >
                      <Delete fontSize="small" />
                    </IconButton>
                  </Box>
                </Box>
              ))
            )}
          </Box>

          {/* Sección de imágenes */}
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={2}
            mt={1}
          >
            <Typography fontSize={18} fontWeight={500}>
              Imágenes del evento
            </Typography>
            <Button
              variant="contained"
              size="small"
              component="label"
              startIcon={<CloudUpload />}
              disabled={isButtonDisabled}
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
              Seleccionar imágenes
              <input
                type="file"
                hidden
                multiple
                accept="image/*"
                onChange={handleImagesChange}
              />
            </Button>
          </Box>

          {/* Carrusel de vista previa */}
          <Box mb={2}>
            {loadingImages ? (
              <Typography
                textAlign="center"
                color="text.secondary"
                fontSize={14}
                my={2}
              >
                Cargando imagenes...
              </Typography>
            ) : previews.length > 0 ? (
              <Swiper spaceBetween={10} slidesPerView={1}>
                {groupsOf4.map((group, gi) => (
                  <SwiperSlide key={gi}>
                    <Box
                      display="grid"
                      gridTemplateColumns="repeat(4, 1fr)"
                      gap={1}
                      mb={2}
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
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                handleOpenPreview(src);
                              }}
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
                                cursor: "pointer",
                                transition: "transform 0.2s ease",
                                "&:hover": {
                                  transform: "scale(1.02)",
                                },
                              }}
                            />

                            {/* Botón para eliminar imagen */}
                            <IconButton
                              size="small"
                              sx={{
                                position: "absolute",
                                top: 4,
                                right: 4,
                                bgcolor: "rgba(0,0,0,0.5)",
                                "&:hover": { bgcolor: "rgba(0,0,0,0.7)" },
                              }}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRemoveImage(globalIndex);
                              }}
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
            ) : (
              <Typography
                textAlign="center"
                color="text.secondary"
                fontSize={14}
                my={4}
              >
                No hay imágenes disponibles
              </Typography>
            )}
          </Box>

          {/* Modal de vista previa */}
          <ImagePreviewModal
            open={previewModalOpen}
            src={selectedImage}
            onClose={handleClosePreview}
          />

          {/* Botón final de guardar */}
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
    </>
  );
};
