import { Box, Typography, Card, CardActionArea, CardContent, useTheme } from "@mui/material";
import { Home, Storefront, CheckCircle } from "@mui/icons-material";
import { useFormContext } from "react-hook-form";

export const PaymentLocationSelector = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const { watch, setValue } = useFormContext();

  const selectedLocation = watch("selectedPaymentLocation");

  const colors = {
    innerCardBg: isDark ? "#141414" : "#fcfcfc",
    textPrimary: isDark ? "#fff" : "#000",
    textSecondary: isDark ? "#999" : "#666",
    border: isDark ? "#333" : "#e0e0e0",
    borderActive: theme.palette.primary.main,
  };

  const locations = [
    {
      id: "online",
      title: "En Casa",
      subtitle: "Pago online",
      icon: <Home sx={{ fontSize: 40 }} />,
      color: isDark ? "#964901" : "#E08438",
    },
    {
      id: "local",
      title: "En Local",
      subtitle: "Pago presencial",
      icon: <Storefront sx={{ fontSize: 40 }} />,
      color: isDark ? "#607d8b" : "#B0B0B0",
    },
  ];

  return (
    <Box sx={{ p: { xs: 0, md: 1 } }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 500, color: colors.textPrimary }}>
          ¿Dónde realizas el pago?
        </Typography>
      </Box>

      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2 }}>
        {locations.map((location) => (
          <Card
            key={location.id}
            elevation={0}
            sx={{
              border:
                selectedLocation === location.id
                  ? `2px solid ${colors.borderActive}`
                  : `1px solid ${colors.border}`,
              borderRadius: 2,
              bgcolor: colors.innerCardBg,
              transition: "all 0.2s",
              position: "relative",
            }}
          >
            <CardActionArea onClick={() => setValue("selectedPaymentLocation", location.id)}>
              <CardContent sx={{ p: 3, textAlign: "center" }}>
                {/* Check en esquina superior derecha */}
                {selectedLocation === location.id && (
                  <CheckCircle
                    sx={{
                      position: "absolute",
                      top: 8,
                      right: 8,
                      fontSize: 24,
                      color: colors.borderActive,
                    }}
                  />
                )}

                {/* Icono */}
                <Box
                  sx={{
                    width: 64,
                    height: 64,
                    borderRadius: 2,
                    bgcolor: location.color,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#fff",
                    mx: "auto",
                    mb: 2,
                  }}
                >
                  {location.icon}
                </Box>

                {/* Título */}
                <Typography variant="subtitle1" sx={{ fontWeight: 600, color: colors.textPrimary, mb: 0.5 }}>
                  {location.title}
                </Typography>

                {/* Subtítulo */}
                <Typography variant="caption" sx={{ color: colors.textSecondary }}>
                  {location.subtitle}
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        ))}
      </Box>
    </Box>
  );
};