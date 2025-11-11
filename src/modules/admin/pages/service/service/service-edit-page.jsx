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
} from "@mui/material";
import { AddCircleOutline, Save } from "@mui/icons-material";
import {
  ServiceDetailBox,
  ServiceFieldModal,
} from "../../../components";
import { ServiceDetailPriceModal } from "../../../components/service/service/service-detail-price-modal";
import { useScreenSizes } from "../../../../../shared/constants/screen-width";
import {
  useServiceTypeStore,
  useProviderStore,
  useServiceStore,
  useServiceDetailStore,
} from "../../../../../hooks";
import { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { useNavigate } from "react-router-dom";

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

  const { selected: selectedServiceDetail } = useServiceDetailStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [detailNumber, setDetailNumber] = useState(0);

  const openModal = (index) => {
    setDetailNumber(index + 1); 
    setIsModalOpen(true);
  };

  const closeModal = () => { 
    setIsModalOpen(false); 
  };

  const onSubmit = async (data) => {
    const result = await startUpdateService(selected._id, data);
    if (result) navigate('/admin/service');
  };

  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors },
    getValues,
  } = useForm({
    defaultValues: {
      provider_id: selected?.provider || "",
      service_type_id: selected?.service_type || "",
      serviceDetails:
        selected?.serviceDetails?.map((detail) => {
          const obj = {
            details: detail.details,
            status: detail.status,
          };
          if (typeof detail._id === "string" && detail._id.length === 24) {
            obj._id = detail._id;
          }
          return obj;
        }) || [],
    },
    mode: "onBlur",
  });

  const {
    fields: details,
    remove,
    append,
  } = useFieldArray({
    control,
    name: "serviceDetails",
  });

  const { isLg } = useScreenSizes();

  useEffect(() => {
    if (!selected) {
      navigate("/admin/service", { replace: true });
      return;
    }
    setSelectedProvider(provider.find((p) => p._id === selected.provider));
    setSelectedServiceType(
      serviceTypes.find((st) => st._id === selected.service_type)
    );
    setSelectedFields(() => {
      const newFields = {};
      selected.serviceDetails.forEach((detail, idx) => {
        const detailFieldNames = Object.keys(detail.details || {});
        newFields[idx] = detailFieldNames.map((name) => ({
          name,
          type: "text",
          required: false,
        }));
      });
      return newFields;
    });
  }, [selected, provider, serviceTypes]);

  const allAttributes = [
    ...(selectedServiceType?.attributes || []),
    ...(customAttributes || []),
  ];

  return (
    <Box
      component="form"
      sx={{ px: 4, pt: 2 }}
      onSubmit={handleSubmit(onSubmit)}
    >
      <Typography variant="h4" sx={{ mb: 4 }}>
        Editando Servicio
      </Typography>

      {/* CABECERA: proveedor y tipo de servicio */}
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
                value={selected?.provider || ""}
                disabled
                sx={{
                  "& .MuiSelect-select": { color: "inherit" },
                  borderRadius: 2,
                  bgcolor: isDark ? "#1f1e1e" : "#f5f5f5",
                }}
              >
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
                value={selected?.service_type || ""}
                disabled
                sx={{
                  "& .MuiSelect-select": { color: "inherit" },
                  borderRadius: 2,
                  bgcolor: isDark ? "#1f1e1e" : "#f5f5f5",
                }}
              >
                {serviceTypes.map((type) => (
                  <MenuItem key={type._id} value={type._id}>
                    {type.name}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText>{errors.service_type_id?.message}</FormHelperText>
            </FormControl>
            {selectedServiceType && (
              <Box sx={{ mt: 2, p: 2, borderRadius: 2, bgcolor: isDark ? "#1f1e1e" : "#f5f5f5" }}>
                <Typography variant="body2">Nombre: {selectedServiceType.category}</Typography>
                <Typography variant="body2">Descripción: {selectedServiceType.description}</Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>Atributos:</Typography>
                {selectedServiceType.attributes?.map((attr, idx) => (
                  <Chip key={idx} label={attr.name} sx={{ mr: 1, mb: 1, bgcolor: "#fff", color: "black" }} />
                ))}
              </Box>
            )}
          </Grid>
        </Grid>
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* Detalles */}
      <Box sx={{ display: "flex", justifyContent: "space-between", maxWidth: 1200, margin: "0 auto", mt: 2 }}>
        <Typography variant="h4" sx={{ fontSize: 25, mt: 1 }}>
          Detalles del Servicio
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddCircleOutline />}
          sx={{ backgroundColor: "#212121", color: "#fff", borderRadius: 2, textTransform: "none", px: 3, py: 1.5 }}
          onClick={() => handleAddDetail(append, details)}
        >
          {isLg ? "Agregar Detalle" : "Agregar"}
        </Button>
      </Box>

      {/* Listado de Detalles */}
      <Box sx={{ maxWidth: 1200, margin: "0 auto", mt: 2 }}>
        {details.map((detail, idx) => (
          <ServiceDetailBox
            key={idx}
            index={idx}
            register={register}
            errors={errors}
            fields={selectedFields[idx] || []}
            initialData={detail}
            refPrice={detail.ref_price}
            onDelete={() => remove(idx)}
            onAddField={() => setOpenFieldModalIdx(idx)}
            onRemoveField={(fieldIdx) => handleRemoveFieldFromDetail(idx, fieldIdx, getValues, setValue)}
            detailsCount={details.length}
            isEditMode
            setValue={setValue}
            openModal={openModal}
          />
        ))}
      </Box>

      {/* Modal de Campos */}
      <ServiceFieldModal
        open={openFieldModalIdx !== null}
        onClose={() => setOpenFieldModalIdx(null)}
        attributes={allAttributes.filter(
          (attr) => !(selectedFields[openFieldModalIdx] || []).some((f) => f.name === attr.name)
        )}
        onAddAttribute={(field) => handleAddFieldToDetail(openFieldModalIdx, field)}
        onAddCustom={(name) => setCustomAttributes((prev) => [...prev, { name, type: "text" }])}
      />

      {/* Modal de Historial de Precios */}
      <ServiceDetailPriceModal
        open={isModalOpen}
        onClose={closeModal}
        serviceDetail={selectedServiceDetail} // ✅ viene directo de Redux
        detailNumber={detailNumber} // ✅ para mostrar “Detalle #2 – Nombre”
      />

      {/* Botón Guardar */}
      <Box sx={{ display: "flex", justifyContent: "end", mt: 4 }}>
        <Button
          type="submit"
          variant="contained"
          startIcon={<Save />}
          sx={{ fontSize: 16, backgroundColor: "#212121", color: "#fff", borderRadius: 2, textTransform: "none", px: 3, py: 1.5 }}
          disabled={loading}
        >
          Guardar Cambios
        </Button>
      </Box>
    </Box>
  );
};
