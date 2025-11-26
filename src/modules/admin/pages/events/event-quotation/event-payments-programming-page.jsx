import { Box, Typography, Button, useTheme } from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import { useQuotationStore } from "../../../../../hooks";
import { FormProvider, useForm } from "react-hook-form";
import { useScreenSizes } from "../../../../../shared/constants/screen-width";
import {
  EventInfoCard,
  PaymentInfoCard,
  PaymentSummaryCard,
  PaymentTablesContainer,
} from "../../../components";
import dayjs from "dayjs";
import { useEffect, useMemo } from "react";
import { usePaymentStore } from "../../../../../hooks";
import { useNavigate } from "react-router-dom";

export const EventPaymentsProgrammingPage = () => {
  const navigate = useNavigate();
  const { selected } = useQuotationStore();
  const { isSm } = useScreenSizes();
  const { loading, startCreatePayments } = usePaymentStore();
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  const eventDate = selected?.event_date ? dayjs(selected.event_date) : dayjs();

  const equipments = selected?.assignations?.filter(a => a.resource_type === "Equipo") || [];
  const workers = selected?.assignations?.filter(a => a.resource_type === "Trabajador") || [];
  const services = selected?.assignations?.filter(a => a.resource_type === "Servicio Adicional") || [];
  const tasks = selected?.tasks || [];
  
  const subtotalEquipments = equipments.reduce((acc, e) => acc + (e.hourly_rate), 0);
  const subtotalWorkers = workers.reduce((acc, w) => acc + (w.hourly_rate), 0);
  const subtotalServices = services.reduce((acc, s) => acc + (s.hourly_rate), 0);
  const subtotalTasks = tasks.reduce((acc, t) => {
    const taskTotal = t.subtasks?.reduce((subAcc, subtask) => {
      return subAcc + (subtask.price || 0);
    }, 0) || 0;
    return acc + taskTotal;
  }, 0);
  const subtotalGeneral = subtotalEquipments + subtotalWorkers + subtotalServices + subtotalTasks;
  const igv = subtotalGeneral * 0.18;
  const totalGeneral = subtotalGeneral + igv;

  // Equipos
  const anticipoEquipos = (subtotalEquipments * 1.18) * 0.5;

  // Trabajadores
  const anticipoWorkers = (subtotalWorkers * 1.18) * 0.5;

  // Servicios (con su % individual)
  const anticipoServicios = services.reduce((acc, s) => {
    const totalSinIGV = s.hourly_rate * (s.hours || 1);
    const totalConIGV = totalSinIGV * 1.18;

    const required = s.payment_percentage_required || 0;
    const applied = required < 50 ? 50 : required;

    return acc + (totalConIGV * (applied / 100));
  }, 0);

  // Actividades
  const anticipoTasks = (subtotalTasks * 1.18) * 0.5;

  const totalAnticipo = anticipoEquipos + anticipoWorkers + anticipoServicios + anticipoTasks;
  
  const saldoRestante = totalGeneral - totalAnticipo;

  const methods = useForm({
    defaultValues: {
      partialPaymentDate: "",
      finalPaymentDate: eventDate.startOf("day").format("YYYY-MM-DDTHH:mm:ssZ"),
      partialAmount: totalAnticipo,
      finalAmount: saldoRestante,
      event_id: selected?._id
    },
    mode: "onBlur",
  });

  const { handleSubmit } = methods;

  useEffect(() => {
    if(!selected){
      navigate("/admin/quotations");
    } 
  }, [selected, navigate]);

  const onSubmit = async (data) => {
    const success = await startCreatePayments(data);
    if (success) navigate('/admin/quotations')
  };

  const isButtonDisabled = useMemo(() => loading, [loading]);

  return (
    <FormProvider {...methods}>
      <Box
        component="form"
        sx={{ px: isSm ? 4 : 0, pt: 2 }}
        onSubmit={handleSubmit(onSubmit)}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}>
          <Button
            variant="contained"
            onClick={() => navigate("/admin/quotations")}
            sx={{
              minWidth: 'auto',
              width: 40,
              height: 40,
              borderRadius: 2,
              p: 0,
              backgroundColor: isDark ? '#1f1e1e' : '#f5f5f5',
              color: isDark ? '#fff' : '#000',
              boxShadow: 'none',
              '&:hover': {
                backgroundColor: isDark ? '#353434' : '#f0f0f0',
                boxShadow: 'none',
              }
            }}
          >
            <ArrowBack />
          </Button>
          <Typography variant="h4">
            Programar Pagos - EVT: {selected?.event_code}
          </Typography>
        </Box>

        <Typography sx={{ mb: 3, fontSize: 16 }} color="text.secondary">
          Realiza la programación de los pagos asociados a la cotización seleccionada.
        </Typography>

        {/* Info del evento */}
        <EventInfoCard selected={selected} />

        {/* Alerta */}
        <PaymentInfoCard selected={selected} />

        {/* Tablas de detalle */}
        <PaymentTablesContainer selected={selected} />

        {/* Resumen y botón */}
        <PaymentSummaryCard 
          selected={selected}
          totalGeneral={totalGeneral}
          totalAnticipo={totalAnticipo}
          saldoRestante={saldoRestante}
          subtotalEquipments={subtotalEquipments}
          subtotalWorkers={subtotalWorkers}
          subtotalServices={subtotalServices}
          subtotalTasks={subtotalTasks}
          equipments={equipments}
          workers={workers}
          services={services}
          tasks={tasks}
          eventDate={selected?.event_date}
          isButtonDisabled={isButtonDisabled}
        />
      </Box>
    </FormProvider>
  );
};
