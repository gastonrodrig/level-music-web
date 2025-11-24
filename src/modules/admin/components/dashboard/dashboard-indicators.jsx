// DashboardIndicators.jsx
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  useTheme,
  Skeleton,
} from "@mui/material";
import {
  Description,
  Visibility,
  CheckCircle,
  Search,
  AccessTime,
  EventAvailableOutlined,
  EventNote,
} from "@mui/icons-material";
import { useQuotationStore } from "../../../../hooks";

export const DashboardIndicators = ({ dashboardData }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  const { loading } = useQuotationStore();

  const estadosConfig = {
    cantidadEventosBorrador: {
      title: "Borrador",
      color: isDark ? "#4B5B6B" : "rgba(134, 143, 160, 1)",
      icon: <Description sx={{ color: "white" }} />,
    },
    cantidadEventosRevision: {
      title: "En Revisión",
      color: isDark ? "#28346B" : "#4154adff",
      icon: <Visibility sx={{ color: "white" }} />,
    },
    cantidadEventosConfirmados: {
      title: "Confirmados",
      color: isDark ? "#2e725dff" : "#58a893ff",
      icon: <CheckCircle sx={{ color: "white" }} />,
    },
    cantidadEventosEnSeguimiento: {
      title: "En Seguimiento",
      color: isDark ? "#31286B" : "#493c9eff",
      icon: <Search sx={{ color: "white" }} />,
    },
  };

  const citasConfig = {
    title: "Citas Pendientes",
    color: isDark ? "#326B28" : "#499a3bff",
    icon: <AccessTime sx={{ color: "white" }} />,
  };

  const estadosConEstilo = dashboardData
    ? Object.entries(estadosConfig).map(([key, config]) => ({
        ...config,
        value: dashboardData[key] || 0,
      }))
    : [];

  const citasPendientes = dashboardData
    ? {
        ...citasConfig,
        value: dashboardData.cantidadCitas || 0,
      }
    : { ...citasConfig, value: 0 };

  if (loading || !dashboardData) {
    return (
      <>
        {/* Skeleton Estados de Eventos */}
        <Box
          sx={{
            borderRadius: 2.5,
            p: 3,
            mb: 1,
            bgcolor: isDark ? "#1f1e1e" : "#f5f5f5",
            boxShadow: "none",
          }}
        >
          {/* Chip */}
          <Skeleton
            variant="rounded"
            width={190}
            height={32}
            sx={{ mb: 2, borderRadius: 16 }}
          />
          {/* Texto descripción */}
          <Skeleton variant="text" width="70%" sx={{ mb: 2 }} />

          {/* Cards */}
          <Grid container spacing={3}>
            {Array.from({ length: 4 }).map((_, i) => (
              <Grid item xs={12} sm={6} md={6} lg={3} key={i}>
                <Card
                  sx={{
                    backgroundColor: isDark ? "#262626" : "#e5e7eb",
                    borderRadius: 2,
                    boxShadow: 3,
                  }}
                >
                  <CardContent sx={{ textAlign: "center" }}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        mb: 1,
                      }}
                    >
                      <Skeleton variant="circular" width={32} height={32} />
                    </Box>
                    <Skeleton
                      variant="text"
                      width="40%"
                      sx={{ mx: "auto", mb: 0.5 }}
                    />
                    <Skeleton
                      variant="text"
                      width="60%"
                      sx={{ mx: "auto" }}
                    />
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Skeleton Citas */}
        <Box
          sx={{
            borderRadius: 2.5,
            p: 3,
            bgcolor: isDark ? "#1f1e1e" : "#f5f5f5",
            boxShadow: "none",
          }}
        >
          {/* Chip */}
          <Skeleton
            variant="rounded"
            width={100}
            height={32}
            sx={{ mb: 2, borderRadius: 16 }}
          />
          {/* Texto descripción */}
          <Skeleton variant="text" width="65%" sx={{ mb: 2 }} />

          {/* Card de citas */}
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={3}>
              <Card
                sx={{
                  backgroundColor: isDark ? "#262626" : "#e5e7eb",
                  borderRadius: 2,
                  boxShadow: 3,
                }}
              >
                <CardContent sx={{ textAlign: "center" }}>
                  <Box
                    sx={{ display: "flex", justifyContent: "center", mb: 1 }}
                  >
                    <Skeleton variant="circular" width={32} height={32} />
                  </Box>
                  <Skeleton
                    variant="text"
                    width="40%"
                    sx={{ mx: "auto", mb: 0.5 }}
                  />
                  <Skeleton
                    variant="text"
                    width="60%"
                    sx={{ mx: "auto" }}
                  />
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      </>
    );
  }

  return (
    <>
      {/* Estados de eventos */}
      <Box
        sx={{
          borderRadius: 2.5,
          p: 3,
          mb: 1,
          bgcolor: isDark ? "#1f1e1e" : "#f5f5f5",
          boxShadow: "none",
        }}
      >
        <Chip
          icon={<EventAvailableOutlined sx={{ color: "white" }} />}
          label="Estados de Eventos"
          sx={{
            fontWeight: "bold",
            fontSize: 16,
            bgcolor: isDark ? "#27496aff" : "#4682beff",
            mb: 1,
            color: "white",
            "& .MuiChip-icon": {
              color: "white !important",
            },
          }}
        />
        <Typography
          sx={{
            color: theme.palette.text.secondary,
            mb: 2,
          }}
        >
          Verifica cuántos eventos necesitan revisión, aprobación o
          seguimiento.
        </Typography>

        <Grid container spacing={3}>
          {estadosConEstilo.map((s, i) => (
            <Grid item xs={12} sm={6} md={6} lg={3} key={i}>
              <Card
                sx={{
                  backgroundColor: s.color,
                  borderRadius: 2,
                  boxShadow: 3,
                }}
              >
                <CardContent sx={{ textAlign: "center" }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      mb: 1,
                    }}
                  >
                    {s.icon}
                  </Box>
                  <Typography
                    variant="h4"
                    sx={{ color: "white", fontWeight: "bold" }}
                  >
                    {s.value}
                  </Typography>
                  <Typography sx={{ color: "rgba(255,255,255,0.9)" }}>
                    {s.title}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Citas */}
      <Box
        sx={{
          borderRadius: 2.5,
          p: 3,
          bgcolor: isDark ? "#1f1e1e" : "#f5f5f5",
          boxShadow: "none",
        }}
      >
        <Chip
          icon={<EventNote sx={{ color: "white" }} />}
          label="Citas"
          sx={{
            fontWeight: "bold",
            fontSize: 16,
            bgcolor: isDark ? "#286b41ff" : "#37945cff",
            mb: 1,
            color: "white",
            "& .MuiChip-icon": {
              color: "white !important",
            },
          }}
        />
        <Typography
          sx={{
            color: theme.palette.text.secondary,
            mb: 2,
          }}
        >
          Revisa las solicitudes de reuniones o visitas generadas por
          clientes.
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={3}>
            <Card
              sx={{
                backgroundColor: citasPendientes.color,
                borderRadius: 2,
                boxShadow: 3,
              }}
            >
              <CardContent sx={{ textAlign: "center" }}>
                <Box sx={{ display: "flex", justifyContent: "center", mb: 1 }}>
                  {citasPendientes.icon}
                </Box>
                <Typography
                  variant="h4"
                  sx={{ color: "white", fontWeight: "bold" }}
                >
                  {citasPendientes.value}
                </Typography>
                <Typography sx={{ color: "rgba(255,255,255,0.9)" }}>
                  Citas Pendientes
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};
