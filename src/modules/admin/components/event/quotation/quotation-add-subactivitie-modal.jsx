// En: ../../../components/SubActivityModal.jsx (o donde lo quieras crear)

import {
  Modal, Box, Typography, TextField, Button, Grid,
  useTheme, Select, MenuItem, FormControl, InputLabel,
  Switch, FormControlLabel, FormHelperText,Paper,Chip // <-- Se añaden estos
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { Save, Inventory } from "@mui/icons-material";
import { useEffect, useState } from "react";


export const SubActivityModal = ({ open, onClose, onSubmit, trabajadoresList = [], equipamientoList = [], fases = [] , movementType = []}) => {
  const theme = useTheme();
  
  const isDark = theme.palette.mode === "dark";
  // --- ESTADO PARA LOS SWITCHES ---
  const [showMovimiento, setShowMovimiento] = useState(false);
  const [showEquipamiento, setShowEquipamiento] = useState(false);
  const [showEvidencia, setShowEvidencia] = useState(false);
  // ---------------------------------

  const { register, handleSubmit, control, formState: { errors }, reset } = useForm({
    defaultValues: {
      nombre: "",
      descripcion: "",
      precio: 0,
      cantidad: 1,
      trabajador: "",
      equipamiento: "" // <-- Nuevo campo
    }
  });

  // 'data' es el objeto del formulario ({nombre, precio, ...})
  const onFormSubmit = (data) => {
    // Solo enviamos los datos si el switch está activado
    const finalData = {
      ...data,
      trabajador: showMovimiento ? data.trabajador : null,
      equipamiento: showEquipamiento ? data.equipamiento : null,
    };

    onSubmit(finalData); // Llama a la función del padre
    handleClose(); // Llama a la función local de cierre
  };
  useEffect(() => { console.log("Equipamiento seleccionado:", equipamientoList); }, [equipamientoList]);

  const handleClose = () => {
    reset(); // Resetea el formulario
    setShowMovimiento(false); // Resetea los switches
    setShowEquipamiento(false);
    setShowEvidencia(false);

    onClose(); // Llama a la función del padre
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={{position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600,
  bgcolor: 'background.paper',
  borderRadius: 2,
  boxShadow: 24,
  p: 4,}} component="form" onSubmit={handleSubmit(onFormSubmit)}>
        
        <Typography variant="h6" component="h2" sx={{ mb: 1 }}>
          Crear Subactividad
        </Typography>
        <Typography sx={{ color: "text.secondary", fontSize: 14,mb:3 }}>Crea una nueva subactividad para la actividad padre seleccionada</Typography>
        
        <Grid container spacing={2}>
          
          {/* Nombre */}
          <Grid item xs={12}>
            <Typography component="h1" sx={{ mt: 1,mb:1 }}>
          Nombre de la subactividad
            </Typography>
            <TextField
              placeholder="Ej. Salida de Equipos"
              fullWidth
              {...register("nombre", { required: "El nombre es requerido" })}
              error={!!errors.nombre}
              helperText={errors.nombre?.message}
            />
          </Grid>
          
          {/* Descripción */}
          <Grid item xs={12}>
            <Typography component="h1" sx={{ mb:1 }}>
          Fase
            </Typography>
            <FormControl fullWidth error={!!errors.trabajador}>
                <InputLabel id="trabajador-select-label"></InputLabel>
                <Controller
                  name="fase"
                  control={control}
                  
                
                  render={({ field }) => (
                    <Select
                      labelId="fase-select-label"
                      
                      {...field}
                    >
                      {fases.map((fasesactivities) => (
                        <MenuItem key={fasesactivities.id} value={fasesactivities.nombre}>
                          {fasesactivities.nombre}
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                />
                <FormHelperText>{errors.trabajador?.message}</FormHelperText>
              </FormControl>
          </Grid>

          {/* --- Switch Trabajador --- */}
          <Grid item xs={12} sx={{ pb: 0 }}>
            <FormControlLabel
              control={
                <Switch 
                  checked={showMovimiento} 
                  onChange={(e) => setShowMovimiento(e.target.checked)} 
                />
              }
              label="Pertenece a movimiento de almacen"
            />
          </Grid>

          {/* --- Dropdown Trabajador (Condicional) --- */}
          {showMovimiento && (
            <>
            <Grid item xs={12}>
                <Typography component="h1" sx={{ mb:1 }}>
            Tipo de movimiento
            </Typography>
              <FormControl fullWidth error={!!errors.trabajador}>
                <InputLabel id="movimiento-select-label"></InputLabel>
                <Controller
                  name="trabajador"
                  control={control}
                  // La validación es condicional
                  placeholder="Selecciona un tipo de movimiento"
                  render={({ field }) => (
                    <Select
                    
                      labelId="movimiento-select-label"
                      label="Tipo de movimiento"
                      {...field}
                    >
                      {movementType.map((movement) => (
                        <MenuItem key={movement.id} value={movement.nombre}>
                          {movement.nombre}
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                />
                <FormHelperText>{errors.trabajador?.message}</FormHelperText>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
                <Typography component="h1" sx={{ mb:1 }}>
            Equipos asignados al evento
            </Typography>
                <Paper 
                    elevation={0}
                    sx={{
                    p: 2,
                    mb: 1.5,
                    borderRadius: 2,
                    bgcolor: isDark ? "#2d2d2d" : "#f9f9f9",
                    border: `1px solid ${theme.palette.divider}`,
                    // make the list scrollable
                    maxHeight: 220,           // ajustar según diseño
                    overflowY: 'auto',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 1,
                    pr: 1,                    // padding-right para evitar overlay del scrollbar
                    }}
                >
            {equipamientoList.map((equipamientoList, index) => (
          <Box 
            sx={{ 
              bgcolor: 'background.paper',
               borderRadius: 2,
              display: 'flex', 
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: 1.5, // <-- Espacio entre nombre y chip
              mb: 1 // <-- Margen inferior
            }}
          >
            <Box sx={{mt:2,mx:2, display: 'flex', flexDirection:'column', alignItems:'start'}}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, }}>
            <Inventory sx={{ fontSize: '1rem' }} />
            <Typography variant="h6" fontSize={16} fontWeight={200} sx={{ m: 0 }}>
              {equipamientoList.nombre}
            </Typography>
            </Box>
            <Typography sx={{ color: "text.secondary", fontSize: 12,mb:3 }}>    
                {equipamientoList.codigo}
            </Typography>
            </Box>
            
            {/* ESTE ES EL CHIP DE PRECIO */}
            
            <Chip
              label={equipamientoList.estado}
              size="small"
              color="success" // Verde para el precio
              variant="outlined"
              sx={{ fontWeight: 200, py:2, px:1, mx:2  }}
            />
          </Box>
))}
        </Paper>
        </Grid>
</>

          )}
          { !showMovimiento && (
            <>
          {/* --- Switch Equipamiento --- */}
          <Grid item xs={12} sx={{ pb: 0 }}>
            <FormControlLabel
              control={
                <Switch 
                  checked={showEquipamiento} 
                  onChange={(e) => setShowEquipamiento(e.target.checked)} 
                />
              }
              label="Necesita Precio"
            />
          </Grid>

          {/* --- Dropdown Equipamiento (Condicional) --- */}
          {showEquipamiento && (
            <Grid item xs={12}>
              <TextField
              placeholder="Ej. 350"
              type="number"
              fullWidth
              
              {...register("cantidad", { 
                required: "La cantidad es requerida",
                valueAsNumber: true,
                min: {  message: "Debe ser al menos 1" }
              })}
              error={!!errors.cantidad}
              helperText={errors.cantidad?.message}
            />
            </Grid>
          )}
          <Grid item xs={12}>
            <Typography component="h1" sx={{ mb:1 }}>
            Trabajadores
            </Typography>
              <FormControl fullWidth error={!!errors.trabajador}>
                <InputLabel id="trabajador-select-label"></InputLabel>
                <Controller
                  name="trabajador"
                  control={control}
                  // La validación es condicional
                  
                  render={({ field }) => (
                    <Select
                      labelId="trabajador-select-label"
                      label="Trabajador"
                      {...field}
                    >
                      {trabajadoresList.map((trabajador) => (
                        <MenuItem key={trabajador.id} value={trabajador.nombre}>
                          {trabajador.nombre}
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                />
                <FormHelperText>{errors.trabajador?.message}</FormHelperText>
              </FormControl>
            </Grid>
            <Grid item xs={12} sx={{ pb: 0 }}>
            <FormControlLabel
              control={
                <Switch 
                  checked={showEvidencia} 
                  onChange={(e) => setShowEvidencia(e.target.checked)} 
                />
              }
              label="Necesita Evidencia"
            />
          </Grid>
          </>
)}

          {/* Botones */}
          <Grid item xs={12} sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
            <Button variant="outlined" onClick={handleClose} sx={{
            mt: 1,
            backgroundColor: "#212121",
            color: "#fff",
            textTransform: "none",
            py: 1.5,
            borderRadius: 2,
            fontWeight: 600,
            width: '25%',
          }}>
              Cancelar
            </Button>
            <Button 
              type="submit" 
              variant="contained" 
              sx={{
            mt: 1,
            backgroundColor: "#212121",
            color: "#fff",
            textTransform: "none",
            py: 1.5,
            borderRadius: 2,
            fontWeight: 600,
            width: '25%',
          }}
              startIcon={<Save />}
            >
              Agregar
            </Button>
          </Grid>
          
        </Grid>
      </Box>
    </Modal>
  );
};