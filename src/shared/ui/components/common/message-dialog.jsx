import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Button,
  Box,
} from "@mui/material";
import { Close } from "@mui/icons-material";

export const MessageDialog = ({
  open,
  onClose,
  onConfirm,
  title = "Confirmar acción",
  message = "¿Estás seguro de que deseas realizar esta acción?",
  confirmText = "Confirmar",
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{ sx: { borderRadius: 4 } }}
    >
      <Box sx={{ p: 3, position: "relative" }}>
        {/* Encabezado */}
        <DialogTitle sx={{ fontWeight: 600, fontSize: 20, mb: 1 }}>
          {title}
          <IconButton
            onClick={onClose}
            sx={{
              position: "absolute",
              top: 16,
              right: 16,
              color: "text.secondary",
            }}
          >
            <Close />
          </IconButton>
        </DialogTitle>

        {/* Contenido */}
        <DialogContent>
          <DialogContentText
            sx={{ fontSize: 16, color: "text.secondary", mb: 2 }}
          >
            {message}
          </DialogContentText>
        </DialogContent>

        {/* Acciones */}
        <DialogActions sx={{ justifyContent: "center", mt: 2 }}>
          <Button
            onClick={onConfirm}
            variant="contained"
            sx={{
              backgroundColor: "#212121",
              color: "#fff",
              textTransform: "none",
              px: 4,
              py: 1.5,
              borderRadius: 2,
              fontWeight: 600,
              "&:hover": {
                backgroundColor: "#333333",
              },
            }}
          >
            {confirmText}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};
