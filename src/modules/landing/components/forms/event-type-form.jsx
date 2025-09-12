import {
  Box,
  Typography,
  Grid,
  Card,
  CardActionArea,
  CardMedia,
  CardContent,
  Stack,
} from '@mui/material';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import Diversity3Icon from '@mui/icons-material/Diversity3';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import { useFormContext } from 'react-hook-form';

export const EventTypeForm = () => {
  const { setValue, watch } = useFormContext();
  const selected = watch('eventType');

  const options = [
    {
      key: 'corporativo',
      title: 'Eventos Corporativos',
      desc: 'Conferencias, seminarios, reuniones de empresa y networking.',
      icon: <BusinessCenterIcon />,
      image:
        'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1600&auto=format&fit=crop',
    },
    {
      key: 'social',
      title: 'Eventos Sociales',
      desc: 'Bodas, cumpleaños, celebraciones familiares y reuniones sociales.',
      icon: <Diversity3Icon />,
      image:
        'https://images.unsplash.com/photo-1464347744102-11db6282f854?q=80&w=1600&auto=format&fit=crop',
    },
  ];

  const handlePick = (key) => {
    setValue('eventType', key, { shouldValidate: true });
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box textAlign="center" my={4}>
        <Typography variant="h5" fontWeight={800} gutterBottom>
          ¿Qué tipo de evento deseas organizar?
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Selecciona el tipo de evento que mejor se adapte a tus necesidades.
        </Typography>
      </Box>

      <Grid container spacing={3} justifyContent="center">
        {options.map((opt) => {
          const isSelected = selected === opt.key;
          return (
            <Grid item xs={12} md={6} key={opt.key}>
              <Card
                sx={{
                  position: 'relative',
                  borderRadius: 3,
                  overflow: 'hidden',
                  border: `2px solid ${isSelected ? '#f7931e' : 'transparent'}`,
                  boxShadow: isSelected
                    ? '0 8px 24px rgba(247,147,30,.3)'
                    : '0 4px 12px rgba(0,0,0,.15)',
                  transition: 'all 0.25s ease',
                  cursor: 'pointer',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 12px 28px rgba(0,0,0,.25)',
                  },
                }}
              >
                <CardActionArea onClick={() => handlePick(opt.key)}>
                  <CardMedia
                    component="img"
                    height="200"
                    image={opt.image}
                    alt={opt.title}
                    sx={{
                      objectFit: 'cover',
                      filter: isSelected ? 'brightness(0.9)' : 'brightness(0.75)',
                      transition: 'all 0.3s ease',
                    }}
                  />

                  <CardContent sx={{ p: 3 }}>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      {opt.icon}
                      <Typography variant="h6" fontWeight={700}>
                        {opt.title}
                      </Typography>
                      {isSelected && <CheckCircleRoundedIcon color="warning" />}
                    </Stack>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1.2 }}>
                      {opt.desc}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};
