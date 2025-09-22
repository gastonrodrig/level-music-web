import { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  CircularProgress
} from '@mui/material';
import { AddCircleOutline, Edit } from '@mui/icons-material';
import { useMaintenanceStore } from '../../../../hooks/equipment/use-maintenance-store';
import { TableComponent } from '../../../../shared/ui/components';
import { MaintenanceModal } from '../../components';
import { useScreenSizes } from '../../../../shared/constants/screen-width';
import { formatDay } from '../../../../shared/utils';

export const EquipmentMaintenancePage = () => {
  const {
    maintenances,
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
    startLoadingMaintenancesPaginated,
    setSelectedMaintenance,
  } = useMaintenanceStore();
  const { isLg } = useScreenSizes();

  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    startLoadingMaintenancesPaginated();
  }, [currentPage, rowsPerPage, searchTerm, orderBy, order]);

  const openModal = (payload) => {
    setSelectedMaintenance(payload || {});
    setIsModalOpen(true);
  };

  const columns = [
    { id: 'equipment_serial_number', label: 'Número de serie', sortable: true },
    { id: 'equipment_name', label: 'Nombre del equipo', sortable: true },
    { id: 'equipment_type', label: 'Tipo de equipo', sortable: true },
    { id: 'type', label: 'Tipo de mantenimiento', sortable: true },
    { id: 'status', label: 'Estado', sortable: true },
    {
      id: 'date',
      label: 'Fecha',
      sortable: true,
      accessor: row => row.date ? formatDay(row.date) : 'N/A'
    },
  ];

  const actions = [
    {
      label: 'Cambiar estado',
      icon: <Edit />,
      onClick: row => openModal(row)
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
              Listado de Mantenimientos
            </Typography>
            <Typography sx={{ color: "text.secondary", fontSize: 16 }}>
              Administra los mantenimientos
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
            {isLg ? "Agregar Mantenimiento" : "Agregar"}
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
        ) : maintenances.length === 0 ? (
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
            rows={maintenances}
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

      <MaintenanceModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        maintenance={selected}
        setMaintenance={setSelectedMaintenance}
        loading={loading}
      />
    </>
  );
};