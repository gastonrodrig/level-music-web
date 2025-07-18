import { Link, useNavigate } from 'react-router-dom';
import { Box, Button, IconButton, Container } from '@mui/material';
import { Login as LoginIcon, PersonAdd as PersonAddIcon, Logout as LogoutIcon } from '@mui/icons-material';
import { useScreenSizes } from '../../../constants/screen-width';
import { useAuthStore } from '../../../../hooks';

export const AuthButtons = () => {
  const { isMd } = useScreenSizes();
  const navigate = useNavigate();

  const { onLogout, status } = useAuthStore();

  const handleLogout = () => onLogout() && navigate('/auth/login');

  const isLoggedIn = status === 'authenticated' || status === 'change-password';

  if (isLoggedIn) {
    return (
      <Box sx={{ flexGrow: 0, mx: { lg: -3, xs: 0 } }}>
        {isMd ? (
          <Button 
            variant="outlined" 
            startIcon={<LogoutIcon />} 
            sx={{ border: 'none', mx: 2, color: 'white' }} 
            onClick={handleLogout}
          >
            Cerrar Sesión
          </Button>
        ) : (
          <IconButton onClick={handleLogout}>
            <LogoutIcon sx={{ color: 'white' }} />
          </IconButton>
        )}
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 0, mx: { lg: -3, xs: 0 } }}>
      {isMd ? (
        <Container>
          {[
            { to: '/auth/login', icon: <LoginIcon />, text: 'Iniciar Sesión' },
            { to: '/auth/register', icon: <PersonAddIcon />, text: 'Registrarse' }
          ].map(({ to, icon, text }) => (
            <Button 
              key={to} 
              variant="outlined" 
              startIcon={icon} 
              sx={{ border: 'none', p: 1, color: 'white' }} 
              component={Link} 
              to={to}
            >
              {text}
            </Button>
          ))}
        </Container>
      ) : (
        <IconButton component={Link} to="/auth/login">
          <LoginIcon sx={{ color: 'white' }}/>
        </IconButton>
      )}
    </Box>
  );
};
