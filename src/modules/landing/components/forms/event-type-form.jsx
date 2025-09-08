import {
  Box,
  Typography,
  Chip,
  Grid,
  Card,
  CardActionArea,
  CardMedia,
  CardContent,
  Stack,
  Alert,
} from '@mui/material';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import Diversity3Icon from '@mui/icons-material/Diversity3';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import { useEventTypeValidation } from '../../../../hooks';

/**
 * Props:
 *  - onSelect?: (type: 'corporativo' | 'social') => void  // avanzar al siguiente paso
 *  - onValidationChange?: (isValid: boolean) => void     // reportar si hay selección válida
 */
export const EventTypeForm = ({ onSelect, onValidationChange }) => {
  const { selected, showError, handleSelection } = useEventTypeValidation(onValidationChange);

  const handlePick = (key) => {
    handleSelection(key, onSelect);
  };

  const options = [
    {
      key: 'corporativo',
      title: 'Eventos Corporativos',
      desc:
        'Conferencias, seminarios, reuniones de empresa y eventos de networking profesional.',
      icon: <BusinessCenterIcon fontSize="small" />,
      image:
        'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1600&auto=format&fit=crop',
    },
    {
      key: 'social',
      title: 'Eventos Sociales',
      desc:
        'Bodas, cumpleaños, celebraciones familiares y reuniones sociales.',
      icon: <Diversity3Icon fontSize="small" />,
      image:
        'https://images.unsplash.com/photo-1464347744102-11db6282f854?q=80&w=1600&auto=format&fit=crop',
    },
  ];

  return (
    <Box sx={{ width: '100%' }}>
      {/* Encabezado */}
      <Box
        sx={{
          maxWidth: 1000,
          mx: 'auto',
          pt: { xs: 2, sm: 3 },
          pb: { xs: 2, sm: 3 },
          px: 2,
          textAlign: 'center',
        }}
      >
        <Typography
          component="h1"
          sx={{
            fontSize: { xs: 24, sm: 32, md: 36 },
            fontWeight: 800,
            color: 'text.primary',
            mb: 1,
          }}
        >
          ¿Qué Tipo de Evento Deseas Organizar?
        </Typography>
        <Typography
          component="p"
          sx={{
            maxWidth: 800,
            mx: 'auto',
            fontSize: { xs: 14, sm: 16 },
            lineHeight: 1.7,
            color: 'text.secondary',
          }}
        >
          Selecciona el tipo de evento que mejor se adapte a tus necesidades.
          Cada opción incluye servicios especializados para tu ocasión.
        </Typography>
      </Box>

      {/* Grid de 2 cartas */}
      <Box sx={{ maxWidth: 1100, mx: 'auto', px: { xs: 2, sm: 3 }, pb: 4 }}>
        <Grid container spacing={{ xs: 2, md: 3 }}>
          {options.map((opt) => {
            const isSelected = selected === opt.key;

            return (
              <Grid item xs={12} md={6} key={opt.key}>
                <Card
                  elevation={0}
                  sx={{
                    height: 300,
                    borderRadius: 3,
                    overflow: 'hidden',
                    border: '1px solid',
                    borderColor: isSelected ? 'warning.main' : 'divider',
                    boxShadow: isSelected
                      ? '0 10px 28px rgba(247, 147, 30, .35)'
                      : (theme) => theme.palette.mode === 'dark' 
                        ? '0 6px 20px rgba(0,0,0,.3)' 
                        : '0 6px 20px rgba(2,8,23,.06)',
                    transition: 'transform 200ms ease, box-shadow 200ms ease',
                    '&:hover': {
                      transform: 'translateY(-3px)',
                      boxShadow: (theme) => theme.palette.mode === 'dark'
                        ? '0 14px 32px rgba(0,0,0,.4), 0 10px 28px rgba(0,0,0,.2)'
                        : '0 14px 32px rgba(2,8,23,.12), 0 10px 28px rgba(2,8,23,.06)',
                    },
                    position: 'relative',
                    bgcolor: 'background.paper',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  {/* Marca seleccion */}
                  {isSelected && (
                    <Stack
                      direction="row"
                      alignItems="center"
                      spacing={0.5}
                      sx={{
                        position: 'absolute',
                        top: 10,
                        left: 10,
                        bgcolor: '#fff',
                        color: '#111',
                        px: 1.2,
                        py: 0.5,
                        borderRadius: 999,
                        fontSize: 12,
                        fontWeight: 700,
                        zIndex: 2,
                      }}
                    >
                      <CheckCircleRoundedIcon sx={{ fontSize: 16 }} />
                      <span>Seleccionado</span>
                    </Stack>
                  )}

  
                  <CardActionArea 
                    onClick={() => handlePick(opt.key)}
                    sx={{ 
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'stretch',
                      justifyContent: 'flex-start',
                      '& .MuiCardActionArea-focusHighlight': {
                        opacity: 0.1,
                      },
                      '&:hover .MuiCardActionArea-focusHighlight': {
                        opacity: 0.05,
                      }
                    }}
                  >
                    <Box sx={{ position: 'relative', flex: '0 0 auto' }}>
                      <CardMedia
                        component="img"
                        height="180"
                        image={opt.image}
                        alt={opt.title}
                        sx={{
                          objectFit: 'cover',
                          filter: isSelected ? 'saturate(1.1)' : 'none',
                        }}
                      />
                      {/* franja inferior translúcida como en la referencia */}
                      <Box
                        sx={{
                          position: 'absolute',
                          left: 0,
                          right: 0,
                          bottom: 0,
                          height: 46,
                          bgcolor: (theme) => theme.palette.mode === 'dark' 
                            ? 'rgba(0,0,0,0.8)' 
                            : 'rgba(255,255,255,0.9)',
                          display: 'flex',
                          alignItems: 'center',
                          px: 2,
                          gap: 1,
                        }}
                      >
                        {opt.icon}
                        <Typography
                          sx={{
                            fontWeight: 700,
                            fontSize: 14,
                            color: 'text.primary',
                          }}
                        >
                          {opt.title}
                        </Typography>
                      </Box>
                    </Box>

                    <CardContent sx={{ 
                      flex: 1,
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      p: 2
                    }}>
                      <Typography variant="h6" sx={{ mb: 0.5 }}>
                        {opt.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ lineHeight: 1.6 }}
                      >
                        {opt.desc}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            );
          })}
        </Grid>

        {/* Mensaje de error */}
        {showError && (
          <Alert 
            severity="error" 
            sx={{ mt: 3, mb: 2 }}
          >
            Por favor selecciona un tipo de evento para continuar.
          </Alert>
        )}
      </Box>
    </Box>
  );
};
