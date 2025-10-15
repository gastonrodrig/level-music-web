import React, { useState, useMemo } from 'react';
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
  CircularProgress,
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled';
 import { Group,  Edit, Payments  } from "@mui/icons-material";
import { TableComponent } from "../../../../../shared/ui/components";
import { useQuotationStore } from '../../../../../hooks';
import { useEffect } from 'react';
import { useScreenSizes } from "../../../../../shared/constants/screen-width";
import { Link, useNavigate } from "react-router-dom";
import { formatDay } from "../../../../../shared/utils";

export const EventOnGoing = () => {
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
    startLoadingQuotationPaginated,
    setSelectedQuotation,
  } = useQuotationStore();
  const filteredQuotations = quotations.filter(
  (q) => String(q.status).toLowerCase() === "en seguimiento"
  );  
  const { isLg } = useScreenSizes();
  const navigate = useNavigate();
  const columns = [
      { 
        id: "event_code", 
        label: "Evento", 
        sortable: false 
      },
      {
        id: "client_info",
        label: "Cliente",
        sortable: false,
        accessor: (row) => {
          if (row.client_info.client_type === "Persona") {
            return row.client_info.first_name && row.client_info.last_name
              ? `${row.client_info.first_name} ${row.client_info.last_name}`
              : "N/A";
          }
          if (row.client_info.client_type === "Empresa") {
            return row.client_info.company_name || "N/A";
          }
          return "N/A";
        },
      },

      {
        id: "name",
        label: "Nombre Evento",
        sortable: false,
        accessor: (row) => row.name || "N/A",
      },
      {
        id: "phone",
        label: "Teléfono",
        sortable: false,
        accessor: (row) => row.client_info.phone || "N/A",
      },
      {
        id: "event_date",
        label: "Fecha",
        sortable: true,
        accessor: (row) => (row.event_date ? formatDay(row.event_date) : "N/A"),
      },
      { 
        id: "status", 
        label: "Estado", 
        sortable: false 
      },
    ];

     const actions = [
  {
    label: 'Reprogramar Evento',
    icon: <AccessTimeFilledIcon />,
    onClick: (row) => {
      setSelectedQuotation(row);
      navigate(`/admin/event-on-going/reprograming`);
    },
    
  },
  
];

      useEffect(() => {
        startLoadingQuotationPaginated();
      }, [currentPage, rowsPerPage, searchTerm, orderBy, order]);

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
              Listado de evento en seguimiento
            </Typography>
            <Typography sx={{ color: "text.secondary", fontSize: 16 }}>
              Administra los eventos que están en seguimiento
            </Typography>
          </Box>
      
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
                ) : quotations.length === 0 ? (
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
                    rows={filteredQuotations}
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
    </>
  );
};
