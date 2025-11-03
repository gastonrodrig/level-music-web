import { Typography, useTheme, Box } from '@mui/material';
import { Link } from 'react-router-dom'; // Importa Link para navegación interna

export const Logo = ({ isNav = false }) => {
  const theme = useTheme();

  return (
    <Box 
      component={isNav ? Link : "div"} 
      to={isNav ? "/" : undefined} 
      sx={{
        alignItems: 'center',
        textDecoration: 'none',
        color: 'inherit',
        display: 'flex',
        flexGrow: { md: 0, xs: 1 },
        cursor: isNav ? 'pointer' : 'default'
      }}
    >
      {/* Imagen del logo */}
      <Box
        component="img"
        src={"https://i.postimg.cc/tCyBxPJ9/logo.png"}
        alt="Logo Level Music"
        sx={{
          width: { md: 45, xs: 40 }, 
          height: { md: 40, xs: 35 },
          mr: 2,
        }}
      />

      {/* Texto del logo */}
      <Typography 
        variant="h6" 
        sx={{
          fontSize: isNav ? { md: '1.2rem', xs: '1rem'} : { md: '1.8rem', xs: '1.2rem'},
          fontWeight: 700,
          letterSpacing: '.2rem',
          textDecoration: 'none',
          color: isNav ? 'white' : theme.palette.text.primary,
        }}
      >
        LEVEL MUSIC
      </Typography>
    </Box>
  );
};
