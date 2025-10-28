import { useEffect } from "react";
import { Box, Typography, TextField, CircularProgress } from "@mui/material";
import { useAuthStore, useAppointmentStore } from "../../../../hooks";
import { TableComponent } from "../../../../shared/ui/components";
import { formatDay } from "../../../../shared/utils";

export const AppointmentPage = () => {
  const {
    appointments,
    total,
    loading,
    searchTerm,
    rowsPerPage,
    currentPage,
    orderBy,
    order,
    setSearchTerm,
    setRowsPerPageGlobal,
    setPageGlobal,
    setOrderBy,
    setOrder,
    startLoadingAppointmentPaginated,
  } = useAppointmentStore();

  const { _id } = useAuthStore();

  useEffect(() => {
    startLoadingAppointmentPaginated(_id);
  }, [_id, currentPage, rowsPerPage, searchTerm, orderBy, order]);

  const columns = [
    {
      id: "client",
      label: "Cliente",
      sortable: true,
      accessor: (row) =>
        row.client_type === "Persona"
          ? `${row.first_name} ${row.last_name}`
          : row.company_name,
    },
    {
      id: "client_type",
      label: "Tipo Cliente",
      sortable: false,
    },
    {
      id: "phone",
      label: "Teléfono",
      sortable: false,
    },
    {
      id: "date",
      label: "Fecha Cita",
      sortable: true,
      accessor: (row) => (row.date ? formatDay(row.date) : "N/A"),
    },
    {
      id: "status",
      label: "Estado",
      sortable: true,
    },
  ];

  return (
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
      {/* Header */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        sx={{ px: 3, py: 2 }}
      >
        <Box>
          <Typography sx={{ fontWeight: 600, fontSize: 24 }}>
            Listado de Citas
          </Typography>
          <Typography sx={{ color: "text.secondary", fontSize: 16 }}>
            Observa las citas programadas para realizar tus eventos con nosotros
          </Typography>
        </Box>
      </Box>

      {/* Buscador */}
      <Box
        display="flex"
        justifyContent="start"
        alignItems="center"
        sx={{ px: 3, pb: { xs: 1, lg: 3 }, width: { xs: "100%", sm: "300px" } }}
      >
        <TextField
          size="small"
          placeholder="Buscar..."
          value={searchTerm}
          fullWidth
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </Box>

      {/* Tabla o Loading */}
      {loading ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          sx={{ py: 5 }}
        >
          <CircularProgress />
        </Box>
      ) : appointments.length === 0 ? (
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
          rows={appointments}
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
          hasActions={false}
        />
      )}
    </Box>
  );
};
