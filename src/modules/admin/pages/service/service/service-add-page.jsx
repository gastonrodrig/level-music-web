import { Box, Typography, TextField, Button,Divider,Link,MenuItem } from '@mui/material';
import { AddCircleOutline, Edit } from '@mui/icons-material';
import { ServiceDetailBox } from '../../../components';

import { useScreenSizes } from '../../../../../shared/constants/screen-width';
import { useServiceTypeStore,useProviderStore,useServiceStore } from '../../../../../hooks';
import { useEffect,useState } from 'react';
export const ServiceAddPage = () => {

   const { startLoadingAllServiceTypes,serviceTypes } = useServiceTypeStore();
   const { startLoadingProviderPaginated,provider } = useProviderStore();
   const { listAllServices,services } = useServiceStore();
   const [details, setDetails] = useState([]);
   const [openDetailIdx, setOpenDetailIdx] = useState(null);
   const handleAddDetail = () => {
  setDetails([...details, { ref_price: '', details: [] }]);
  setOpenDetailIdx(details.length);
};
const handleSubmitDetail = (data, idx) => {
  const updated = [...details];
  updated[idx] = data;
  setDetails(updated);
  setOpenDetailIdx(null);
};
const handleDeleteDetail = idx => {
  setDetails(details.filter((_, i) => i !== idx));
  setOpenDetailIdx(null);
};
   useEffect(() => {
    startLoadingAllServiceTypes();
    startLoadingProviderPaginated();
    listAllServices();
  }, []);
  const { isLg } = useScreenSizes();
  return (
    <Box sx={{ p: 4 }}>
      
        <Typography variant="h4" component="div" sx={{ flexGrow: 1, textAlign: 'Start', mb: 4, fontSize:25}}>
          Creando Nuevo Servicio
        </Typography>

      <Box component="form" sx={{ display: 'flex', flexDirection: 'row', maxWidth: 1200, margin: '0 auto', gap: 4,  }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
          <Typography variant="h4" component="div" sx={{  mb:2,fontSize:18}}>
            Provedor
          </Typography>
          <TextField
            select
            label="Seleccionar Proveedor"
            variant="outlined"
            fullWidth
            sx={{ mb: 2 }}
            InputProps={{
              sx: { borderRadius: 5 } // Cambia el valor para hacerlo más o menos redondo
          }}
        >
          {provider.map((typi) => (
            <MenuItem key={typi._id} value={typi._id}>
              {typi.name}
            </MenuItem>
          ))}
          {/* Aquí irían las opciones del select */}
        </TextField>
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
          <Typography variant="h4" component="div" sx={{ mb:2,fontSize:18}}>
            Tipo de servicio
          </Typography>
          <TextField
            select
            label="Seleccionar Tipo de Servicio"
            variant="outlined"
            fullWidth
            sx={{ mb: 2 }}
            InputProps={{
              sx: { borderRadius: 5 } // Cambia el valor para hacerlo más o menos redondo
          }}
        >
          {serviceTypes.map((type) => (
            <MenuItem key={type._id} value={type._id}>
              {type.name}
            </MenuItem>
          ))}
          {/* Aquí irían las opciones del select */}
        </TextField>
        </Box>
      </Box>
      <Divider sx={{ my: 2 }} />
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: 1200, margin: '0 auto', mt: 2 }}>
        <Typography variant="h4" component="div" sx={{ flexGrow: 1, textAlign: 'Start', mb: 4, fontSize:25, pt:2 }}>
          Detalles del Servicio
        </Typography>
            <Button
              variant="contained"
              startIcon={<AddCircleOutline />}
              sx={{ backgroundColor: '#212121', color: '#fff', borderRadius: 2, textTransform: 'none', px: 3, py: 1.5 }}
              onClick={handleAddDetail}
            >
              {isLg ? 'Agregar Detalle' : 'Agregar'}
            </Button>
           
      </Box>
       {/* Renderiza los detalles */}
            <Box sx={{ maxWidth: 1200, margin: '0 auto', mt: 2 }}>
              {details.map((detail, idx) => (
                <ServiceDetailBox
                  key={idx}
                  index={idx}
                  initialData={detail}
                  open={openDetailIdx === idx}
                  onClose={() => setOpenDetailIdx(null)}
                  onSubmit={handleSubmitDetail}
                  onDelete={handleDeleteDetail}
                  loading={false}
                />
              ))}
            </Box>
    </Box>

  );
};
