import React from 'react';
import { Box, Card, CardContent, Typography, Grid, useTheme } from '@mui/material';
import { Inventory, TrendingUp, Warning, CheckCircle } from '@mui/icons-material';

export const DashboardPage = () => {
  const theme = useTheme();

  // Datos ficticios
  const stats = [
    {
      title: 'Equipos en Almacén',
      value: '248',
      icon: <Inventory sx={{ fontSize: 40, color: '#1976D2' }} />,
      bgColor: theme.palette.mode === 'light' ? '#E3F2FD' : '#1e3a5f'
    },
    {
      title: 'Movimientos Hoy',
      value: '15',
      icon: <TrendingUp sx={{ fontSize: 40, color: '#FF9800' }} />,
      bgColor: theme.palette.mode === 'light' ? '#FFF3E0' : '#5f3a1e'
    },
    {
      title: 'Equipos Asignados',
      value: '8',
      icon: <CheckCircle sx={{ fontSize: 40, color: '#4CAF50' }} />,
      bgColor: theme.palette.mode === 'light' ? '#E8F5E9' : '#1e5f2e'
    },
    {
      title: 'Equipos Pendientes',
      value: '3',
      icon: <Warning sx={{ fontSize: 40, color: '#D32F2F' }} />,
      bgColor: theme.palette.mode === 'light' ? '#FFEBEE' : '#5f1e1e'
    }
  ];

  const latestMovements = [
    {
      action: 'Entrada de equipos - ACT-2025-001',
      time: 'Hace 1 hora',
      type: 'entrada',
      color: '#4CAF50'
    },
    {
      action: 'Salida de equipos - ACT-2025-002',
      time: 'Hace 3 horas',
      type: 'salida',
      color: '#FF9800'
    },
    {
      action: 'Actualización de inventario',
      time: 'Hace 5 horas',
      type: 'actualización',
      color: '#1976D2'
    },
    {
      action: 'Nuevo equipo registrado',
      time: 'Hace 7 horas',
      type: 'nuevo',
      color: '#9C27B0'
    }
  ];

  const equipmentStatus = [
    {
      name: 'Parlantes',
      quantity: 45,
      status: 'Disponible',
      statusColor: '#4CAF50'
    },
    {
      name: 'Micrófonos',
      quantity: 32,
      status: 'Disponible',
      statusColor: '#4CAF50'
    },
    {
      name: 'Cables',
      quantity: 15,
      status: 'Bajo Stock',
      statusColor: '#FF9800'
    },
    {
      name: 'Soportes',
      quantity: 3,
      status: 'Crítico',
      statusColor: '#D32F2F'
    }
  ];

  return (
    <Box sx={{ pb: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', color: theme.palette.text.primary }}>
          ¡Bienvenido Almacenero!
        </Typography>
        <Typography variant="body1" sx={{ color: theme.palette.text.secondary, mt: 1 }}>
          Sistema de Gestión de Almacén
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

      {/* Últimas Actividades y Estado de Equipos */}
      <Grid container spacing={3}>
        {/* Últimas Actividades */}
        <Grid item xs={12} md={6}>
          <Card sx={{ boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)', height: '100%' }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: theme.palette.text.primary }}>
                Últimas Actividades
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {latestMovements.map((movement, index) => (
                  <Box 
                    key={index}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      p: 1.5,
                      borderLeft: `3px solid ${movement.color}`,
                      backgroundColor: theme.palette.mode === 'light' ? '#F9F9F9' : '#252525',
                      borderRadius: 1
                    }}
                  >
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="body2" sx={{ color: theme.palette.text.primary, fontWeight: 500 }}>
                        {movement.action}
                      </Typography>
                      <Typography variant="caption" sx={{ color: theme.palette.text.secondary, display: 'block', mt: 0.3 }}>
                        {movement.time}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Estado de Equipos */}
        <Grid item xs={12} md={6}>
          <Card sx={{ boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)', height: '100%' }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: theme.palette.text.primary }}>
                Estado del Inventario
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {equipmentStatus.map((equipment, index) => (
                  <Box 
                    key={index}
                    sx={{
                      p: 2,
                      borderRadius: 1,
                      backgroundColor: theme.palette.mode === 'light' ? '#F5F5F5' : '#2a2a2a',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 'bold', color: theme.palette.text.primary }}>
                        {equipment.name}
                      </Typography>
                      <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
                        Cantidad: {equipment.quantity}
                      </Typography>
                    </Box>
                    <Typography 
                      variant="caption" 
                      sx={{
                        backgroundColor: equipment.statusColor,
                        color: 'white',
                        px: 1.5,
                        py: 0.5,
                        borderRadius: 1,
                        fontWeight: 'bold'
                      }}
                    >
                      {equipment.status}
                    </Typography>
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
