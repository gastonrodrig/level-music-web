import {
  Modal,
  Box,
  Typography,
  IconButton,
  Button,
  useTheme,
  CircularProgress,
} from "@mui/material";
import { TableComponent } from "../../../../../shared/ui/components/common/table";
import { formatDay } from "../../../../../shared/utils/format-day";
import { Close, CalendarMonth } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { serviceDetailPriceApi } from "../../../../../api"; // usa la ruta global api

export const ServicePricesModal = ({ open, onClose, serviceDetailId, detailNumber = 1 }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const [prices, setPrices] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // 🧩 Si el modal está abierto y hay un ID válido, carga los precios
    if (open && serviceDetailId) {
      setLoading(true);
      serviceDetailPriceApi
        .get(`/by-detail/${serviceDetailId}`)
        .then(({ data }) => setPrices(data))
        .catch((err) => setPrices(null)) // null indica error de ID
        .finally(() => setLoading(false));
    } else {
      // Limpia cuando se cierra
      setPrices([]);
    }
  }, [open, serviceDetailId]);

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          p: 3,
          bgcolor: "background.paper",
          borderRadius: 3,
          width: { xs: "95%", sm: 700 },
          mx: "auto",
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          boxShadow: isDark
            ? "0px 0px 15px rgba(255,255,255,0.2)"
            : "0px 0px 10px rgba(0,0,0,0.2)",
        }}
      >
        {/* === HEADER === */}
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box display="flex" alignItems="center" gap={1}>
            <CalendarMonth sx={{ color: theme.palette.primary.main }} />
            <Typography variant="h6" fontWeight={600}>
              Historial de Precios
            </Typography>
          </Box>
          <IconButton onClick={onClose}>
            <Close />
          </IconButton>
        </Box>

        <Typography variant="body2" mt={2} mb={2} color="text.secondary">
          Mostrando precios registrados por temporada.
        </Typography>

        {/* === TABLA REUTILIZABLE === */}
        {loading ? (
          <Box display="flex" justifyContent="center" mt={4}>
            <CircularProgress size={28} />
          </Box>
        ) : prices === null ? (
          <Typography textAlign="center" mt={4} color="error">
            Error: El detalle no tiene un ID válido o no existe historial.
          </Typography>
        ) : prices.length === 0 ? (
          <Typography textAlign="center" mt={4} color="text.secondary">
            No se encontraron precios para este detalle de servicio.
          </Typography>
        ) : (
          <TableComponent
            columns={[
              { label: "N° Temporada", id: "detail_number", accessor: (row, idx) => row.detail_number ?? idx + 1 },
              { label: "Precio Ref. (S/)", id: "reference_detail_price", accessor: (row) => row.reference_detail_price ? `S/ ${Number(row.reference_detail_price).toFixed(2)}` : "-" },
              { label: "Fecha Inicio", id: "start_date", accessor: (row) => row.start_date ? formatDay(row.start_date) : "-" },
              { label: "Fecha Fin", id: "end_date", accessor: (row) => row.end_date == null ? "-" : formatDay(row.end_date) },
            ]}
            rows={prices}
            total={prices.length}
          />
        )}

        {/* === FOOTER === */}
        <Box display="flex" justifyContent="flex-end" mt={3}>
          <Button
            variant="contained"
            onClick={onClose}
            sx={{
              textTransform: "none",
              fontWeight: 600,
              bgcolor: theme.palette.primary.main,
              "&:hover": {
                bgcolor: theme.palette.primary.dark,
              },
            }}
          >
            Cerrar
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};
