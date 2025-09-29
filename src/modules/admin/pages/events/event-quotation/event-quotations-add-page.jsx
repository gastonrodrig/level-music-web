import { Box, Typography, Button } from "@mui/material";
import { useForm, FormProvider } from "react-hook-form";

// Importa tus hijos
import { EventDetailsForm, PersonalInfoForm } from "../../../components";

export const EventQuotationAddPage = () => {
  const methods = useForm({
    defaultValues: {
      // Evento
      eventName: "",
      eventDescription: "",
      startDateTime: null,
      endDateTime: null,
      attendeesCount: 0,
      placeType: "",
      exactAddress: "",
      placeReference: "",
      placeCapacity: "",
      // Cliente
      client_type: "Persona",
      email: "",
      phone: "",
      document_type: "Dni",
      document_number: "",
      first_name: "",
      last_name: "",
      company_name: "",
      contact_person: "",
      // Recursos
      services: [],
      equipments: [],
      workers: [],
    },
    mode: "onBlur",
  });

  const { handleSubmit } = methods;

  const onSubmit = (data) => {
    console.log("Cotización completa:", data);
    // aquí iría tu dispatch al backend
  };

  return (
    <FormProvider {...methods}>
      <Box
        component="form"
        sx={{ px: 4, pt: 2 }}
        onSubmit={handleSubmit(onSubmit)}
      >
        <Typography variant="h4" sx={{ mb: 1 }}>
          Agregar Cotización
        </Typography>
        <Typography sx={{ mb: 3, fontSize: 16 }} color="text.secondary">
          Crea una nueva cotización completando la información del evento, cliente y servicios requeridos.
        </Typography>

        {/* 1. Información del evento */}
        <EventDetailsForm />
        
        <PersonalInfoForm />

        {/* Botón de enviar */}
        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
          <Button
            type="submit"
            variant="contained"
            sx={{ textTransform: "none", borderRadius: 2 }}
          >
            Guardar Cotización
          </Button>
        </Box>
      </Box>
    </FormProvider>
  );
};
