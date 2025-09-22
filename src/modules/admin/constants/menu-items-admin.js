import { 
  Dashboard,
  Event,
  People,
  VolumeUp,
  Store,
  RoomService,
  Person,
  Person2Outlined
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
    text: 'Gestionar Equipos', 
    icon: VolumeUp, 
    subItems: [
      { 
        text: 'Equipos', 
        breadcrumb: 'Equipos',
        href: '/admin/equipments' 
      },
      { 
        text: 'Mantenimiento', 
        breadcrumb: 'Mantenimiento de Equipos',
        href: '/admin/equipment-maintenance' 
      }
    ]
  },
  { 
    text: 'Gestionar Clientes', 
    icon: Person, 
    subItems: [
      { 
        text: 'Persona', 
        breadcrumb: 'Clientes - Persona',
        href: '/admin/client-person' 
      },
      { 
        text: 'Empresa', 
        breadcrumb: 'Clientes - Empresa',
        href: '/admin/client-company' 
      }
    ]
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
            href: '/admin/service/edit',
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
