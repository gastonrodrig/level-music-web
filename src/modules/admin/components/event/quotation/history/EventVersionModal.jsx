import React from "react";
import {
  Modal,
  Box,
  IconButton,
  Tabs,
  Tab,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
  useTheme,
} from "@mui/material";
import {
  Close,
  AccessTime,
  ListAlt,
  Build,
  Person,
  Place,
  Groups,
  MonetizationOn,
  CalendarMonth,
  Phone,
  Email,
} from "@mui/icons-material";

export const EventVersionModal = ({ open, onClose, version = {} }) => {
  const theme = useTheme();
  const [tab, setTab] = React.useState(0);

  React.useEffect(() => {
    if (!open) setTab(0);
  }, [open]);

  // colores basados en la paleta del tema y formato igual a otros modales (borderRadius 4, boxShadow 24, etc.)
  const modalSx = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: { xs: "92%", sm: 680 },
    bgcolor: "background.paper",
    color: "text.primary",
    borderRadius: 4,
    boxShadow: 24,
    p: 3.5,
    outline: "none",
  };

  const tabBg = theme.palette.action.selected;
  const innerBg = theme.palette.mode === "dark" ? theme.palette.background.default : theme.palette.grey[50];
  const iconColor = theme.palette.text.secondary;

  const formatDay = (d, withTime) => {
    if (!d) return "N/A";
    const dt = new Date(d);
    const dd = String(dt.getDate()).padStart(2, "0");
    const mm = String(dt.getMonth() + 1).padStart(2, "0");
    const yyyy = dt.getFullYear();
    if (withTime) {
      const hh = String(dt.getHours()).padStart(2, "0");
      const min = String(dt.getMinutes()).padStart(2, "0");
      return `${dd}/${mm}/${yyyy} ${hh}:${min}`;
    }
    return `${dd}/${mm}/${yyyy}`;
  };

  const changesList = (version.changes || "")
    .split(/\r?\n|•|·| - |;|\. /)
    .map((s) => s.trim())
    .filter(Boolean);

  return (
    <Modal open={!!open} onClose={onClose}>
      <Box sx={modalSx}>
        {/* header */}
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Detalles de Versión {version.version || ""}
          </Typography>
          <IconButton size="small" onClick={onClose} sx={{ color: iconColor }}>
            <Close />
          </IconButton>
        </Box>

        {/* tabs */}
        <Box sx={{ mb: 2 }}>
          <Tabs
            value={tab}
            onChange={(_, v) => setTab(v)}
            variant="fullWidth"
            sx={{
              bgcolor: tabBg,
              borderRadius: 3,
              px: 1,
              "& .MuiTab-root": { textTransform: "none", minHeight: 40, borderRadius: 2 },
              "& .Mui-selected": { fontWeight: 700 },
            }}
          >
            <Tab label={<Box sx={{ display: "flex", alignItems: "center", gap: 1 }}><ListAlt fontSize="small" sx={{ color: iconColor }} />Cambios</Box>} />
            <Tab label={<Box sx={{ display: "flex", alignItems: "center", gap: 1 }}><Build fontSize="small" sx={{ color: iconColor }} />Servicios</Box>} />
            <Tab label={<Box sx={{ display: "flex", alignItems: "center", gap: 1 }}><Person fontSize="small" sx={{ color: iconColor }} />Cliente</Box>} />
            <Tab label={<Box sx={{ display: "flex", alignItems: "center", gap: 1 }}><CalendarMonth fontSize="small" sx={{ color: iconColor }} />Evento</Box>} />
          </Tabs>
        </Box>

        {/* content */}
        <Box>
          {tab === 0 && (
            <Box>
              <Box sx={{ display: "flex", gap: 1.5, alignItems: "center", mb: 2, color: "text.secondary" }}>
                <AccessTime fontSize="small" sx={{ color: iconColor }} />
                <Typography variant="body2">{version.date ? formatDay(version.date, true) : "N/A"}</Typography>
              </Box>

              <Box sx={{ bgcolor: innerBg, p: 2, borderRadius: 2, border: `1px solid ${theme.palette.divider}` }}>
                <Typography fontWeight={700} sx={{ mb: 1, display: "flex", alignItems: "center", gap: 1 }}>
                  <ListAlt fontSize="small" sx={{ color: iconColor }} /> Cambios Realizados:
                </Typography>

                {changesList.length ? (
                  <List dense>
                    {changesList.map((c, i) => (
                      <ListItem key={i} sx={{ display: "list-item", pl: 2 }}>
                        <ListItemText primary={c} primaryTypographyProps={{ color: "text.primary" }} />
                      </ListItem>
                    ))}
                  </List>
                ) : (
                  <Typography color="text.secondary">No hay detalles.</Typography>
                )}
              </Box>
            </Box>
          )}

          {tab === 1 && (
            <Box>
              <Typography color="text.secondary" sx={{ mb: 1, display: "flex", alignItems: "center", gap: 1 }}>
                <Build fontSize="small" sx={{ color: iconColor }} /> Servicios asociados
              </Typography>
              <Divider sx={{ my: 1 }} />
              <Box sx={{ bgcolor: innerBg, p: 2, borderRadius: 2, border: `1px solid ${theme.palette.divider}` }}>
                {(version.services || []).length ? (
                  <List dense>
                    {version.services.map((s, i) => (
                      <ListItem key={i} sx={{ display: "flex", justifyContent: "space-between", py: 1 }}>
                        <Box>
                          <Typography sx={{ fontWeight: 600 }}>{s.name}</Typography>
                          {s.description && <Typography color="text.secondary" sx={{ fontSize: 12 }}>{s.description}</Typography>}
                        </Box>

                        <Box textAlign="right">
                          <Typography sx={{ fontWeight: 600 }}>{s.quantity ?? 1} x</Typography>
                          <Typography color="text.secondary" sx={{ fontSize: 12, display: "flex", alignItems: "center", gap: 0.5 }}>
                            <MonetizationOn fontSize="small" sx={{ color: iconColor }} /> {new Intl.NumberFormat("es-PE", { style: "currency", currency: "PEN" }).format(s.unit_price ?? s.price ?? 0)}
                          </Typography>
                          <Typography sx={{ fontWeight: 700, mt: 0.5 }}>
                            {new Intl.NumberFormat("es-PE", { style: "currency", currency: "PEN" }).format((s.unit_price ?? s.price ?? 0) * (s.quantity ?? 1))}
                          </Typography>
                        </Box>
                      </ListItem>
                    ))}
                  </List>
                ) : (
                  <Typography color="text.secondary">No hay servicios registrados en esta versión.</Typography>
                )}
              </Box>
            </Box>
          )}

          {tab === 2 && (
            <Box>
              <Typography color="text.secondary" sx={{ mb: 1, display: "flex", alignItems: "center", gap: 1 }}>
                <Person fontSize="small" sx={{ color: iconColor }} /> Datos del cliente
              </Typography>
              <Divider sx={{ my: 1 }} />
              <Box sx={{ bgcolor: innerBg, p: 2, borderRadius: 2, border: `1px solid ${theme.palette.divider}` }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                  <Person fontSize="small" sx={{ color: iconColor }} />
                  <Box>
                    <Typography variant="body2" color="text.secondary">Nombre</Typography>
                    <Typography sx={{ fontWeight: 700 }}>{version.client || version.client_name || "-"}</Typography>
                  </Box>
                </Box>

                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                  <Phone fontSize="small" sx={{ color: iconColor }} />
                  <Box>
                    <Typography variant="body2" color="text.secondary">Teléfono</Typography>
                    <Typography sx={{ fontWeight: 700 }}>{version.client_phone || version.client_contact || "-"}</Typography>
                  </Box>
                </Box>

                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Email fontSize="small" sx={{ color: iconColor }} />
                  <Box>
                    <Typography variant="body2" color="text.secondary">Email</Typography>
                    <Typography sx={{ fontWeight: 700 }}>{version.client_email || version.email || "-"}</Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
          )}

          {tab === 3 && (
            <Box>
              <Typography color="text.secondary" sx={{ mb: 1, display: "flex", alignItems: "center", gap: 1 }}>
                <CalendarMonth fontSize="small" sx={{ color: iconColor }} /> Información del evento
              </Typography>
              <Divider sx={{ my: 1 }} />
              <Box sx={{ bgcolor: innerBg, p: 2, borderRadius: 2, border: `1px solid ${theme.palette.divider}` }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                  <MonetizationOn fontSize="small" sx={{ color: iconColor }} />
                  <Box>
                    <Typography variant="body2" color="text.secondary">Tipo de Evento</Typography>
                    <Typography sx={{ fontWeight: 700 }}>{version.eventType || version.event_type_name || "-"}</Typography>
                  </Box>
                </Box>

                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                  <CalendarMonth fontSize="small" sx={{ color: iconColor }} />
                  <Box>
                    <Typography variant="body2" color="text.secondary">Fecha</Typography>
                    <Typography sx={{ fontWeight: 700 }}>{version.eventDate ? formatDay(version.eventDate) : "-"}</Typography>
                  </Box>
                </Box>

                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                  <Place fontSize="small" sx={{ color: iconColor }} />
                  <Box>
                    <Typography variant="body2" color="text.secondary">Lugar</Typography>
                    <Typography sx={{ fontWeight: 700 }}>{version.venue || version.place || "-"}</Typography>
                  </Box>
                </Box>

                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Groups fontSize="small" sx={{ color: iconColor }} />
                  <Box>
                    <Typography variant="body2" color="text.secondary">Número de Asistentes</Typography>
                    <Typography sx={{ fontWeight: 700 }}>{version.attendees ? `${version.attendees} personas` : "-"}</Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
          )}
        </Box>
      </Box>
    </Modal>
  );
};

export default EventVersionModal;