import {
  Box,
  Typography,
  Grid,
  Card,
  CardActionArea,
  CardMedia,
  CardContent,
  Stack,
  TextField,
  useTheme,
} from '@mui/material';
import {
  BusinessCenter,
  Diversity3,
  Favorite,
  Celebration,
  Event,
  Work,
  Groups,
  School,
  Edit,
  CheckCircleRounded
} from '@mui/icons-material';
import { useFormContext } from 'react-hook-form';
import { 
  categoriesEvents as categories,
  socialEvents
} from '../../constants';

export const EventTypeForm = () => {
  const { setValue, watch, register } = useFormContext();
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const selectedCategory = watch('eventCategory');
  const selectedType = watch('eventType');
  const customType = watch('customEventType', '');

  const corporateEvents = [
  { key: 'conferencia', label: 'Conferencia', desc: 'Charlas profesionales', icon: <Work /> },
  { key: 'seminario', label: 'Seminario', desc: 'Formación y aprendizaje', icon: <School /> },
  { key: 'networking', label: 'Networking', desc: 'Conexiones y relaciones', icon: <Groups /> },
  { key: 'otros', label: 'Otros', desc: 'Especifica tu tipo de evento corporativo', icon: <Edit /> },
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
    selectedCategory === 'social'
      ? socialEvents
      : selectedCategory === 'corporativo'
      ? corporateEvents
      : [];

  return (
    <Box>
      {/* Encabezado */}
      <Box textAlign="center" mb={4}>
        <Typography variant="h5" fontWeight={800} gutterBottom>
          ¿Qué tipo de evento deseas organizar?
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Selecciona la categoría de tu evento y luego el tipo específico.
        </Typography>
      </Box>

      {/* Selección categoría con estilo visual */}
      <Grid container spacing={3} mb={4} justifyContent="center">
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat.key;
          return (
            <Grid item xs={12} md={6} key={cat.key}>
              <Card
                sx={{
                  borderRadius: 3,
                  overflow: 'hidden',
                  border: `2px solid ${isSelected ? '#f7931e' : 'transparent'}`,
                  boxShadow: isSelected
                    ? '0 10px 28px rgba(247,147,30,.35)'
                    : isDark
                    ? '0 6px 20px rgba(0,0,0,.3)'
                    : '0 6px 20px rgba(2,8,23,.06)',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                }}
              >
                <CardActionArea onClick={() => handleCategoryPick(cat.key)}>
                  <Box sx={{ position: 'relative' }}>
                    <CardMedia
                      component="img"
                      height="180"
                      image={cat.image}
                      alt={cat.title}
                      sx={{ objectFit: 'cover' }}
                    />
                    <Box
                      sx={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        bgcolor: 'rgba(0,0,0,0.6)',
                        color: '#fff',
                        px: 2,
                        py: 1,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                      }}
                    >
                      {cat.icon}
                      <Typography fontWeight={700}>{cat.title}</Typography>
                      {isSelected && <CheckCircleRounded color="warning" />}
                    </Box>
                  </Box>
                  <CardContent>
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
                      border: `2px solid ${isSelected ? '#f7931e' : isDark ? '#494949' : '#efefef'}`,
                      borderRadius: 2,
                      cursor: 'pointer',
                    }}
                  >
                    <CardActionArea onClick={() => handleTypePick(evt.key)}>
                      <CardContent>
                        <Stack direction="row" spacing={1} alignItems="center">
                          {evt.icon}
                          <Typography fontWeight={600}>{evt.label}</Typography>
                          {isSelected && <CheckCircleRounded color="warning" />}
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
              <Typography variant="subtitle1" fontWeight={600} gutterBottom>
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
