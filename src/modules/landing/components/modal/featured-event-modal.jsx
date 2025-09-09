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
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

export const FeaturedEventModal = ({ open, onClose, event, sx }) => {
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
          width: { xs: '96vw', sm: '90vw', md: 900 },
          maxWidth: '100vw',
          p: { xs: 1, sm: 2, md: 3 },
          outline: 'none',
          overflowY: 'auto',
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
        <style>{`
          .featured-modal-swiper { position: relative; }
          .featured-modal-swiper .swiper-pagination {
            position: absolute !important;
            left: 0; right: 0; bottom: 10px !important;
            display: flex; justify-content: center; align-items: center;
            gap: 10px; margin: 0 !important; z-index: 2;
            pointer-events: auto;
          }
          .featured-modal-swiper .swiper-pagination-bullet {
            width: 10px; height: 10px; border-radius: 50%;
            background-color: #BDBDBD !important;
            opacity: 1 !important; margin: 0 6px !important;
            transition: transform .25s ease, background-color .25s ease;
          }
          .featured-modal-swiper .swiper-pagination-bullet-active {
            background-color: #FF9800 !important;
            transform: scale(1.15);
          }
          @media (prefers-color-scheme: light) {
            .featured-modal-swiper .swiper-pagination-bullet-active {
              background-color: #000 !important;
            }
          }
        `}</style>
        <Box
          sx={{
            display: { xs: "block", md: "flex" },
            flexDirection: { md: "row" },
            gap: { xs: 0, md: 3 },
            alignItems: "flex-start",
          }}
        >
          {/* Carrusel de imágenes con paginación de puntos */}
          <Box sx={{ flex: '1 1 360px', minWidth: 0, position: "relative", mb: { xs: 2, md: 0 } }}>
            <Swiper
              className="featured-modal-swiper"
              modules={[Pagination]}
              pagination={{ clickable: true }}
              loop={false}
              style={{ borderRadius: 12, paddingBottom: 36 }}
            >
              {event?.images?.map((src, idx) => (
                <SwiperSlide key={idx}>
                  <Box
                    component="img"
                    src={src}
                    sx={{
                      width: '100%',
                      height: { xs: 180, sm: 220, md: 260 },
                      maxHeight: { xs: 180, sm: 220, md: 260 },
                      objectFit: 'cover',
                      borderRadius: 3,
                      display: 'block',
                      pt: 2,
                    }}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </Box>
          {/* Texto + acordeón */}
          <Box sx={{ flex: '2 1 0', minWidth: 0 }}>
            <Typography color="text.secondary" sx={{ mb: 2 }}>
              {event?.featured_description}
            </Typography>
            <Typography fontWeight={700} sx={{ mb: 1 }}>
              Servicios incluidos
            </Typography>
            {event?.services?.slice(0, 3).map((srv, idx) => {
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
