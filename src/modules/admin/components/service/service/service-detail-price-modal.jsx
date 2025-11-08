import {
  Box,
  IconButton,
  Modal,
  Typography,
  Button,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import { useEffect } from "react";
import { PaginatedTable } from "../../../../../shared/ui/components/common/table-price";
import { useServiceDetailPriceStore } from "../../../../../hooks";

export const ServiceDetailPriceModal = ({ open, onClose, serviceDetail = {}, detailNumber }) => {
  const {
    serviceDetailPrices,
    total,
    loading,
    order,
    currentPage,
    rowsPerPage,
    setPageGlobal,
    setRowsPerPageGlobal,
    startLoadingServiceDetailPricesPaginated,
  } = useServiceDetailPriceStore();

  useEffect(() => {
    if (open && serviceDetail?._id) {
      setPageGlobal(0);
      startLoadingServiceDetailPricesPaginated(serviceDetail._id);
    }
  }, [open, serviceDetail?._id, currentPage, rowsPerPage]);

  const columns = [
    { label: "Nro. Temporada", field: "season_number" },
    { label: "Precio Ref. (S/)", field: "ref_price", format: "currency" },
    { label: "Desde", field: "start_date", format: "date" },
    { label: "Hasta", field: "end_date", format: "date" },
  ];

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: { xs: "90%", sm: 600 },
          bgcolor: "background.paper",
          borderRadius: 4,
          boxShadow: 24,
          p: 4,
        }}
      >
        {/* === ENCABEZADO === */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
          <Typography variant="h6" fontWeight={600}>
            Historial de Precios
          </Typography>
          <IconButton onClick={onClose}>
            <Close />
          </IconButton>
        </Box>

        {/* === Detalle actual === */}
        <Typography fontSize={15} mb={2}>
          <Box component="span" sx={{ fontWeight: 700, mr: 0.5 }}>
            Detalle:
          </Box>
          <Box component="span">
            #{detailNumber} – {serviceDetail?.service_type_name || "Sin nombre"}
          </Box>
        </Typography>

        {/* === Tabla de precios === */}
        <PaginatedTable
          columns={columns}
          rows={serviceDetailPrices}
          loading={loading}
          total={total}
          page={currentPage}
          rowsPerPage={rowsPerPage}
          order={order}
          descendingLabel={true}
          onPageChange={setPageGlobal}
          onRowsPerPageChange={(newRows) => {
            setRowsPerPageGlobal(newRows);
            setPageGlobal(0);
          }}
          getRowId={(row) => row._id}
          emptyMessage="No hay precios registrados para este detalle"
        />

        {/* === Pie del modal === */}
        <Box mt={3} display="flex" justifyContent="flex-end">
          <Button
            onClick={onClose}
            variant="contained"
            sx={{
              backgroundColor: "#212121",
              color: "#fff",
              textTransform: "none",
              py: 1.2,
              px: 4,
              borderRadius: 2,
              fontWeight: 600,
            }}
          >
            Cerrar
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};
