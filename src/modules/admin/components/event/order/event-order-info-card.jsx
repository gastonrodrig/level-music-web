import { Card, CardContent, Typography, useTheme, Grid } from '@mui/material'
import { useMemo } from 'react'
import { useQuotationStore } from '../../../../../hooks';
import { formatDateString } from '../../../../../shared/utils';

export const EventOrderInfoCard = () => {
  const { selected } = useQuotationStore();
  const assignations = selected?.assignations || [];
  const theme = useTheme();

  const providers = useMemo(() => {
    const map = new Map();
    (assignations || []).forEach((a) => {
      const name = a.service_provider_name || "Sin proveedor";
      if (!map.has(name)) map.set(name, []);
      map.get(name).push(a);
    });
    return map;
  }, [assignations]);

  const totalProviders = providers.size;
  const totalServicesAdditional = (
    assignations.filter((a) => a.resource_type === "Servicio Adicional") || []
  ).length;
  
  return (
    <>
      <Card
        elevation={0}
        sx={{
          borderRadius: 3,
          bgcolor: theme.palette.mode === "dark" ? "#1f1e1e" : "#f5f5f5",
          mb: 3,
        }}
      >
        <CardContent>
          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item xs={12} md={3}>
              <Typography variant="caption" color="text.secondary">
                Código Evento
              </Typography>
              <Typography variant="h6">{selected?.event_code || "-"}</Typography>
            </Grid>

            <Grid item xs={12} md={2}>
              <Typography variant="caption" color="text.secondary">
                Cliente
              </Typography>
              <Typography variant="h6">
                {selected?.client_type === "Persona"
                  ? `${selected?.first_name || ""} ${selected?.last_name || ""}`.trim()
                  : selected?.company_name || "-"}
              </Typography>
            </Grid>

            <Grid item xs={12} md={3}>
              <Typography variant="caption" color="text.secondary">
                Nombre del Evento
              </Typography>
              <Typography variant="h6">{selected?.name || selected?.event_type_name || "-"}</Typography>
            </Grid>

            <Grid item xs={12} md={4}>
              <Typography variant="caption" color="text.secondary">
                Fecha
              </Typography>
              <Typography variant="h6">{formatDateString(selected?.event_date) || "-"}</Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Totals card */}
      <Card
        elevation={0}
        sx={{
          borderRadius: 3,
          bgcolor: theme.palette.mode === "dark" ? "#1f1e1e" : "#f5f5f5",
          mb: 3,
        }}
      >
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Typography variant="body2" color="text.secondary">
                Total Proveedores
              </Typography>
              <Typography variant="h5">{totalProviders}</Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="body2" color="text.secondary">
                Total Paquetes
              </Typography>
              <Typography variant="h5">{totalServicesAdditional}</Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </>
  )
}
