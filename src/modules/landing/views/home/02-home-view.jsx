import { Container, Typography, Box, useTheme } from '@mui/material';

export const HomeView02 = () => {
  const theme = useTheme();

  return (
      <Container 
        maxWidth="lg"
        sx={{
          py: { xs: 2, md: 8 },
          backgroundColor: theme.palette.background.default,
        }}
      >
        <Box
          sx={{
            backgroundColor: theme.palette.mode === 'light' ? '#e0e0e0' : '#1F1F1F', 
            borderRadius: 3,
            px: { xs: 3, md: 6 },
            py: { xs: 4, md: 6 },
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: 'center',
            gap: 4,
            boxShadow: 2,
          }}
        >
          <Box sx={{ flex: 1, gap: 4, display: 'flex', flexDirection: 'column', textAlign: 'center', maxWidth: { lg: 400 } }}> 
            <Typography
              sx={{ fontSize: { xs: 14, sm: 18, md: 22, lg: 26 } }}
            >
              ACERCA DE NOSOTROS
            </Typography>
            <Typography
              sx={{ fontSize: { xs: 12, sm: 14, md: 15, lg: 18 }, maxWidth: 500 }}
            >
              Desde 2018, en Level Music ofrecemos soluciones audiovisuales de última generación para tus eventos. Con un equipo de expertos altamente calificados, nos dedicamos a transformar cada celebración en una experiencia memorable. Nos comprometemos contigo en cada paso, garantizando el éxito absoluto de tu evento.
            </Typography>
          </Box>
          <Box
            sx={{
              flex: 1,
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row', md: 'column' },
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Box
              component="img"
              src={ theme.palette.mode === 'light' ? "https://i.postimg.cc/WpZGS4CN/imagen-1-lm.png" : "https://i.postimg.cc/d3cTg8pL/imagen-1-dm.png"}
              alt="equipo"
              sx={{
                width: { xs: '75%', md: '90%' },
                height: 'auto',
                borderRadius: 1,
              }}
            />
          </Box>
        </Box>
      </Container>
  );
};
