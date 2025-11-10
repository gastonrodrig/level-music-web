import { Box, IconButton, Modal, Typography, Button } from "@mui/material";
import { Close, Add, Remove } from "@mui/icons-material";
import { useEffect, useMemo } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { PaginatedTable } from "../../../../shared/ui/components/common/table-price";
import { useEquipmentPriceStore } from "../../../../hooks";
import { PriceForm } from "../../../../shared/ui/components";

export const EquipmentPriceModal = ({ open, onClose, equipment = {} }) => {
  const {
    equipmentPrices,
    total,
    loading,
    order,
    currentPage,
    rowsPerPage,
    setPageGlobal,
    setRowsPerPageGlobal,
    startLoadingEquipmentPricePaginated,
    startCreateEquipmentPrice,
  } = useEquipmentPriceStore();

  const methods = useForm({
    mode: "onBlur",
    defaultValues: {
      referencePrice: "",
      showPriceForm: false,
      equipmentId: null,
    },
  });

  const { watch, setValue, reset, handleSubmit } = methods;
  const showPriceForm = watch("showPriceForm");
  const isButtonDisabled = useMemo(() => loading, [loading]);

  useEffect(() => {
    if (open && equipment._id) {
      setPageGlobal(0);
      setValue("equipmentId", equipment._id);
    }
    if (!open) {
      reset();
    }
  }, [open, equipment?._id]);

  useEffect(() => {
    if (open && equipment?._id) {
      startLoadingEquipmentPricePaginated(equipment._id);
    }
  }, [open, equipment?._id, currentPage, rowsPerPage]);

  const onSubmit = async (data) => {
    await startCreateEquipmentPrice(data);
  };

  const columns = [
    { label: "Nro. Temporada", field: "season_number" },
    { label: "Precio", field: "reference_price", format: "currency" },
    { label: "Desde", field: "start_date", format: "date" },
    { label: "Hasta", field: "end_date", format: "date" },
  ];

  return (
    <Modal open={open} onClose={onClose}>
      <FormProvider {...methods}>
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
          {/* Encabezado */}
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
            <Box component="span">{`${equipment?.name}`}</Box>
          </Typography>

          {/* Tabla paginada */}
          <PaginatedTable
            columns={columns}
            rows={equipmentPrices}
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
            emptyMessage="No hay precios registrados"
          />

          {/* Formulario reutilizable */}
          {showPriceForm && (
            <PriceForm
              label="Precio Ref. (S/)"
              onCancel={() => setValue("showPriceForm", false)}
            />
          )}

          {/* Botón para alternar formulario */}
          <Box mt={3} display="flex" justifyContent="flex-end">
            <Button
              onClick={() => setValue("showPriceForm", !showPriceForm)}
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
      </FormProvider>
    </Modal>
  );
};
