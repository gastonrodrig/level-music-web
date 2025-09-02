import { Breadcrumbs as MuiBreadcrumbs, Link, useTheme } from '@mui/material';
import { useLocation } from 'react-router-dom';
import { Link as RouterLink } from 'react-router-dom';

export const Breadcrumbs = ({ menuItems, homeLabel = 'Inicio' }) => {
  const location = useLocation();
  const theme = useTheme();

  
  // Detecta base según URL
  const isAdmin = location.pathname.startsWith('/admin');
  const homeHref = isAdmin ? '/admin' : '/cliente';
  // Oculta breadcrumbs en la raíz de admin o cliente
  if (location.pathname === '/admin' || location.pathname === '/cliente') {
    return null;
  }

  const findMenuItem = (path) => {
    for (const item of menuItems) {
      if (item.href === path) {
        return item; 
      }
      if (item.subItems) {
        for (const subItem of item.subItems) {
          if (subItem.href === path) {
            return subItem;
          }
          if (subItem.subItems) {
            const nestedSubItem = subItem.subItems.find((nested) => nested.href === path);
            if (nestedSubItem) {
              return nestedSubItem;
            }
          }
        }
      }
    }
    return null; 
  };

  const buildBreadcrumbs = () => {
    const pathnames = location.pathname.split('/').filter((x) => x);

    return pathnames.map((_, index) => {
      const to = `/${pathnames.slice(0, index + 1).join('/')}`;
      const menuItem = findMenuItem(to);

      if (menuItem) {
        if (menuItem.href === homeHref) {
          return null;
        }

        return (
          <Link
            key={to}
            underline="hover" 
            color="inherit"
            to={to} 
            component={RouterLink}
            sx={{
              fontWeight: 500,
              fontSize: '18px',
              color: theme.palette.text.primary,
              textDecoration: index === pathnames.length - 1 ? 'underline' : 'none', 
              '&:hover': {
                textDecoration: 'underline', 
              },
            }}
          >
            {menuItem.breadcrumb} 
          </Link>
        );
      }

      return null; 
    }).filter(Boolean); 
  };

  return (
    <MuiBreadcrumbs
      aria-label="breadcrumb"
      separator="›"
      sx={{
        mb: 2,
        '& .MuiBreadcrumbs-separator': {
          fontSize: '18px',
        },
      }}
    >
      <Link 
        underline="hover" 
        color="inherit" 
        to={homeHref}
        component={RouterLink}
        sx={{
          fontWeight: 500,
          fontSize: '18px',
          textDecoration: 'none',
        }}
      >
        {homeLabel}
      </Link>
      {buildBreadcrumbs()}
    </MuiBreadcrumbs>
  );
};
