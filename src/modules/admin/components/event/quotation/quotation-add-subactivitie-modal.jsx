// En: ../../../components/SubActivityModal.jsx (o donde lo quieras crear)

import {
  Modal, Box, Typography, TextField, Button, Grid,
  useTheme, Select, MenuItem, FormControl, InputLabel,
  Switch, FormControlLabel, FormHelperText,Paper,Chip // <-- Se añaden estos
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { Save, Inventory } from "@mui/icons-material";
import { useEffect, useState, useMemo } from "react";
import { useQuotationStore, useWorkerStore } from "../../../../../hooks";



export const SubActivityModal = ({ open, onClose, onSubmit}) => {
  const theme = useTheme();
  
  const isDark = theme.palette.mode === "dark";
  // --- ESTADO PARA LOS SWITCHES ---
  const [showMovimiento, setShowMovimiento] = useState(false);
  const [showEquipamiento, setShowEquipamiento] = useState(false);
  const [showEvidencia, setShowEvidencia] = useState(false);
  const [showPrice, setShowPrice] = useState(false);
  // ---------------------------------

  const { register, handleSubmit, control, setValue, formState: { errors }, reset } = useForm({
    defaultValues: {
      subtask_name: "",
      price: 0,
      worker_name: "",
      worker_id: null,
       
      phase: "",
      storehouse_code: "",
      requires_evidence: false,
      storehouse_movement_type: "",
      is_for_storehouse: false,
    }
  });

  const {
    selected,
  } = useQuotationStore();

  const {
    workers,
  } = useWorkerStore();

  const phase = [
   {id:1, nombre: "Planificación"},
   {id:2, nombre: "Ejecución"},
   {id:3, nombre: "Seguimiento"},
  ]

  const storehouse_movement_type = [
    { id: 1, nombre: "Salida de almacén" },
    { id: 2, nombre: "Recepción en evento" },
    { id: 3, nombre: "Salida de evento" },
    { id: 4, nombre: "Recepción en almacén" },
  ];

  const equipmentList = useMemo(() => {
    // Si no hay 'selected' o 'assignations', devuelve un array vacío
    console.log("Selected en equipo:", selected);
    if (!selected || !selected.assignations) return [];
  
    // Filtramos el array
    return selected.assignations.filter(
      (item) => item.resource_type === "Equipo"
    );
  }, [selected]);

  useEffect(() => {
    console.log("Lista de equipamientos filtrada:", equipmentList);
    console .log("Selected completo:", selected);
  }, [equipmentList]);

  // 'data' es el objeto del formulario ({nombre, precio, ...})
  const onFormSubmit = (data) => {
    // 'data' tiene todos los campos del formulario
    // Sobrescribimos los campos de los switches con el 'useState'
    const finalData = {
      ...data,

      subtask_name: data.subtask_name,
      is_for_storehouse: showMovimiento,
      requires_evidence: showEvidencia,
      phase: data.phase,
      // Lógica de limpieza:
      // Si es de almacén, no tiene precio ni trabajador.
      // Si NO es de almacén, no tiene tipo de movimiento.
      price: showMovimiento ? 0 : (showPrice ? data.price : 0),
      worker_id: showMovimiento ? null : data.worker_id,

      storehouse_movement_type: showMovimiento ? data.storehouse_movement_type : "",
    };

    console.log("Datos del formulario antes de enviar:", finalData);
    onSubmit(finalData); // Llama a la función del padre
    handleClose(); // Llama a la función local de cierre
  };
  

  const handleClose = () => {
    reset(); // Resetea el formulario
    setShowMovimiento(false); // Resetea los switches
    setShowEquipamiento(false);
    setShowEvidencia(false);
    setShowPrice(false);
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
  p: 4,}} >
        
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
              {...register("subtask_name", { required: "El nombre es requerido" })}
              error={!!errors.subtask_name}
              helperText={errors.subtask_name?.message}
            />
          </Grid>
          
          {/* Descripción */}
          <Grid item xs={12}>
            <Typography component="h1" sx={{ mb:1 }}>
          Fase
            </Typography>
            <FormControl fullWidth error={!!errors.phase}>
                <InputLabel id="fase-select-label"></InputLabel>
                <Controller
                  name="phase"
                  control={control}
                  render={({ field }) => (
                    <Select
                      labelId="phase-select-label"
                      {...field}
                    >
                      {phase.map((phase) => (
                        <MenuItem key={phase.id} value={phase.nombre}>
                          {phase.nombre}
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                />
                <FormHelperText>{errors.phase?.message}</FormHelperText>
              </FormControl>
          </Grid>

          {/* --- Switch Trabajador --- */}
          <Grid item xs={12} sx={{ pb: 0 }}>
            <FormControlLabel
              control={
                <Switch 
                  checked={showMovimiento} 
                  onChange={(e) => {
                  const isChecked = e.target.checked;
                  setShowMovimiento(isChecked);
                  
                  // 3. Vinculamos el switch al formulario
                  setValue('is_for_storehouse', isChecked);

                  // 4. Reseteamos campos opuestos para limpiar la data
                  if (isChecked) {
                    // Si es de almacén, limpiamos precio y trabajador
                    setValue('price', 0);
                    setValue('worker_name', '');
                    setShowPrice(false);
                  } else {
                    // Si no es de almacén, limpiamos el tipo de movimiento
                    setValue('storehouse_movement_type', '');
                  }
                }}
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
              <FormControl fullWidth error={!!errors.movementType}>
                <InputLabel id="movimiento-select-label"></InputLabel>
                <Controller
                  name="storehouse_movement_type"
                  control={control}
                  defaultValue=""
                  // La validación es condicional
                  rules={showMovimiento ? { required: "El tipo es requerido" } : {}}
                  placeholder="Selecciona un tipo de movimiento"
                  render={({ field }) => (
                    <Select
                      
                      labelId="movimiento-select-label"
                      label="Tipo de movimiento"
                      {...field}
                      
                    >
                      {storehouse_movement_type.map((type) => (
                        <MenuItem key={type.id} value={type.nombre}>
                          {type.nombre}
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                />
                <FormHelperText>{errors.storehouse_movement_type?.message}</FormHelperText>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
                <Typography component="h1" sx={{ mb:1 }}>
            Tipo de movimiento
            </Typography>
              <FormControl fullWidth error={!!errors.movementType}>
                <InputLabel id="movimiento-select-label"></InputLabel>
                <Controller
                  name="storehouse_movement_type"
                  control={control}
                  defaultValue=""
                  // La validación es condicional
                  rules={showMovimiento ? { required: "El tipo es requerido" } : {}}
                  placeholder="Selecciona un tipo de movimiento"
                  render={({ field }) => (
                    <Select
                      
                      labelId="movimiento-select-label"
                      label="Tipo de movimiento"
                      {...field}
                      
                    >
                      {storehouse_movement_type.map((type) => (
                        <MenuItem key={type.id} value={type.nombre}>
                          {type.nombre}
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                />
                <FormHelperText>{errors.storehouse_movement_type?.message}</FormHelperText>
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
            {equipmentList.map((equipo, index) => (
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
            key={equipo._id}
          >
            <Box sx={{mt:2,mx:2, display: 'flex', flexDirection:'column', alignItems:'start'}} >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, }}>
            <Inventory sx={{ fontSize: '1rem' }} />
            <Typography variant="h6" fontSize={16} fontWeight={200} sx={{ m: 0 }}>
              {equipo.equipment_name}
            </Typography>
            </Box>
            <Typography sx={{ color: "text.secondary", fontSize: 12,mb:3 }}>    
                {equipo.equipment_serial_number}
            </Typography>
            </Box>
            
            {/* ESTE ES EL CHIP DE PRECIO */}
            
            <Chip
              label={equipo.equipment_status}
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
          {/* --- Switch Precio --- */}
          <Grid item xs={12} sx={{ pb: 0 }}>
            <FormControlLabel
              control={
                <Switch 
                  checked={showPrice} 
                  onChange={(e) => setShowPrice(e.target.checked)} 
                />
              }
              label="Necesita Precio"
            />
          </Grid>

          {/* --- Dropdown Equipamiento (Condicional) --- */}
          {showPrice && (
            <Grid item xs={12}>
              <TextField
              placeholder="Ej. 350"
              type="number"
              fullWidth
              
              {...register("price", { 
                required: "La cantidad es requerida",
                valueAsNumber: true,
                min: {  message: "Debe ser al menos 1" }
              })}
              error={!!errors.price}
              helperText={errors.price?.message}
            />
            </Grid>
          )}
          <Grid item xs={12}>
            <Typography component="h1" sx={{ mb:1 }}>
              Trabajadores
            </Typography>
            {/* El error se basa en 'worker_id' */}
            <FormControl fullWidth error={!!errors.worker_id}> 
              <InputLabel id="trabajador-select-label"></InputLabel>
              <Controller
                name="worker_id" // 1. El 'name' es 'worker_id'
                control={control}
                rules={!showMovimiento ? { required: "El trabajador es requerido" } : {}}
                render={({ field }) => (
                  <Select
                    labelId="trabajador-select-label"
                    label="Trabajador"
                    value={field.value || ""} // 2. El 'value' del select es el ID
                    onChange={(e) => {
                      const selectedId = e.target.value;
                      // 3. Busca por '_id' (o '.id' si es el caso)
                      const worker = workers.find(w => w._id === selectedId); 
                      
                      // 4. Setea AMBOS campos
                      field.onChange(selectedId); // Setea worker_id
                      setValue('worker_name', worker ? `${worker.first_name} ${worker.last_name}` : '');
                    }}
                  >
                    {workers.map((trabajador) => (
                      // 5. ¡LA CORRECCIÓN! El 'value' es el '_id'
                      <MenuItem key={trabajador._id} value={trabajador._id}> 
                        {trabajador.first_name} {trabajador.last_name}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
              <FormHelperText>{errors.worker_id?.message}</FormHelperText>
            </FormControl>
          </Grid>
            <Grid item xs={12} sx={{ pb: 0 }}>
            <FormControlLabel
              control={
                <Switch 
                  checked={showEvidencia} 
                  onChange={(e) => setShowEvidencia(e.target.checked)} 
                  value={showEvidencia}
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
              type="button" 
              variant="contained" 
              onClick={handleSubmit(onFormSubmit)}
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