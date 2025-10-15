import { Box, Typography, Chip, useTheme } from "@mui/material";

export const QuotationRequestedServices = ({ selected }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  if (!selected) return null;

  return (
    <Box
      sx={{
        p: 3,
        borderRadius: 3,
        bgcolor: isDark ? "#1f1e1e" : "#f5f5f5",
        mt: 2,
      }}
    >
      <Typography sx={{ fontSize: 20, fontWeight: 500, mb: 2 }}>
        Servicios Solicitados en la Cotización
      </Typography>

      {selected?.services_requested?.map((service) => (
        <Box
          key={service.service_type_id}
          sx={{
            border: "1px solid",
            borderColor: isDark ? "#333" : "#e0e0e0",
            borderRadius: 2,
            p: 2,
            mb: 2,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box>
            <Typography fontSize={15} fontWeight={600}>
              {service.service_type_name}
            </Typography>
            <Typography fontSize={13} color="text.secondary">
              {service.details}
            </Typography>
          </Box>

          <Chip
            label="Solicitado"
            color="default"
            variant="outlined"
            size="small"
          />
        </Box>
      ))}
    </Box>
  );
};
