
import { useEffect, useMemo } from "react";
import {useQuotationStore,} from "../../../../../hooks";
import { Box, Typography, Button, TextField,useTheme, Link} from "@mui/material";
import { useForm, FormProvider, useFieldArray } from "react-hook-form";
import { useScreenSizes } from "../../../../../shared/constants/screen-width";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { PostAdd, Edit, Payments,History, Assignment } from "@mui/icons-material";
import { QuotationActivitiesSummery, QuotationsFatherSubActivites } from "../../../components";


export const EventQuotationsActivitiesPage = () => {

const theme = useTheme();
const isDark = theme.palette.mode === "dark";
const navigate = useNavigate();
const dispatch = useDispatch();
const { isLg } = useScreenSizes();

const {
    quotations,
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

const datos = {
    tipo: " Fiesta Privada",
    cliente: " Juan Perez",
    codigoEvent: "EVT-20251114-9IIYG4"
}
const listaDeActividades = [
    {
      nombre: "Actividad Padre 1",
      descripcion: "Descripcion de la actividad padre 1",
      precio: 500.00,
      cantidadSubactividades: 3,
      subactividades: [
        { nombre: "Subactividad 1", precio: 150.00, trabajador: "Carlos Lopez" },
        { nombre: "Subactividad 2", precio: 200.00, trabajador: "Ana Gomez" },
        { nombre: "Subactividad 3", precio: 150.00, trabajador: "Luis Martinez" }
      ],
      fechaCreacion: "2024-11-01",
      ultimaModificacion: "2024-11-10"
    },
    {
      nombre: "Actividad Padre 2",
      descripcion: "Descripcion de la actividad padre 2",
      precio: 700.00,
      cantidadSubactividades: 2,
      subactividades: [
        { nombre: "Subactividad 1", precio: 150.00, trabajador: "Carlos Lopez" },
        { nombre: "Subactividad 2", precio: 550.00, trabajador: "Ana Gomez" }
      ],
      fechaCreacion: "2024-11-05",
      ultimaModificacion: "2024-11-12"
    }
    // ... (Puedes añadir Actividad Padre 3, 4, 5... aquí)
  ];

return (
    <>
    <Box
        sx={{
          borderRadius: 2,
          
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
              Gestion de actividades 
            </Typography>
            <Typography sx={{ color: "text.secondary", fontSize: 16 }}>
              {datos.tipo} - {datos.cliente} - {datos.codigoEvent}
            </Typography>
          </Box>
          <Link to="/admin/quotations/new" style={{ textDecoration: 'none', color: 'inherit' }}>
            <Button
              variant="contained"
              startIcon={<PostAdd />}
              onClick={() => setSelectedQuotation(null)}
              sx={{
                backgroundColor: "#212121",
                color: "#fff",
                borderRadius: 2,
                textTransform: "none",
                px: 3,
                py: 1.5,
              }}
            >
              {isLg ? "Crear Actividad padre" : "Actividad padre"}
            </Button>
          </Link>
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
        {listaDeActividades.map((actividad, index) => (
          <QuotationsFatherSubActivites 
            key={index} // <-- React necesita una 'key' única para cada item
            actividades={actividad} // <-- Pasa el objeto 'actividad' actual al prop
          />
        ))}
        <QuotationActivitiesSummery amount={listaDeActividades.map(act => act.precio)}/>

        
      </Box>
    </>
  );
};