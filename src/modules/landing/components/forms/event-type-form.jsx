import {
  Box,
  Typography,
  Grid,
  Card,
  CardActionArea,
  CardContent,
  Stack,
  TextField,
} from '@mui/material';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import Diversity3Icon from '@mui/icons-material/Diversity3';
import FavoriteIcon from '@mui/icons-material/Favorite';
import CelebrationIcon from '@mui/icons-material/Celebration';
import EventIcon from '@mui/icons-material/Event';
import WorkIcon from '@mui/icons-material/Work';
import GroupsIcon from '@mui/icons-material/Groups';
import SchoolIcon from '@mui/icons-material/School';
import EditIcon from '@mui/icons-material/Edit';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import { useFormContext } from 'react-hook-form';

export const EventTypeForm = () => {
  const { setValue, watch, register } = useFormContext();

  const selectedCategory = watch('eventCategory');
  const selectedType = watch('eventType');
  const customType = watch('customEventType', '');

  // Categorías principales
  const categories = [
    {
      key: 'corporativo',
      title: 'Eventos Corporativos',
      desc: 'Conferencias, seminarios y networking',
      icon: <BusinessCenterIcon />,
    },
    {
      key: 'social',
      title: 'Eventos Sociales',
      desc: 'Bodas, cumpleaños y celebraciones familiares',
      icon: <Diversity3Icon />,
    },
  ];

  // Tipos de eventos sociales
  const socialEvents = [
    { key: 'boda', label: 'Boda', desc: 'Ceremonia y recepción', icon: <FavoriteIcon /> },
    { key: 'cumple', label: 'Cumpleaños', desc: 'Fiesta de todas las edades', icon: <CelebrationIcon /> },
    { key: 'aniversario', label: 'Aniversario', desc: 'Bodas de plata, oro, etc.', icon: <EventIcon /> },
    { key: 'babyshower', label: 'Baby Shower', desc: 'Celebración previa al bebé', icon: <GroupsIcon /> },
    { key: 'graduacion', label: 'Graduación', desc: 'Logros académicos o profesionales', icon: <SchoolIcon /> },
    { key: 'otros', label: 'Otros', desc: 'Especifica tu tipo de evento', icon: <EditIcon /> },
  ];

  // Tipos de eventos corporativos
  const corporateEvents = [
    { key: 'conferencia', label: 'Conferencia', desc: 'Charlas profesionales', icon: <WorkIcon /> },
    { key: 'seminario', label: 'Seminario', desc: 'Formación y aprendizaje', icon: <SchoolIcon /> },
    { key: 'networking', label: 'Networking', desc: 'Conexiones y relaciones', icon: <GroupsIcon /> },
    { key: 'otros', label: 'Otros', desc: 'Especifica tu tipo de evento corporativo', icon: <EditIcon /> },
  ];

  const handleCategoryPick = (key) => {
    setValue('eventCategory', key, { shouldValidate: true });
    setValue('eventType', '');
    setValue('customEventType', '');
  };

  const handleTypePick = (key) => {
    setValue('eventType', key, { shouldValidate: true });
    if (key !== 'otros') {
      setValue('customEventType', '');
    }
  };

  const currentOptions =
    selectedCategory === 'social' ? socialEvents : selectedCategory === 'corporativo' ? corporateEvents : [];

  return (
    <Box>
      {/* Selección categoría */}
      <Typography variant="h6" fontWeight={700} mb={2} textAlign="center">
        Selecciona la categoría de tu evento
      </Typography>
      <Grid container spacing={3} mb={4} justifyContent="center">
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat.key;
          return (
            <Grid item xs={12} md={6} key={cat.key}>
              <Card
                sx={{
                  border: `2px solid ${isSelected ? '#f7931e' : 'transparent'}`,
                  borderRadius: 3,
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  '&:hover': { boxShadow: '0 6px 16px rgba(0,0,0,0.25)' },
                }}
              >
                <CardActionArea onClick={() => handleCategoryPick(cat.key)}>
                  <CardContent>
                    <Stack direction="row" spacing={1} alignItems="center">
                      {cat.icon}
                      <Typography fontWeight={700}>{cat.title}</Typography>
                      {isSelected && <CheckCircleRoundedIcon color="warning" />}
                    </Stack>
                    <Typography variant="body2" color="text.secondary">
                      {cat.desc}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {/* Subtipos dinámicos */}
      {selectedCategory && (
        <>
          <Typography variant="h6" fontWeight={700} mb={2}>
            Selecciona tu evento {selectedCategory === 'social' ? 'social' : 'corporativo'}
          </Typography>
          <Grid container spacing={2}>
            {currentOptions.map((evt) => {
              const isSelected = selectedType === evt.key;
              return (
                <Grid item xs={12} md={4} key={evt.key}>
                  <Card
                    sx={{
                      border: `2px solid ${isSelected ? '#f7931e' : 'transparent'}`,
                      borderRadius: 2,
                      cursor: 'pointer',
                    }}
                  >
                    <CardActionArea onClick={() => handleTypePick(evt.key)}>
                      <CardContent>
                        <Stack direction="row" spacing={1} alignItems="center">
                          {evt.icon}
                          <Typography fontWeight={600}>{evt.label}</Typography>
                          {isSelected && <CheckCircleRoundedIcon color="warning" />}
                        </Stack>
                        <Typography variant="body2" color="text.secondary">
                          {evt.desc}
                        </Typography>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                </Grid>
              );
            })}
          </Grid>

          {/* Campo "Otros" */}
          {selectedType === 'otros' && (
            <Box mt={3}>
              <Typography
                variant="subtitle1"
                fontWeight={600}
                gutterBottom
                sx={{ color: 'text.primary' }}
              >
                Especifica tu tipo de evento
              </Typography>
              <TextField
                fullWidth
                placeholder="Ej: Reunión familiar, Evento de caridad, Lanzamiento de producto..."
                {...register('customEventType')}
              />
            </Box>
          )}

        </>
      )}

      {/* Resumen */}
      {selectedCategory && (
        <Box mt={4} p={2} borderRadius={2} bgcolor="rgba(255,255,255,0.05)">
          <Typography variant="subtitle1" fontWeight={600}>
            Tu selección
          </Typography>
          <Typography variant="body2">
            {selectedCategory === 'social' ? 'Eventos Sociales' : 'Eventos Corporativos'}
            {selectedType &&
              ` > ${
                selectedType === 'otros'
                  ? customType || 'Especificar tipo de evento...'
                  : currentOptions.find((e) => e.key === selectedType)?.label
              }`}
          </Typography>
        </Box>
      )}
    </Box>
  );
};
