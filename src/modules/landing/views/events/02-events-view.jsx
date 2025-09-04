import { useEffect, useRef, useState } from "react";
import {
  Box,
  Container,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  Chip,
  IconButton,
  useTheme,
  styled,
} from "@mui/material";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import { FeaturedEventModal } from "../../components/modal";
import { useEventFeaturedStore } from "../../../../hooks";

const StyledSwiper = styled(Swiper)({
  position: "relative",
  "& .swiper-wrapper": { padding: 0 },
});

export const EventsView02 = () => {
  const theme = useTheme();
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  const [open, setOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState();

  const { eventFeatured, startLoadingAllEventFeatured } = useEventFeaturedStore();

  useEffect(() => {
    startLoadingAllEventFeatured();
  }, []);

  return (
    <Box
      sx={{ width: "100%", backgroundColor: theme.palette.background.default }}
    >
      <style>{`
        .events02-bullet { opacity: 1; width: 8px; height: 8px; margin: 0 4px; background: #cfcfcf; }
        .events02-bullet-active { transform: scale(1.2); background: #9e9e9e; }
      `}</style>

      <Container sx={{ py: { xs: 4, sm: 5, md: 6 } }}>
        {/* Encabezado + flechas */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            alignItems: "center",
            justifyContent: "space-between",
            mb: 3,
            gap: { xs: 2, sm: 0 },
          }}
        >
          <Typography
            component="h2"
            sx={{ fontSize: { xs: 22, sm: 26, md: 30 }, fontWeight: 700 }}
          >
            Nuestros Eventos
          </Typography>

          <Box>
            <IconButton
              ref={prevRef}
              aria-label="Anterior"
              sx={{
                border: `2px solid ${theme.palette.text.tertiary || "#9e9e9e"}`,
                mr: 1,
                width: 40,
                height: 40,
              }}
            >
              <ChevronLeft />
            </IconButton>
            <IconButton
              ref={nextRef}
              aria-label="Siguiente"
              sx={{
                border: `2px solid ${theme.palette.text.tertiary || "#9e9e9e"}`,
                width: 40,
                height: 40,
              }}
            >
              <ChevronRight />
            </IconButton>
          </Box>
        </Box>

        {/* Carrusel */}
        <StyledSwiper
          modules={[Navigation, Pagination]}
          navigation={{ prevEl: prevRef.current, nextEl: nextRef.current }}
          onBeforeInit={(swiper) => {
            swiper.params.navigation.prevEl = prevRef.current;
            swiper.params.navigation.nextEl = nextRef.current;
          }}
          pagination={{
            clickable: true,
            bulletClass: "events02-bullet",
            bulletActiveClass: "events02-bullet-active",
          }}
          loop
          spaceBetween={24}
          breakpoints={{
            0: { slidesPerView: 1, slidesPerGroup: 1 },
            900: { slidesPerView: 2, slidesPerGroup: 1 },
            1200: { slidesPerView: 3, slidesPerGroup: 1 },
          }}
          style={{ paddingBottom: 28 }}
        >
          {eventFeatured.map((item, i) => (
            <SwiperSlide key={i}>
              <Card
                elevation={0}
                sx={{
                  backgroundColor:
                    theme.palette.mode === "light" ? "#efefef" : "#1F1F1F",
                  borderRadius: 3,
                  p: { xs: 1.5, sm: 2 },
                  boxShadow:
                    theme.palette.mode === "light"
                      ? "0px 1px 6px rgba(0,0,0,.12)"
                      : "0px 1px 6px rgba(0,0,0,.4)",
                  height: 525,
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <CardMedia
                  component="img"
                  image={item.cover_image}
                  alt={item.title}
                  sx={{
                    width: '100%',
                    minHeight: 260,
                    borderRadius: 2,
                    objectFit: 'cover',
                  }}
                />

                <CardContent sx={{ px: { xs: 1, sm: 1.5 } }}>
                  <Typography
                    sx={{
                      mt: 2,
                      textAlign: "center",
                      fontWeight: 700,
                      fontSize: { xs: 18, sm: 20, md: 22 },
                    }}
                  >
                    {item.title}
                  </Typography>

                  <Typography sx={{ mt: 1.5, fontSize: { xs: 13, sm: 14 } }}>
                    {item.featured_description}
                  </Typography>

                  <Typography
                    sx={{
                      mt: 2,
                      mb: 1,
                      fontSize: { xs: 13, sm: 14 },
                      fontWeight: 600,
                    }}
                  >
                    Servicios incluidos :
                  </Typography>

                  <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap" }}>
                    {item.services?.map((s, idx) => (
                      <Chip
                        key={idx}
                        label={s.title}
                        sx={{
                          backgroundColor: "#000000ff",
                          color: "#fff",
                          borderRadius: 1,
                          "& .MuiChip-label": {
                            px: 1.5,
                            py: 0.75,
                            fontSize: 12,
                          },
                        }}
                      />
                    ))}
                  </Box>

                  <Button
                    variant="contained"
                    disableElevation
                    sx={{
                      mt: 2.5,
                      textTransform: "none",
                      borderRadius: 2,
                      px: 2.5,
                      backgroundColor: theme.palette.primary.main,
                      "&:hover": {
                        backgroundColor:
                          theme.palette.primary.hover ||
                          theme.palette.primary.dark,
                      },
                      fontSize: { xs: 12.5, sm: 13.5 },
                      color: "#fff",
                      alignSelf: "flex-start",
                    }}
                    onClick={() => {
                      setSelectedEvent(item);
                      setOpen(true);
                    }}
                  >
                    Ver más
                  </Button>
                </CardContent>
              </Card>
            </SwiperSlide>
          ))}
        </StyledSwiper>

        {/* Único modal */}
        <FeaturedEventModal
          open={open}
          onClose={() => setOpen(false)}
          event={selectedEvent}
        />
      </Container>
    </Box>
  );
};
