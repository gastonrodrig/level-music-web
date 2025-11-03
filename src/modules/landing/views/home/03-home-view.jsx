import React, { useRef } from 'react';
import {
  Box,
  Container,
  Typography,
  IconButton,
  useMediaQuery,
  useTheme,
  styled
} from '@mui/material';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';

const slides = [
  { src: "https://i.postimg.cc/sDN3XVfp/imagen-2.jpg", alt: 'evento 1' },
  { src: "https://i.postimg.cc/0yS1yDBv/imagen-3.jpg", alt: 'evento 2' },
  { src: "https://i.postimg.cc/yxxw4ZR4/imagen-4.jpg", alt: 'evento 3' },
  { src: "https://i.postimg.cc/mgf6Vq8p/imagen-5.jpg", alt: 'evento 4' },
  { src: "https://i.postimg.cc/KvByZtVy/imagen-6.jpg", alt: 'evento 5' },
];

const StyledSwiper = styled(Swiper)({
  position: 'relative',
  '& .swiper-wrapper': {
    padding: '0',
  },
});

export const HomeView03 = () => {
  const theme = useTheme();
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  return (
    <Box 
      sx={{
        width: "100%",
        backgroundColor: theme.palette.primary.main,
        py: { xs: 5, md: 6 },
      }}
    >
      <Container>
        {/* HEADER: Título a la izquierda, flechas a la derecha */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: 'center',
            justifyContent: 'space-between',
            mb: 4,
            gap: { xs: 3, sm: 0 },
          }}
        >
          <Typography
            variant="h4"
            sx={{
              color: '#fff',
              fontSize: { xs: 24, sm: 32, md: 40 }
            }}
          >
            NUESTROS EVENTOS
          </Typography>
          <Box>
            <IconButton
              ref={prevRef}
              sx={{
                color: '#fff',
                border: '2px solid #fff',
                mr: 1,
                width: 40,
                height: 40
              }}
            >
              <ChevronLeft />
            </IconButton>
            <IconButton
              ref={nextRef}
              sx={{
                color: '#fff',
                border: '2px solid #fff',
                width: 40,
                height: 40
              }}
            >
              <ChevronRight />
            </IconButton>
          </Box>
        </Box>

        {/* CARRUSEL */}
        <StyledSwiper
          modules={[Navigation]}
          navigation={{
            prevEl: prevRef.current,
            nextEl: nextRef.current
          }}
          onBeforeInit={(swiper) => {
            swiper.params.navigation.prevEl = prevRef.current;
            swiper.params.navigation.nextEl = nextRef.current;
          }}
          loop
          spaceBetween={24}
          breakpoints={{
            0:   { slidesPerView: 1, slidesPerGroup: 1 },
            600: { slidesPerView: 2, slidesPerGroup: 1 },
            1200: { slidesPerView: 3, slidesPerGroup: 1 },
          }}
        >
          {slides.map((slide, idx) => (
            <SwiperSlide key={idx}>
              <Box
                sx={{
                  height: { xs: 250, sm: 230, md: 300, lg: 280 },
                  overflow: 'hidden',
                  borderRadius: 2
                }}
              >
                <Box
                  component="img"
                  src={slide.src}
                  alt={slide.alt}
                  sx={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />
              </Box>
            </SwiperSlide>
          ))}
        </StyledSwiper>
      </Container>
    </Box>
  );
};
