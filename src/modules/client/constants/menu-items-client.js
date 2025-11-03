import { 
  Dashboard,
  Event,
  EventNote,
  Person,
} from '@mui/icons-material';

export const menuItems = [
  { 
    text: 'Dashboard', 
    breadcrumb: 'Inicio',
    icon: Dashboard, 
    href: '/client' 
  },
  { 
    text: 'Eventos', 
    icon: Event,
    subItems: [
      { 
        text: 'Cotizaciones', 
        breadcrumb: 'Cotizaciones',
        href: '/client/quotations',
        subItems: [
          {
            text: 'Detalle Cotización', 
            breadcrumb: 'Detalle Cotización',
            href: '/client/quotations/details' 
          },
          {
            text: 'Realizar Pagos', 
            breadcrumb: 'Realizar Pagos',
            href: '/client/quotations/payments' 
          },
        ],
      },
      { 
        text: 'En Seguimiento', 
        breadcrumb: 'Eventos En Seguimiento',
        href: '/client/events-ongoing' 
      },
      { 
        text: 'Realizados', 
        breadcrumb: 'Eventos Realizados',
        href: '/client/events-made' 
      },
      { 
        text: 'Solicitudes de Reprogramación', 
        breadcrumb: 'Solicitudes de Reprogramación',
        href: '/client/reprogramming-requests' 
      }
    ]
  },
  { 
    text: 'Gestionar Perfil', 
    breadcrumb: 'Perfil',
    icon: Person,
    href: '/client/edit-profile' 
  }
];
