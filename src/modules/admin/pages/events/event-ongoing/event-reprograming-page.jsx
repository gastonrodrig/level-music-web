import { QuotationInfoCard } from "../../../components";
import { useQuotationStore } from "../../../../../hooks";
import { Typography, Box,Stack,Button } from "@mui/material";
import { useEffect, useMemo, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useScreenSizes } from "../../../../../shared/constants/screen-width";
import { ResourceTabs } from "../../../../client/components";
import { EventRescheduleCard } from "../../../components";
import { useForm, FormProvider } from "react-hook-form";

export const EventQuotationReprograming = () => {
  const navigate = useNavigate();
  const { isSm } = useScreenSizes();

  const {
    loading,
    selected,
    startTimeUpdateQuotationAdmin, // asegúrate que existe en tu hook
  } = useQuotationStore();

  const assignations = selected?.assignations || [];
  console.log("Selected quotation for reprogramming:", selected);
  console.log("Assignations:", assignations);

  // Form
  const methods = useForm({
    mode: "onBlur",
    defaultValues: {
      startDateTime: selected?.start_time ?? selected?.event_start_datetime ?? null,
      endDateTime: selected?.end_time ?? selected?.event_end_datetime ?? null,
    },
  });
  const { handleSubmit, setValue, getValues, reset } = methods;

  // mantener estado local de validez para habilitar botón
  const [rescheduleMeta, setRescheduleMeta] = useState({ isValid: false, error: null });

  useEffect(() => {
    if (!selected) {
      navigate("/admin/event-ongoing");
      return;
    }
    // si cambió selected, resetear form con nuevos valores
    reset({
      startDateTime: selected?.start_time ?? selected?.event_start_datetime ?? null,
      endDateTime: selected?.end_time ?? selected?.event_end_datetime ?? null,
    });
  }, [selected, navigate, reset]);

  // memoiza callback para evitar loops
  const handlePickerChange = useCallback(
    (payload) => {
      // payload: { start, end, isValid, error } según el componente
      setValue("startDateTime", payload.start);
      setValue("endDateTime", payload.end);
      setRescheduleMeta({ isValid: payload.isValid, error: payload.error });
    },
    [setValue]
  );

  const onSubmit = async (data) => {
    if (!rescheduleMeta.isValid) return;
    const payload = {
      start_time: data.startDateTime,
      end_time: data.endDateTime,
    };

    const ok = await startTimeUpdateQuotationAdmin(selected._id, payload);
    if (ok) {
      navigate("/admin/event-ongoing");
    }
  };

  const isButtonDisabled = useMemo(() => loading || !rescheduleMeta.isValid, [loading, rescheduleMeta.isValid]);

  return (
    <FormProvider {...methods}>
      <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ px: isSm ? 4 : 0, pt: 2 }}>
        <Typography variant="h4" sx={{ mb: 2 }}>
          Reprogramación de evento
        </Typography>
        <Typography sx={{ mb: 2, fontSize: 16 }} color="text.secondary">
          Reprograma la fecha y asigna los recursos para el evento seleccionado.
        </Typography>

        <QuotationInfoCard selected={selected} />
        <ResourceTabs assignations={assignations} />

        <Box sx={{ mt: 2 }}>
          <EventRescheduleCard
            initialStart={getValues("startDateTime")}
            initialEnd={getValues("endDateTime")}
            onChange={handlePickerChange}
            showActions={false} // ocultamos botones internos
            minDateTime={/* opcional: dayjs().add(2,'day') o prop */ undefined}
          />
        </Box>

        <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 3 }}>
          <Button variant="outlined" onClick={() => navigate("/admin/event-ongoing")} disabled={loading}>
            Cancelar
          </Button>

          <Button variant="contained" disabled={isButtonDisabled} type="submit">
            Reprogramar Evento
          </Button>
        </Stack>
      </Box>
    </FormProvider>
  );
};