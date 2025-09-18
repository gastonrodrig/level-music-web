import { useEffect, useState } from 'react';
import { AddCircleOutline, Edit } from '@mui/icons-material';
import { useQuotationStore,useEventTypeStore } from '../../../../hooks';
import { useScreenSizes } from '../../../../shared/constants/screen-width';
import { TableComponent } from '../../../../shared/ui/components';
import { formatDay } from '../../../../shared/utils';
import {
  Box,
  Typography,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  TableSortLabel,
  TextField,
  CircularProgress
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import MoreVertIcon from '@mui/icons-material/MoreVert';


export const EventQuotationsPage = () => {
const {
  quotations,
    selected,
    total,
    loading,
    searchTerm,
    rowsPerPage,
    currentPage,
    orderBy,
    order,
    setSearchTerm,
    setOrderBy,
    setOrder,
    setPageGlobal,
    setRowsPerPageGlobal,
    startCreateQuotationLanding,
    startLoadingQuotationPaginated,
    setSelectedQuotation,
} = useQuotationStore();
    const { isLg } = useScreenSizes();
    const columns = [
        { id: 'event_code', label: 'Evento' , sortable: false },
        { id: 'date', label: 'Fecha', sortable: true, accessor: (row) => row.date ? formatDay(row.date) : 'N/A' },
        { id: 'attendees_count', label: 'Asistentes' , sortable: false },
        { id: 'status', label: 'Estado' , sortable: false },
        //falta establecer los estados 
        // { id: 'state', label: 'Estado' , sortable: false },
      ];
    useEffect(() => {
          startLoadingQuotationPaginated();
    }, [currentPage, rowsPerPage, searchTerm, orderBy, order]);

    const [anchorEl, setAnchorEl] = useState(null);       // para el menú de acciones
    const actions = [
        { 
          label: 'Editar', 
          icon: <Edit />, 
  
        },
      ];
  return (
      <>
            <Box
              sx={{
                borderRadius: 2,
                border: (theme) => `1px solid ${theme.palette.mode === 'dark' ? 'rgb(140, 140, 140)' : 'rgba(0,0,0,0.12)'}`
              }}
            >
              <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ px: 3, py: 2 }}>
                <Box>
                  <Typography sx={{ fontWeight: 600, fontSize: 24 }}>Listado de cotizaciones</Typography>
                  <Typography sx={{ color: 'text.secondary', fontSize: 16 }}>Administra las cotizaciones</Typography>
                </Box>
                <Button
                  variant="contained"
                  startIcon={<AddCircleOutline />}
                  sx={{ backgroundColor: '#212121', color: '#fff', borderRadius: 2, textTransform: 'none', px: 3, py: 1.5 }}
                  onClick={() => openModal()} 
                >
                  {isLg ? 'Agregar Cotización' : 'Agregar'}
                </Button>
              </Box>
      
              <Box
                display="flex"
                justifyContent="start"
                alignItems="center"
                sx={{ px: 3, pb: { xs: 1, lg: 3 }, width: { xs: '100%', sm: '300px' } }} 
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
                <Box display="flex" justifyContent="center" alignItems="center" sx={{ py: 5 }}>
                  <CircularProgress />
                </Box>
              ) : quotations.length === 0 ? (
                <Box display="flex" justifyContent="center" alignItems="center" sx={{ py: 5 }}>
                  <Typography sx={{ color: 'text.secondary', fontSize: 16 }}>
                    No se encontraron resultados.
                  </Typography>
                </Box>
              ) : (
                <TableComponent
                  rows={quotations}
                  columns={columns}
                  order={order}
                  orderBy={orderBy}
                  onRequestSort={(prop) => {
                    const isAsc = orderBy === prop && order === 'asc';
                    setOrder(isAsc ? 'desc' : 'asc');
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
      </>
  );
};