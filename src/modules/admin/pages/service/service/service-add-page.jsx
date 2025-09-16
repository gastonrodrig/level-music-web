import { Box, Typography, TextField, Button,Divider,Link,MenuItem, Chip } from '@mui/material';
import { AddCircleOutline, Edit,Add  } from '@mui/icons-material';
import SaveIcon from '@mui/icons-material/Save';
import { ServiceDetailBox,ServiceFieldModal } from '../../../components';

import { useScreenSizes } from '../../../../../shared/constants/screen-width';
import { useServiceTypeStore,useProviderStore,useServiceStore } from '../../../../../hooks';
import { useEffect,useState } from 'react';
export const ServiceAddPage = () => {

   const { startLoadingAllServiceTypes,serviceTypes } = useServiceTypeStore();
   const { startLoadingProviderPaginated,provider } = useProviderStore();
   const { listAllServices,startCreateService,services } = useServiceStore();
   const [details, setDetails] = useState([]);
   const [openDetailIdx, setOpenDetailIdx] = useState(null);
   const [selectedProvider, setSelectedProvider] = useState(null);
   const [selectedServiceType, setSelectedServiceType] = useState(null);
   const [openFieldModalIdx, setOpenFieldModalIdx] = useState(null);
   const [modalAttributes, setModalAttributes] = useState([]);
   const [customAttributes, setCustomAttributes] = useState([]);
const [selectedFields, setSelectedFields] = useState({}); // { idx: [fields] }

const handleAddCustomAttribute = (name) => {
  setCustomAttributes([...customAttributes, { name, type: 'text', required: false }]);
};
const handleAddFieldToDetail = (idx, field) => {
  setSelectedFields(prev => ({
    ...prev,
    [idx]: [...(prev[idx] || []), field]
  }));
  setOpenFieldModalIdx(null);
};
const allAttributes = [
  ...(selectedServiceType?.attributes || []),
  ...customAttributes
];
const handleAddDetail = () => {
  setDetails(prev => [...prev, { ref_price: '', details: {} }]);
  setSelectedFields(prev => ({
    ...prev,
    [details.length]: selectedServiceType?.attributes
      ? [...selectedServiceType.attributes]
      : []
  }));
};
const handleSubmitDetail = (data, idx) => {
   const updated = [...details];
  // Solo guarda los campos que están en selectedFields[idx]
  const detailsObj = {};
  (selectedFields[idx] || []).forEach(field => {
    detailsObj[field.name] = data.details?.[field.name] ?? '';
  });
  updated[idx] = {
    ref_price: data.ref_price,
    details: detailsObj
  };
  setDetails(updated);
  setOpenDetailIdx(null);
};
const handleDeleteDetail = idx => {
  setDetails(details.filter((_, i) => i !== idx));
  setOpenDetailIdx(null);
};
const handleRemoveFieldFromDetail = (detailIdx, fieldIdx) => {
  setSelectedFields(prev => ({
    ...prev,
    [detailIdx]: prev[detailIdx].filter((_, idx) => idx !== fieldIdx)
  }));
};
const handleOpenFieldModal = idx => {
  if (selectedServiceType?.attributes) {
    setModalAttributes(selectedServiceType.attributes);
    setOpenFieldModalIdx(idx);
  }
};

const handleCloseFieldModal = () => {
  setOpenFieldModalIdx(null);
};
const handleCreateService = async () => {
  if (!selectedProvider || !selectedServiceType || details.length === 0) {
    // Puedes mostrar un error aquí si falta algo
    return;
  }
  const serviceObject = {
    provider_id: selectedProvider._id,
    service_type_id: selectedServiceType._id,
    serviceDetails: details.map(detail => ({
      details: Object.fromEntries(
        Object.entries(detail.details).map(([key, value]) => {
        const num = Number(value);
          return [key, isNaN(num) || value === "" ? value : num];
      })
      ),
      ref_price: Number(detail.ref_price) // Convierte ref_price a número
    }))
  };
  console.log('Creando servicio con datos:', serviceObject);
  await startCreateService(serviceObject);
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
            Provedor *
          </Typography>
          <TextField
            select
            label="Seleccionar Proveedor"
            variant="outlined"
            fullWidth
            sx={{ mb: 2 }}
            value={selectedProvider ? selectedProvider._id : ''}
            InputProps={{
              sx: { borderRadius: 5 } // Cambia el valor para hacerlo más o menos redondo
          }}
          onChange={e => {
              const found = provider.find(p => p._id === e.target.value);
              setSelectedProvider(found);
            }}
        >
          {provider.map((typi) => (
            <MenuItem key={typi._id} value={typi._id}>
              {typi.name}
            </MenuItem>
          ))}
          {/* Aquí irían las opciones del select */}
        </TextField>
        {selectedProvider && (
            <Box sx={{ mt: 2, p: 2,  borderRadius: 2, bgcolor: '#1f1e1e' }}>
              <Typography variant="body2">Nombre: {selectedProvider.name}</Typography>
              <Typography variant="body2">Teléfono: {selectedProvider.phone}</Typography>
              <Typography variant="body2">Email: {selectedProvider.email}</Typography>
            </Box>
          )}
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
          <Typography variant="h4" component="div" sx={{ mb:2,fontSize:18}}>
            Tipo de servicio *
          </Typography>
          <TextField
            select
            label="Seleccionar Tipo de Servicio"
            variant="outlined"
            fullWidth
            sx={{ mb: 2 }}
            value={selectedServiceType ? selectedServiceType._id : ''}
            onChange={e => {
              const found = serviceTypes.find(st => st._id === e.target.value);
              setSelectedServiceType(found);
            }}
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
         {selectedServiceType && (
            <Box sx={{ mt: 2, p: 2, borderRadius: 2, bgcolor: '#1f1e1e' }}>
              <Typography variant="body2">Nombre: {selectedServiceType.category}</Typography>
              <Typography variant="body2">Descripción: {selectedServiceType.description}</Typography>
              <Typography variant="body2" sx={{ mb:1 }}>Atributos:</Typography>
              
                {selectedServiceType.attributes?.map((attr, idx) => (
                  <Chip key={idx} label={attr.name} sx={{ mr: 1, mb: 1, backgroundColor: '#ffffffff',color:'black'}} />
                ))}
              
            </Box>
          )}
        </Box>
      </Box>
      <Divider sx={{ my: 2 }} />
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: 1200, margin: '0 auto', mt: 2 }}>
        <Typography variant="h4" component="div" sx={{ flexGrow: 1, textAlign: 'Start', mb: 4, fontSize:25, pt:2 }}>
          Detalles del Servicio
        </Typography>
            <Button
              variant="contained"
              startIcon={<Add />}
              sx={{ backgroundColor: '#2bb80fff', color: '#fff', borderRadius: 2, textTransform: 'none', px: 3, py: 1.5 }}
              onClick={handleAddDetail}
            >
              {isLg ? 'Agregar Detalle' : 'Agregar Detalle'}
            </Button>
           
      </Box>
       {/* Renderiza los detalles */}     
       <Box sx={{ maxWidth: 1200, margin: '0 auto', mt: 2 }}>
          {details.map((detail, idx) => (
            <ServiceDetailBox
              key={idx}
              index={idx}
              initialData={detail}
              open={true}
              onClose={() => setOpenDetailIdx(null)}
              onSubmit={handleSubmitDetail}
              onDelete={handleDeleteDetail}
              loading={false}
              onAddField={() => handleOpenFieldModal(idx)}
              fields={selectedFields[idx] || []} // pasa los campos seleccionados
              onRemoveField={(fieldIdx) => handleRemoveFieldFromDetail(idx, fieldIdx)}
            />
          ))}
        </Box>
        <ServiceFieldModal
            open={openFieldModalIdx !== null}
            onClose={handleCloseFieldModal}
            attributes={allAttributes}
            onAddAttribute={(field) => handleAddFieldToDetail(openFieldModalIdx, field)}
            onAddCustom={handleAddCustomAttribute}
            
          />
          <Box sx={{ display: 'flex', justifyContent: 'end' }}>
          <Button
              variant="contained"
              startIcon={<SaveIcon  />}
              sx={{ backgroundColor: '#2bb80fff', color: '#fff', borderRadius: 2, textTransform: 'none', px: 3, py: 1.5 }}
              onClick={handleCreateService}
            >
              Crear Servicio
            </Button>
            </Box>
    </Box>

  );
};
