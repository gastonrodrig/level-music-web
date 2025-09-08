import { Box, TextField, MenuItem } from '@mui/material';
// import { useEventStore } from '../../../../hooks';

export const EventDetailsForm = () => {
  // const { sections, updateEventSection, currentPage } = useEventStore();

  // const { eventCategory, eventType, attendeesCount, eventSchedule,S eventDescription} = sections.find((section) => section.id === currentPage).data;
  
  // const handleNext = () => {
  //   // Validar los datos de la página actual antes de avanzar
  //   const validation = validateCurrentPage();
  //   if (!validation.valid) {
  //     alert(validation.message); // Mostrar mensaje de error si la validación falla
  //     return;
  //   }
  // }
  
  return (
    <Box>
      <TextField
        fullWidth
        label="Cantidad de Asistentes"
        type="number"
        margin="normal"
        // value={attendeesCount}
        // onChange={(e) => updateEventSection(currentPage,{ attendeesCount: parseInt(e.target.value, 10) })}
      />
      <TextField
        fullWidth
        label="Horario del Evento"
        margin="normal"
        // value={eventSchedule}
        // onChange={(e) => updateEventSection(currentPage,{ eventSchedule: e.target.value })}
      />
      <TextField
        fullWidth
        multiline
        rows={3}
        label="Descripción del Evento"
        margin="normal"
        // value={eventDescription}
        // onChange={(e) => updateEventSection(currentPage,{ eventDescription: e.target.value })}
      />
      <TextField 
      fullWidth 
      label="Dirección Exacta" 
      margin="normal" 
      // value={exactAddress}
      // onChange={(e) => updateEventSection(currentPage,{ exactAddress: e.target.value })}
      />
      <TextField 
      fullWidth 
      label="Referencia del Lugar" 
      margin="normal" 
      // value={placeReference}
      // onChange={(e) => updateEventSection(currentPage,{ placeReference: e.target.value })}
      />
      <TextField 
      fullWidth 
      select 
      label="Tipo de Lugar" 
      margin="normal"
      // value={placeType}
      // onChange={(e) => updateEventSection(currentPage,{ placeType: e.target.value })}
      >
        <MenuItem value="Casa">Casa</MenuItem>
        <MenuItem value="Salón">Salón</MenuItem>
        <MenuItem value="Parque">Parque</MenuItem>
        <MenuItem value="Otro">Otro</MenuItem>
      
        
      </TextField>
      <TextField 
      fullWidth 
      label="Tamaño del Lugar (m² o capacidad)" 
      margin="normal" 
      // value={placeCapacity}
      // onChange={(e) => updateEventSection(currentPage,{ placeCapacity: parseInt(e.target.value, 10) })}
      />
    </Box>
  );
};
