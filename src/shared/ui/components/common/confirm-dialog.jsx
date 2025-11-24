import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  useTheme,
} from "@mui/material";
import { Warning, CheckCircle } from "@mui/icons-material";

export const ConfirmDialog = ({
  open,
  onClose,
  onConfirm,
  title = "Confirmar acción",
  message = "¿Está seguro de realizar esta acción?",
  confirmText = "Aceptar",
  cancelText = "Cancelar",
  type = "warning", // 'warning' | 'success' | 'error' | 'info'
  confirmColor = "primary",
}) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  const getIcon = () => {
    switch (type) {
      case "success":
        return <CheckCircle sx={{ fontSize: 48, color: theme.palette.success.main }} />;
      case "error":
        return <Warning sx={{ fontSize: 48, color: theme.palette.error.main }} />;
      case "warning":
        return <Warning sx={{ fontSize: 48, color: theme.palette.warning.main }} />;
      default:
        return <Warning sx={{ fontSize: 48, color: theme.palette.info.main }} />;
    }
  };

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          bgcolor: isDark ? "#141414" : "#ffffff",
          backgroundImage: "none",
        },
      }}
    >
      <DialogTitle sx={{ textAlign: "center", pt: 3, pb: 1 }}>
        <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
          {getIcon()}
        </Box>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          {title}
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ textAlign: "center", px: 3, pb: 2 }}>
        <Typography variant="body1" sx={{ color: "text.secondary" }}>
          {message}
        </Typography>
      </DialogContent>

      <DialogActions sx={{ justifyContent: "center", gap: 1, px: 3, pb: 3 }}>
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{
            textTransform: "none",
            fontWeight: 600,
            borderRadius: 2,
            px: 3,
            borderColor: isDark ? "#333" : "#e0e0e0",
            color: theme.palette.text.secondary,
            "&:hover": {
              borderColor: isDark ? "#444" : "#d0d0d0",
              bgcolor: isDark ? "#252525" : "#f5f5f5",
            },
          }}
        >
          {cancelText}
        </Button>
        <Button
          onClick={handleConfirm}
          variant="contained"
          color={confirmColor}
          sx={{
            textTransform: "none",
            fontWeight: 600,
            borderRadius: 2,
            px: 3,
            boxShadow: "none",
            "&:hover": {
              boxShadow: "none",
            },
          }}
        >
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};