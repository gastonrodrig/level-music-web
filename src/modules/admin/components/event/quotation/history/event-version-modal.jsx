import React, { useEffect, useState } from "react";
import {
  Modal,
  Box,
  IconButton,
  Tabs,
  Tab,
  Typography,
  useTheme,
} from "@mui/material";
import {
  Close,
  Build,
  Person,
  CalendarMonth
} from "@mui/icons-material";
import { EventHistoryTab0, EventHistoryTab1, EventHistoryTab2 } from "./tabs";

export const EventVersionModal = ({ open, onClose, version = {}, client }) => {
  const theme = useTheme();
  const [tab, setTab] = useState(0);

  useEffect(() => {
    if (!open) setTab(0);
  }, [open]);

  return (
    <Modal open={!!open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: { xs: "92%", sm: 550 },
          bgcolor: "background.paper",
          color: "text.primary",
          borderRadius: 4,
          boxShadow: 24,
          p: 3.5,
          outline: "none",
        }}
      >
        {/* header */}
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          mb={2}
        >
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Detalles de Versión {version?.version}
          </Typography>
          <IconButton size="small" onClick={onClose}>
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
              bgcolor: theme.palette.action.selected,
              borderRadius: 3,
              px: 1,
              "& .MuiTab-root": {
                textTransform: "none",
                minHeight: 40,
                borderRadius: 2,
              },
              "& .Mui-selected": { fontWeight: 700 },
            }}
          >
            <Tab
              label={
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Build fontSize="small" />
                  Recursos
                </Box>
              }
            />
            <Tab
              label={
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Person fontSize="small" />
                  Cliente
                </Box>
              }
            />
            <Tab
              label={
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <CalendarMonth fontSize="small" />
                  Evento
                </Box>
              }
            />
          </Tabs>
        </Box>

        {/* content */}
        <Box>
          {tab === 0 && <EventHistoryTab0 version={version} />}

          {tab === 1 && <EventHistoryTab1 version={version} />}

          {tab === 2 && <EventHistoryTab2 version={version} />}
        </Box>
      </Box>
    </Modal>
  );
};
