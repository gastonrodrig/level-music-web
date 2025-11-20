import React from 'react';
import { Box, Card, CardContent, Typography, Grid, useTheme } from '@mui/material';
import { Event, People, VolumeUp, Store, TrendingUp, Notifications } from '@mui/icons-material';

export const DashboardPage = () => {
  const theme = useTheme();

  // Datos ficticios
  const stats = [
    {
      title: 'Eventos Activos',
      value: '24',
      icon: <Event sx={{ fontSize: 40, color: '#1976D2' }} />,
      bgColor: theme.palette.mode === 'light' ? '#E3F2FD' : '#1e3a5f'
    },
    {
      title: 'Citas Pendientes',
      value: '8',
      icon: <Notifications sx={{ fontSize: 40, color: '#FF9800' }} />,
      bgColor: theme.palette.mode === 'light' ? '#FFF3E0' : '#5f3a1e'
    },
    {
      title: 'Clientes Totales',
      value: '142',
      icon: <People sx={{ fontSize: 40, color: '#4CAF50' }} />,
      bgColor: theme.palette.mode === 'light' ? '#E8F5E9' : '#1e5f2e'
    },
    {
      title: 'Equipos Disponibles',
      value: '248',
      icon: <VolumeUp sx={{ fontSize: 40, color: '#9C27B0' }} />,
      bgColor: theme.palette.mode === 'light' ? '#F3E5F5' : '#4a1e5f'
    }
  ];

  const upcomingEvents = [
    {
      title: 'Evento Corporativo 2025',
      date: '15 de Febrero, 2025 - 18:00',
      status: 'Próximo',
      statusColor: '#FF9800'
    },
    {
      title: 'Concierto Acústico',
      date: '22 de Febrero, 2025 - 20:00',
      status: 'Confirmado',
      statusColor: '#4CAF50'
    }
  ];

  const recentActivity = [
    {
      action: 'Nueva cotización creada',
      time: 'Hace 2 horas',
      color: '#4CAF50'
    },
    {
      action: 'Evento actualizado',
      time: 'Hace 4 horas',
      color: '#1976D2'
    },
    {
      action: 'Equipo asignado a evento',
      time: 'Hace 6 horas',
      color: '#FF9800'
    },
    {
      action: 'Nuevo cliente registrado',
      time: 'Hace 8 horas',
      color: '#9C27B0'
    }
  ];

  return (
    <Box sx={{ pb: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', color: theme.palette.text.primary }}>
          ¡Bienvenido al Dashboard!
        </Typography>
        <Typography variant="body1" sx={{ color: theme.palette.text.secondary, mt: 1 }}>
          Sistema de Gestión Level Music
        </Typography>
      </Box>

      {/* Stats Grid */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={6} lg={3} key={index}>
            <Card 
              sx={{ 
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                p: 2,
                backgroundColor: stat.bgColor,
                border: 'none',
                boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.15)'
                }
              }}
            >
              <CardContent sx={{ textAlign: 'center', width: '100%' }}>
                <Box sx={{ mb: 1 }}>
                  {stat.icon}
                </Box>
                <Typography variant="h5" sx={{ fontWeight: 'bold', color: theme.palette.text.primary }}>
                  {stat.value}
                </Typography>
                <Typography variant="body2" sx={{ color: theme.palette.text.secondary, mt: 1 }}>
                  {stat.title}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Próximos Eventos y Actividad Reciente */}
      <Grid container spacing={3}>
        {/* Próximos Eventos */}
        <Grid item xs={12} md={6}>
          <Card sx={{ boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)', height: '100%' }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: theme.palette.text.primary }}>
                Próximos Eventos
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {upcomingEvents.map((event, index) => (
                  <Box 
                    key={index}
                    sx={{
                      p: 2,
                      borderLeft: `4px solid ${event.statusColor}`,
                      backgroundColor: theme.palette.mode === 'light' ? '#F5F5F5' : '#2a2a2a',
                      borderRadius: 1
                    }}
                  >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                      <Box>
                        <Typography variant="body1" sx={{ fontWeight: 'bold', color: theme.palette.text.primary }}>
                          {event.title}
                        </Typography>
                        <Typography variant="body2" sx={{ color: theme.palette.text.secondary, mt: 0.5 }}>
                          {event.date}
                        </Typography>
                      </Box>
                      <Typography 
                        variant="caption" 
                        sx={{
                          backgroundColor: event.statusColor,
                          color: 'white',
                          px: 1.5,
                          py: 0.5,
                          borderRadius: 1,
                          fontWeight: 'bold'
                        }}
                      >
                        {event.status}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Actividad Reciente */}
        <Grid item xs={12} md={6}>
          <Card sx={{ boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)', height: '100%' }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: theme.palette.text.primary }}>
                Actividad Reciente
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {recentActivity.map((activity, index) => (
                  <Box 
                    key={index}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      p: 1.5,
                      borderLeft: `3px solid ${activity.color}`,
                      backgroundColor: theme.palette.mode === 'light' ? '#F9F9F9' : '#252525'
                    }}
                  >
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="body2" sx={{ color: theme.palette.text.primary, fontWeight: 500 }}>
                        {activity.action}
                      </Typography>
                      <Typography variant="caption" sx={{ color: theme.palette.text.secondary, display: 'block', mt: 0.3 }}>
                        {activity.time}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};
