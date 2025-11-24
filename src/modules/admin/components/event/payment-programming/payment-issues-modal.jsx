import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  Button,
  Checkbox,
  FormControl,
  Select,
  MenuItem,
  TextField,
  Avatar,
  Chip,
  useTheme,
  IconButton,
  Divider,
  Alert,
} from "@mui/material";
import { Close, Send, Warning, Image, AccountBalance } from "@mui/icons-material";
import dayjs from "dayjs";
import { ImagePreviewModal } from "../../../../../shared/ui/components/common";

const formatCurrency = (v) => `S/ ${Number(v || 0).toLocaleString("es-PE", { minimumFractionDigits: 2 })}`;

const issueCategories = [
  { value: "amount_incorrect", label: "Monto incorrecto" },
  { value: "voucher_illegible", label: "Comprobante ilegible" },
  { value: "operation_mismatch", label: "Número de operación no coincide" },
  { value: "payment_method_incorrect", label: "Método de pago incorrecto" },
  { value: "date_incorrect", label: "Fecha incorrecta" },
  { value: "duplicate_payment", label: "Pago duplicado" },
  { value: "other", label: "Otro" },
];

export const PaymentIssuesModal = ({ open, onClose, payments, onSubmit }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  const [selectedPayments, setSelectedPayments] = useState({});
  const [validationError, setValidationError] = useState("");
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewSrc, setPreviewSrc] = useState(null);

  const colors = {
    cardBg: isDark ? "#1F1E1E" : "#ffffff",
    border: isDark ? "#333" : "#e0e0e0",
    selectedBorder: "#ff9800",
    selectedBg: isDark ? "#2d2100" : "#fff8e1",
  };

  const getMethodMeta = (method) => {
    const key = (method || "").toString().toLowerCase();
    if (key.includes("yape")) return { color: "#9c27b0", logo: "https://i.postimg.cc/MHYc1qSn/YAPE.jpg", label: "YAPE" };
    if (key.includes("plin")) return { color: "#2196f3", logo: "https://i.postimg.cc/NG8237Hf/logo-plin.jpg", label: "PLIN" };
    if (key.includes("transfer") || key.includes("trans")) return { color: "#607d8b", icon: <AccountBalance sx={{ fontSize: 14 }} />, label: "TRANSFERENCIA" };
    return { color: theme.palette.info?.main || theme.palette.success.main, label: (method || "-").toString().toUpperCase() };
  };

  const openPreview = (src) => {
    setPreviewSrc(src);
    setPreviewOpen(true);
  };

  const closePreview = () => {
    setPreviewOpen(false);
    setPreviewSrc(null);
  };

  const handleCheckboxChange = (paymentId) => {
    setValidationError("");
    setSelectedPayments((prev) => {
      const newSelected = { ...prev };
      if (newSelected[paymentId]) {
        delete newSelected[paymentId];
      } else {
        newSelected[paymentId] = {
          category: "",
          comments: "",
        };
      }
      return newSelected;
    });
  };

  const handleCategoryChange = (paymentId, category) => {
    setSelectedPayments((prev) => ({
      ...prev,
      [paymentId]: {
        ...prev[paymentId],
        category,
      },
    }));
  };

  const handleCommentsChange = (paymentId, comments) => {
    setSelectedPayments((prev) => ({
      ...prev,
      [paymentId]: {
        ...prev[paymentId],
        comments,
      },
    }));
  };

  const handleSubmit = () => {
    const selectedIds = Object.keys(selectedPayments);
    
    if (selectedIds.length === 0) {
      setValidationError("Debe seleccionar al menos un pago para reportar");
      return;
    }

    // Validar que todos los pagos seleccionados tengan categoría
    const missingCategory = selectedIds.some((id) => !selectedPayments[id].category);
    if (missingCategory) {
      setValidationError("Todos los pagos seleccionados deben tener una categoría de problema");
      return;
    }

    const issuesData = selectedIds.map((paymentId) => ({
      payment_id: paymentId,
      category: selectedPayments[paymentId].category,
      comments: selectedPayments[paymentId].comments,
    }));

    onSubmit(issuesData);
    handleClose();
  };

  const handleClose = () => {
    setSelectedPayments({});
    setValidationError("");
    onClose();
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="md"
        fullWidth
        fullScreen={false}
        PaperProps={{
          sx: {
            borderRadius: 3,
            maxHeight: "90vh",
            bgcolor: isDark ? "#141414" : "#ffffff",
            backgroundImage: "none",
          },
        }}
      >
        <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", pb: 1 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Warning sx={{ color: theme.palette.warning.main }} />
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Informar Desconformidades en Pagos
            </Typography>
          </Box>
          <IconButton onClick={handleClose} size="small">
            <Close />
          </IconButton>
        </DialogTitle>

        <Divider />

        <DialogContent sx={{ pt: 2 }}>
          <Alert severity="info" sx={{ mb: 3, borderRadius: 2 }}>
            Seleccione los pagos con problemas, indique el tipo de inconveniente y agregue comentarios adicionales si es necesario.
          </Alert>

          {validationError && (
            <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
              {validationError}
            </Alert>
          )}

          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {payments.map((payment) => {
              const isSelected = !!selectedPayments[payment._id];
              const meta = getMethodMeta(payment.payment_method);

              return (
                <Box
                  key={payment._id}
                  sx={{
                    border: `2px solid ${isSelected ? colors.selectedBorder : colors.border}`,
                    borderRadius: 2,
                    p: 2,
                    bgcolor: isSelected ? colors.selectedBg : colors.cardBg,
                    transition: "all 0.3s ease",
                  }}
                >
                  <Box sx={{ display: "flex", gap: 2, alignItems: "flex-start" }}>
                    <Checkbox
                      checked={isSelected}
                      onChange={() => handleCheckboxChange(payment._id)}
                      sx={{
                        color: theme.palette.warning.main,
                        "&.Mui-checked": {
                          color: theme.palette.warning.main,
                        },
                      }}
                    />

                    <Box
                      onClick={() => payment.voucher_url && openPreview(payment.voucher_url)}
                      sx={{
                        cursor: payment.voucher_url ? "pointer" : "default",
                        transition: "transform 0.2s",
                        "&:hover": payment.voucher_url ? {
                          transform: "scale(1.05)",
                        } : {},
                      }}
                    >
                      <Avatar
                        variant="rounded"
                        src={payment.voucher_url}
                        sx={{
                          width: 60,
                          height: 60,
                          border: `1px solid ${colors.border}`,
                        }}
                      >
                        <Image />
                      </Avatar>
                      {payment.voucher_url && (
                        <Typography sx={{ fontSize: 10, color: "text.secondary", textAlign: "center", mt: 0.5 }}>
                          Click para ver
                        </Typography>
                      )}
                    </Box>

                    <Box sx={{ flex: 1 }}>
                      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 1, flexWrap: "wrap", gap: 1 }}>
                        <Box>
                          <Typography sx={{ fontSize: 18, fontWeight: 700 }}>
                            {formatCurrency(payment.amount)}
                          </Typography>
                          <Typography sx={{ fontSize: 12, color: "text.secondary" }}>
                            Op: {payment.operation_number || "—"}
                          </Typography>
                        </Box>

                        <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                          <Chip
                            avatar={
                              meta.logo ? (
                                <Avatar src={meta.logo} sx={{ width: 18, height: 18 }} />
                              ) : meta.icon ? (
                                <Avatar sx={{ width: 18, height: 18 }}>{meta.icon}</Avatar>
                              ) : (
                                <Avatar sx={{ width: 18, height: 18, bgcolor: meta.color }}>
                                  {meta.label.charAt(0)}
                                </Avatar>
                              )
                            }
                            label={meta.label}
                            size="small"
                            sx={{
                              fontWeight: 700,
                              bgcolor: meta.color,
                              color: theme.palette.getContrastText(meta.color),
                            }}
                          />
                          <Typography sx={{ fontSize: 12, color: "text.secondary" }}>
                            {payment.created_at ? dayjs(payment.created_at).format("DD/MM/YYYY") : "—"}
                          </Typography>
                        </Box>
                      </Box>

                      {isSelected && (
                        <Box sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 2 }}>
                          <FormControl fullWidth size="small">
                            <Select
                              value={selectedPayments[payment._id]?.category || ""}
                              onChange={(e) => handleCategoryChange(payment._id, e.target.value)}
                              displayEmpty
                              sx={{ borderRadius: 2 }}
                            >
                              <MenuItem value="" disabled>
                                Seleccione el tipo de problema
                              </MenuItem>
                              {issueCategories.map((cat) => (
                                <MenuItem key={cat.value} value={cat.value}>
                                  {cat.label}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>

                          <TextField
                            fullWidth
                            multiline
                            rows={2}
                            placeholder="Comentarios adicionales (opcional)"
                            value={selectedPayments[payment._id]?.comments || ""}
                            onChange={(e) => handleCommentsChange(payment._id, e.target.value)}
                            size="small"
                            sx={{
                              "& .MuiOutlinedInput-root": {
                                borderRadius: 2,
                              },
                            }}
                          />
                        </Box>
                      )}
                    </Box>
                  </Box>
                </Box>
              );
            })}
          </Box>
        </DialogContent>

        <Divider />

        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button
            onClick={handleClose}
            variant="outlined"
            sx={{
              textTransform: "none",
              borderRadius: 2,
              fontWeight: 600,
            }}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            startIcon={<Send />}
            sx={{
              textTransform: "none",
              borderRadius: 2,
              fontWeight: 600,
              bgcolor: theme.palette.warning.main,
              color: theme.palette.getContrastText(theme.palette.warning.main),
              "&:hover": {
                bgcolor: theme.palette.warning.dark || theme.palette.warning.main,
              },
            }}
          >
            Enviar Reporte al Cliente
          </Button>
        </DialogActions>
      </Dialog>

      <ImagePreviewModal open={previewOpen} src={previewSrc} onClose={closePreview} />
    </>
  );
};