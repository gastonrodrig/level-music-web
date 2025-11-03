import React, { useRef } from 'react';
import { useScreenSizes } from '../../../../shared/constants/screen-width';
import {
  Box,
  Typography,
  Button,
  useTheme
} from '@mui/material';
import { useNavigate } from 'react-router-dom'; // <--- IMPORTANTE
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css';
import '../../../../styles.css';

// ----------------------------------------
// Componente individual para cada slide
// ----------------------------------------
const SlideContent = ({
  image,
  title,
  subtitle,
  buttonText,
  redirectTo,
  isSecondSlide = false,
  isFirstSlide = false,
  isThirdSlide = false
}) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { isMd } = useScreenSizes();

  const handleRedirect = () => {
    if (redirectTo) {
      navigate(redirectTo);
    }
  };

  return (
    <Box
      sx={theme => ({
        position: 'relative',
        height: { xs: '35vh', sm: '50vh', md: '75vh', lg: '93vh' },
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        color: 'white',
        textAlign: 'center',
        px: 2,
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 1,
          backgroundColor:
            !isMd
              ? 'rgba(0, 0, 0, 0.45)'
              : theme.palette.mode === 'dark'
                ? 'rgba(0, 0, 0, 0.45)'
                : 'transparent',
        },
      })}
    >
      {/* Imagen de fondo */}
      <Box
        component="img"
        src={image}
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          zIndex: 0,
        }}
      />

      {/* Contenido encima de la imagen */}
      <Box
        sx={{
          position: 'relative',
          zIndex: 2,
          mt: isThirdSlide ? { xs: 0, md: '-30vh', lg: '-40vh' } : 5,
          mb: isSecondSlide ? { xs: 0, md: '-35vh', lg: '-45vh' } : 0,
          maxWidth: { xs: '90%', sm: '80%', lg: '40%' },
        }}
      >
        <Typography sx={{ fontSize: { xs: 15, sm: 18, md: 20, lg: 35 }, fontWeight: 700 }}>
          {title}
        </Typography>

        <Typography sx={{ mt: 2, fontSize: { xs: 10, sm: 12, md: 15, lg: 20 } }}>
          {subtitle}
        </Typography>

        {buttonText && (
          <Button
            variant="text"
            color="primary"
            onClick={handleRedirect} // <--- Aquí se maneja la redirección
            sx={{
              pt: 1,
              px: 2,
              mt: 3,
              textTransform: 'none',
              fontSize: { xs: 10, sm: 12, md: 14, lg: 16 },
              '&:hover': {
                backgroundColor: theme.palette.primary.hover,
              },
              backgroundColor: theme.palette.primary.main,
              color: 'white',
            }}
          >
            {buttonText}
          </Button>
        )}
      </Box>
    </Box>
  );
};

// ----------------------------------------
// Configuración de los slides
// ----------------------------------------
const slides = [
  {
    image: "https://i.postimg.cc/VvnF2sNQ/imagen-1.png",
    title: '¡Haz de tu evento una experiencia inolvidable!',
    subtitle: 'Sonido, luces y ambientación profesional para eventos.',
    buttonText: 'Solicitar Cotización',
    redirectTo: '/quotation', // <-- Ruta al hacer click
  },
  {
    image: "https://i.postimg.cc/2yhxgj5C/imagen-2.png",
    title: 'Producción de Audio y Sonido Profesional',
    subtitle: 'Servicios personalizados: catering, iluminación, decoración y más.',
    buttonText: 'Ver Eventos',
    redirectTo: '/events',
  },
  {
    image: "https://i.postimg.cc/SRCGHQKk/imagen-3.png",
    title: 'Tu Playlist, Nuestra Mezcla',
    subtitle: 'Envíanos tu lista de canciones y creamos la atmósfera perfecta para tu evento.',
    // Este slide no tiene botón
  },
];

// ----------------------------------------
// Componente principal
// ----------------------------------------
export const HomeView01 = () => {
  const { isXs } = useScreenSizes();
  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const theme = useTheme();

  return (
    <Box sx={{ width: '100%' }}>
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        loop
        navigation={{
          prevEl: prevRef.current,
          nextEl: nextRef.current,
        }}
        onBeforeInit={(swiper) => {
          swiper.params.navigation.prevEl = prevRef.current;
          swiper.params.navigation.nextEl = nextRef.current;
        }}
        pagination={{
          clickable: true,
          bulletClass: 'swiper-pagination-bullet',
          bulletActiveClass: 'swiper-pagination-bullet-active',
        }}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        style={{
          height: '100%',
          background: 'white',
        }}
        className="custom-swiper"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index}>
            <SlideContent
              image={slide.image}
              title={slide.title}
              subtitle={slide.subtitle}
              buttonText={slide.buttonText}
              redirectTo={slide.redirectTo}
              isFirstSlide={index === 0}
              isSecondSlide={index === 1}
              isThirdSlide={index === 2}
            />
          </SwiperSlide>
        ))}

        {/* Flechas personalizadas */}
        {!isXs && (
          <>
            <Box
              ref={prevRef}
              className="swiper-button-prev"
              sx={{
                width: '40px',
                height: '40px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                color: theme.palette.primary.main,
                fontSize: '18px',
                backgroundColor: 'white',
                borderRadius: '50%',
                cursor: 'pointer',
                position: 'absolute',
                left: '30px',
                top: '50%',
                transition: 'transform 0.3s ease, background-color 0.3s ease',
                '&::after': {
                  content: '"\\276E"',
                  fontSize: '24px',
                  fontWeight: 'bold',
                },
                '&:hover': {
                  transform: 'scale(1.2)',
                  color: theme.palette.primary.dark,
                },
              }}
            />
            <Box
              ref={nextRef}
              className="swiper-button-next"
              sx={{
                width: '40px',
                height: '40px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                color: theme.palette.primary.main,
                fontSize: '18px',
                backgroundColor: 'white',
                borderRadius: '50%',
                cursor: 'pointer',
                position: 'absolute',
                right: '30px',
                top: '50%',
                transition: 'transform 0.3s ease, background-color 0.3s ease',
                '&::after': {
                  content: '"\\276F"',
                  fontSize: '24px',
                  fontWeight: 'bold',
                },
                '&:hover': {
                  transform: 'scale(1.2)',
                  color: theme.palette.primary.dark,
                },
              }}
            />
          </>
        )}
      </Swiper>
    </Box>
  );
};
