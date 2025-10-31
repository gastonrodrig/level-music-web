import {
  Modal,
  Box,
  Typography,
  IconButton,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  useTheme,
  CircularProgress,
} from "@mui/material";
import { Close, CalendarMonth } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { serviceDetailPriceApi } from "../../../../../api"; // usa la ruta global api

export const ServicePricesModal = ({ open, onClose, serviceDetailId }) => {
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
        .catch((err) => console.error("❌ Error al cargar precios:", err))
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

        {/* === TABLA === */}
        {loading ? (
          <Box display="flex" justifyContent="center" mt={4}>
            <CircularProgress size={28} />
          </Box>
        ) : prices.length === 0 ? (
          <Typography textAlign="center" mt={4} color="text.secondary">
            No se encontraron precios para este detalle de servicio.
          </Typography>
        ) : (
          <Table
            size="small"
            sx={{
              "& th": {
                fontWeight: 600,
                bgcolor: isDark ? "#2a2a2a" : "#f9f9f9",
              },
              "& td": {
                borderBottom: "1px solid",
                borderColor: isDark ? "#333" : "#eee",
              },
            }}
          >
            <TableHead>
              <TableRow>
                <TableCell>N° Temporada</TableCell>
                <TableCell>Precio Ref. (S/)</TableCell>
                <TableCell>Fecha Inicio</TableCell>
                <TableCell>Fecha Fin</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {prices.map((p, idx) => (
                <TableRow key={p._id}>
                  <TableCell>{`Temporada ${idx + 1}`}</TableCell>
                  <TableCell>
                    {p.reference_detail_price
                      ? `S/ ${Number(p.reference_detail_price).toFixed(2)}`
                      : "-"}
                  </TableCell>
                  <TableCell>
                    {p.start_date
                      ? new Date(p.start_date).toLocaleDateString("es-PE", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })
                      : "-"}
                  </TableCell>
                  <TableCell>
                    {p.end_date
                      ? new Date(p.end_date).toLocaleDateString("es-PE", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })
                      : "Vigente"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
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
