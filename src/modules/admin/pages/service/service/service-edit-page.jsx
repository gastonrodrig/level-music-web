import { 
  Box, 
  Typography, 
  Button,
  Divider,
  MenuItem, 
  Chip,
  Grid,
  Select, 
  FormHelperText, 
  FormControl,
  useTheme,
} from '@mui/material';
import { AddCircleOutline, Save  } from '@mui/icons-material';
import { ServiceDetailBox,ServiceFieldModal } from '../../../components';
import { useScreenSizes } from '../../../../../shared/constants/screen-width';
import { 
  useServiceTypeStore,
  useProviderStore,
  useServiceStore 
} from '../../../../../hooks';
import { useEffect, useMemo } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

export const ServiceEditPage = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const navigate = useNavigate();

  const { serviceTypes } = useServiceTypeStore();
  const { provider } = useProviderStore();

  const { 
    loading,
    selected,
    customAttributes,
    setCustomAttributes,
    selectedFields,
    openFieldModalIdx,
    setOpenFieldModalIdx,
    selectedProvider,
    setSelectedProvider,
    selectedServiceType,
    setSelectedFields,
    setSelectedServiceType,
    handleAddDetail,
    handleAddFieldToDetail,
    handleRemoveFieldFromDetail,
    startUpdateService, 
  } = useServiceStore();

  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    getValues
  } = useForm({
    defaultValues: {
      provider_id: selected?.provider || "",
      service_type_id: selected?.service_type || "",
      serviceDetails: selected?.serviceDetails?.map(detail => {
        const obj = {
          ref_price: detail.ref_price,
          details: detail.details,
          status: detail.status,
        };
        if (typeof detail._id === "string" && detail._id.length === 24) {
          obj._id = detail._id;
        }
        return obj;
      }) || [],
    },
    mode: 'onBlur',
  });

  const { fields: details, remove, append } = useFieldArray({
    control,
    name: 'serviceDetails',
  });

  const { isLg } = useScreenSizes();

  useEffect(() => {
    if (!selected) {
      navigate('/admin/service', { replace: true });
      return;
    }
    setSelectedProvider(provider.find(p => p._id === selected.provider));
    setSelectedServiceType(serviceTypes.find(st => st._id === selected.service_type));
    setSelectedFields(() => {
      const newFields = {};
      selected.serviceDetails.forEach((detail, idx) => {
        const detailFieldNames = Object.keys(detail.details || {});
        newFields[idx] = detailFieldNames.map(name => ({
          name,
          type: 'text',
          required: false,
        }));
      });
      return newFields;
    });
  }, [selected, provider, serviceTypes]);

  const onSubmit = async (data) => {
    data.serviceDetails = data.serviceDetails.map(detail => {
      if (!detail._id) {
        const { _id, ...rest } = detail;
        return rest;
      }
      return detail;
    });
    console.log(data)
    const success = await startUpdateService(selected._id, data);
    if (success) navigate('/admin/service');
  };

  const allAttributes = [
    ...(selectedServiceType?.attributes || []),
    ...customAttributes,
  ];

  const isButtonDisabled = useMemo(() => loading, [loading]);

  return (
    <Box component="form" sx={{ px: 4, pt: 2 }} onSubmit={handleSubmit(onSubmit)}>
      <Typography variant="h4" sx={{ mb: 4 }}>
        Editando Servicio
      </Typography>

      <Box sx={{ display: 'flex', gap: 4, maxWidth: 1200, margin: '0 auto' }}>
        <Grid container spacing={4}>
          {/* Proveedor */}
          <Grid item xs={12} md={6}>
            <Typography variant="h4" sx={{ mb: 2, fontSize: 18 }}>
              Proveedor *
            </Typography>
            <FormControl fullWidth error={!!errors.provider_id} sx={{ mb: 2 }}>
              <Select
                labelId="provider-label"
                value={watch("provider_id") || ""}
                {...register("provider_id", {
                  required: "Proveedor requerido",
                  onChange: (e) => {
                    setValue("provider_id", e.target.value);
                    const found = provider.find((p) => p._id === e.target.value);
                    setSelectedProvider(found);
                  },
                })}
                onChange={(e) => {
                  setValue("provider_id", e.target.value);
                  const found = provider.find((p) => p._id === e.target.value);
                  setSelectedProvider(found);
                }}
                displayEmpty
                sx={{
                  "& .MuiSelect-select": {
                    color: watch("provider_id") ? "inherit" : "text.secondary",
                    fontStyle: watch("provider_id") ? "normal" : "italic",
                  },
                  borderRadius: 2,
                  bgcolor: isDark ? "#1f1e1e" : "#f5f5f5",
                }}
                disabled
              >
                <MenuItem value="">
                  <Typography sx={{ color: 'text.secondary', fontStyle: 'italic' }}>
                    Seleccione un proveedor...
                  </Typography>
                </MenuItem>
                {provider.map((p) => (
                  <MenuItem key={p._id} value={p._id}>
                    {p.name}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText>{errors.provider_id?.message}</FormHelperText>
            </FormControl>
            {selectedProvider && (
              <Box sx={{ mt: 2, p: 2, borderRadius: 2, bgcolor: isDark ? "#1f1e1e" : "#f5f5f5",}}>
                <Typography variant="body2">Nombre: {selectedProvider.name}</Typography>
                <Typography variant="body2">Teléfono: {selectedProvider.phone}</Typography>
                <Typography variant="body2">Email: {selectedProvider.email}</Typography>
              </Box>
            )}
          </Grid>

          {/* Tipo de servicio */}
          <Grid item xs={12} md={6}>
            <Typography variant="h4" sx={{ mb: 2, fontSize: 18 }}>
              Tipo de servicio *
            </Typography>
            <FormControl fullWidth error={!!errors.service_type_id} sx={{ mb: 2 }}>
              <Select
                labelId="service-type-label"
                value={watch("service_type_id") || ""}
                {...register("service_type_id", {
                  required: "Tipo de servicio requerido",
                  onChange: (e) => {
                    setValue("service_type_id", e.target.value);
                    const found = serviceTypes.find((st) => st._id === e.target.value);
                    setSelectedServiceType(found);
                  },
                })}
                onChange={(e) => {
                  setValue("service_type_id", e.target.value);
                  const found = serviceTypes.find((st) => st._id === e.target.value);
                  setSelectedServiceType(found);
                }}
                displayEmpty
                sx={{
                  "& .MuiSelect-select": {
                    color: watch("service_type_id") ? "inherit" : "text.secondary",
                    fontStyle: watch("service_type_id") ? "normal" : "italic",
                  },
                  borderRadius: 2,
                  bgcolor: isDark ? "#1f1e1e" : "#f5f5f5",
                }}
                disabled
              >
                <MenuItem value="">
                  <Typography sx={{ color: 'text.secondary', fontStyle: 'italic' }}>
                    Seleccione un tipo de servicio...
                  </Typography>
                </MenuItem>
                {serviceTypes.map((type) => (
                  <MenuItem key={type._id} value={type._id}>
                    {type.name}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText>{errors.service_type_id?.message}</FormHelperText>
            </FormControl>
            {selectedServiceType && (
              <Box sx={{ mt: 2, p: 2, borderRadius: 2, bgcolor: isDark ? "#1f1e1e" : "#f5f5f5", }}>
                <Typography variant="body2">
                  Nombre: {selectedServiceType.category}
                </Typography>
                <Typography variant="body2">
                  Descripción: {selectedServiceType.description}
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  Atributos:
                </Typography>
                {selectedServiceType.attributes?.map((attr, idx) => (
                  <Chip
                    key={idx}
                    label={attr.name}
                    sx={{ mr: 1, mb: 1, bgcolor: '#fff', color: 'black' }}
                  />
                ))}
              </Box>
            )}
          </Grid>
        </Grid>
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* Detalles */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          maxWidth: 1200,
          margin: '0 auto',
          mt: 2,
        }}
      >
        <Typography variant="h4" sx={{ fontSize: 25, mt: 1 }}>
          Detalles del Servicio
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddCircleOutline />}
          sx={{
            backgroundColor: '#212121',
            color: '#fff',
            borderRadius: 2,
            textTransform: 'none',
            px: 3,
            py: 1.5
          }}
          onClick={() => handleAddDetail(append, details)}
        >
          {isLg ? 'Agregar Detalle' : 'Agregar'}
        </Button>
      </Box>

      <Box sx={{ maxWidth: 1200, margin: '0 auto', mt: 2 }}>
        {details.map((detail, idx) => (
          <ServiceDetailBox
            key={detail._id || idx}
            index={idx}
            control={control}
            register={register}
            errors={errors}
            fields={selectedFields[idx] || []}
            initialData={detail}
            onDelete={() => remove(idx)}
            onAddField={() => setOpenFieldModalIdx(idx)}
            onRemoveField={(fieldIdx) => 
              handleRemoveFieldFromDetail(idx, fieldIdx, getValues, setValue)
            }
            detailsCount={details.length} 
            isEditMode
            watch={watch}
            setValue={setValue}
          />
        ))}
      </Box>

      <ServiceFieldModal
        open={openFieldModalIdx !== null}
        onClose={() => setOpenFieldModalIdx(null)}
        attributes={
          allAttributes.filter(attr =>
            !(selectedFields[openFieldModalIdx] || []).some(f => f.name === attr.name)
          )
        }
        onAddAttribute={(field) => handleAddFieldToDetail(openFieldModalIdx, field)}
        onAddCustom={(name) =>
          setCustomAttributes((prev) => [...prev, { name, type: 'text' }])
        }
      />

      <Box sx={{ display: 'flex', justifyContent: 'end', mt: 4 }}>
        <Button
          type="submit"
          variant="contained"
          startIcon={<Save />}
          sx={{
            fontSize: 16,
            backgroundColor: '#212121',
            color: '#fff',
            borderRadius: 2,
            textTransform: 'none',
            px: 3,
            py: 1.5
          }}
          disabled={isButtonDisabled} 
        >
          Guardar Cambios
        </Button>
      </Box>
    </Box>
  );
};
