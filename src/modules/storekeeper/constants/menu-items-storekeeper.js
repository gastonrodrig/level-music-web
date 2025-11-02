import { 
  Dashboard,
  Inventory,
  Person,
} from '@mui/icons-material';

export const menuItems = [
  { 
    text: 'Dashboard', 
    breadcrumb: 'Inicio',
    icon: Dashboard, 
    href: '/storekeeper' 
  },
  { 
    text: 'Almacen', 
    icon: Inventory,
    subItems: [
      { 
        text: 'Movimientos', 
        breadcrumb: 'Movimientos',
        href: '/storekeeper/movements' 
      },
      { 
        text: 'Reportes', 
        breadcrumb: 'Reportes',
        href: '/storekeeper/reports' 
      },
    ]
  },
  { 
    text: 'Perfil', 
    breadcrumb: 'Perfil',
    icon: Person,
    href: '/storekeeper/view-profile' 
  }
];
