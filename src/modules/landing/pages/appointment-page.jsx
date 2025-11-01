import { FormProvider, useForm } from "react-hook-form"
import { LandingLayout } from "../layout/landing-layout"
import { useAuthStore } from "../../../hooks";
import { useEffect } from "react";
import { Typography, Grid } from "@mui/material";
import {
  AppointmentDetailForm,
  AppointmentSummary,
  PersonalInfoForm,
} from "../components";

export const AppointmentPage = () => {
  const formMethods = useForm({
    defaultValues: {
      clientType: "Persona",
      firstName: "",
      lastName: "",
      companyName: "",
      contactPerson: "",
      email: "",
      phone: "",
      documentType: "Dni",
      documentNumber: "",
      meetingType: "Virtual",
      startDate: null,
      endDate: null,
      shift: "Tarde",
      attendeesCount: "",
      duration: "",
    }
  });

  const { setValue, watch } = formMethods;

  const clientType = watch("clientType");

  useEffect(() => {
    if (clientType === "Empresa") {
      setValue("documentType", "Ruc");
      setValue("documentNumber", "");
    }
  }, [clientType, setValue]);

  return (
    <LandingLayout>
      <FormProvider {...formMethods}>
        <Typography sx={{ mt: { xs: 9, md: 12 }, fontSize: 30 }}>
          Empieza a organizar tu evento con una cita personalizada
        </Typography>
        <Typography sx={{ mt: 2, fontWeight: 100, fontSize: 16, mb: 3 }}>
          Completa el formulario y uno de nuestros asesores se pondrá en contacto contigo para ayudarte a planificar el evento perfecto.
        </Typography>

        <Grid container spacing={3} sx={{ mb: 5 }}>
          <Grid item xs={12} md={8}>
            <Grid item xs={12}>
              <PersonalInfoForm />
            </Grid>
            <Grid item xs={12}>
              <AppointmentDetailForm />
            </Grid>
          </Grid>
          <Grid item xs={12} md={4}>
            <AppointmentSummary />
          </Grid>
        </Grid>
      </FormProvider>
    </LandingLayout>
  )
}