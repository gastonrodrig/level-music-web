import { Box, Typography, useTheme } from "@mui/material"
import { FormProvider, useForm } from "react-hook-form"
import { EventDetailsForm } from "../../../components"

export const EventQuotationEditPage = () => {
  const formMethods = useForm();
    const theme = useTheme();  
    const isDark = theme.palette.mode === "dark";


  const onSubmit = (data) => {
    console.log(data)
  }

  return (
    <FormProvider {...formMethods}>
      <Box component="form" sx={{ px: 4, pt: 2 }} onSubmit={formMethods.handleSubmit(onSubmit)}>
        <Typography variant="h4" sx={{ mb: 2 }}>
          Asignación de Recursos
        </Typography>
        <Typography sx={{ mb: 2, fontSize: 16 }} color="text.secondary">
          Asigna trabajadores, servicios adicionales y equipos para el evento.
        </Typography>

        <EventDetailsForm       
        />
      </Box>
    </FormProvider>
  )
}

