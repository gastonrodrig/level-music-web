import { 
  Dashboard,
  Event,
  Person
} from '@mui/icons-material';

export const menuItems = [
  { 
    text: 'Dashboard', 
    breadcrumb: 'Inicio',
    icon: Dashboard, 
    href: '/cliente' 
  },
  
  { 
    text: 'Eventos', 
    icon: Event,
    subItems: [
      { 
        text: 'Realizados', 
        breadcrumb: 'Eventos Realizados',
        href: '/cliente/event-made' 
      },
      { 
        text: 'Por Realizar', 
        breadcrumb: 'Eventos Por Realizar',
        href: '/cliente/event-to-do' 
      },
      { 
        text: 'Cotizaciones', 
        breadcrumb: 'Eventos Por Cotizar',
        href: '/cliente/event-quotes' 
      }
    ]
  },
  { 
    text: 'Gestionar Perfil', 
    breadcrumb: 'Perfil',
    icon: Person,
    href: '/cliente/edit-profile' 
  }
 
];
