import { Box, Typography } from "@mui/material";
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

  const eventDate = selected?.event_date ? dayjs(selected.event_date) : dayjs();

  const equipments = selected?.assignations?.filter(a => a.resource_type === "Equipo") || [];
  const workers = selected?.assignations?.filter(a => a.resource_type === "Trabajador") || [];
  const services = selected?.assignations?.filter(a => a.resource_type === "Servicio Adicional") || [];
  
  const subtotalEquipments = equipments.reduce((acc, e) => acc + (e.hourly_rate * e.hours || 0), 0);
  const subtotalWorkers = workers.reduce((acc, w) => acc + (w.hourly_rate * w.hours || 0), 0);
  const subtotalServices = services.reduce((acc, s) => acc + (s.hourly_rate * s.hours || 0), 0);
  const totalGeneral = subtotalEquipments + subtotalWorkers + subtotalServices;

  const anticipoEquipos = equipments.reduce((acc, e) => acc + ((e.payment_percentage_required / 100) * e.hourly_rate * e.hours), 0);
  const anticipoWorkers = workers.reduce((acc, w) => acc + ((w.payment_percentage_required / 100) * w.hourly_rate * w.hours), 0);
  const anticipoServicios = services.reduce((acc, s) => acc + ((s.payment_percentage_required / 100) * s.hourly_rate * s.hours), 0);
  const totalAnticipo = anticipoEquipos + anticipoWorkers + anticipoServicios;
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
        <Typography variant="h4" sx={{ mb: 1 }}>
          Programar Pagos - EVT: {selected?.event_code}
        </Typography>

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
          equipments={equipments}
          workers={workers}
          services={services}
          eventDate={selected?.event_date}
          isButtonDisabled={isButtonDisabled}
        />
      </Box>
    </FormProvider>
  );
};
