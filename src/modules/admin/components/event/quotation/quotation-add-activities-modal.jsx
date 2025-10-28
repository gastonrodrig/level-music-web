import React, { useState } from "react";
import { Modal, Box, Typography, TextField, Button, Stack, IconButton, useTheme } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";


export const QuotationAddActivityModal = ({
  open,
  onClose,
  onAdd,
  loading = false,
}) => {
  const [activityName, setActivityName] = useState("");
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const handleAdd = () => {
    if (activityName.trim()) {
      onAdd(activityName.trim());
      setActivityName("");
    }
  };
  
  const handleClose = () => {
    setActivityName("");
    onClose();
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        sx={{
          backgroundColor: isDark ? '#2c2b2b' : '#fff',
          p: 3,
          borderRadius: 2,
          minWidth: 400,
          maxWidth: 450,
          mx: "auto",
          my: "10%",
          boxShadow: 24,
          position: "relative",
        }}
      >
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
        <Typography variant="h6" sx={{ mb: 1 }}>
          Agregar Nueva Actividad
        </Typography>
        <Typography sx={{ mb: 2, color: "text.secondary" }}>
          Crea una actividad personalizada para este evento. Esta actividad no viene de la plantilla.
        </Typography>
        <TextField
          fullWidth
          label="Nombre de la actividad"
          placeholder="Ej: Coordinar transporte VIP"
          value={activityName}
          onChange={e => setActivityName(e.target.value)}
          sx={{ mb: 3 }}
        />
        <Stack direction="row" spacing={2} justifyContent="flex-end">
            <Button
            variant="contained"
            color="primary"
            disabled={!activityName.trim() || loading}
            onClick={handleAdd}
            sx={{backgroundColor: '#212121', color: '#fff', borderRadius: 2, textTransform: 'none', px: 3, py: 1.5 }}
          >
            Agregar Actividad
          </Button>
        </Stack>
      </Box>
    </Modal>
  );
};