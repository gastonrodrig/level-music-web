import { useSelector, useDispatch } from 'react-redux';
import {
  Drawer,
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  useTheme,
  Divider,
  ListItemIcon,
  Switch,
} from "@mui/material";
import { sections } from '../../../../constants/custom/nav-sections';
import { Link, useNavigate } from 'react-router-dom';
import { Login, Logout, Brightness7, Brightness4 } from '@mui/icons-material'; 
import { toggleTheme } from '../../../../../store';
import { useAuthStore } from '../../../../../hooks';

export const LandingDrawer = ({ drawerOpen, handleDrawerToggle }) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { mode } = useSelector((state) => state.theme);
  const { status, onLogout } = useAuthStore(); 

  const handleLogout = () => {
    onLogout();
    navigate('/auth/login'); 
    handleDrawerToggle(); 
  };

  const isLoggedIn = status === 'authenticated' || status === 'first-login-password';

  return (
    <Drawer
      variant="temporary"
      anchor="right"
      open={drawerOpen}
      onClose={handleDrawerToggle}
      ModalProps={{
        keepMounted: true,
      }}
      sx={{
        '& .MuiDrawer-paper': {
          bgcolor: theme.palette.primary.main,
          color: 'white'
        },
      }}
    >
      <Box 
        sx={{ 
          width: 250, 
          padding: 2, 
          display: 'flex', 
          flexDirection: 'column', 
          justifyContent: 'space-between', 
          height: '100%' 
        }}
      >
        <List>
          {sections
            .filter((section) => !(status === 'authenticated' && section.id === 1)) 
            .map((section) => (
              <ListItem key={section.id} disablePadding>
                <ListItemButton
                  component={Link} 
                  to={section.url} 
                  onClick={handleDrawerToggle}
                >
                  <ListItemText primary={section.title} />
                </ListItemButton>
              </ListItem>
            ))}
        </List>
        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'start', alignItems: 'center', mb: 2 }}>
            <Switch
              checked={mode === 'dark'}
              onChange={() => dispatch(toggleTheme())}
              color="default"
            />
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'white', fontSize: 16 }}>
              {mode === 'dark' ? (
                <>
                  <Brightness7 />
                  MODO CLARO
                </>
              ) : (
                <>
                  <Brightness4 />
                  MODO OSCURO
                </>
              )}
            </Box>
          </Box>
          <Divider color="white" sx={{ mx: -2, mb: 1 }} />
          <ListItem disablePadding sx={{ mb: -1 }}>
            <ListItemButton
              onClick={isLoggedIn ? handleLogout : handleDrawerToggle}
              component={isLoggedIn ? 'button' : Link}
              to={isLoggedIn ? undefined : '/auth/login'}
              sx={{ gap: 1 }}
            >
              <ListItemIcon sx={{ color: 'white', minWidth: 'auto' }}>
                {isLoggedIn ? <Logout /> : <Login />}
              </ListItemIcon>
              <ListItemText primary={isLoggedIn ? 'CERRAR SESIÓN' : 'INICIAR SESIÓN'} />
            </ListItemButton>
          </ListItem>
        </Box>
      </Box>
    </Drawer>
  );
};