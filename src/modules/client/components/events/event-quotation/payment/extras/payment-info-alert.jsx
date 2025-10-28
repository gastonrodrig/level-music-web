import { 
  Box, 
  Typography, 
  Alert, 
  AlertTitle, 
  useTheme 
} from "@mui/material";
import { Info } from "@mui/icons-material";

export const PaymentInfoAlert = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  return (
    <Alert
      icon={<Info sx={{ fontSize: 20 }} />}
      severity="info"
      sx={{
        borderRadius: 2,
        bgcolor: isDark ? "#1a2332" : "#e3f2fd",
        px: 2.5,
        py: 1.5,
        alignItems: 'flex-start'
      }}
    >
      <AlertTitle sx={{ fontWeight: 600 }}>Información importante</AlertTitle>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        <Typography variant="body2">
          Todos estos pagos quedan en estado{' '}
          <Box component="span" sx={{ color: '#ff9800', fontWeight: 600 }}>
            Pendiente
          </Box>{' '}
          hasta que el administrador los revise y apruebe.
        </Typography>

        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <Typography variant="body2">
            Si prefieres aprobación automática, usa{' '}
            <Box component="span" sx={{ fontWeight: 600 }}>
              Mercado Pago
            </Box>{' '}
            (disponible arriba).
          </Typography>
        </Box>
      </Box>
    </Alert>
  );
};