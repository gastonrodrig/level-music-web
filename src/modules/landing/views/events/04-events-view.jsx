// src/modules/landing/views/events/04-events-view.jsx
import React from "react";
import {
  Box,
  Container,
  Typography,
  IconButton,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { ChevronLeft, ChevronRight, AccountCircle } from "@mui/icons-material";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export const EventsView04 = () => {
  const theme = useTheme();

  // Regla exacta solicitada: 1100 px
  const isDesktop = useMediaQuery("(min-width:1100px)");

  const testimonials = [
    {
      quote:
        "Lograron crear una atmósfera mágica. El evento recaudó más fondos de los esperados. La coordinación fue perfecta y la atención al detalle increíble.",
      name: "Carlos Medina",
      role: "Director de Marketing",
      company: "Devdatop Consulting",
      eventType: "Conferencia Corporativa",
    },
    {
      quote:
        "Un equipo súper profesional. Todo salió mejor de lo planeado y los invitados quedaron encantados.",
      name: "Lucía Ramírez",
      role: "Coordinadora de Eventos",
      company: "R&P Group",
      eventType: "Aniversario",
    },
    {
      quote:
        "Excelente sonido e iluminación; muy atentos a cada detalle del programa.",
      name: "T.C.",
      role: "Organizador",
      company: "Independiente",
      eventType: "Gala Benéfica",
    },
  ];

  return (
    <Container sx={{ py: { xs: 5, md: 8 } }}>
      {/* Encabezado */}
      <Box sx={{ textAlign: "center", mb: { xs: 3, md: 5 } }}>
        <Typography
          sx={{
            fontSize: { xs: 22, md: 28 },
            fontWeight: 700,
            mb: 1,
          }}
        >
          Lo Que Dicen Nuestros Clientes
        </Typography>
        <Typography
          sx={{
            fontSize: { xs: 12, md: 16 },
            color: "text.secondary",
            maxWidth: 760,
            mx: "auto",
          }}
        >
          La confianza es nuestro mayor logro, estas son las experiencias reales
          de quienes han confiado en nosotros
        </Typography>
      </Box>

      {/* Estilos del pagination como en la 03 */}
      {!isDesktop && (
        <style>
          {`
            .swiper-pagination-bullet {
              background-color: rgb(204, 204, 204) !important;
              opacity: 1 !important;
              width: 10px;
              height: 10px;
              margin: 0 5px;
              border-radius: 50%;
              transition: transform 0.3s ease, background-color 0.3s ease;
            }
            .swiper-pagination-bullet-active {
              background-color: ${theme.palette.primary.main} !important;
              transform: scale(1.2);
            }
          `}
        </style>
      )}

      {/* Card de testimonios */}
      <Box
        sx={{
          position: "relative",
          borderRadius: 4,
          border: `1px solid ${theme.palette.divider}`,
          backgroundColor:
            theme.palette.mode === "light" ? "#F4F4F4" : "#1F1F1F",
          px: { xs: 2, md: 6 },
          pt: { xs: 4, md: 4 },
          pb: { xs: 2, md: 4 },
          overflow: "hidden",
        }}
      >
        {/* Flechas solo en ≥1100px */}
        {isDesktop && (
          <>
            <IconButton
              className="events04-prev"
              aria-label="Anterior"
              sx={{
                position: "absolute",
                left: { xs: 8, md: 16 },
                top: "50%",
                transform: "translateY(-50%)",
                width: 44,
                height: 44,
                borderRadius: "50%",
                border: `2px solid ${theme.palette.text.secondary}`,
                zIndex: 2,
                "&:hover": { backgroundColor: theme.palette.action.hover },
              }}
            >
              <ChevronLeft />
            </IconButton>
            <IconButton
              className="events04-next"
              aria-label="Siguiente"
              sx={{
                position: "absolute",
                right: { xs: 8, md: 16 },
                top: "50%",
                transform: "translateY(-50%)",
                width: 44,
                height: 44,
                borderRadius: "50%",
                border: `2px solid ${theme.palette.text.secondary}`,
                zIndex: 2,
                "&:hover": { backgroundColor: theme.palette.action.hover },
              }}
            >
              <ChevronRight />
            </IconButton>
          </>
        )}

        {/* Swiper: pagination en móvil, flechas en desktop */}
        <Swiper
          modules={[Navigation, Pagination]}
          navigation={
            isDesktop
              ? {
                  prevEl: ".events04-prev",
                  nextEl: ".events04-next",
                }
              : false
          }
          pagination={
            isDesktop
              ? false
              : {
                  clickable: true,
                }
          }
          loop
          style={{
            paddingBottom: isDesktop ? 0 : 50, // espacio para los bullets en móvil
          }}
        >
          {testimonials.map((item, i) => (
            <SwiperSlide key={i}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  flexDirection: "column",
                  textAlign: "center",
                  gap: 2,
                }}
              >
                {/* 5 estrellas como imagen */}
                <Box
                  component="img"
                  src={'https://i.postimg.cc/vZDg9sBZ/4stars.png'}
                  alt="Calificación 5 estrellas"
                  sx={{
                    width: { xs: 140, md: 180 },
                    height: "auto",
                    mb: { xs: 1, md: 2 },
                  }}
                />

                {/* Quote */}
                <Typography
                  sx={{
                    fontSize: { xs: 16, md: 20 },
                    lineHeight: 1.6,
                    maxWidth: 820,
                    px: { xs: 1, md: 0 },
                  }}
                >
                  “{item.quote}”
                </Typography>

                {/* Autor */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    mt: 2,
                    flexDirection: { xs: "column", sm: "row" },
                  }}
                >
                  <AccountCircle
                    sx={{
                      fontSize: { xs: 56, md: 64 },
                      color: "text.secondary",
                    }}
                  />
                  <Box sx={{ textAlign: "left" }}>
                    <Typography sx={{ fontWeight: 600 }}>
                      {item.name}
                    </Typography>
                    <Typography sx={{ color: "text.secondary" }}>
                      {item.role}
                    </Typography>
                    <Typography sx={{ color: "text.secondary" }}>
                      {item.company}
                    </Typography>
                  </Box>
                </Box>

                {/* Tipo de evento */}
                <Box sx={{ mt: 2 }}>
                  <Typography sx={{ fontWeight: 600, mt: 1 }}>
                    Tipo de evento
                  </Typography>
                  <Typography>{item.eventType}</Typography>
                </Box>
              </Box>
            </SwiperSlide>
          ))}
        </Swiper>
      </Box>
    </Container>
  );
};
