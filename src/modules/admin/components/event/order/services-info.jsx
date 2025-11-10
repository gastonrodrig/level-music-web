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
import { useQuotationStore } from "../../../../../hooks";

export const ServicesInfo = () => {
  const { selected } = useQuotationStore();

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

  const rowsWithComputed = selected?.assignations.map((r) => ({ ...r, total: (r.hourly_rate || 0) * (r.hours || 0) })) || [];

  // Agrupar por proveedor
  const byProvider = useMemo(() => {
    const map = new Map();
    rowsWithComputed.forEach((r) => {
      const key = r.service_provider_name;
      if (!map.has(key)) map.set(key, { service_provider_name: key, service_provider_email: r.service_provider_email || "", rows: [] });
      map.get(key).rows.push(r);
    });
    for (const group of map.values()) {
      group.rows = group.rows.map((row, idx) => ({ ...row, package_number: `Paquete #${idx + 1}` }));
    }

    return Array.from(map.values());
  }, [rowsWithComputed]);

  const [open, setOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const theme = useTheme();

  const handleRowAction = (row) => {
    setSelectedService(row);
    setOpen(true);
  };

  return (
    <>
      {byProvider.map((group) => (
        <ServicesTable
          key={group.service_provider_name}
          title=""
          subtitle=""
          providerName={group.service_provider_name}
          providerEmail={group.service_provider_email}
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
                {selectedService.service_detail && Object.entries(selectedService.service_detail).map(([k, v]) => (
                  <Grid item xs={12} md={6} key={k}>
                    <Box sx={{ borderRadius: 2, p: 2, minHeight: 96, bgcolor: theme.palette.mode === 'dark' ? "#151515" : "#e0e0e0", display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                      <Typography color="text.secondary" fontSize={15}>{k}</Typography>
                      <Typography sx={{ mt: 1 }} fontSize={18}>{String(v)}</Typography>
                    </Box>
                  </Grid>
                ))}

                {/* fallback boxes for common fields if not present */}
                {!selectedService.service_detail && (
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
    </>
  );
};
