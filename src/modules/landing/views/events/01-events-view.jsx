import React from "react";
import { useScreenSizes } from "../../../../shared/constants/screen-width";
import { Box, Typography, Button, useTheme } from "@mui/material";

import "../../../../styles.css";

export const EventsView01 = () => {
  const theme = useTheme();
  const { isXs } = useScreenSizes();

  const hero = {
    image: "https://i.postimg.cc/g20SZn8H/img-events.jpg",
    title: "Nuestros Eventos, Nuestra Pasión",
    subtitle: "Creamos experiencias únicas para cada ocasión.",
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Box
        sx={{
          position: "relative",
          height: {
            xs: "38vh",
            sm: "50vh",
            md: "60vh",
            lg: "75vh",
            xl: "85vh",
          },
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          color: "#fff",
          textAlign: "center",
        }}
      >
        {/* Imagen de fondo */}
        <Box
          component="img"
          src={hero.image}
          alt="imagen de fondo"
          sx={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />

        {/* Overlay para legibilidad */}
        <Box
          aria-hidden
          sx={{
            position: "absolute",
            inset: 0,
            zIndex: 1,
            background:
              "linear-gradient(180deg, rgba(0,0,0,.35) 0%, rgba(0,0,0,.65) 70%, rgba(0,0,0,.75) 100%)",
          }}
        />

        {/* Contenido */}
        <Box
          sx={{
            position: "relative",
            zIndex: 2,
            px: 2,
            maxWidth: { xs: "92%", sm: "80%", lg: "48%" },
          }}
        >
          <Typography
            component="h1"
            sx={{
              fontFamily:
                'Mulish, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif',
              fontWeight: 800,
              lineHeight: 1.1,
              fontSize: { xs: 24, sm: 32, md: 40, lg: 48 },
            }}
          >
            {hero.title}
          </Typography>

          {hero.subtitle && (
            <Typography
              sx={{
                mt: 2,
                fontSize: { xs: 12, sm: 14, md: 16, lg: 18 },
                opacity: 0.95,
              }}
            >
              {hero.subtitle}
            </Typography>
          )}
        </Box>
      </Box>
    </Box>
  );
};
