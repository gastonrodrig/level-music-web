import { Box, IconButton, Modal, TextField, Typography, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, TableFooter, TablePagination, Paper, CircularProgress } from '@mui/material'
import { useWorkerPriceStore } from '../../../../hooks'
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Close } from '@mui/icons-material';

export const WorkerPriceModal = ({
  open, 
  onClose,
  worker = {},
}) => {
  const { 
    workerPrices,
    total,
    loading,
    currentPage,
    rowsPerPage,
    orderBy,
    order,
    setPageGlobal,
    setRowsPerPageGlobal,
    startLoadingWorkerPricePaginated,
    startCreateWorkerPrice,
  } = useWorkerPriceStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm({
    mode: "onBlur",
  });

useEffect(() => {
  if (open && worker?._id) {
    startLoadingWorkerPricePaginated(worker._id);
  }
}, [open, worker?._id, currentPage, rowsPerPage]);

  console.log(workerPrices)


  const onSubmit = async (data) => {
    // try {
      const success = startCreateWorkerPrice(data);
      if (success) onClose();
    // } catch (error) {
    //   console.log(error)
    // }
  };

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
        {/* Modal content goes here */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
          <Typography variant="h6" fontWeight={600}>
            Precios por Temporada
          </Typography>
          <IconButton onClick={onClose}>
            <Close />
          </IconButton>
        </Box>

        <Typography fontSize={15}>
          <Box component="span" sx={{ fontWeight: 700, mr: 0.5 }}>Trabajador:</Box>
          <Box component="span">{` ${worker?.first_name || ''} ${worker?.last_name || ''}`}</Box>
        </Typography>

        {/* Tabla con paginación */}
        <Box sx={{ mt: 2 }}>
          <TableContainer component={Paper} sx={{ overflowX: 'auto' }}>
            <Table sx={{ minWidth: 650 }} size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Nro. Temporada</TableCell>
                  <TableCell>Precio</TableCell>
                  <TableCell>Desde</TableCell>
                  <TableCell>Hasta</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      <Box sx={{ py: 2 }}><CircularProgress size={24} /></Box>
                    </TableCell>
                  </TableRow>
                ) : (workerPrices && workerPrices.length > 0 ? (
                  workerPrices.map((wp) => (
                    <TableRow key={wp._id}>
                      <TableCell>{wp.season_number}</TableCell>
                      <TableCell>{wp.reference_price}</TableCell>
                      <TableCell>{wp.start_date}</TableCell>
                      <TableCell>{wp.end_date}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} align="center">No hay precios registrados</TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    count={total ?? 0}
                    rowsPerPage={rowsPerPage}
                    page={currentPage}
                    onPageChange={(_, newPage) => setPageGlobal(newPage)}
                    onRowsPerPageChange={(e) => {
                      const newRows = parseInt(e.target.value, 10);
                      setRowsPerPageGlobal(newRows);
                      setPageGlobal(0);
                    }}
                  />
                </TableRow>
              </TableFooter>
            </Table>
          </TableContainer>
        </Box>

        {/* Nombre */}
        {/* <TextField
          label="Nombre"
          fullWidth
          {...register("name", {
            required: "El nombre es obligatorio",
          })}
          error={!!errors.name}
          helperText={errors.name?.message}
        /> */}

      </Box>
    </Modal>
  )
}
