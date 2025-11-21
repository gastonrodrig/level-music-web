import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  CircularProgress,
} from "@mui/material";
import { AddCircleOutline, Edit, PriceChange } from "@mui/icons-material";
import { useEquipmentStore } from "../../../../hooks/equipment/use-equipment-store";
import { TableComponent } from "../../../../shared/ui/components";
import { EquipmentModal, EquipmentPriceModal } from "../../components";
import { useScreenSizes } from "../../../../shared/constants/screen-width";
import { formatDay } from "../../../../shared/utils";

export const EquipmentPage = () => {
  const {
    equipments,
    total,
    loading,
    searchTerm,
    rowsPerPage,
    currentPage,
    orderBy,
    order,
    selected,
    setSearchTerm,
    setRowsPerPageGlobal,
    setPageGlobal,
    setOrderBy,
    setOrder,
    startLoadingEquipmentsPaginated,
    setSelectedEquipment,
  } = useEquipmentStore();
  const { isLg } = useScreenSizes();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSecondModalOpen, setIsSecondModalOpen] = useState(false);

  useEffect(() => {
    startLoadingEquipmentsPaginated();
  }, [currentPage, rowsPerPage, searchTerm, orderBy, order]);

  const openModal = (payload) => {
    setSelectedEquipment(payload || {});
    setIsModalOpen(true);
  };

  const openSecondModal = (payload) => {
    setSelectedEquipment(payload);
    setIsSecondModalOpen(true);
  };

  const columns = [
    {
      id: "name",
      label: "Nombre",
      sortable: true,
    },
    {
      id: "equipment_type",
      label: "Tipo",
      sortable: true,
    },
    {
      id: "serial_number",
      label: "N° de Serie",
      sortable: true,
    },
    {
      id: "status",
      label: "Estado",
      sortable: true,
    },
    {
      id: "location",
      label: "Locación",
      sortable: true,
    },
    {
      id: "next_maintenance_date",
      label: "Próximo Mantenimiento (Preventivo)",
      sortable: true,
      accessor: (row) =>
        row.next_maintenance_date
          ? formatDay(row.next_maintenance_date)
          : "N/A",
    },
  ];

  const actions = [
    {
      label: "Editar",
      icon: <Edit />,
      onClick: (row) => openModal(row),
    },
    {
      label: "Precios",
      icon: <PriceChange />,
      onClick: (row) => openSecondModal(row),
    },
  ];

  return (
    <>
      <Box
        sx={{
          borderRadius: 2,
          border: (theme) =>
            `1px solid ${
              theme.palette.mode === "dark"
                ? "rgb(140, 140, 140)"
                : "rgba(0,0,0,0.12)"
            }`,
        }}
      >
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          sx={{ px: 3, py: 2 }}
        >
          <Box>
            <Typography sx={{ fontWeight: 600, fontSize: 24 }}>
              Listado de Equipos
            </Typography>
            <Typography sx={{ color: "text.secondary", fontSize: 16 }}>
              Administra los equipos
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddCircleOutline />}
            sx={{
              backgroundColor: "#212121",
              color: "#fff",
              borderRadius: 2,
              textTransform: "none",
              px: 3,
              py: 1.5,
            }}
            onClick={() => openModal()}
          >
            {isLg ? "Agregar Equipo" : "Agregar"}
          </Button>
        </Box>

        <Box
          display="flex"
          justifyContent="start"
          alignItems="center"
          sx={{
            px: 3,
            pb: { xs: 1, lg: 3 },
            width: { xs: "100%", sm: "300px" },
          }}
        >
          <TextField
            size="small"
            placeholder="Buscar..."
            value={searchTerm}
            fullWidth
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Box>

        {loading ? (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            sx={{ py: 5 }}
          >
            <CircularProgress />
          </Box>
        ) : equipments.length === 0 ? (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            sx={{ py: 5 }}
          >
            <Typography sx={{ color: "text.secondary", fontSize: 16 }}>
              No se encontraron resultados.
            </Typography>
          </Box>
        ) : (
          <TableComponent
            rows={equipments}
            columns={columns}
            order={order}
            orderBy={orderBy}
            onRequestSort={(prop) => {
              const isAsc = orderBy === prop && order === "asc";
              setOrder(isAsc ? "desc" : "asc");
              setOrderBy(prop);
            }}
            page={currentPage}
            rowsPerPage={rowsPerPage}
            total={total}
            onPageChange={(_, newPage) => setPageGlobal(newPage)}
            onRowsPerPageChange={(e) => {
              setRowsPerPageGlobal(parseInt(e.target.value, 10));
              setPageGlobal(0);
            }}
            actions={actions}
            hasActions
          />
        )}
      </Box>

      <EquipmentModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        equipment={selected}
        setEquipment={setSelectedEquipment}
        loading={loading}
      />

      <EquipmentPriceModal
        open={isSecondModalOpen}
        onClose={() => setIsSecondModalOpen(false)}
        equipment={selected}
      />
    </>
  );
};