import {
  Box,
  Typography,
  TextField,
  Button,
  Divider,
  MenuItem,
  Chip,
  FormControl,
  InputLabel,
  Select,
  FormHelperText,
  Grid
} from "@mui/material";
import { Add, Save } from "@mui/icons-material";
import { ServiceDetailBox, ServiceFieldModal } from "../../../components";

import { useScreenSizes } from "../../../../../shared/constants/screen-width";
import {
  useServiceTypeStore,
  useProviderStore,
  useServiceStore,
} from "../../../../../hooks";
import { useEffect, useState } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";

export const ServiceAddPage = () => {
  const { startLoadingAllServiceTypes, serviceTypes } = useServiceTypeStore();
  const { startLoadingProviderPaginated, provider } = useProviderStore();
  const { startCreateService } = useServiceStore();

  const [customAttributes, setCustomAttributes] = useState([]);
  const [selectedFields, setSelectedFields] = useState({});
  const [openFieldModalIdx, setOpenFieldModalIdx] = useState(null);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [selectedServiceType, setSelectedServiceType] = useState(null);

  // RHF principal
  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
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
    startLoadingAllServiceTypes();
    startLoadingProviderPaginated();
  }, []);

  const handleAddDetail = () => {
    append({ ref_price: "", details: {} });
    setSelectedFields((prev) => ({
      ...prev,
      [details.length]: selectedServiceType?.attributes
        ? [...selectedServiceType.attributes]
        : [],
    }));
  };

  const handleAddFieldToDetail = (idx, field) => {
    setSelectedFields((prev) => ({
      ...prev,
      [idx]: [...(prev[idx] || []), field],
    }));
    setOpenFieldModalIdx(null);
  };

  const handleRemoveFieldFromDetail = (detailIdx, fieldIdx) => {
    setSelectedFields((prev) => ({
      ...prev,
      [detailIdx]: prev[detailIdx].filter((_, idx) => idx !== fieldIdx),
    }));
  };

  const onSubmit = async (data) => {
    const serviceObject = {
      provider_id: data.provider_id,
      service_type_id: data.service_type_id,
      serviceDetails: data.serviceDetails.map((detail) => ({
        details: Object.fromEntries(
          Object.entries(detail.details).map(([key, value]) => {
            const num = Number(value);
            return [key, isNaN(num) || value === "" ? value : num];
          })
        ),
        ref_price: Number(detail.ref_price),
      })),
    };
    console.log("Creando servicio con datos:", serviceObject);
    await startCreateService(serviceObject);
  };

  const allAttributes = [
    ...(selectedServiceType?.attributes || []),
    ...customAttributes,
  ];

  const { isLg } = useScreenSizes();

  return (
    <Box component={'form'} sx={{ p: 4 }} onSubmit={handleSubmit(onSubmit)}>
      <Typography variant="h4" sx={{ mb: 4 }}>
        Creando Nuevo Servicio
      </Typography>

      <Box
        sx={{ display: "flex", gap: 4, maxWidth: 1200, margin: "0 auto" }}
      >
        <Grid container spacing={4}>
  {/* Proveedor */}
  <Grid item xs={12} md={6}>
    <Typography variant="h4" component="div" sx={{ mb: 2, fontSize: 18 }}>
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
          bgcolor: "#1f1e1e",
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
      <Box sx={{ mt: 2, p: 2, borderRadius: 2, bgcolor: "#1f1e1e" }}>
        <Typography variant="body2">Nombre: {selectedProvider.name}</Typography>
        <Typography variant="body2">Teléfono: {selectedProvider.phone}</Typography>
        <Typography variant="body2">Email: {selectedProvider.email}</Typography>
      </Box>
    )}
  </Grid>

  {/* Tipo de servicio */}
  <Grid item xs={12} md={6}>
    <Typography variant="h4" component="div" sx={{ mb: 2, fontSize: 18 }}>
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
          bgcolor: "#1f1e1e",
        }}
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
      <Box sx={{ mt: 2, p: 2, borderRadius: 2, bgcolor: "#1f1e1e" }}>
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

      {/* Detalles */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          maxWidth: 1200,
          margin: "0 auto",
          mt: 2,
        }}
      >
        <Typography variant="h4" sx={{ fontSize: 25 }}>
          Detalles del Servicio
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleAddDetail}
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
              handleRemoveFieldFromDetail(idx, fieldIdx)
            }
          />
        ))}
      </Box>

      <ServiceFieldModal
        open={openFieldModalIdx !== null}
        onClose={() => setOpenFieldModalIdx(null)}
        attributes={allAttributes}
        onAddAttribute={(field) =>
          handleAddFieldToDetail(openFieldModalIdx, field)
        }
        onAddCustom={(name) =>
          setCustomAttributes((prev) => [...prev, { name, type: "text" }])
        }
      />

      <Box sx={{ display: "flex", justifyContent: "end", mt: 4 }}>
        <Button type="submit" variant="contained" startIcon={<Save />}>
          Crear Servicio
        </Button>
      </Box>
    </Box>
  );
};
