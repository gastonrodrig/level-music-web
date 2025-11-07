import {
  Box,
  Typography,
  Button,
  Divider,
  MenuItem,
  Chip,
  FormControl,
  Select,
  FormHelperText,
  Grid,
  useTheme
} from "@mui/material";
import { AddCircleOutline, Save } from "@mui/icons-material";
import { ServiceDetailBox, ServiceFieldModal } from "../../../components";
import { useScreenSizes } from "../../../../../shared/constants/screen-width";
import {
  useServiceTypeStore,
  useProviderStore,
  useServiceStore,
} from "../../../../../hooks";
import { useEffect, useMemo } from "react";
import { useForm, useFieldArray } from "react-hook-form";

import { useNavigate } from "react-router-dom";
import { createServiceModel } from '../../../../../shared/models/service/service/create-service-model';

export const ServiceAddPage = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const navigate = useNavigate();

  const { startLoadingAllServiceTypes, serviceTypes } = useServiceTypeStore();
  const { startLoadingAllProviders, provider } = useProviderStore();

  const {
    loading,
    customAttributes,
    setCustomAttributes,
    selectedFields,
    openFieldModalIdx,
    setOpenFieldModalIdx,
    selectedProvider,
    setSelectedProvider,
    selectedServiceType,
    setSelectedServiceType,
    handleAddDetail,
    handleAddFieldToDetail,
    handleRemoveFieldFromDetail,
    startCreateService,
  } = useServiceStore();

  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    getValues,
    formState: { errors },
  } = useForm({
    defaultValues: {
      provider_id: "",
      service_type_id: "",
      serviceDetails: [],
    },
    mode: "onBlur",
  });

  const { fields: details, append, remove } = useFieldArray({
    control,
    name: "serviceDetails",
  });

  useEffect(() => {
    if (!provider.length || !serviceTypes.length) {
      navigate("/admin/service");
    }
  }, [provider, serviceTypes, navigate]);

  const { isLg } = useScreenSizes();

  const onSubmit = async (data) => {
    try {
      await startCreateService(createServiceModel(data));
      navigate('/admin/service');
    } catch (error) {
      // El store ya muestra el snackbar custom
    }
  };

  const allAttributes = [
    ...(selectedServiceType?.attributes || []),
    ...customAttributes,
  ];

  const isButtonDisabled = useMemo(() => loading, [loading]);

  return (
    <Box component="form" sx={{ px: 4, pt: 2 }} onSubmit={handleSubmit(onSubmit)}>
      <Typography variant="h4" sx={{ mb: 4 }}>
        Creando Nuevo Servicio
      </Typography>

      <Box sx={{ display: "flex", gap: 4, maxWidth: 1200, margin: "0 auto" }}>
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
              >
                <MenuItem value="">
                  <Typography sx={{ color: "text.secondary", fontStyle: "italic" }}>
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
              <Box sx={{ p: 2, borderRadius: 2, bgcolor: isDark ? "#1f1e1e" : "#f5f5f5" }}>
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
                disabled={details.length > 0}
              >
                <MenuItem value="">
                  <Typography sx={{ color: "text.secondary", fontStyle: "italic" }}>
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
              <Box sx={{ p: 2, borderRadius: 2, bgcolor: isDark ? "#1f1e1e" : "#f5f5f5" }}>
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
                    sx={{ mr: 1, mb: 1, bgcolor: "#fff", color: "black" }}
                  />
                ))}
              </Box>
            )}
          </Grid>
        </Grid>
      </Box>

      <Divider sx={{ my: 2 }} />

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          maxWidth: 1200,
          margin: "0 auto",
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
          disabled={
          !watch("provider_id") || !watch("service_type_id")
        }
        >
          {isLg ? "Agregar Detalle" : "Agregar"}
        </Button>
      </Box>

      <Box sx={{ maxWidth: 1200, margin: "0 auto", mt: 2 }}>
        {details.map((detail, idx) => (
          <ServiceDetailBox
            key={detail.id}
            index={idx}
            control={control}
            register={register}
            errors={errors}
            fields={selectedFields[idx] || []}
            onDelete={() => remove(idx)}
            onAddField={() => setOpenFieldModalIdx(idx)}
            onRemoveField={(fieldIdx) =>
              handleRemoveFieldFromDetail(idx, fieldIdx, getValues, setValue)
            }
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
        onAddAttribute={(field) =>
          handleAddFieldToDetail(openFieldModalIdx, field)
        }
        onAddCustom={(name) =>
          setCustomAttributes((prev) => [...prev, { name, type: "text" }])
        }
      />

      {details.length > 0 && (
        <Box sx={{ display: "flex", justifyContent: "end", mt: 4 }}>
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
            Crear Servicio
          </Button>
        </Box>
      )}
    </Box>
  );
};
