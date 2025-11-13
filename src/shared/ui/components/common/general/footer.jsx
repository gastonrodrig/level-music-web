import { Box, Container, Typography, useTheme } from "@mui/material";
import { SocialMedia } from "../../custom";

export const Footer = () => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        backgroundColor: theme.palette.footer.main,
        color: "white",
        py: { xs: 3, md: 2 },
      }}
    >
      <Container
        maxWidth="xl"
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 2,
          alignItems: { xs: "flex-start", md: "center" }, 
          justifyContent: { xs: "flex-start", md: "space-between" },
          textAlign: { xs: "center", md: "left" },
        }}
      >
        {/* Redes sociales */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            order: { xs: 0, md: 1 }, 
          }}
        >
          <SocialMedia />
        </Box>

        {/* Derechos reservados */}
        <Typography
          sx={{
            fontSize: 14,
            order: { xs: 1, md: 0 }, 
          }}
        >
          &copy; 2025 Level Music Corp. Todos los derechos reservados.
        </Typography>
      </Container>
    </Box>
  );
};