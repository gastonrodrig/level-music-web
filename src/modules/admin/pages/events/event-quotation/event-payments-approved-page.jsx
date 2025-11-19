import React from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Avatar,
  Chip,
  Button,
  Divider,
  useTheme,
} from "@mui/material";
import { CheckCircleOutline, Close, Image, AccountBalance } from "@mui/icons-material";
import { useScreenSizes } from "../../../../../shared/constants/screen-width";
import { useQuotationStore, usePaymentStore } from "../../../../../hooks";
import { useDispatch } from "react-redux";
import { showSnackbar } from "../../../../../store";
import dayjs from "dayjs";
import { ImagePreviewModal } from "../../../../../shared/ui/components/common";
import { EventInfoCard } from "../../../components";

const formatCurrency = (v) => `S/ ${Number(v || 0).toLocaleString("es-PE", { minimumFractionDigits: 2 })}`;

export const EventPaymentsApprovedPage = () => {
  const { isMd } = useScreenSizes();
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  // colores alineados con PaymentManualCard / PaymentManualContent
  const colors = {
    cardBg: isDark ? "#141414" : "#FAF9FA",
    innerCardBg: isDark ? "#141414" : "#fcfcfc",
    textPrimary: theme.palette.text.primary,
    textSecondary: theme.palette.text.secondary,
    border: isDark ? "#333" : "#e0e0e0",
  };

  // color same as EventInfoCard's background
  const smallBoxBg = isDark ? "#1f1e1e" : "#f5f5f5";

  const getMethodColor = (method) => {
    const key = (method || "").toString().toLowerCase();
    if (key.includes("yape")) return "#9c27b0";
    if (key.includes("plin")) return "#2196f3";
    if (key.includes("transfer") || key.includes("trans")) return "#607d8b";
    return theme.palette.info?.main || theme.palette.success.main;
  };

  const getMethodMeta = (method) => {
    const key = (method || "").toString().toLowerCase();
    if (key.includes("yape")) return { color: "#9c27b0", logo: "https://i.postimg.cc/MHYc1qSn/YAPE.jpg", label: "YAPE" };
    if (key.includes("plin")) return { color: "#2196f3", logo: "https://i.postimg.cc/NG8237Hf/logo-plin.jpg", label: "PLIN" };
    if (key.includes("transfer") || key.includes("trans")) return { color: "#607d8b", icon: <AccountBalance sx={{ fontSize: 14 }} />, label: "TRANSFERENCIA" };
    return { color: theme.palette.info?.main || theme.palette.success.main, label: (method || "-").toString().toUpperCase() };
  };

  const { selected } = useQuotationStore();
  const { payments, setSelectedPayment } = usePaymentStore();
  const dispatch = useDispatch();

  const eventPayments = (payments || []).filter((p) => !selected || String(p.event) === String(selected?._id) || p.event === selected?._id);

  // fallback de ejemplo para maquetación
  const sampleImages = [
    "https://i.postimg.cc/hGTGDXn1/Whats-App-Image-2025-10-14-at-5-41-43-PM.jpg",
    "https://i.postimg.cc/tRMGcXQY/yapecito.jpg",
  ];

  const samplePayments = [
    { _id: "p1", amount: 50, operation_number: "000123456", payment_method: "YAPE", created_at: dayjs().subtract(2, "day").toISOString(), voucher_url: sampleImages[0], payment_type: "PARCIAL", status: "PENDIENTE" },
    { _id: "p2", amount: 500, operation_number: "202511100045678", payment_method: "TRANSFERENCIA", created_at: dayjs().subtract(1, "day").toISOString(), voucher_url: sampleImages[1], payment_type: "PARCIAL", status: "PENDIENTE" },
  ];

  const displayedPayments = eventPayments.length ? eventPayments : samplePayments;

  const [previewOpen, setPreviewOpen] = React.useState(false);
  const [previewSrc, setPreviewSrc] = React.useState(null);

  const openPreview = (src) => {
    setPreviewSrc(src);
    setPreviewOpen(true);
  };
  const closePreview = () => {
    setPreviewOpen(false);
    setPreviewSrc(null);
  };

  const totalCount = displayedPayments.length;
  const pendingCount = displayedPayments.filter((p) => String(p.status).toLowerCase().includes("pend")).length;
  const totalAmount = displayedPayments.reduce((s, p) => s + (Number(p.amount) || 0), 0);
  const pendingAmount = displayedPayments.filter((p) => String(p.status).toLowerCase().includes("pend")).reduce((s, p) => s + (Number(p.amount) || 0), 0);

  const handleApprove = (payment) => {
    setSelectedPayment(payment);
    dispatch(showSnackbar({ message: "Pago aprobado" }));
  };

  const handleReject = (payment) => {
    setSelectedPayment(payment);
    dispatch(showSnackbar({ message: "Pago rechazado" }));
  };

  const getClientName = () => {
    if (!selected) return "—";
    if (selected?.client_type === "Persona") return `${selected?.first_name || ""} ${selected?.last_name || ""}`.trim() || "—";
    return selected?.company_name || selected?.client_name || "—";
  };

  return (
    <Box sx={{ px: isMd ? 4 : 0, pt: 2, maxWidth: 1200, margin: "0 auto" }}>
      <Typography variant="h4" sx={{ mb: 1, fontWeight: 700, color: colors.textPrimary }}>Aprobar Pagos del Evento</Typography>

      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, alignItems: { xs: "flex-start", sm: "center" }, gap: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: 150, color: colors.textPrimary }}>
            {selected?.name || "Los Jojitas 2010 Promocion"}
          </Typography>
          <Typography variant="h6" sx={{ fontWeight: 150, color: colors.textSecondary }}>- {selected?.event_code || "EVT-20251122-9T5FBN"}</Typography>
        </Box>
        <Box sx={{ mt: 2 }}>
          <EventInfoCard selected={selected} />
        </Box>
      </Box>

      <Card elevation={0} sx={{ mb: 3, borderRadius: 3, bgcolor: colors.cardBg, border: `1px solid ${colors.border}` }}>
        <CardContent sx={{ p: 2.5 }}>
          <Typography variant="h6" sx={{ mb: 1 }}>Resumen de Pagos</Typography>
          <Box sx={{ display: "flex", gap: 2, alignItems: "center", justifyContent: "space-between", flexDirection: { xs: "column", sm: "row" } }}>
              <Box sx={{ flex: 1, p: 1.5, borderRadius: 2, bgcolor: smallBoxBg, border: `1px solid ${colors.border}`, width: { xs: "100%", sm: "auto" }, mb: { xs: 1.5, sm: 0 } }}>
              <Typography fontSize={12} sx={{ color: colors.textSecondary }}>Total Pagos</Typography>
              <Typography variant="h5" sx={{ fontWeight: 700, color: colors.textPrimary }}>{totalCount}</Typography>
            </Box>
              <Box sx={{ flex: 1, p: 1.5, borderRadius: 2, bgcolor: smallBoxBg, border: `1px solid ${colors.border}`, width: { xs: "100%", sm: "auto" }, mb: { xs: 1.5, sm: 0 } }}>
              <Typography fontSize={12} sx={{ color: colors.textSecondary }}>Pagos Pendientes</Typography>
              <Typography variant="h5" sx={{ fontWeight: 700, color: colors.textPrimary }}>{pendingCount}</Typography>
            </Box>
              <Box sx={{ flex: 1, p: 1.5, borderRadius: 2, bgcolor: smallBoxBg, border: `1px solid ${colors.border}`, width: { xs: "100%", sm: "auto" }, mb: { xs: 1.5, sm: 0 } }}>
              <Typography fontSize={12} sx={{ color: colors.textSecondary }}>Monto Total</Typography>
              <Typography variant="h5" sx={{ fontWeight: 700, color: colors.textPrimary }}>{formatCurrency(totalAmount)}</Typography>
            </Box>
              <Box sx={{ flex: 1, p: 1.5, borderRadius: 2, bgcolor: smallBoxBg, border: `1px solid ${colors.border}`, width: { xs: "100%", sm: "auto" }, mb: { xs: 1.5, sm: 0 } }}>
              <Typography fontSize={12} sx={{ color: colors.textSecondary }}>Monto Pendiente</Typography>
              <Typography variant="h5" sx={{ fontWeight: 700, color: colors.textPrimary }}>{formatCurrency(pendingAmount)}</Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>

      <Box>
        {displayedPayments.map((p, i) => (
          <Card key={p._id || i} elevation={0} sx={{ mb: 2, borderRadius: 2, bgcolor: colors.cardBg, border: `1px solid ${colors.border}`, borderLeft: `6px solid ${theme.palette.primary.main}` }}>
            <CardContent sx={{ display: "flex", gap: 2, alignItems: "center", flexDirection: { xs: "column", sm: "row" } }}>
                <Box sx={{ width: { xs: "100%", sm: 120 }, textAlign: { xs: "center", sm: "left" }, cursor: p.voucher_url ? "pointer" : "default" }} onClick={() => p.voucher_url && openPreview(p.voucher_url)}>
                  <Avatar variant="rounded" src={p.voucher_url} sx={{ width: { xs: 140, sm: 90 }, height: { xs: 140, sm: 90 }, mb: 1, boxShadow: 3, border: `1px solid ${colors.border}`, backgroundColor: isDark ? "#141414" : "#fff", margin: { xs: '0 auto', sm: 0 } }}>
                    <Image />
                  </Avatar>
                  <Typography sx={{ fontSize: 12, color: "text.secondary", mt: 1 }}>{p.voucher_url ? "Click para ampliar" : "—"}</Typography>
                </Box>

                <Box sx={{ flex: 1, display: "flex", flexDirection: "column", width: "100%" }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <Box>
                    <Typography sx={{ fontSize: 13, color: "text.secondary" }}>Monto</Typography>
                    <Typography sx={{ fontSize: 20, fontWeight: 700 }}>{formatCurrency(p.amount)}</Typography>
                    <Typography sx={{ fontSize: 12, color: "text.secondary", mt: 0.5 }}>N° de Operación</Typography>
                    <Typography sx={{ fontSize: 12 }}>{p.operation_number || "—"}</Typography>
                  </Box>

                  <Box sx={{ textAlign: "right" }}>
                    <Typography sx={{ fontSize: 13, color: "text.secondary" }}>Método de Pago</Typography>
                    {(() => {
                      const meta = getMethodMeta(p.payment_method);
                      return (
                        <Chip
                          avatar={meta.logo ? <Avatar src={meta.logo} sx={{ width: 18, height: 18 }} /> : meta.icon ? <Avatar sx={{ width: 18, height: 18 }}>{meta.icon}</Avatar> : <Avatar sx={{ width: 18, height: 18, bgcolor: meta.color }}>{meta.label.charAt(0)}</Avatar>}
                          label={meta.label}
                          size="small"
                          sx={{ mt: 1, px: 1.2, fontWeight: 700, bgcolor: meta.color, color: theme.palette.getContrastText(meta.color), borderRadius: 2 }}
                        />
                      );
                    })()}

                    <Typography sx={{ fontSize: 13, color: "text.secondary", mt: 2 }}>Fecha del Pago</Typography>
                    <Typography sx={{ fontSize: 13 }}>{p.created_at ? dayjs(p.created_at).format("DD/MM/YYYY HH:mm") : "—"}</Typography>
                  </Box>

                  <Box sx={{ width: 180, textAlign: "right" }}>
                    <Typography sx={{ fontSize: 13, color: "text.secondary" }}>Tipo de Pago</Typography>
                    <Chip label={(p.payment_type || "-").toString()} size="small" sx={{ mt: 1, px: 1.2, fontWeight: 700, bgcolor: theme.palette.primary.main, color: theme.palette.getContrastText(theme.palette.primary.main), borderRadius: 2 }} />

                    <Typography sx={{ fontSize: 13, color: "text.secondary", mt: 2 }}>Estado</Typography>
                    <Chip label={(p.status || "-").toString()} size="small" sx={{ mt: 1, px: 1.2, fontWeight: 700, bgcolor: p.status && p.status.toLowerCase().includes("pend") ? theme.palette.primary.main : theme.palette.success?.main, color: theme.palette.getContrastText(p.status && p.status.toLowerCase().includes("pend") ? theme.palette.primary.main : theme.palette.success?.main), borderRadius: 2 }} />
                  </Box>
                </Box>

                <Divider sx={{ mt: 4, mb: 2, borderColor: colors.border }} />

                <Box sx={{ mt: 2, display: "flex", gap: 1, flexDirection: { xs: "column", sm: "row" } }}>
                  <Button
                    variant="contained"
                    onClick={() => handleApprove(p)}
                    startIcon={<CheckCircleOutline />}
                    sx={{
                      py: 1.05,
                      boxShadow: "none",
                      textTransform: "none",
                      fontWeight: 600,
                      fontSize: 14,
                      borderRadius: 2,
                      color: theme.palette.getContrastText(theme.palette.primary.main),
                      backgroundColor: theme.palette.primary.main,
                      "&:hover": { backgroundColor: theme.palette.primary.dark || theme.palette.primary.main },
                      width: { xs: "100%", sm: "auto" },
                    }}
                  >
                    Aprobar Pago
                  </Button>

                  <Button
                    variant="contained"
                    onClick={() => handleReject(p)}
                    startIcon={<Close />}
                    sx={{
                      py: 1.05,
                      textTransform: "none",
                      fontWeight: 600,
                      fontSize: 14,
                      borderRadius: 2,
                      color: theme.palette.getContrastText(theme.palette.error.main),
                      backgroundColor: theme.palette.error.main,
                      "&:hover": { backgroundColor: theme.palette.error.dark || theme.palette.error.main },
                      width: { xs: "100%", sm: "auto" },
                    }}
                  >
                    Rechazar Pago
                  </Button>
                </Box>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>

      <ImagePreviewModal open={previewOpen} src={previewSrc} onClose={closePreview} />
    </Box>
  );
};

export default EventPaymentsApprovedPage;
