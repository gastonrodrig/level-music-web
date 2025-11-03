import {
  Box,
  Modal,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  IconButton,
  useTheme,
} from "@mui/material";
import { useEffect, useState } from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CloseIcon from "@mui/icons-material/Close";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

export const FeaturedEventModal = ({ open, onClose, event }) => {
  const theme = useTheme();
  const [expandedIndex, setExpandedIndex] = useState(-1);

  // Reset expanded state when the modal opens or the event changes
  useEffect(() => {
    setExpandedIndex(-1);
  }, [open, event]);
  return (
    <Modal open={open} onClose={onClose}>
      <Box
        className="featured-modal-container"
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          bgcolor: theme.palette.background.paper,
          borderRadius: 3,
          boxShadow: 24,
          width: { xs: '96vw', sm: '90vw', md: 500 },
          height: { xs: '80vh', sm: '80vh', md: '90%' },
          maxWidth: '100vw',
          p: { xs: 3, sm: 3, md: 4 },
          outline: 'none',
          overflowY: 'auto',
          // webkit scrollbar via sx (fallback to CSS below)
          '&::-webkit-scrollbar': { width: 10 },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: theme.palette.primary.main,
            borderRadius: 8,
          },
          '&::-webkit-scrollbar-track': { background: 'transparent' },
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
          /* Scrollbar styling for the modal container */
          .featured-modal-container { scrollbar-color: ${theme.palette.primary.main} transparent; scrollbar-width: thin; }
          .featured-modal-container::-webkit-scrollbar { width: 10px; }
          .featured-modal-container::-webkit-scrollbar-thumb { background: ${theme.palette.primary.main}; border-radius: 8px; }
          .featured-modal-container::-webkit-scrollbar-track { background: transparent; }

          .featured-modal-swiper { position: relative; }
          .featured-modal-swiper .swiper-pagination {
            position: absolute !important;
            left: 0; right: 0; bottom: 16px !important;
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
            background-color: ${theme.palette.primary.main} !important;
            transform: scale(1.15);
          }
          .featured-modal-swiper .swiper-button-next,
          .featured-modal-swiper .swiper-button-prev {
            color: rgba(255,255,255,.9);
            width: 36px; height: 36px; border-radius: 50%;
            background: rgba(0,0,0,0.35); display:flex; align-items:center; justify-content:center;
            box-shadow: none; top: 45%;
          }
          .featured-modal-swiper .swiper-button-next::after,
          .featured-modal-swiper .swiper-button-prev::after { font-size: 16px; }
          @media (prefers-color-scheme: light) {
            .featured-modal-swiper .swiper-pagination-bullet-active {
              background-color: #000 !important;
            }
          }
        `}</style>
        {/* Layout: title above, then large image with nav & bullets inside, then description, then services */}
        
        {/* Carrusel de imágenes */}
        <Box sx={{ position: 'relative', mb: 3 }}>
          <Swiper
            className="featured-modal-swiper"
            modules={[Pagination, Navigation]}
            pagination={{ clickable: true }}
            navigation={true}
            loop={true}
            style={{ borderRadius: 12, paddingBottom: 0 }}
          >
            {event?.images?.map((src, idx) => (
              <SwiperSlide key={idx}>
                <Box
                  component="img"
                  src={src}
                  sx={{
                    width: '100%',
                    height: { xs: 220, sm: 300, md: 360 },
                    maxHeight: { xs: 220, sm: 300, md: 360 },
                    objectFit: 'cover',
                    borderRadius: 3,
                    display: 'block',
                  }}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </Box>

        {/* Descripción */}
        <Typography color="text.secondary" sx={{ mb: 2, lineHeight: 1.6 }}>
          {event?.featured_description}
        </Typography>

        {/* Servicios incluidos */}
        <Typography fontWeight={700} sx={{ mb: 1 }}>
          Servicios incluidos
        </Typography>

          {event?.services?.map((srv, idx) => {
            const title = srv?.title;
            const desc = srv?.description;
            return (
              <Accordion
                key={`${title}-${idx}`}
                disableGutters
                expanded={expandedIndex === idx}
                onChange={() =>
                  setExpandedIndex((prev) => (prev === idx ? -1 : idx))
                }
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
    </Modal>
  );
};
