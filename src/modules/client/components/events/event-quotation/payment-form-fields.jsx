import { useState } from "react";
import { Box, Typography, TextField, Paper, useTheme, IconButton, Button } from "@mui/material";
import { CloudUpload, CheckCircle, Close, InsertDriveFile } from "@mui/icons-material";
import { ImagePreviewModal } from "../../../../../shared/ui/components/common/image-preview-modal";

export const PaymentFormFields = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [previewModalOpen, setPreviewModalOpen] = useState(false);

  const colors = {
    innerCardBg: isDark ? "#141414" : "#fcfcfc",
    textPrimary: isDark ? "#fff" : "#000",
    textSecondary: isDark ? "#999" : "#666",
    border: isDark ? "#333" : "#e0e0e0",
    borderActive: theme.palette.primary.main,
    inputBg: isDark ? "#1f1f1f" : "#fafafa",
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validar tamaño (5MB máximo)
      if (file.size > 5 * 1024 * 1024) {
        alert("El archivo no debe superar los 5MB");
        return;
      }

      // Validar tipo de archivo
      const validTypes = ["image/png", "image/jpeg", "image/jpg", "application/pdf"];
      if (!validTypes.includes(file.type)) {
        alert("Solo se permiten archivos PNG, JPG o PDF");
        return;
      }

      setSelectedFile(file);

      // Crear vista previa solo para imágenes
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviewUrl(reader.result);
        };
        reader.readAsDataURL(file);
      } else {
        setPreviewUrl(null);
      }
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
  };

  const handleChangeFile = () => {
    document.getElementById("file-upload").click();
  };

  const handleOpenPreview = () => {
    if (previewUrl) {
      setPreviewModalOpen(true);
    }
  };

  const handleClosePreview = () => {
    setPreviewModalOpen(false);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  return (
    <Box sx={{ p: 1 }}>
      {/* Número de Operación */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="body2" sx={{ color: colors.textPrimary, mb: 1 }}>
          Número de Operación / Transacción *
        </Typography>
        <TextField
          fullWidth
          placeholder="Ej: 12345789"
          sx={{
            "& .MuiOutlinedInput-root": {
              bgcolor: colors.inputBg,
              color: colors.textPrimary,
              height: 60,
              "& fieldset": { borderColor: colors.border },
              "&:hover fieldset": { borderColor: colors.borderActive },
              "&.Mui-focused fieldset": { borderColor: colors.borderActive },
            },
            "& .MuiInputBase-input::placeholder": {
              color: colors.textSecondary,
              opacity: 1,
            },
          }}
        />
      </Box>

      {/* Comprobante de Pago */}
      <Box>
        <Typography variant="body2" sx={{ color: colors.textPrimary, mb: 1 }}>
          Comprobante de Pago *
        </Typography>

        <input
          type="file"
          id="file-upload"
          accept="image/png,image/jpeg,image/jpg,application/pdf"
          style={{ display: "none" }}
          onChange={handleFileChange}
        />

        {!selectedFile ? (
          <Paper
            elevation={0}
            component="label"
            htmlFor="file-upload"
            sx={{
              p: 3,
              border: `2px dashed ${colors.border}`,
              borderRadius: 2,
              bgcolor: colors.innerCardBg,
              cursor: "pointer",
              transition: "all 0.2s",
              "&:hover": { borderColor: colors.borderActive },
              display: "flex",
              alignItems: "center",
              gap: 3,
            }}
          >
            {/* Icono a la izquierda */}
            <Box
              sx={{
                bgcolor: isDark ? "#2d2d2d" : "#e0e0e0",
                borderRadius: 2,
                p: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <CloudUpload sx={{ fontSize: 40, color: colors.textSecondary }} />
            </Box>

            {/* Texto a la derecha */}
            <Box sx={{ flex: 1, textAlign: "left" }}>
              <Typography variant="body2" sx={{ color: colors.textPrimary, mb: 0.5, fontWeight: 500 }}>
                Sube tu comprobante
              </Typography>
              <Typography variant="caption" sx={{ color: colors.textSecondary, display: "block" }}>
                PNG, JPG, PDF (Máx. 5MB)
              </Typography>
              <Typography variant="caption" sx={{ color: colors.textSecondary, display: "block", mt: 0.5 }}>
                Haz clic para seleccionar una imagen
              </Typography>
            </Box>
          </Paper>
        ) : (
          <Paper
            elevation={0}
            sx={{
              p: 3,
              border: `1px solid ${colors.border}`,
              borderRadius: 2,
              bgcolor: colors.innerCardBg,
              position: "relative",
            }}
          >
            {/* Vista previa o icono */}
            <Box sx={{ position: "relative", textAlign: "center", mb: 2 }}>
              {previewUrl ? (
                <Box sx={{ position: "relative", display: "inline-block" }}>
                  <Box
                    component="img"
                    src={previewUrl}
                    alt="Preview"
                    onClick={handleOpenPreview}
                    sx={{
                      maxWidth: "100%",
                      maxHeight: 200,
                      borderRadius: 2,
                      objectFit: "contain",
                      cursor: "pointer",
                      border: `1px solid ${colors.border}`,
                      transition: "transform 0.2s ease",
                      "&:hover": {
                        transform: "scale(1.02)",
                      },
                    }}
                  />
                  {/* Botón para eliminar imagen */}
                  <IconButton
                    size="small"
                    onClick={handleRemoveFile}
                    sx={{
                      position: "absolute",
                      top: 8,
                      right: 8,
                      bgcolor: "rgba(0,0,0,0.5)",
                      "&:hover": { bgcolor: "rgba(0,0,0,0.7)" },
                    }}
                  >
                    <Close fontSize="small" sx={{ color: "#fff" }} />
                  </IconButton>
                </Box>
              ) : (
                <Box>
                  <InsertDriveFile sx={{ fontSize: 48, color: "#f44336", mb: 1 }} />
                  <Typography variant="caption" sx={{ color: colors.textSecondary }}>
                    Archivo PDF
                  </Typography>
                </Box>
              )}
            </Box>

            {/* Información del archivo */}
            <Box sx={{ textAlign: "center", mb: 2 }}>
              <CheckCircle sx={{ fontSize: 24, color: "#4caf50", mb: 0.5 }} />
              <Typography variant="body2" sx={{ color: colors.textPrimary, fontWeight: 600, mb: 0.5 }}>
                {selectedFile.name}
              </Typography>
              <Typography variant="caption" sx={{ color: colors.textSecondary }}>
                {formatFileSize(selectedFile.size)}
              </Typography>
            </Box>

            {/* Botón para cambiar */}
            <Button
              fullWidth
              variant="outlined"
              onClick={handleChangeFile}
              sx={{
                borderColor: colors.border,
                color: colors.textPrimary,
                textTransform: "none",
                fontWeight: 600,
                "&:hover": {
                  borderColor: colors.borderActive,
                  bgcolor: isDark ? "#2d2d2d" : "#f5f5f5",
                },
              }}
            >
              Cambiar archivo
            </Button>
          </Paper>
        )}
      </Box>

      {/* Modal de vista previa */}
      <ImagePreviewModal open={previewModalOpen} src={previewUrl} onClose={handleClosePreview} />
    </Box>
  );
};