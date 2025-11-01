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
import { serviceDetailPriceApi } from "../../../../../api";
import dayjs from "dayjs";

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

  const handleOpenPrices = (detailId) => {
    setSelectedDetailId(detailId);
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
  // Limpia los objetos nuevos sin _id
  data.serviceDetails = data.serviceDetails.map((detail) => {
    if (!detail._id) {
      const { _id, ...rest } = detail;
      return rest;
    }
    return detail;
  });

  try {
    // 🔸 Detectar cambios de precios respecto al original
    for (const detail of data.serviceDetails) {
      const original = selected.serviceDetails.find(
        (d) => d._id === detail._id
      );

      if (
        detail._id &&
        original &&
        Number(original.ref_price) !== Number(detail.ref_price)
      ) {
        // 📅 Día actual en Lima
        const today = dayjs().tz("America/Lima");

        // 🕛 Inicio y fin del día (misma fecha)
        const startOfDay = today.startOf("day").format("YYYY-MM-DDTHH:mm:ssZ");
        const endOfDay = today.endOf("day").format("YYYY-MM-DDTHH:mm:ssZ");

        // 🚀 Registrar nuevo precio en el historial
        await serviceDetailPriceApi.post("/", {
          service_detail_id: detail._id,
          reference_detail_price: Number(detail.ref_price),
          start_date: startOfDay,
          end_date: endOfDay,
        });
      }
    }

    // 🔸 Actualiza el servicio principal
    const success = await startUpdateService(selected._id, data);
    if (success) navigate("/admin/service");
  } catch (error) {
    console.error("❌ Error al registrar o actualizar servicio:", error);
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
            onOpenPrices={handleOpenPrices} // ✅ ahora viene del padre
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
