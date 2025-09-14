import {
  Favorite,
  Celebration,
  Event,
  Work,
  Groups,
  School,
  Edit
} from '@mui/icons-material';

export const socialEvents = [
  { key: 'boda', label: 'Boda', desc: 'Ceremonia y recepción', icon: <Favorite /> },
  { key: 'cumple', label: 'Cumpleaños', desc: 'Fiesta de todas las edades', icon: <Celebration /> },
  { key: 'aniversario', label: 'Aniversario', desc: 'Bodas de plata, oro, etc.', icon: <Event /> },
  { key: 'babyshower', label: 'Baby Shower', desc: 'Celebración previa al bebé', icon: <Groups /> },
  { key: 'graduacion', label: 'Graduación', desc: 'Logros académicos o profesionales', icon: <School /> },
  { key: 'otros', label: 'Otros', desc: 'Especifica tu tipo de evento', icon: <Edit /> },
];