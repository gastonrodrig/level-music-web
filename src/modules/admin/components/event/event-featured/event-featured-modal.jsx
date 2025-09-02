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
    watch
  } = useForm({
    mode: "onBlur",
    defaultValues: {
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

  // Previews (urls temporales o del backend)
  const [previews, setPreviews] = useState([]);

  useEffect(() => {
    if (open) {
      reset({
        title: eventFeatured?.title ?? "",
        featured_description: eventFeatured?.featured_description ?? "",
        services: eventFeatured?.services ?? [],
        images: [],
      });
      setPreviews(eventFeatured?.images ?? []); // si editas y traes URLs del backend
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
    setPreviews(localUrls);
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
    arr.reduce((acc, _, i) => (i % size === 0 ? acc.concat([arr.slice(i, i + size)]) : acc), []);

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

            {/* Código de evento */}
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

            {/* Nombre del evento ingresado */}
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
          
            {/* Descripción */}
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
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
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
              <Typography color="text.secondary" fontSize={14} textAlign="center" my={2}>
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
                    <IconButton size="small" onClick={() => handleEditField(field, index)}>
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

            <Button variant="outlined" component="label" sx={{ mr: 2 }}>
              Seleccionar imágenes
              <input
                type="file"
                hidden
                multiple
                ref={imagesRef}
                {...imagesFieldRest}
                onChange={(e) => {
                  rhfImagesOnChange(e); // RHF
                  handleImagesChange(e); // previews
                }}
              />
            </Button>

            <Typography variant="caption" sx={{ display: "block", mt: 1, color: "text.secondary" }}>
              La primera imagen se tomará como <strong>portada</strong>; las demás se enviarán a la <strong>galería</strong>.
            </Typography>
          </Box>

          {/* Carrusel 4 por slide (sin flechas) */}
          {previews.length > 0 && (
            <Box
              mt={2}
              sx={{
                // estiliza bullets
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
                slidesPerView={1}      // 1 slide a la vez (cada slide contiene 4 imágenes)
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
                        height: 170, // más bajito
                        // responsive: 2 por fila en pantallas chicas
                        "@media (max-width:600px)": {
                          gridTemplateColumns: "repeat(2, 1fr)",
                          height: 200,
                        },
                      }}
                    >
                      {group.map((src, i) => (
                        <Box
                          key={`${gi}-${i}`}
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
                                theme.palette.mode === "dark" ? "#3c3c3c" : "#e0e0e0"
                              }`,
                          }}
                        />
                      ))}
                    </Box>
                  </SwiperSlide>
                ))}
              </Swiper>
            </Box>
          )}

          {/* Botón guardar */}
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
