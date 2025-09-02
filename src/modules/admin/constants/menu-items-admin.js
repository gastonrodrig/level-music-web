import { 
  Dashboard,
  Event,
  People,
  VolumeUp,
  Store,
  RoomService,
  Person
} from '@mui/icons-material';

export const menuItems = [
  { 
    text: 'Dashboard', 
    breadcrumb: 'Inicio',
    icon: Dashboard, 
    href: '/admin' 
  },
  { 
    text: 'Gestionar Eventos', 
    icon: Event, 
    subItems: [
      { 
        text: 'Eventos', 
        breadcrumb: 'Eventos',
        href: '/admin/events'
      },
      { 
        text: 'Tipo de Eventos', 
        breadcrumb: 'Tipo de Eventos',
        href: '/admin/event-types' 
      },
      { 
        text: 'Cotizaciones',
        breadcrumb: 'Cotizaciones',
        href: '/admin/quotes' 
      }, 
      { 
        text: 'Destacados',
        breadcrumb: 'Eventos Destacados',
        href: '/admin/featured-events' 
      }
    ]
  },
  { 
    text: 'Gestionar Trabajadores', 
    icon: People,
    subItems: [
      { 
        text: 'Trabajadores', 
        breadcrumb: 'Trabajadores',
        href: '/admin/workers' 
      },
      { 
        text: 'Tipo de Trabajadores', 
        breadcrumb: 'Tipo de Trabajadores',
        href: '/admin/worker-types' 
      }
    ]
  },
  { 
    text: 'Gestionar Recursos', 
    icon: VolumeUp, 
    subItems: [
      { 
        text: 'Recursos', 
        breadcrumb: 'Recursos',
        href: '/admin/resource' 
      },
      { 
        text: 'Mantenimiento', 
        breadcrumb: 'Mantenimiento de Recursos',
        href: '/admin/resource-maintenance' 
      }
    ]
  },
  { 
    text: 'Gestionar Clientes', 
    breadcrumb: 'Clientes',
    icon: Person,
    href: '/admin/client' 
  },
  { 
    text: 'Gestionar Servicios', 
    icon: RoomService,
    subItems: [
      { 
        text: 'Servicios', 
        breadcrumb: 'Servicios',
        href: '/admin/service',
        subItems: [
          {
            text: 'Nuevo Servicio',
            breadcrumb: 'Nuevo Servicio',
            href: '/admin/service/new',
          },
          {
            text: 'Editar Servicio',
            breadcrumb: 'Editar Servicio',
            href: '/admin/service/:serviceId',
          },
        ],
      },
      { 
        text: 'Tipo de Servicios', 
        breadcrumb: 'Tipo de Servicios',
        href: '/admin/service-type' 
      },
      { 
        text: 'Proveedores', 
        breadcrumb: 'Proveedores',
        href: '/admin/provider' 
      }
    ]
  },
  { 
    text: 'Almacén', 
    breadcrumb: 'Almacén',
    icon: Store, 
    href: '/admin/storehouse'
  }
];
