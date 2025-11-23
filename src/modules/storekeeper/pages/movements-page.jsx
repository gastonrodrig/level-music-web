import React, { useEffect, useState, useCallback } from 'react'
import { Box, Typography, Button, TextField, CircularProgress } from '@mui/material'
import { AddCircleOutline } from '@mui/icons-material'
import { useScreenSizes } from '../../../shared/constants/screen-width'
import { TableComponent } from '../../../shared/ui/components'
import MovementsModal from './modal/movements-modal'
import { useStorehouseMovementService } from '../../../hooks/event/use-storehouse-movement-store'

export const MovementsPage = () => {
  const [showModal, setShowModal] = useState(false)
  const [movements, setMovements] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [currentPage, setCurrentPage] = useState(0)
  const [orderBy, setOrderBy] = useState('movement_date')
  const [order, setOrder] = useState('desc')
  const [total, setTotal] = useState(0)

  const { isLg } = useScreenSizes()
  const { fetchPaginated } = useStorehouseMovementService()

  const fetchMovements = useCallback(async (params = {}) => {
    setLoading(true)
    try {
      const data = await fetchPaginated(params)
      setMovements(data.items || [])
      setTotal(data.total || 0)
    } finally {
      setLoading(false)
    }
  }, [fetchPaginated])

  useEffect(() => {
  fetchMovements({
    limit: rowsPerPage,
    offset: currentPage * rowsPerPage,
    search: searchTerm || undefined,
    sortField: orderBy,
    sortOrder: order,
  })
}, [rowsPerPage, currentPage, searchTerm, orderBy, order])

  const handleCreated = () => {
    fetchMovements({
      limit: rowsPerPage,
      offset: currentPage * rowsPerPage,
      search: searchTerm || undefined,
      sortField: orderBy,
      sortOrder: order,
    })
    setShowModal(false)
  }

  const columns = [
    { id: 'code', label: 'Código', sortable: true, width: '220px', truncate: true },
    { id: 'movement_type', label: 'Tipo', sortable: true, width: '160px' },
    { id: 'equipment', label: 'Equipo', sortable: false, width: '260px', accessor: r => r.equipment?.name || '' },
    { id: 'event', label: 'Evento asociado', sortable: false, width: '260px', accessor: r => r.event?.name || '' },
    { id: 'destination', label: 'Destino', sortable: false, width: '140px', accessor: r => r.destination || '' },
    { id: 'state', label: 'Estado', sortable: false, width: '120px', accessor: r => r.state || '' },
    { id: 'movement_date', label: 'Fecha', sortable: true, width: '180px', accessor: r => r.movement_date ? new Date(r.movement_date).toLocaleString() : '' },
  ]

  return (
    <>
      <Box sx={{ borderRadius: 2, border: theme => `1px solid ${theme.palette.mode === 'dark' ? 'rgb(140, 140, 140)' : 'rgba(0,0,0,0.12)'}` }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ px: 3, py: 2 }}>
          <Box>
            <Typography sx={{ fontWeight: 600, fontSize: 24 }}>Historial de Movimientos</Typography>
            <Typography sx={{ color: 'text.secondary', fontSize: 16 }}>Visualiza todos los códigos generados y su estado</Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddCircleOutline />}
            sx={{ backgroundColor: '#212121', color: '#fff', borderRadius: 2, textTransform: 'none', px: 3, py: 1.5 }}
            onClick={() => setShowModal(true)}
          >
            {isLg ? 'Nuevo Movimiento' : 'Nuevo'}
          </Button>
        </Box>

        <Box display="flex" justifyContent="start" alignItems="center" sx={{ px: 3, pb: { xs: 1, lg: 3 }, width: { xs: '100%', sm: '300px' } }}>
          <TextField size="small" placeholder="Buscar por código..." value={searchTerm} fullWidth onChange={(e) => setSearchTerm(e.target.value)} />
        </Box>

        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" sx={{ py: 5 }}><CircularProgress /></Box>
        ) : movements.length === 0 ? (
          <Box display="flex" justifyContent="center" alignItems="center" sx={{ py: 5 }}>
            <Typography sx={{ color: 'text.secondary', fontSize: 16 }}>No se encontraron movimientos.</Typography>
          </Box>
        ) : (
          <TableComponent
            rows={movements}
            columns={columns}
            order={order}
            orderBy={orderBy}
            onRequestSort={(prop) => { const isAsc = orderBy === prop && order === 'asc'; setOrder(isAsc ? 'desc' : 'asc'); setOrderBy(prop) }}
            page={currentPage}
            rowsPerPage={rowsPerPage}
            total={total}
            onPageChange={(_, newPage) => setCurrentPage(newPage)}
            onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setCurrentPage(0) }}
            hasActions={false}
          />
        )}
      </Box>

      <MovementsModal open={showModal} onClose={() => setShowModal(false)} onCreated={handleCreated} />
    </>
  )
}
