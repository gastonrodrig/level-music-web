import { Modal, Box, IconButton } from "@mui/material";
import { Close } from "@mui/icons-material";

export const ImagePreviewModal = ({ open, src, onClose }) => (
  <Modal
    open={open}
    onClose={onClose}
    sx={{ zIndex: 2000 }}
  >
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        bgcolor: "rgba(0,0,0,0.85)",
      }}
    >
      {/* Botón cerrar */}
      <IconButton
        onClick={onClose}
        sx={{
          position: "absolute",
          top: 24,
          right: 24,
          color: "#fff",
          zIndex: 2100,
          background: "rgba(0,0,0,0.3)",
          "&:hover": { background: "rgba(0,0,0,0.5)" },
        }}
      >
        <Close />
      </IconButton>

      {/* Imagen en vista previa */}
      {src && (
        <Box
          component="img"
          src={src}
          alt="Vista previa"
          sx={{
            maxWidth: { xs: "90vw", sm: "80vw" },
            maxHeight: { xs: "70vh", sm: "80vh" },
            borderRadius: 3,
            boxShadow: 6,
            objectFit: "contain",
          }}
        />
      )}
    </Box>
  </Modal>
);
