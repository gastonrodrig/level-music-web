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
  ServicePricesModal,
} from "../../../components";
import { useScreenSizes } from "../../../../../shared/constants/screen-width";
import {
  useServiceTypeStore,
  useProviderStore,
  useServiceStore,
} from "../../../../../hooks";
import { useEffect, useMemo, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { showSnackbar } from "../../../../../store";
import { serviceDetailApi } from "../../../../../api";

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

  const dispatch = useDispatch();

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

  // === NUEVO: modal de historial de precios ===
  const [openPricesModal, setOpenPricesModal] = useState(false);
  const [selectedDetailId, setSelectedDetailId] = useState(null);
  const [selectedDetailNumber, setSelectedDetailNumber] = useState(1);

  // Recibe el detailId y el detailNumber (índice + 1)
  const handleOpenPrices = (detailId, detailNumber) => {
    setSelectedDetailId(detailId);
    setSelectedDetailNumber(detailNumber);
    setOpenPricesModal(true);
  };

  const handleClosePrices = () => {
    setSelectedDetailId(null);
    setOpenPricesModal(false);
  };

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

  // === SUBMIT ===
 const onSubmit = async (data) => {
  // Asegura que serviceDetails sea un array
  if (!Array.isArray(data.serviceDetails)) {
    data.serviceDetails = Object.values(data.serviceDetails);
  }
  // Limpia los objetos nuevos sin _id (para que el update del servicio principal no incluya _id vacíos)
  data.serviceDetails = data.serviceDetails.map((detail, idx) => {
    if (!detail._id) {
      const { _id, ...rest } = detail;
      // Procesa el objeto flexible details
      const detailsObj = {};
      Object.entries(rest.details || {}).forEach(([key, value]) => {
        const num = Number(value);
        detailsObj[key] = value === "" ? undefined : (isNaN(num) ? value : num);
      });
      return {
        ...rest,
        details: detailsObj,
        detail_number: Number(idx + 1),
      };
    }
    // Procesa también los existentes
    const detailsObj = {};
    Object.entries(detail.details || {}).forEach(([key, value]) => {
      const num = Number(value);
      detailsObj[key] = value === "" ? undefined : (isNaN(num) ? value : num);
    });
    return {
      ...detail,
      details: detailsObj,
      detail_number: Number(idx + 1),
    };
  });

  try {
    // Construye array de detalles modificados (solo los existentes con _id)
    const modifiedDetails = [];

    for (const detail of data.serviceDetails) {
      if (!detail._id) continue; // nuevos detalles se manejan en la actualización del servicio

      const original = selected.serviceDetails.find((d) => d._id === detail._id);
      if (!original) continue;

      const changes = { _id: detail._id };

      // Si cambió el precio, lo actualiza
      if (
        typeof detail.ref_price !== "undefined" &&
        Number(original.ref_price) !== Number(detail.ref_price)
      ) {
        changes.ref_price = Number(detail.ref_price);
      }

      // Si cambió el status, lo actualiza
      if (typeof detail.status !== "undefined" && detail.status !== original.status) {
        changes.status = detail.status;
      }

      // Si cambió algún campo de details, lo actualiza
      const originalDetails = original.details || {};
      const newDetails = detail.details || {};
      const detailsChanged = JSON.stringify(originalDetails) !== JSON.stringify(newDetails);
      if (detailsChanged) {
        changes.details = newDetails;
      }

      // Si hay cambios además de _id, lo agrega al array
      if (Object.keys(changes).length > 1) {
        modifiedDetails.push(changes);
      }
    }

    // Si no hay cambios, muestra snackbar y termina
    if (modifiedDetails.length === 0) {
      dispatch(showSnackbar({ message: "No hay cambios para guardar." }));
      return;
    }
    try {
      // El backend espera { serviceDetails: [...] }
      await serviceDetailApi.patch(
        "/update-details",
        { serviceDetails: modifiedDetails }
      );
    } catch (err) {
      const msg = err.response?.data?.message || 'Error al actualizar los detalles.';
      dispatch(showSnackbar({ message: "Error al guardar cambios: " + msg }));
      return;
    }

    // Actualiza el servicio principal (incluye nuevos detalles sin _id, etc.)
    const success = await startUpdateService(selected._id, data);
    if (success) {
      dispatch(showSnackbar({ message: "Cambios guardados correctamente." }));
      navigate("/admin/service");
    }
  } catch (error) {
    const msg = error.response?.data?.message || 'Ocurrió un error al actualizar.';
    dispatch(showSnackbar({ message: "Error al guardar cambios: " + msg }));
  }
};

  const allAttributes = [
    ...(selectedServiceType?.attributes || []),
    ...customAttributes,
  ];

  const isButtonDisabled = useMemo(() => loading, [loading]);

  return (
    <Box
      component="form"
      sx={{ px: 4, pt: 2 }}
      onSubmit={handleSubmit(onSubmit)}
    >
      <Typography variant="h4" sx={{ mb: 4 }}>
        Editando Servicio
      </Typography>

      {/* === CABECERA: proveedor y tipo de servicio === */}
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
                  "& .MuiSelect-select": {
                    color: "inherit",
                  },
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
              <Box
                sx={{
                  mt: 2,
                  p: 2,
                  borderRadius: 2,
                  bgcolor: isDark ? "#1f1e1e" : "#f5f5f5",
                }}
              >
                <Typography variant="body2">
                  Nombre: {selectedProvider.name}
                </Typography>
                <Typography variant="body2">
                  Teléfono: {selectedProvider.phone}
                </Typography>
                <Typography variant="body2">
                  Email: {selectedProvider.email}
                </Typography>
              </Box>
            )}
          </Grid>

          {/* Tipo de servicio */}
          <Grid item xs={12} md={6}>
            <Typography variant="h4" sx={{ mb: 2, fontSize: 18 }}>
              Tipo de servicio *
            </Typography>
            <FormControl
              fullWidth
              error={!!errors.service_type_id}
              sx={{ mb: 2 }}
            >
              <Select
                labelId="service-type-label"
                value={selected?.service_type || ""}
                disabled
                sx={{
                  "& .MuiSelect-select": {
                    color: "inherit",
                  },
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
              <Box
                sx={{
                  mt: 2,
                  p: 2,
                  borderRadius: 2,
                  bgcolor: isDark ? "#1f1e1e" : "#f5f5f5",
                }}
              >
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

      {/* === DETALLES === */}
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
            backgroundColor: "#212121",
            color: "#fff",
            borderRadius: 2,
            textTransform: "none",
            px: 3,
            py: 1.5,
          }}
          onClick={() => handleAddDetail(append, details)}
        >
          {isLg ? "Agregar Detalle" : "Agregar"}
        </Button>
      </Box>

      {/* === LISTADO DE DETALLES === */}
      <Box sx={{ maxWidth: 1200, margin: "0 auto", mt: 2 }}>
        {details.map((detail, idx) => (
          <ServiceDetailBox
            key={detail._id || idx}
            index={idx}
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
            setValue={setValue}
            // Pasa el detailNumber correcto (idx + 1)
            onOpenPrices={(detailId) => handleOpenPrices(detailId, idx + 1)}
          />
        ))}
      </Box>

      {/* Modal de Campos */}
      <ServiceFieldModal
        open={openFieldModalIdx !== null}
        onClose={() => setOpenFieldModalIdx(null)}
        attributes={allAttributes.filter(
          (attr) =>
            !(selectedFields[openFieldModalIdx] || []).some(
              (f) => f.name === attr.name
            )
        )}
        onAddAttribute={(field) =>
          handleAddFieldToDetail(openFieldModalIdx, field)
        }
        onAddCustom={(name) =>
          setCustomAttributes((prev) => [...prev, { name, type: "text" }])
        }
      />

      {/* Modal de Historial de Precios */}
      <ServicePricesModal
        open={openPricesModal}
        onClose={handleClosePrices}
        serviceDetailId={selectedDetailId}
        detailNumber={selectedDetailNumber}
      />

      {/* Botón Guardar */}
      <Box sx={{ display: "flex", justifyContent: "end", mt: 4 }}>
        <Button
          type="submit"
          variant="contained"
          startIcon={<Save />}
          sx={{
            fontSize: 16,
            backgroundColor: "#212121",
            color: "#fff",
            borderRadius: 2,
            textTransform: "none",
            px: 3,
            py: 1.5,
          }}
          disabled={isButtonDisabled}
        >
          Guardar Cambios
        </Button>
      </Box>
    </Box>
  );
};
