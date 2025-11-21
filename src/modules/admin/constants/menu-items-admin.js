import { 
  Dashboard,
  Event,
  People,
  VolumeUp,
  Store,
  RoomService,
  Person,
  Timelapse,
  EventNote
} from '@mui/icons-material';

export const menuItems = [
  { 
    text: 'Resumen', 
    breadcrumb: 'Inicio',
    icon: Dashboard, 
    href: '/admin' 
  },
  { 
    text: 'Gestionar Citas', 
    breadcrumb: 'Citas',
    icon: EventNote, 
    href: '/admin/appointments' 
  },
  { 
    text: 'Gestionar Eventos', 
    icon: Event, 
    subItems: [
      { 
        text: 'Tipo de Eventos', 
        breadcrumb: 'Tipo de Eventos',
        href: '/admin/event-types' 
      },
      { 
        text: 'Cotizaciones',
        breadcrumb: 'Cotizaciones',
        href: '/admin/quotations',
        subItems: [
          {
            text: 'Asignar Recursos',
            breadcrumb: 'Asignar Recursos',
            href: '/admin/quotations/assign',
          },
          {
            text: 'Nueva Cotización',
            breadcrumb: 'Nueva Cotización',
            href: '/admin/quotations/new',
          },
          {
            text: 'Editar Cotización',
            breadcrumb: 'Editar Cotización',
            href: '/admin/quotations/edit',
          },
          {
            text: 'Programar Pagos',
            breadcrumb: 'Programar Pagos',
            href: '/admin/quotations/payments-programming',
          },
          {
            text: 'Historial ',
            breadcrumb: 'Historial',
            href: '/admin/quotations/history',
          },
          {
            text: 'Actividades ',
            breadcrumb: 'Actividades',
            href: '/admin/quotations/activities',
          },
          {
            text: 'Pagos Aprobados',
            breadcrumb: 'Pagos Aprobados',
            href: '/admin/quotations/payments-approved',
          },
          {
            text: 'Enviar Propuesta',
            breadcrumb: 'Enviar Propuesta',
            href: '/admin/quotations/send-proposal',
          }
        ],
      }, 
      {
        text: 'En Seguimiento', 
        breadcrumb: 'Eventos',
        href: '/admin/event-ongoing',
        subItems: [
          {
            text: 'Reprogramar Evento',
            breadcrumb: 'Reprogramar Evento',
            href: '/admin/event-ongoing/reprograming',
          },
          {
            text: 'Control Actividades',
            breadcrumb: 'Control de Actividades',
            href: '/admin/event-ongoing/activities',
          },
          {
            text: 'Ver Ordenes',
            breadcrumb: 'Ordenes de Compra',
            href: '/admin/event-ongoing/orders',
          }
        ],
      },
      {
        text: 'Destacados',
        breadcrumb: 'Eventos Destacados',
        href: '/admin/featured-events' 
      }
    ]
  },
  { 
    text: 'Reprogramaciones',
    icon: Timelapse,
    subItems: [
      { 
        text: 'Solicitudes', 
        breadcrumb: 'Solicitudes de Reprogramación de eventos',
        href: '/admin/requests' 
      },
      { 
        text: 'Reprogramar', 
        breadcrumb: 'Reprogramar eventos',
        href: '/admin/reschedule' 
      }
    ]
  },
  {
    text: 'Gestionar Trabajadores', 
    icon: People,
    subItems: [
      { 
        text: 'Tipo de Trabajadores', 
        breadcrumb: 'Tipo de Trabajadores',
        href: '/admin/worker-types' 
      },
      { 
        text: 'Trabajadores', 
        breadcrumb: 'Trabajadores',
        href: '/admin/workers' 
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
        breadcrumb: 'Persona',
        href: '/admin/client-person' 
      },
      { 
        text: 'Empresa', 
        breadcrumb: 'Empresa',
        href: '/admin/client-company' 
      }
    ]
  },
  { 
    text: 'Gestionar Servicios', 
    icon: RoomService,
    subItems: [
      { 
        text: 'Tipo de Servicios', 
        breadcrumb: 'Tipo de Servicios',
        href: '/admin/service-type' 
      },
      { 
        text: 'Proveedores', 
        breadcrumb: 'Proveedores',
        href: '/admin/provider' 
      },
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
