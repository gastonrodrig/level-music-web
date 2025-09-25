import {
  Typography,
  Box,
  useTheme,
  TextField,
  Chip,
  Grid,
  Button,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  FormHelperText,
  IconButton,
} from "@mui/material";
import {
  Add,
  Delete,
  Group,
  Speaker,
  ViewInArSharp,
} from "@mui/icons-material";
import {
  useAssignServicesStore,
  useEquipmentStore,
  useQuotationStore,
  useServiceDetailStore,
  useServiceStore,
  useWorkerStore,
} from "../../../../../hooks";
import { useForm } from "react-hook-form";
import { QuotationInfoCard, ServiceAssignment } from "../../../components";
import { useEffect, useMemo } from "react";
import { useScreenSizes } from "../../../../../shared/constants/screen-width";
import { useNavigate } from "react-router-dom";

export const AssignResourcesPage = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const navigate = useNavigate();

  const { loading, selected } = useQuotationStore();
  const { serviceDetail } = useServiceDetailStore();
  const { equipments } = useEquipmentStore();
  const { workers } = useWorkerStore();
  const { services } = useServiceStore(); 

  const {
    selectedDetail,
    assignedServices,
    setAssignedServices,
    handleSelectService,
    handleSelectDetail,
    handleAddService,
  } = useAssignServicesStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue
  } = useForm({
    defaultValues: {
      provider_id: "",
      service_type_id: "",
      serviceDetails: [],
      name: "",
      description: "",
      service_id: "",
      service_detail_id: "",
      hours: 1,
      custom_price: 0,
    },
    mode: "onBlur",
  });

  useEffect(() => {
    if (!selected) {
      navigate('/admin/quotations', { replace: true });
      return;
    }
  }, [selected]);

  const onSubmit = (data) => {

  };

  const serviceId = watch("service_id");

  const filteredDetails = useMemo(
    () => (serviceDetail || []).filter((d) => d.service_id === serviceId),
    [serviceDetail, serviceId]
  );

  return (
    <Box component="form" sx={{ px: 0, pt: 2 }} onSubmit={handleSubmit(onSubmit)}>
      <Typography variant="h4" sx={{ mb: 2 }}>
        Asignación de Recursos
      </Typography>
      <Typography sx={{ mb: 2, fontSize: 16 }} color="text.secondary">
        Asigna trabajadores, servicios adicionales y equipos para el evento.
      </Typography>

      {/* Información de la Cotización */}
      <QuotationInfoCard selected={selected} />

      {/* Servicios Adicionales */}
      <ServiceAssignment
        services={services}
        filteredDetails={filteredDetails}
        assignedServices={assignedServices}
        selectedDetail={selectedDetail}
        handleSelectService={handleSelectService}
        handleSelectDetail={handleSelectDetail}
        handleAddService={handleAddService}
        setAssignedServices={setAssignedServices}
        watch={watch}
        setValue={setValue}
        errors={errors}
        serviceId={serviceId}
      />

      {/* Información de la asignación */}
      <Box
        sx={{
          p: 3,
          borderRadius: 3,
          bgcolor: isDark ? "#1f1e1e" : "#f5f5f5",
          my: 2,
        }}
      >
        <Typography fontSize={18} sx={{ mb: 3 }}>
          Información de la Asignación (Nombre del evento y su descripción)
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Nombre del Evento"
              placeholder="Ingrese el nombre"
              InputLabelProps={{ shrink: true }}
              {...register("name", { required: true })}
              error={!!errors.name}
              helperText={errors.name && "Requerido"}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Descripción del Evento"
              placeholder="Ingrese una descripción"
              InputLabelProps={{ shrink: true }}
              {...register("description", { required: true })}
              error={!!errors.description}
              helperText={errors.description && "Requerido"}
            />
          </Grid>
        </Grid>
      </Box>

      {/* Botón de Guardar/Enviar (opcional) */}
      <Box sx={{ display: "flex", justifyContent: "flex-end", pb: 4 }}>
        <Button
          type="submit"
          variant="contained"
          disabled={loading}
          sx={{ textTransform: "none", borderRadius: 2, fontWeight: 600 }}
        >
          Guardar Asignación
        </Button>
      </Box>
    </Box>
  );
};
