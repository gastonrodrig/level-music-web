import {
  Card,
  CardContent,
  Box,
  Typography,
  Grid,
  useTheme,
  Tabs,
  Tab,
} from "@mui/material";
import { Assignment, Lightbulb, MusicNote, Person } from "@mui/icons-material";
import { useState } from "react";

export const ResourceTabs = ({ assignations }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const mainColor = theme.palette.primary.main;
  const [tab, setTab] = useState(0);

  const services = assignations.filter(
    (r) => r.resource_type === "Servicio Adicional"
  );
  const equipment = assignations.filter((r) => r.resource_type === "Equipo");
  const workers = assignations.filter((r) => r.resource_type === "Trabajador");

  const typeIcon = {
    "Servicio Adicional": <Lightbulb sx={{ color: mainColor, mr: 1 }} />,
    Equipo: <MusicNote sx={{ color: mainColor, mr: 1 }} />,
    Trabajador: <Person sx={{ color: mainColor, mr: 1 }} />,
  };

  const renderResourceSection = (resources) => {
    if (!resources.length) {
      return (
        <Typography align="center" sx={{ color: "text.secondary", py: 4 }}>
          No hay recursos asignados
        </Typography>
      );
    }

    const grouped = {
      "Servicio Adicional": resources.filter(
        (r) => r.resource_type === "Servicio Adicional"
      ),
      Equipo: resources.filter((r) => r.resource_type === "Equipo"),
      Trabajador: resources.filter((r) => r.resource_type === "Trabajador"),
    };

    const renderSection = (title, items, type) =>
      !!items.length && (
        <Box sx={{ mb: 2 }} key={type}>
          <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>
            {title}
          </Typography>
          {items.map((resource, idx) => (
            <Card
              key={resource._id || idx}
              variant="outlined"
              sx={{
                mb: idx === items.length - 1 ? 1 : 1.5,
                borderRadius: 3,
                borderLeft: `4px solid ${mainColor}`,
                boxShadow: "none",
                bgcolor: isDark ? "#18181b" : "#fff",
              }}
            >
              <CardContent sx={{ px: 4, py: 2 }}>
                <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
                  <Box sx={{ mt: 0.5 }}>{typeIcon[type]}</Box>
                  <Box sx={{ flex: 1 }}>
                    {type === "Servicio Adicional" && (
                      <>
                        <Typography sx={{ fontWeight: 600 }}>
                          {resource.service_provider_name}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{ color: "text.secondary" }}
                        >
                          {resource.service_type_name}
                        </Typography>
                      </>
                    )}
                    {type === "Equipo" && (
                      <>
                        <Typography sx={{ fontWeight: 600 }}>
                          {resource.equipment_name}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{ color: "text.secondary" }}
                        >
                          {resource.equipment_type}
                        </Typography>
                      </>
                    )}
                    {type === "Trabajador" && (
                      <>
                        <Typography sx={{ fontWeight: 600 }}>
                          Rol: {resource.worker_type_name}
                        </Typography>

                        <Typography variant="body2" sx={{ mt: 1 }}>
                          Cantidad requerida: <b>{resource.quantity_required}</b>
                        </Typography>
                      </>
                    )}


                    <Grid container spacing={2} sx={{ mt: 1 }}>
                      {
                        resource.resource_type !== "Servicio Adicional" && (
                          <Grid item xs={4}>
                            <Typography
                              variant="body2"
                              sx={{ color: "text.secondary" }}
                            >
                              Horas
                            </Typography>
                            <Typography>{resource.hours}h</Typography>
                          </Grid>
                        )
                      }
                      <Grid item xs={4}>
                        <Typography
                          variant="body2"
                          sx={{ color: "text.secondary" }}
                        >
                          Tarifa/{resource.resource_type === "Servicio Adicional" ? "Día" : "Hora"}
                        </Typography>

                        <Typography>

                          {resource.resource_type === "Trabajador"
                            ? `S/. ${(resource.hourly_rate / (resource.hours * resource.quantity_required)).toLocaleString()}`
                            : `S/. ${(resource.hourly_rate / resource.hours).toLocaleString()}`
                          }

                        </Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography
                          variant="body2"
                          sx={{ color: "text.secondary" }}
                        >
                          Total
                        </Typography>
                        <Typography>
                          S/. {(resource.hourly_rate).toLocaleString()}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
      );

    return (
      <Box>
        {renderSection(
          "Proveedores de Servicios",
          grouped["Servicio Adicional"],
          "Servicio Adicional"
        )}
        {renderSection("Equipos", grouped["Equipo"], "Equipo")}
        {renderSection("Personal", grouped["Trabajador"], "Trabajador")}
      </Box>
    );
  };

  return (
    <Box
      sx={{
        p: 3,
        borderRadius: 3,
        bgcolor: isDark ? "#1f1e1e" : "#f5f5f5",
        mt: 2,
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", mb: 2, gap: 1 }}>
        <Assignment />
        <Typography sx={{ fontSize: 20, fontWeight: 500 }}>
          Recursos Asignados
        </Typography>
      </Box>
      <Tabs
        value={tab}
        onChange={(_, v) => setTab(v)}
        sx={{
          mb: 2,
          bgcolor: isDark ? theme.palette.background.paper : "#f5f5fa",
          borderRadius: "16px",
          minHeight: 40,
          px: 1,
          "& .MuiTabs-flexContainer": {
            justifyContent: "space-between",
          },
          "& .MuiTab-root": {
            minHeight: 36,
            minWidth: 0,
            flex: 1,
            borderRadius: "16px",
            mx: 0.5,
            color: theme.palette.text.primary,
            fontWeight: 500,
            fontSize: 15,
            transition: "background 0.2s",
            bgcolor: "transparent",
            textTransform: "none",
            "&.Mui-selected": {
              bgcolor: theme.palette.background.default,
              color: theme.palette.text.primary,
              boxShadow: "0 1px 4px 0 #0001",
              fontWeight: 700,
            },
          },
          "& .MuiTabs-indicator": {
            display: "none",
          },
        }}
      >
        <Tab label={`Todos (${assignations.length})`} />
        <Tab label={`Servicios (${services.length})`} />
        <Tab label={`Equipos (${equipment.length})`} />
        <Tab label={`Personal (${workers.length})`} />
      </Tabs>

      <Box hidden={tab !== 0}>{renderResourceSection(assignations)}</Box>
      <Box hidden={tab !== 1}>{renderResourceSection(services)}</Box>
      <Box hidden={tab !== 2}>{renderResourceSection(equipment)}</Box>
      <Box hidden={tab !== 3}>{renderResourceSection(workers)}</Box>
    </Box>
  );
};
