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
        text: 'Cotizaciones', 
        breadcrumb: 'Cotizaciones',
        href: '/cliente/event-quotes',
        subItems: [
          {
           text: 'Detalle Cotización', 
           breadcrumb: 'Detalle Cotización',
          href: '/cliente/event-quotes/details' 
          },
        
        ],
      },
     
      { 
        text: 'En Seguimiento', 
        breadcrumb: 'Eventos En Seguimiento',
        href: '/cliente/event-to-do' 
      },
      { 
        text: 'Realizados', 
        breadcrumb: 'Eventos Realizados',
        href: '/cliente/event-made' 
      },
      { 
        text: 'Solicitudes de Reprogramación', 
        breadcrumb: 'Solicitudes de Reprogramación',
        href: '/cliente/reprogramings-requests' 
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
