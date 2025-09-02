import { Box, Toolbar, useTheme } from '@mui/material';
import { Breadcrumbs, SidebarMenu } from '../../../shared/ui/components/common';
import { Outlet } from 'react-router-dom';
import { menuItems } from '../constants/menu-items-admin';
import { useScreenSizes } from '../../../shared/constants/screen-width';

export const AdminLayout = () => {
  const theme = useTheme();
  const { isLg } = useScreenSizes()

  return (
    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' } }}>
      {/* Sidebar */}
      {isLg && ( 
        <Box
          sx={{
            width: { md: 400, sm: '100%' },
            flexShrink: 0,
          }}
        >
          <Toolbar />
          <Box 
            sx={{ 
              overflow: 'auto', 
              mt: 2,
              backgroundColor: theme.palette.mode === 'light' ? '#F5F5F5' : '#1F1F1F',
              margin: 3,
              borderRadius: 3
            }}
          >
            <SidebarMenu menuItems={menuItems} />
          </Box>
        </Box>
      )}

      {/* Área principal */}
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        <Breadcrumbs menuItems={menuItems} />
        <Outlet />
      </Box>
    </Box>
  );
};
