import React, { useRef } from "react";
import {
  Box,
  Modal,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  IconButton,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CloseIcon from "@mui/icons-material/Close";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

export const FeaturedEventModal = ({ open, onClose, event }) => {
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  console.log(event)

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          bgcolor: "background.paper",
          borderRadius: 4,
          boxShadow: 24,
          width: { xs: "94%", md: 920 },
          p: { xs: 2, md: 3 },
          outline: "none",
        }}
      >
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 2,
          }}
        >
          <Typography variant="h6" fontWeight={700}>
            {event?.title}
          </Typography>
          <IconButton onClick={onClose} aria-label="Cerrar">
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Cuerpo */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "360px 1fr" },
            gap: 3,
            alignItems: "start",
          }}
        >
          {/* Carrusel de imágenes */}
          <Box sx={{ position: "relative", pt: 5 }}>
            {/* Flechas centradas sobre la parte superior de la imagen */}
            <Box
              sx={{
                position: "absolute",
                top: 0,
                left: "50%",
                transform: "translateX(-50%)",
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                zIndex: 3,
              }}
            >
              <IconButton
                ref={prevRef}
                aria-label="Anterior imagen"
                sx={{
                  border: "2px solid",
                  borderColor: "text.tertiary",
                  bgcolor: "rgba(0,0,0,0.6)",
                  color: "#fff",
                  "&:hover": { bgcolor: "rgba(0,0,0,0.8)" },
                  width: 40,
                  height: 40,
                  p: 2,
                }}
              >
                <ChevronLeft />
              </IconButton>
              <IconButton
                ref={nextRef}
                aria-label="Siguiente imagen"
                sx={{
                  border: "2px solid",
                  borderColor: "text.tertiary",
                  bgcolor: "rgba(0,0,0,0.6)",
                  color: "#fff",
                  "&:hover": { bgcolor: "rgba(0,0,0,0.8)" },
                  width: 40,
                  height: 40,
                  p: 2, 
                }}
              >
                <ChevronRight />
              </IconButton>
            </Box>

            <Swiper
              modules={[Navigation]}
              navigation={{
                prevEl: prevRef.current,
                nextEl: nextRef.current,
              }}
              onBeforeInit={(swiper) => {
                swiper.params.navigation.prevEl = prevRef.current;
                swiper.params.navigation.nextEl = nextRef.current;
              }}
              loop
              style={{ borderRadius: 12 }}
            >
              {event?.images?.map((src, idx) => (
                <SwiperSlide key={idx}>
                  <Box
                    component="img"
                    src={src}
                    sx={{
                      width: "100%",
                      height: 260,
                      objectFit: "cover",
                      borderRadius: 3,
                      display: "block",
                      pt: 2,
                    }}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </Box>

          {/* Texto + acordeón */}
          <Box>
            <Typography color="text.secondary" sx={{ mb: 2 }}>
              {event?.featured_description}
            </Typography>

            <Typography fontWeight={700} sx={{ mb: 1 }}>
              Servicios incluidos
            </Typography>

            {event?.services.slice(0, 3).map((srv, idx) => {
              const title = srv?.title;
              const desc = srv?.description;
              return (
                <Accordion
                  key={`${title}-${idx}`}
                  defaultExpanded={idx === 0}
                  disableGutters
                  sx={{
                    borderRadius: 2,
                    mb: 1.2,
                    "&:before": { display: "none" },
                    boxShadow: 1,
                  }}
                >
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography fontWeight={600}>{title}</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography color="text.secondary">
                      {desc}
                    </Typography>
                  </AccordionDetails>
                </Accordion>
              );
            })}
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};
