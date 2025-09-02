import { useState } from 'react';
import { 
  AppBar, 
  Toolbar, 
  Container, 
  useTheme,
  Box
} from '@mui/material';
import { Logo, LandingDrawer, ProtectedDrawer } from './';
import { NavSections, AuthButtons, ToogleTheme, MenuDrawer } from '../custom';
import { useScreenSizes } from '../../../constants/screen-width';
import { useAuthStore } from '../../../../hooks';
import { menuItems as adminMenuItems } from '../../../../modules/admin/constants/menu-items-admin';
import { menuItems as clientMenuItems } from '../../../../modules/client/constants/menu-items-client';

export const NavBar = () => {
  const theme = useTheme();
  const { status, role } = useAuthStore();
  const { isLg } = useScreenSizes();

  const [landingDrawerOpen, setLandingDrawerOpen] = useState(false);
  const [protectedDrawerOpen, setProtectedDrawerOpen] = useState(false);

  const handleLandingDrawerToggle = () => {
    setLandingDrawerOpen((prev) => !prev);
  };

  const handleProtectedDrawerToggle = () => {
    setProtectedDrawerOpen((prev) => !prev);
  };

  return (
    <AppBar
      position="fixed"
      sx={{ backgroundColor: theme.palette.navbar.main }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {status === "authenticated" ? (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                width: '100%',
              }}
            >
              { isLg ? (
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    width: '100%',
                  }}
                >
                  <>
                    <Logo isNav />
                    <NavSections />
                  </>
                  <>
                    <ToogleTheme />
                    <AuthButtons />
                  </>
                </Box>
              ) : (
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    width: '100%',
                    gap: 1,
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <MenuDrawer handleDrawerToggle={handleProtectedDrawerToggle} type="menu" />
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Logo isNav />
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <MenuDrawer handleDrawerToggle={handleLandingDrawerToggle} />
                  </Box>
                </Box>
              )}
            </Box>
          ) : (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                width: '100%',
              }}
            >
              { isLg ? (
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    width: '100%',
                  }}
                >
                  <>
                    <Logo isNav />
                    <NavSections />
                  </>
                  <>
                    <ToogleTheme />
                    <AuthButtons />
                  </>
                </Box>
              ) : (
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    width: '100%',
                    gap: 1,
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Logo isNav />
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <MenuDrawer handleDrawerToggle={handleLandingDrawerToggle} type="menu" />
                  </Box>
                </Box>
              )}
            </Box>
          )}
        </Toolbar>
      </Container>

      {/* Drawer del landing */}
      <LandingDrawer
        drawerOpen={landingDrawerOpen}
        handleDrawerToggle={handleLandingDrawerToggle}
      />

      {/* Drawer del protected */}
      <ProtectedDrawer
  drawerOpen={protectedDrawerOpen}
  handleDrawerToggle={handleProtectedDrawerToggle}
  menuItems={
    role === 'Administrador'
      ? adminMenuItems
      : role === 'Cliente'
        ? clientMenuItems
        : undefined
  }
/>
    </AppBar>
  );
};

