import { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Paper,
  useTheme,
  IconButton,
  Button,
} from "@mui/material";
import {
  CloudUpload,
  CheckCircle,
  Close,
  InsertDriveFile,
  WarningAmber,
} from "@mui/icons-material";
import { ImagePreviewModal } from "../../../../../../../shared/ui/components/common/image-preview-modal";
import { useFormContext } from "react-hook-form";
import { alpha } from "@mui/material/styles";

export const PaymentFormFields = ({ paymentId, paymentNumber }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [previewModalOpen, setPreviewModalOpen] = useState(false);

  const { register, setValue, watch, formState: { errors }, trigger } = useFormContext();

  const opField = `manualPayments.${paymentNumber - 1}.operationNumber`;
  const voucherField = `manualPayments.${paymentNumber - 1}.voucher`;
  const operationValue = watch(opField) || "";
  const voucherValue = watch(voucherField);
  const opError = !!errors?.manualPayments?.[paymentNumber - 1]?.operationNumber;
  const voucherError = !!errors?.manualPayments?.[paymentNumber - 1]?.voucher;
  const voucherErrorMessage = errors?.manualPayments?.[paymentNumber - 1]?.voucher?.message;

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
      const validTypes = [
        "image/png",
        "image/jpeg",
        "image/jpg",
        "application/pdf",
      ];
      if (!validTypes.includes(file.type)) {
        alert("Solo se permiten archivos PNG, JPG o PDF");
        return;
      }

      setSelectedFile(file);
      // set value in RHF form
      setValue(voucherField, file, { shouldValidate: true, shouldDirty: true });

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
    setValue(voucherField, null, { shouldValidate: true, shouldDirty: true });
  };

  const handleChangeFile = () => {
    document.getElementById(`file-upload-${paymentId}`).click();
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
    <Box>
      {/* Número de Operación */}
      <Box sx={{ mb: 3 }}>
        <Typography
          variant="body2"
          sx={{ color: colors.textPrimary, mb: 1, fontWeight: 600 }}
        >
          Número de Operación *
        </Typography>
        <TextField
          fullWidth
          placeholder="Ej: 123456789"
          size="small"
          {...register(opField, {
            required: "El número de operación es obligatorio",
            pattern: { value: /^[0-9]{8}$/, message: "Formato inválido" },
          })}
          value={operationValue}
          onChange={(e) => {
            setValue(opField, e.target.value, { shouldDirty: true });
          }}
          error={!!errors?.manualPayments?.[paymentNumber - 1]?.operationNumber}
          helperText={
            errors?.manualPayments?.[paymentNumber - 1]?.operationNumber
              ?.message || ""
          }
        />
      </Box>

      {/* Comprobante de Pago */}
      <Box>
        <Typography
          variant="body2"
          sx={{ color: colors.textPrimary, mb: 1, fontWeight: 600 }}
        >
          Comprobante de Pago *
        </Typography>

        {/* register the input and compose onChange so both RHF and local preview run */}
        {(() => {
          const reg = register(voucherField, {
            // validate depending on the selected method for this payment.
            // only require a voucher when the selected method needs proof
            validate: (file) => {
              const method = watch(`manualPayments.${paymentNumber - 1}.method`);
              const needsProof = ["yape", "plin", "transfer"].includes(method);
              if (!needsProof) return true; // no proof needed for this method
              if (!file) return "El comprobante es obligatorio";
              if (!(file && file.type && file.type.startsWith("image/"))) return "Debe ser una imagen (jpg, jpeg, png)";
              return true;
            },
          });
          return (
            <input
              type="file"
              id={`file-upload-${paymentId}`}
              accept="image/png,image/jpeg,image/jpg,application/pdf"
              style={{ display: "none" }}
              {...reg}
              onChange={(e) => {
                // first let RHF process the change
                if (typeof reg.onChange === "function") reg.onChange(e);
                // then run local preview/selectedFile logic
                handleFileChange(e);
              }}
            />
          );
        })()}

        {!selectedFile ? (
          <Paper
            elevation={0}
            component="label"
            htmlFor={`file-upload-${paymentId}`}
            sx={{
              p: 3,
              border: `2px dashed ${voucherError ? alpha("#AB1D33", 0.9) : colors.border}`,
              borderRadius: 2,
              bgcolor: colors.innerCardBg,
              cursor: "pointer",
              transition: "all 0.2s",
              "&:hover": {
                borderColor: voucherError ? "#e7203dff" : colors.borderActive,
              },
              display: "flex",
              alignItems: "center",
              gap: 3,
              position: "relative",
            }}
          >
            {/* Icono a la izquierda */}
            <Box display="flex" alignItems="center" gap={2}>
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
                <Typography
                  variant="body2"
                  sx={{ color: colors.textPrimary, mb: 0.5, fontWeight: 500 }}
                >
                  Sube tu comprobante
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ color: colors.textSecondary, display: "block" }}
                >
                  PNG, JPG, PDF (Máx. 5MB)
                </Typography>
              </Box>
            </Box>
            <Box>
              {voucherError && (
                <Box
                  sx={{
                    position: "absolute",
                    top: 8,
                    right: 8,
                    display: "flex",
                    alignItems: "center",
                    gap: 0.5,
                    color: "#AB1D33",
                  }}
                >
                  <WarningAmber fontSize="small" />
                  <Typography variant="caption">{voucherErrorMessage || 'El comprobante es obligatorio'}</Typography>
                </Box>
              )}
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
                  <InsertDriveFile
                    sx={{ fontSize: 48, color: "#f44336", mb: 1 }}
                  />
                  <Typography
                    variant="caption"
                    sx={{ color: colors.textSecondary }}
                  >
                    Archivo PDF
                  </Typography>
                </Box>
              )}
            </Box>

            {/* Información del archivo */}
            <Box sx={{ textAlign: "center", mb: 2 }}>
              <CheckCircle sx={{ fontSize: 24, color: "#4caf50", mb: 0.5 }} />
              <Typography
                variant="body2"
                sx={{ color: colors.textPrimary, fontWeight: 600, mb: 0.5 }}
              >
                {selectedFile.name}
              </Typography>
              <Typography
                variant="caption"
                sx={{ color: colors.textSecondary }}
              >
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
        {/* Error helper removed — inline mini-alert inside the card handles validation messaging */}
      </Box>

      {/* Modal de vista previa */}
      <ImagePreviewModal
        open={previewModalOpen}
        src={previewUrl}
        onClose={handleClosePreview}
      />
    </Box>
  );
};
