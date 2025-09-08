import { Person, Event, Celebration , RestaurantMenu } from '@mui/icons-material';
import { PersonalInfoForm, EventDetailsForm, ServicesForm, EventTypeForm } from '..';

export const StepSections = [
  {
    label: 'Tipo de Evento', 
    icon: <Celebration  />,
    component: <EventTypeForm />
  },
  {
    label: 'Información Personal', 
    icon: <Person />, 
    component: <PersonalInfoForm /> 
  },
  {
    label: 'Detalles del Evento', 
    icon: <Event />,
    component: <EventDetailsForm />
  },
  {
    label: 'Servicios Adicionales', 
    icon: <RestaurantMenu />,
    component: <ServicesForm />
  }
];