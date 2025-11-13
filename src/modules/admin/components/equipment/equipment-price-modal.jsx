import {
  Box,
  IconButton,
  Modal,
  Typography,
  Button,
  TextField,
} from "@mui/material";
import { Close, Add, Remove } from "@mui/icons-material";
import SaveIcon from "@mui/icons-material/Save";
import { useEffect, useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { PaginatedTable } from "../../../../shared/ui/components/common";

// EquipmentPriceModal is a reusable modal to list and add prices for a given equipment.
// It receives the data and actions as props so it doesn't depend on a specific store.
export const EquipmentPriceModal = ({
  open,
  onClose,
  equipment = {},
  equipmentPrices = [],
  total = 0,
  loading = false,
  currentPage = 0,
  rowsPerPage = 5,
  setPageGlobal = () => {},
  setRowsPerPageGlobal = () => {},
  startLoadingEquipmentPricePaginated = async () => {},
  startCreateEquipmentPrice = async () => {},
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    mode: "onBlur",
  });

  const [showPriceForm, setShowPriceForm] = useState(false);
  const isButtonDisabled = useMemo(() => loading, [loading]);

  // Load prices when modal opens or paging changes
  useEffect(() => {
    if (open && equipment?._id) {
      startLoadingEquipmentPricePaginated(equipment._id, {
        page: currentPage,
        rowsPerPage,
      });
    }
    if (!open) {
      setShowPriceForm(false);
      reset();
    }
  }, [open, equipment?._id, currentPage, rowsPerPage]);

  const onSubmit = async (data) => {
    const payload = {
      ...data,
      equipmentTypeId: equipment.equipmentTypeId,
    };
    const success = await startCreateEquipmentPrice(payload);
    if (success) {
      setShowPriceForm(false);
      await startLoadingEquipmentPricePaginated(equipment._id, {
        page: currentPage,
        rowsPerPage,
      });
      reset();
    }
  };

  const columns = [
    { label: "Nro. Temporada", field: "season_number" },
    { label: "Precio", field: "reference_price", format: "currency" },
    { label: "Desde", field: "start_date", format: "date" },
    { label: "Hasta", field: "end_date", format: "date" },
  ];

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
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
        {/* Header */}
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={1}
        >
          <Typography variant="h6" fontWeight={600}>
            Precios por Temporada
          </Typography>
          <IconButton onClick={onClose}>
            <Close />
          </IconButton>
        </Box>

        {/* Nombre del equipo */}
        <Typography fontSize={15} mb={2}>
          <Box component="span" sx={{ fontWeight: 700, mr: 0.5 }}>
            Equipo:
          </Box>
          <Box component="span">{`${equipment?.name || ""}`}</Box>
        </Typography>

        {/* Tabla paginada */}
        <PaginatedTable
          columns={columns}
          rows={equipmentPrices}
          loading={loading}
          total={total}
          page={currentPage}
          rowsPerPage={rowsPerPage}
          onPageChange={setPageGlobal}
          onRowsPerPageChange={(newRows) => {
            setRowsPerPageGlobal(newRows);
            setPageGlobal(0);
          }}
          getRowId={(row) => row._id}
          emptyMessage="No hay precios registrados"
        />

        {/* Formulario para agregar nuevo precio */}
        {showPriceForm && (
          <Box
            mt={3}
            p={2}
            sx={{
              borderRadius: 2,
              border: (theme) =>
                `1px solid ${theme.palette.mode === "dark" ? "#444" : "#d3d3d3"}`,
              backgroundColor: (theme) =>
                theme.palette.mode === "dark" ? "#2a2a2b4e" : "#f5f5f5",
            }}
          >
            <Typography fontWeight={600} mb={2}>
              Agregar Nuevo Precio
            </Typography>

            <Box display="flex" flexDirection="column">
              <Box sx={{ width: "50%" }}>
                <TextField
                  type="number"
                  label="Precio Ref. (S/)"
                  placeholder="Ej: 500.00"
                  variant="outlined"
                  fullWidth
                  size="small"
                  sx={{ mb: 1 }}
                  {...register("reference_price", {
                    required: "El precio es obligatorio",
                    min: {
                      value: 0,
                      message: "El precio debe ser mayor a 0",
                    },
                  })}
                  error={!!errors.reference_price}
                  helperText={errors.reference_price?.message}
                />
              </Box>

              <Box display="flex" gap={2} mt={1}>
                <Button
                  variant="contained"
                  type="submit"
                  startIcon={<SaveIcon />}
                  sx={{
                    backgroundColor: (theme) => theme.palette.primary.main,
                    color: "#fff",
                    textTransform: "none",
                    borderRadius: 2,
                    fontWeight: 600,
                    "&:hover": {
                      backgroundColor: (theme) => theme.palette.primary.dark,
                    },
                  }}
                >
                  Guardar Precio
                </Button>

                <Button
                  variant="contained"
                  onClick={() => setShowPriceForm(false)}
                  sx={{
                    backgroundColor: "#363c4e",
                    color: "#fff",
                    textTransform: "none",
                    borderRadius: 2,
                    "&:hover": {
                      backgroundColor: "#333",
                    },
                  }}
                >
                  Cancelar
                </Button>
              </Box>
            </Box>
          </Box>
        )}

        {/* Botón principal para agregar nuevo precio (siempre visible y alterna el formulario) */}
        <Box mt={3} display="flex" justifyContent="flex-end">
          <Button
            onClick={() => setShowPriceForm((s) => !s)}
            variant="contained"
            disabled={isButtonDisabled}
            startIcon={showPriceForm ? <Remove /> : <Add />}
            sx={{
              mt: 1,
              backgroundColor: "#212121",
              color: "#fff",
              textTransform: "none",
              py: 1.5,
              px: 4,
              borderRadius: 2,
              fontWeight: 600,
            }}
          >
            {showPriceForm ? "Ocultar Formulario" : "Agregar Precio"}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};
