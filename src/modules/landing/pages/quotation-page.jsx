import { useEffect, useMemo } from "react";
import { useForm, FormProvider } from "react-hook-form";
import {
  Box,
  Button,
  Divider,
  Stepper,
  Step,
  StepLabel,
  Typography,
  Paper,
} from "@mui/material";
import {
  CustomStepIcon,
  StepSections,
  EventTypeForm,
  PersonalInfoForm,
  EventDetailsForm,
  ServicesForm,
} from "../components/";
import {
  useAuthStore,
  useEventTypeStore,
  useQuotationStore,
  useServiceTypeStore,
  useStepperStore,
} from "../../../hooks";
import { useScreenSizes } from "../../../shared/constants/screen-width";
import { useDispatch } from "react-redux";
import { showSnackbar } from "../../../store";
import { ArrowBack, ArrowForward, Done } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { LandingLayout } from "../layout/landing-layout";

export const QuotationPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const formMethods = useForm({
    mode: "onBlur",
    defaultValues: {
      eventCategory: "",
      eventType: "",
      event_type_id: null,
      event_type_name: null,
      customEventType: "",
      user_id: null,
      client_type: "Persona",
      first_name: "",
      last_name: "",
      company_name: "",
      contact_person: "",
      email: "",
      phone: "",
      document_type: "Dni",
      document_number: "",
      attendeesCount: "",
      startTime: null,
      endTime: null,
      exactAddress: "",
      placeReference: "",
      placeType: "",
      placeCapacity: "",
    },
  });

  const { handleSubmit, reset, setValue, watch, trigger } = formMethods;
  const { startLoadingAllServiceTypes } = useServiceTypeStore();
  const { startLoadingAllEventTypes } = useEventTypeStore();
  const { loading, startCreateQuotationLanding } = useQuotationStore();
  const { _id, status } = useAuthStore();

  useEffect(() => {
    if (status === 'authenticated') {
      setValue("user_id", _id);
    }
  }, [_id, setValue]);

  const { currentPage, goNext, goBack, isFirst, isLast } = useStepperStore(
    "quotation",
    StepSections.length
  );

  const { isMd } = useScreenSizes();

  const selectedEventType = watch("eventType");
  const customEventType = watch("customEventType");
  const clientType = watch("client_type");

  useEffect(() => {
    if (clientType === "Empresa") {
      setValue("document_type", "Ruc");
      setValue("document_number", "");
    }
  }, [clientType, setValue]);

  useEffect(() => {
    startLoadingAllServiceTypes();
    startLoadingAllEventTypes();
  }, []);

  const handleEventTypeSelect = (eventType) => {
    setValue("eventType", eventType);
  };

  const onNext = async () => {
    // Validaciones del paso 1
    if (currentPage === 0) {
      if (!selectedEventType) {
        dispatch(
          showSnackbar({ message: "Debes seleccionar un tipo de evento." })
        );
        return;
      }

      if (
        selectedEventType === "otros" &&
        (!customEventType || customEventType.trim().length === 0)
      ) {
        dispatch(
          showSnackbar({
            message: "Debes especificar el tipo de evento personalizado.",
          })
        );
        return;
      }
    }

    const isValid = await trigger();
    if (isValid) goNext();
  };

  const onFinish = handleSubmit(async (data) => {
    console.log(data)
    const success = await startCreateQuotationLanding(data);
    if (success) {
      if (status === 'authenticated') {
        navigate('/client/event-quotes')
      } else {
        navigate('/');
      }
      reset();
    }
  });

  const renderCurrentComponent = () => {
    switch (currentPage) {
      case 0:
        return <EventTypeForm onSelect={handleEventTypeSelect} />;
      case 1:
        return <PersonalInfoForm />;
      case 2:
        return <EventDetailsForm />;
      case 3: 
        return <ServicesForm/>;
      default:
        return null;
    }
  };

  const isButtonDisabled = useMemo(() => loading, [loading]);

  return (
    <LandingLayout>
      <FormProvider {...formMethods}>
        <Typography sx={{ mt: { xs: 9, md: 12 }, fontSize: 30 }}>
          Empieza a organizar tu evento
        </Typography>
        <Typography sx={{ mt: 2, fontWeight: 100, fontSize: 16 }}>
          Completa los datos y recibe una proforma para tu evento.
        </Typography>

        <Paper sx={{ mt: 4, p: { xs: 2, sm: 3, md: 4 }, mb: 4, boxShadow: 1 }}>
          <Stepper
            activeStep={currentPage}
            orientation={isMd ? "horizontal" : "vertical"}
          >
            {StepSections.map((step) => (
              <Step key={step.label}>
                <StepLabel
                  slots={{
                    stepIcon: (props) => (
                      <CustomStepIcon {...props} icon={step.icon} />
                    ),
                  }}
                >
                  {step.label}
                </StepLabel>
              </Step>
            ))}
          </Stepper>

          <Divider sx={{ mt: 3, mx: -3 }} />

          <Box sx={{ mt: 2 }}>
            {currentPage < StepSections.length ? (
              renderCurrentComponent()
            ) : (
              <Typography sx={{ fontSize: 16 }}>
                ¡Listo! En breve te enviaremos la proforma de tu evento.
              </Typography>
            )}

            <Box sx={{ display: "flex", justifyContent: "space-between", mt: 4 }}>
              <Button
                variant="contained"
                color="secondary"
                onClick={goBack}
                startIcon={<ArrowBack />}
                sx={{
                  px: 4,
                  py: 1,
                  borderRadius: 3,
                  textTransform: "none",
                  fontWeight: 600,
                  visibility: isFirst ? "hidden" : "visible",
                  bgcolor: "#4a4a4a",
                  color: "#fff",
                  "&:hover": {
                    bgcolor: "#5c5c5c",
                  },
                }}
              >
                Atrás
              </Button>

              <Button
                variant="contained"
                color="primary"
                disabled={isButtonDisabled}
                onClick={isLast ? onFinish : onNext}
                endIcon={isLast ? <Done /> : <ArrowForward />}
                sx={{
                  color: "white",
                  px: 4,
                  py: 1,
                  borderRadius: 3,
                  textTransform: "none",
                  fontWeight: 600,
                  boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
                  "&:hover": {
                    boxShadow: "0 6px 16px rgba(0,0,0,0.25)",
                  },
                }}
              >
                {isLast ? "Finalizar" : "Siguiente"}
              </Button>
            </Box>
          </Box>
        </Paper>
      </FormProvider>
    </LandingLayout>
  );
};
