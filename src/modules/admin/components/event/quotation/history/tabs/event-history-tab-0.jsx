import { Box, Typography, Divider, List, ListItem, useTheme, Chip } from '@mui/material';
import { Build, MonetizationOn, Devices, Person, Notes, MonetizationOnSharp, Celebration } from '@mui/icons-material';

export const EventHistoryTab0 = ({ version = {} }) => {
  const theme = useTheme();

  const items = version?.assignations || [];

  // Agrupar por tipo de recurso
  const groups = items.reduce((acc, it) => {
    const key = (it.resource_type || 'Sin tipo').trim();
    if (!acc[key]) acc[key] = [];
    acc[key].push(it);
    return acc;
  }, {});

  // Pluralizar nombre de grupo
  const pluralizeGroupName = (name) => {
    const g = name.toLowerCase();
    if (g.includes('servicio')) return 'Servicios Adicionales';
    if (g.includes('equipo')) return 'Equipos';
    if (g.includes('trabajador')) return 'Trabajadores';
  };

  // Ícono por tipo
  const iconFor = (groupName) => {
    const g = groupName.toLowerCase();
    if (g.includes('servicio')) return <Celebration fontSize="small" />;
    if (g.includes('equipo')) return <Devices fontSize="small" />;
    if (g.includes('trabajador')) return <Person fontSize="small" />;
  };

  return (
    <Box>
      <Typography
        color="text.secondary"
        sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}
      >
        <Build fontSize="small" /> Recursos asignados
      </Typography>
      <Divider sx={{ my: 1 }} />

      <Box
        sx={{
          backgroundColor: theme.palette.background.default,
          p: 2,
          borderRadius: 2,
          border: `1px solid ${theme.palette.divider}`,
          maxHeight: items.length > 4 ? 450 : 'auto',
          overflowY: items.length > 4 ? 'auto' : 'visible',
          pr: items.length > 4 ? 1 : 0,
        }}
      >
        {Object.keys(groups).length ? (
          Object.entries(groups).map(([groupName, list]) => (
            <Box key={groupName} sx={{ mb: 2 }}>
              {/* Encabezado de grupo */}
              <Box display="flex" alignItems="center" gap={1} mb={1}>
                {iconFor(groupName)}
                <Typography sx={{ fontWeight: 700, textTransform: 'capitalize' }}>
                  {pluralizeGroupName(groupName)}
                </Typography>
                <Chip label={`${list.length}`} size="small" sx={{ ml: 1 }} />
              </Box>

              <List dense>
                {list.map((s, idx) => (
                  <ListItem
                    key={s._id ?? idx}
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      py: 1,
                      alignItems: 'flex-start',
                      borderBottom: '1px dashed rgba(255,255,255,0.1)',
                    }}
                  >
                    {/* Columna izquierda */}
                    <Box>
                      {/* Servicios */}
                      {groupName.toLowerCase().includes('servicio') && (
                        <>
                          <Typography sx={{ fontSize: 13 }}>
                            <Box component="span" sx={{ fontWeight: 600 }}>
                              Tipo de Servicio:
                            </Box>{' '}
                            {s.service_type_name}
                          </Typography>

                          <Typography sx={{ fontSize: 13 }}>
                            <Box component="span" sx={{ fontWeight: 600 }}>
                              Proveedor:
                            </Box>{' '}
                            {s.service_provider_name}
                          </Typography>

                          {s.service_detail && (
                            <Box sx={{ mt: 0.5 }}>
                              <Typography
                                color="text.secondary"
                                sx={{ fontSize: 12, fontWeight: 600 }}
                              >
                                Detalles del paquete:
                              </Typography>
                              {Object.entries(s.service_detail).map(([key, val]) => (
                                <Typography key={key} color="text.secondary" sx={{ fontSize: 12 }}>
                                  {key}: {String(val)}
                                </Typography>
                              ))}
                            </Box>
                          )}
                        </>
                      )}

                      {/* Equipos */}
                      {groupName.toLowerCase().includes('equipo') && (
                        <>
                          <Typography sx={{ fontSize: 13, fontWeight: 600 }}>
                            {s.equipment_name || 'Equipo sin nombre'}
                          </Typography>
                          <Typography color="text.secondary" sx={{ fontSize: 12 }}>
                            Tipo: {s.equipment_type || '—'}
                          </Typography>
                        </>
                      )}

                      {/* Trabajadores */}
                      {groupName.toLowerCase().includes('trabajador') && (
                        <>
                          <Typography sx={{ fontSize: 13, fontWeight: 600 }}>
                            {`${s.worker_first_name ?? ''} ${s.worker_last_name ?? ''}`}
                          </Typography>
                          <Typography color="text.secondary" sx={{ fontSize: 12 }}>
                            Rol: {s.worker_role || s.role || '—'}
                          </Typography>
                        </>
                      )}
                    </Box>

                    {/* Columna derecha */}
                    <Box textAlign="right">
                      <Typography
                        color="text.secondary"
                        sx={{
                          fontSize: 12,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'flex-end',
                          gap: 0.5,
                        }}
                      >
                        <Box component="span" sx={{ fontWeight: 700, fontSize: 12 }}>
                          Cant. horas:
                        </Box>
                        {s.hours} x
                      </Typography>

                      <Typography
                        color="text.secondary"
                        sx={{
                          fontSize: 12,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 0.5,
                          justifyContent: 'flex-end',
                        }}
                      >
                        <Box component="span" sx={{ fontWeight: 700 }}>
                          Precio hora:
                        </Box>
                        S/ {s.hourly_rate?.toFixed(2) ?? '0.00'}
                      </Typography>

                      <Typography sx={{ mt: 0.5, fontSize: 13, fontWeight: 700 }}>
                        Total: S/ {(s.hourly_rate * s.hours).toFixed(2)}
                      </Typography>
                    </Box>
                  </ListItem>
                ))}
              </List>
            </Box>
          ))
        ) : (
          <Typography color="text.secondary">
            No hay recursos registrados en esta versión.
          </Typography>
        )}
      </Box>

      {/* Additional meta */}
      <Box sx={{ mt: 2 }}>
        <Typography
          color="text.secondary"
          sx={{ mb: 1, display: "flex", alignItems: "center", gap: 1 }}
        >
          <MonetizationOnSharp fontSize="small" /> Total
        </Typography>
        <Divider sx={{ my: 1 }} />
        <Box
          sx={{
            backgroundColor: theme.palette.background.default,
            p: 2,
            borderRadius: 2,
            border: `1px solid ${theme.palette.divider}`,
          }}
        >
          <Typography>
            <strong>Precio total estimado:</strong>{" "}
              FALTAAAAAA
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};
