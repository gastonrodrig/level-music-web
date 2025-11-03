// src/modules/landing/views/events/05-events-view.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  Button,
  useTheme,
} from "@mui/material";

export const EventsView05 = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  const handleNavigateToCitas = () => {
    navigate("/appointment");
  };

  return (
    <Box
      sx={{
        width: "100%",
        backgroundColor: theme.palette.primary.main,
        py: { xs: 8, sm: 10, md: 12 },
      }}
    >
      <Container>
        <Box
          sx={{
            textAlign: "center",
            maxWidth: 800,
            mx: "auto",
          }}
        >
          <Typography
            component="h2"
            sx={{
              fontSize: { xs: 28, sm: 36, md: 42 },
              fontWeight: 600,
              color: "#fff",
              mb: 2,
            }}
          >
            ¿Quieres Ser Nuestro Próximo Cliente?
          </Typography>
          <Typography
            sx={{
              fontSize: { xs: 16, sm: 18, md: 20 },
              color: "#fff",
              mb: 4,
              lineHeight: 1.6,
            }}
          >
            Estamos listos para hacer realidad el evento de tus sueños. Agenda una cita con
            nosotros y cuéntanos tu visión.
          </Typography>
          <Button
            variant="contained"
            onClick={handleNavigateToCitas}
            sx={{
              backgroundColor: "#2C3E50",
              color: "#fff",
              fontSize: { xs: 14, sm: 16 },
              fontWeight: 600,
              textTransform: "none",
              px: { xs: 4, sm: 5 },
              py: { xs: 1.5, sm: 2 },
              borderRadius: 2,
              "&:hover": {
                backgroundColor: "#1a252f",
              },
            }}
          >
            Agendar una Cita
          </Button>
        </Box>
      </Container>
    </Box>
  );
};
