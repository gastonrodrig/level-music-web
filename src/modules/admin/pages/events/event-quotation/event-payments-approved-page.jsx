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
import { CheckCircleOutline, Warning, Image, AccountBalance, ArrowBack } from "@mui/icons-material";
import { useScreenSizes } from "../../../../../shared/constants/screen-width";
import { useQuotationStore, usePaymentStore } from "../../../../../hooks";
import { useDispatch } from "react-redux";
import { showSnackbar } from "../../../../../store";
import dayjs from "dayjs";
import { ImagePreviewModal, ConfirmDialog } from "../../../../../shared/ui/components/common";
import { EventInfoCard } from "../../../components";
import { PaymentIssuesModal } from "../../../components/event/payment-programming/payment-issues-modal";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const formatCurrency = (v) => `S/ ${Number(v || 0).toLocaleString("es-PE", { minimumFractionDigits: 2 })}`;

export const EventPaymentsApprovedPage = () => {
  const { isMd } = useScreenSizes();
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const navigate = useNavigate();

  const colors = {
    cardBg: isDark ? "#141414" : "#FAF9FA",
    innerCardBg: isDark ? "#141414" : "#fcfcfc",
    textPrimary: theme.palette.text.primary,
    textSecondary: theme.palette.text.secondary,
    border: isDark ? "#333" : "#e0e0e0",
  };

  const smallBoxBg = isDark ? "#1f1e1e" : "#f5f5f5";

  const getMethodMeta = (method) => {
    const key = (method || "").toString().toLowerCase();
    if (key.includes("yape")) return { color: "#9c27b0", logo: "https://i.postimg.cc/MHYc1qSn/YAPE.jpg", label: "YAPE" };
    if (key.includes("plin")) return { color: "#2196f3", logo: "https://i.postimg.cc/NG8237Hf/logo-plin.jpg", label: "PLIN" };
    if (key.includes("transfer") || key.includes("trans")) return { color: "#607d8b", icon: <AccountBalance sx={{ fontSize: 14 }} />, label: "TRANSFERENCIA" };
    return { color: theme.palette.info?.main || theme.palette.success.main, label: (method || "-").toString().toUpperCase() };
  };

  const { selected } = useQuotationStore();
  const { payments, loading, startApproveAllPayments, startReportPaymentIssues } = usePaymentStore();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!selected) {
      navigate("/admin/quotations");
    }
  }, [selected, navigate]);

  const eventPayments = (payments || []).filter((p) => 
    selected && (String(p.event) === String(selected._id) || p.event === selected._id)
  );

  const displayedPayments = eventPayments;

  const [previewOpen, setPreviewOpen] = React.useState(false);
  const [previewSrc, setPreviewSrc] = React.useState(null);
  const [issuesModalOpen, setIssuesModalOpen] = React.useState(false);
  const [confirmOpen, setConfirmOpen] = React.useState(false);

  const openPreview = (src) => {
    setPreviewSrc(src);
    setPreviewOpen(true);
  };

  const closePreview = () => {
    setPreviewOpen(false);
    setPreviewSrc(null);
  };

  const totalCount = displayedPayments.length;
  const pendingCount = displayedPayments.filter((p) => 
    String(p.status).toLowerCase() === "pendiente"
  ).length;
  
  const totalAmount = displayedPayments.reduce((s, p) => s + (Number(p.total_amount) || 0), 0);
  const pendingAmount = displayedPayments
    .filter((p) => String(p.status).toLowerCase() === "pendiente")
    .reduce((s, p) => s + (Number(p.total_amount) || 0), 0);

  const handleApproveAllClick = () => {
    if (!selected?._id) {
      dispatch(showSnackbar({ message: "No hay evento seleccionado", severity: "error" }));
      return;
    }

    if (pendingCount === 0) {
      dispatch(showSnackbar({ message: "No hay pagos pendientes para aprobar", severity: "warning" }));
      return;
    }

    setConfirmOpen(true);
  };

  const handleConfirmApprove = async () => {
    const success = await startApproveAllPayments(selected._id);

    if (!success) {
      // El error ya se mostró en el hook
      return;
    }
  };

  const handleOpenIssuesModal = () => {
    setIssuesModalOpen(true);
  };

  const handleCloseIssuesModal = () => {
    setIssuesModalOpen(false);
  };

  const handleSubmitIssues = async (issuesData) => {
    if (!selected?._id) {
      dispatch(showSnackbar({ message: "No hay evento seleccionado", severity: "error" }));
      return;
    }

    const success = await startReportPaymentIssues(selected._id, issuesData);

    if (success) {
      handleCloseIssuesModal();
    }
  };

  if (!selected) {
    return (
      <Box sx={{ px: isMd ? 4 : 0, pt: 2, maxWidth: 1200, margin: "0 auto" }}>
        <Typography variant="h6" color="text.secondary">
          No hay evento seleccionado
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ px: isMd ? 4 : 0, pt: 2, maxWidth: 1200, margin: "0 auto" }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}>
        <Button
          variant="contained"
          onClick={() => navigate("/admin/quotations")}
          sx={{
            minWidth: 'auto',
            width: 40,
            height: 40,
            borderRadius: 2,
            p: 0,
            backgroundColor: isDark ? '#1f1e1e' : '#f5f5f5',
            color: isDark ? '#fff' : '#000',
            boxShadow: 'none',
            '&:hover': {
              backgroundColor: isDark ? '#353434' : '#f0f0f0',
              boxShadow: 'none',
            }
          }}
        >
          <ArrowBack />
        </Button>
        <Typography variant="h4" sx={{ fontWeight: 700, color: colors.textPrimary }}>
          Aprobar Pagos del Evento
        </Typography>
      </Box>

      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, alignItems: { xs: "flex-start", sm: "center" }, gap: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: 150, color: colors.textPrimary }}>
            {selected?.name || "—"}
          </Typography>
          <Typography variant="h6" sx={{ fontWeight: 150, color: colors.textSecondary }}>
            - {selected?.event_code || "—"}
          </Typography>
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

      {displayedPayments.length === 0 ? (
        <Card elevation={0} sx={{ mb: 3, borderRadius: 3, bgcolor: colors.cardBg, border: `1px solid ${colors.border}`, p: 3 }}>
          <Typography variant="body1" color="text.secondary" textAlign="center">
            No hay pagos registrados para este evento
          </Typography>
        </Card>
      ) : (
        <Box>
          {displayedPayments.map((p, i) => (
            <Card key={p._id || i} elevation={0} sx={{ mb: 2, borderRadius: 2, bgcolor: colors.cardBg, border: `1px solid ${colors.border}`, borderLeft: `6px solid ${theme.palette.primary.main}` }}>
              <CardContent sx={{ display: "flex", gap: 2, alignItems: "center", flexDirection: { xs: "column", sm: "row" } }}>
                <Box sx={{ width: { xs: "100%", sm: 120 }, textAlign: { xs: "center", sm: "left" }, cursor: p.voucher_url ? "pointer" : "default" }} onClick={() => p.voucher_url && openPreview(p.voucher_url)}>
                  <Avatar variant="rounded" src={p.voucher_url} sx={{ width: { xs: 140, sm: 90 }, height: { xs: 140, sm: 90 }, mb: 1, boxShadow: 3, border: `1px solid ${colors.border}`, backgroundColor: isDark ? "#141414" : "#fff", margin: { xs: '0 auto', sm: 0 } }}>
                    <Image />
                  </Avatar>
                  <Typography sx={{ fontSize: 12, color: "text.secondary", mt: 1 }}>{p.voucher_url ? "Click para ampliar" : "Sin voucher"}</Typography>
                </Box>

                <Box sx={{ flex: 1, display: "flex", flexDirection: "column", width: "100%" }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 2 }}>
                    <Box>
                      <Typography sx={{ fontSize: 13, color: "text.secondary" }}>Monto</Typography>
                      <Typography sx={{ fontSize: 20, fontWeight: 700 }}>{formatCurrency(p.total_amount)}</Typography>
                      <Typography sx={{ fontSize: 12, color: "text.secondary", mt: 0.5 }}>N° de Operación</Typography>
                      <Typography sx={{ fontSize: 12 }}>{p.operation_number || "—"}</Typography>
                    </Box>

                    <Box sx={{ textAlign: { xs: "left", sm: "right" } }}>
                      <Typography sx={{ fontSize: 13, color: "text.secondary" }}>Método de Pago</Typography>
                      {p.payment_method ? (
                        (() => {
                          const meta = getMethodMeta(p.payment_method);
                          return (
                            <Chip
                              avatar={meta.logo ? <Avatar src={meta.logo} sx={{ width: 18, height: 18 }} /> : meta.icon ? <Avatar sx={{ width: 18, height: 18 }}>{meta.icon}</Avatar> : <Avatar sx={{ width: 18, height: 18, bgcolor: meta.color }}>{meta.label.charAt(0)}</Avatar>}
                              label={meta.label}
                              size="small"
                              sx={{ mt: 1, px: 1.2, fontWeight: 700, bgcolor: meta.color, color: theme.palette.getContrastText(meta.color), borderRadius: 2 }}
                            />
                          );
                        })()
                      ) : (
                        <Typography sx={{ fontSize: 12, mt: 1 }}>—</Typography>
                      )}

                      <Typography sx={{ fontSize: 13, color: "text.secondary", mt: 2 }}>Fecha de Vencimiento</Typography>
                      <Typography sx={{ fontSize: 13 }}>{p.due_date ? dayjs(p.due_date).format("DD/MM/YYYY") : "—"}</Typography>
                    </Box>

                    <Box sx={{ textAlign: { xs: "left", sm: "right" } }}>
                      <Typography sx={{ fontSize: 13, color: "text.secondary" }}>Tipo de Pago</Typography>
                      <Chip 
                        label={p.payment_type || "—"} 
                        size="small" 
                        sx={{ 
                          mt: 1, 
                          px: 1.2, 
                          fontWeight: 700, 
                          bgcolor: theme.palette.primary.main, 
                          color: theme.palette.getContrastText(theme.palette.primary.main), 
                          borderRadius: 2 
                        }} 
                      />

                      <Typography sx={{ fontSize: 13, color: "text.secondary", mt: 2 }}>Estado</Typography>
                      <Chip 
                        label={p.status || "—"} 
                        size="small" 
                        sx={{ 
                          mt: 1, 
                          px: 1.2, 
                          fontWeight: 700, 
                          bgcolor: p.status?.toLowerCase() === "pendiente" 
                            ? theme.palette.warning.main 
                            : p.status?.toLowerCase() === "aprobado"
                            ? theme.palette.success.main
                            : theme.palette.error.main,
                          color: theme.palette.getContrastText(
                            p.status?.toLowerCase() === "pendiente" 
                              ? theme.palette.warning.main 
                              : p.status?.toLowerCase() === "aprobado"
                              ? theme.palette.success.main
                              : theme.palette.error.main
                          ), 
                          borderRadius: 2 
                        }} 
                      />
                    </Box>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}

      <Divider sx={{ my: 3, borderColor: colors.border }} />

      <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mb: 4, flexDirection: { xs: "column", sm: "row" } }}>
        <Button
          variant="contained"
          onClick={handleApproveAllClick}
          startIcon={<CheckCircleOutline />}
          disabled={loading || pendingCount === 0}
          sx={{
            py: 1,
            px: 2.5,
            boxShadow: "none",
            textTransform: "none",
            fontWeight: 600,
            fontSize: 13,
            borderRadius: 2,
            color: theme.palette.getContrastText(theme.palette.success.main),
            backgroundColor: theme.palette.success.main,
            "&:hover": { backgroundColor: theme.palette.success.dark || theme.palette.success.main },
            "&:disabled": {
              backgroundColor: theme.palette.action.disabledBackground,
              color: theme.palette.action.disabled,
            },
          }}
        >
          {loading ? "Procesando..." : "Aprobar Todos los Pagos"}
        </Button>

        {/* <Button
          variant="contained"
          onClick={handleOpenIssuesModal}
          startIcon={<Warning />}
          disabled={loading || displayedPayments.length === 0}
          sx={{
            py: 1,
            px: 2.5,
            textTransform: "none",
            fontWeight: 600,
            fontSize: 13,
            borderRadius: 2,
            color: theme.palette.getContrastText(theme.palette.warning.main),
            backgroundColor: theme.palette.warning.main,
            "&:hover": { backgroundColor: theme.palette.warning.dark || theme.palette.warning.main },
            "&:disabled": {
              backgroundColor: theme.palette.action.disabledBackground,
              color: theme.palette.action.disabled,
            },
          }}
        >
          Informar Desconformidades
        </Button> */}
      </Box>

      <ImagePreviewModal open={previewOpen} src={previewSrc} onClose={closePreview} />
      
      <PaymentIssuesModal
        open={issuesModalOpen}
        onClose={handleCloseIssuesModal}
        payments={displayedPayments}
        onSubmit={handleSubmitIssues}
      />

      <ConfirmDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleConfirmApprove}
        title="Aprobar Pagos"
        message={`¿Está seguro de aprobar todos los ${pendingCount} pagos pendientes de este evento?`}
        confirmText="Aceptar"
        cancelText="Cancelar"
        type="success"
        confirmColor="success"
      />
    </Box>
  );
};