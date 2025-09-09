import React from "react";
import { Box, Container, Typography, useTheme } from "@mui/material";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import Diversity3Icon from "@mui/icons-material/Diversity3";
import LibraryMusicIcon from "@mui/icons-material/LibraryMusic";

import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

const features = [
  {
    title: "Experiencia Profesional",
    description:
      "Contamos con años de experiencia en la organización de eventos, brindando servicios profesionales de sonido e iluminación para garantizar el éxito de tu evento.",
    icon: <EventAvailableIcon fontSize="large" />,
  },
  {
    title: "Versatilidad en Eventos",
    description:
      "Atendemos tanto eventos privados como corporativos, adaptando nuestros servicios a cada ocasión para asegurar una experiencia única y memorable para todos.",
    icon: <Diversity3Icon fontSize="large" />,
  },
  {
    title: "Amplio Catálogo Musical",
    description:
      "Adaptamos cada evento a tus gustos musicales, diseñamos un playlist personalizado que se adapta al estilo y tema de cada evento para crear la atmósfera perfecta.",
    icon: <LibraryMusicIcon fontSize="large" />,
  },
];

export const EventsView03 = () => {
  const theme = useTheme();

  return (
    <Box sx={{ backgroundColor: theme.palette.primary.main, width: "100%" }}>
      <Container sx={{ pt: { xs: 4, md: 8 }, pb: { xs: 2, md: 4, lg: 8 } }}>
        {/* ===== Mobile/Tablet: Carrusel con paginación (puntos) ===== */}
        <Box sx={{ display: { xs: "block", lg: "none" } }}>
          {/* Estilos de la paginación, encapsulados al Swiper de esta sección */}
          <style>{`
            .events03-swiper { position: relative; }

            /* Contenedor de los puntos dentro del slider */
            .events03-swiper .swiper-pagination {
              position: absolute !important;
              left: 0; right: 0; bottom: 16px !important;
              display: flex; justify-content: center; align-items: center;
              gap: 10px; margin: 0 !important; z-index: 2;
              pointer-events: auto;
            }

            /* Puntos inactivos (gris) */
            .events03-swiper .swiper-pagination-bullet {
              width: 10px; height: 10px; border-radius: 50%;
              background-color: #BDBDBD !important;
              opacity: 1 !important; margin: 0 6px !important;
              transition: transform .25s ease, background-color .25s ease;
            }

            /* Punto activo (negro) */
            .events03-swiper .swiper-pagination-bullet-active {
              background-color: #000 !important;
              transform: scale(1.15);
            }
          `}</style>

          <Swiper
            className="events03-swiper"
            modules={[Pagination]}
            pagination={{ clickable: true }}
            loop={false}
            spaceBetween={24}
            slidesPerView={1}
            breakpoints={{ 600: { slidesPerView: 2 } }}
            style={{ paddingBottom: 56 }} 
          >
            {features.map((feature, index) => (
              <SwiperSlide key={index}>
                <Box
                  sx={{
                    backgroundColor:
                      theme.palette.mode === "light" ? "#1E1E1E" : "#1F1F1F",
                    p: { xs: 4, md: 6 },
                    borderRadius: 4,
                    textAlign: "center",
                    height: { xs: "200px", sm: "220px", md: "240px" },
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    color: "#fff",
                    boxShadow: "0px 4px 12px rgba(0,0,0,.25)",
                  }}
                >
                  <Box>
                    {React.cloneElement(feature.icon, {
                      fontSize: "inherit",
                      sx: { fontSize: { xs: 36, sm: 42, md: 54 } },
                    })}
                  </Box>
                  <Typography
                    sx={{ fontSize: { xs: 18, md: 20 }, fontWeight: 600 }}
                  >
                    {feature.title}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: { xs: 13, md: 14 },
                      color: "rgba(255,255,255,.85)",
                    }}
                  >
                    {feature.description}
                  </Typography>
                </Box>
              </SwiperSlide>
            ))}
          </Swiper>
        </Box>

        {/* ===== Desktop: 3 tarjetas estáticas ===== */}
        <Box
          sx={{
            display: { xs: "none", lg: "flex" },
            gap: 4,
            justifyContent: "center",
          }}
        >
          {features.map((feature, index) => (
            <Box
              key={index}
              sx={{
                backgroundColor:
                  theme.palette.mode === "light" ? "#1E1E1E" : "#1F1F1F",
                p: 6,
                borderRadius: 4,
                textAlign: "center",
                height: "400px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                color: "#fff",
                boxShadow: "0px 4px 12px rgba(0,0,0,.25)",
              }}
            >
              <Box sx={{ mb: 2 }}>
                {React.cloneElement(feature.icon, {
                  fontSize: "inherit",
                  sx: { fontSize: { xs: 40, sm: 50, md: 60 } },
                })}
              </Box>
              <Typography sx={{ fontSize: 22, mb: 2, fontWeight: 600 }}>
                {feature.title}
              </Typography>
              <Typography sx={{ fontSize: 18, color: "rgba(255,255,255,.85)" }}>
                {feature.description}
              </Typography>
            </Box>
          ))}
        </Box>
      </Container>
    </Box>
  );
};
