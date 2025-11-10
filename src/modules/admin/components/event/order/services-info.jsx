import { useMemo, useState } from "react";
import { ServicesTable } from "../../ui";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  useTheme,
} from "@mui/material";

export const ServicesInfo = () => {
  // Datos estáticos convertidos a objetos más legibles
  const rows = useMemo(
    () => [
      {
        _id: "69118d1317287ae708fe0edb",
        created_at: "2025-11-10T06:58:27.566Z",
        event_date: "2025-11-21T05:00:00Z",
        start_time: "2025-11-21T10:00:00Z",
        event_id: "69118d1317287ae708fe0ed4",
        hourly_rate: 173,
        hours: 1,
        resource_id: "690fe7cd4c6fa605adc0a74d",
        resource_type: "Servicio Adicional",
        details: { duration: 2, price_per_hour: 100 },
        provider_email: "gaston.rodriguez0410@gmail.com",
        provider_name: "Staff Eventos Pro",
        service_ref_price: 150,
        service_status: "Activo",
        service_type_name: "Sistema de Audio",
      },

      {
        _id: "69118d1417287ae708fe0ee2",
        created_at: "2025-11-10T06:58:28.209Z",
        event_date: "2025-11-21T05:00:00Z",
        start_time: "2025-11-21T10:00:00Z",
        event_id: "69118d1317287ae708fe0ed4",
        hourly_rate: 63,
        hours: 1,
        resource_id: "690ff05c4c6fa605adc0a7a6",
        resource_type: "Servicio Adicional",
        details: { "Número de parlantes": "2" },
        provider_email: "gaston.rodriguez0410@gmail.com",
        provider_name: "Staff Eventos Pro",
        service_ref_price: 55,
        service_status: "Activo",
        service_type_name: "Sistema de Audio",
      },

      {
        _id: "69118d1517287ae708fe0ee9",
        created_at: "2025-11-10T06:58:28.829Z",
        event_date: "2025-11-21T05:00:00Z",
        start_time: "2025-11-21T10:00:00Z",
        event_id: "69118d1317287ae708fe0ed4",
        hourly_rate: 115,
        hours: 1,
        resource_id: "6911653fcc546a1dd6eecb19",
        resource_type: "Servicio Adicional",
        details: { "Horas de servicio": "1" },
        provider_email: "gaston.rodriguez@icloud.com",
        provider_name: "FlorArte Diseños",
        service_ref_price: 100,
        service_status: "Activo",
        service_type_name: "Iluminación Especial",
      },
      {
        _id: "69118d1517287ae708fe0ef0",
        created_at: "2025-11-10T06:58:29.442Z",
        event_date: "2025-11-21T05:00:00Z",
        start_time: "2025-11-21T10:00:00Z",
        event_id: "69118d1317287ae708fe0ed4",
        hourly_rate: 115,
        hours: 1,
        resource_id: "69117167c633351b1ecfa685",
        resource_type: "Servicio Adicional",
        details: { "Numero de Mesas": "10" },
        provider_email: "ieral100604@gmail.com",
        provider_name: "Estudio Fotográfico Lima",
        service_ref_price: 100,
        service_status: "Activo",
        service_type_name: "Decoración Floral",
      },
    ],
    []
  );

  const columns = [
    {
      key: "package_number",
      label: "Nro. Paquete",
      render: (val) => val || "-",
    },

    {
      key: "hours",
      label: "Horas",
      render: (val) => (val != null ? val : "-"),
    },
  ];

  const rowsWithComputed = rows.map((r) => ({ ...r, total: (r.hourly_rate || 0) * (r.hours || 0) }));

  // Agrupar por proveedor
  const byProvider = useMemo(() => {
    const map = new Map();
    rowsWithComputed.forEach((r) => {
      const key = r.provider_name || "Sin proveedor";
      if (!map.has(key)) map.set(key, { provider_name: key, provider_email: r.provider_email || "", rows: [] });
      map.get(key).rows.push(r);
    });
    // asignar número de paquete por proveedor (Paquete #1, Paquete #2, ...)
    for (const group of map.values()) {
      group.rows = group.rows.map((row, idx) => ({ ...row, package_number: `Paquete #${idx + 1}` }));
    }

    return Array.from(map.values());
  }, [rowsWithComputed]);

  // modal state for service detail
  const [open, setOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const theme = useTheme();

  const handleRowAction = (row) => {
    setSelectedService(row);
    setOpen(true);
  };

  return (
    <div>

      {byProvider.map((group) => (
        <ServicesTable
          key={group.provider_name}
          title=""
          subtitle=""
          providerName={group.provider_name}
          providerEmail={group.provider_email}
          badgeLabel={`${group.rows.length} servicio${group.rows.length === 1 ? '' : 's'}`}
          columns={columns}
          rows={group.rows}
          getRowKey={(r) => r._id}
          emptyMessage="No hay servicios asignados"
          onRowAction={handleRowAction}
        />
      ))}

      {/* Service detail modal */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ pr: 2, bgcolor: theme.palette.mode === 'dark' ? '#1f1e1e' : '#f5f5f5', color: theme.palette.mode === 'dark' ? '#fff' : '#111' }}>
          Detalles del Servicio
        </DialogTitle>
        <DialogContent dividers sx={{ bgcolor: theme.palette.mode === 'dark' ? '#1f1e1e' : '#f5f5f5' }}>
          {selectedService ? (
            <Box>
              {/* Header card inside modal */}
              <Card sx={{ mb: 2, borderRadius: 2, bgcolor: theme.palette.mode === 'dark' ? "#151515" : "#e0e0e0" }} elevation={0}>
                <CardContent sx={{ py: 2, px: 3 }}>
                  <Typography sx={{ mt: 1, fontSize: 18 }}>
                    <Box component="span" sx={{ fontWeight: 700 }}>
                      Tipo de Servicio:
                    </Box>{" "}
                    {selectedService.service_type_name}
                  </Typography>
                  <Typography sx={{ mt: 0.5, color: 'text.secondary', fontSize: 16 }}>{selectedService.package_number}</Typography>
                </CardContent>
              </Card>

              <Typography sx={{ mb: 2 }}>Especificaciones del Servicio</Typography>

              <Grid container spacing={2}>
                {selectedService.details && Object.entries(selectedService.details).map(([k, v]) => (
                  <Grid item xs={12} md={6} key={k}>
                    <Box sx={{ borderRadius: 2, p: 2, minHeight: 96, bgcolor: theme.palette.mode === 'dark' ? "#151515" : "#e0e0e0", display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                      <Typography color="text.secondary" fontSize={15}>{k}</Typography>
                      <Typography sx={{ mt: 1 }} fontSize={18}>{String(v)}</Typography>
                    </Box>
                  </Grid>
                ))}

                {/* fallback boxes for common fields if not present */}
                {!selectedService.details && (
                  <Grid item xs={12}>
                    <Typography variant="body2">-</Typography>
                  </Grid>
                )}
              </Grid>

            </Box>
          ) : null}
        </DialogContent>
        <DialogActions sx={{ p: 2, bgcolor: theme.palette.mode === 'dark' ? '#1f1e1e' : '#f5f5f5' }}>
          <Button
            variant="contained"
            onClick={() => setOpen(false)}
            sx={{
              textTransform: "none",
              borderRadius: 2,
              color: "#fff",
              fontWeight: 600,
              bgcolor: theme.palette.primary.main,
              "&:hover": { bgcolor: theme.palette.primary.dark },
            }}
          >
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
