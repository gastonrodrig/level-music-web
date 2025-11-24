import React, { useState, useMemo } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  Button,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
  TextField,
  Divider,
  Alert,
  useTheme,
  IconButton,
  Card,
  CardContent,
  Grid,
} from "@mui/material";
import { Close, Receipt, Download, Warning } from "@mui/icons-material";
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";
import { useForm, Controller } from "react-hook-form";
import dayjs from "dayjs";

// Estilos para el PDF
const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 10,
    fontFamily: "Helvetica",
    backgroundColor: "#ffffff",
  },
  header: {
    marginBottom: 20,
    borderBottom: "2 solid #000",
    paddingBottom: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 12,
    textAlign: "center",
    marginBottom: 5,
  },
  section: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 8,
    backgroundColor: "#f0f0f0",
    padding: 5,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  label: {
    fontWeight: "bold",
    width: "40%",
  },
  value: {
    width: "60%",
  },
  table: {
    display: "table",
    width: "auto",
    marginBottom: 10,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    paddingVertical: 5,
  },
  tableHeader: {
    backgroundColor: "#f5f5f5",
    fontWeight: "bold",
    borderBottomWidth: 2,
    borderBottomColor: "#000",
  },
  tableCol: {
    padding: 5,
  },
  tableCol1: { width: "10%" },
  tableCol2: { width: "40%" },
  tableCol3: { width: "15%" },
  tableCol4: { width: "15%" },
  tableCol5: { width: "20%" },
  totalSection: {
    marginTop: 20,
    borderTop: "2 solid #000",
    paddingTop: 10,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  totalLabel: {
    fontWeight: "bold",
    fontSize: 12,
  },
  totalValue: {
    fontSize: 12,
    fontWeight: "bold",
  },
  footer: {
    marginTop: 30,
    borderTop: "1 solid #000",
    paddingTop: 10,
    fontSize: 8,
    textAlign: "center",
    color: "#666",
  },
});

const formatCurrency = (value) => {
  return `S/ ${Number(value || 0).toLocaleString("es-PE", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

// Componente PDF del Comprobante
const ReceiptPDF = ({ data, receiptType, clientType }) => {
  const isFactura = receiptType === "factura";
  const IGV_RATE = 0.18;

  const calculateTotals = () => {
    const subtotal = data.totalAmount || 0;
    const igv = isFactura ? subtotal * IGV_RATE : 0;
    const total = subtotal + igv;

    return { subtotal, igv, total };
  };

  const totals = calculateTotals();

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>
            {isFactura ? "FACTURA ELECTRÓNICA" : "BOLETA DE VENTA ELECTRÓNICA"}
          </Text>
          <Text style={styles.subtitle}>MUSIC EVENTS SAC</Text>
          <Text style={styles.subtitle}>RUC: 20123456789</Text>
          <Text style={styles.subtitle}>
            Av. Principal 123, Lima - Perú | Tel: (01) 234-5678
          </Text>
          <Text style={[styles.subtitle, { marginTop: 10, fontSize: 10 }]}>
            {isFactura ? "FACTURA N°" : "BOLETA N°"} {data.receiptNumber || "F001-00001"}
          </Text>
        </View>

        {/* Información del Cliente */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>DATOS DEL CLIENTE</Text>
          <View style={styles.row}>
            <Text style={styles.label}>
              {isFactura ? "Razón Social:" : "Nombre/Razón Social:"}
            </Text>
            <Text style={styles.value}>{data.clientName || "—"}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>{isFactura ? "RUC:" : "DNI/RUC:"}</Text>
            <Text style={styles.value}>{data.clientDocument || "—"}</Text>
          </View>
          {data.clientAddress && (
            <View style={styles.row}>
              <Text style={styles.label}>Dirección:</Text>
              <Text style={styles.value}>{data.clientAddress}</Text>
            </View>
          )}
          <View style={styles.row}>
            <Text style={styles.label}>Fecha de Emisión:</Text>
            <Text style={styles.value}>
              {dayjs().format("DD/MM/YYYY HH:mm")}
            </Text>
          </View>
        </View>

        {/* Información del Evento */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>DATOS DEL EVENTO</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Nombre del Evento:</Text>
            <Text style={styles.value}>{data.eventName || "—"}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Código:</Text>
            <Text style={styles.value}>{data.eventCode || "—"}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Fecha del Evento:</Text>
            <Text style={styles.value}>
              {data.eventDate ? dayjs(data.eventDate).format("DD/MM/YYYY") : "—"}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Lugar:</Text>
            <Text style={styles.value}>{data.eventLocation || "—"}</Text>
          </View>
        </View>

        {/* Servicios Principales */}
        {data.services && data.services.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>SERVICIOS PRINCIPALES</Text>
            <View style={styles.table}>
              <View style={[styles.tableRow, styles.tableHeader]}>
                <Text style={[styles.tableCol, styles.tableCol1]}>#</Text>
                <Text style={[styles.tableCol, styles.tableCol2]}>Descripción</Text>
                <Text style={[styles.tableCol, styles.tableCol3]}>Cant.</Text>
                <Text style={[styles.tableCol, styles.tableCol4]}>P. Unit.</Text>
                <Text style={[styles.tableCol, styles.tableCol5]}>Subtotal</Text>
              </View>
              {data.services.map((service, index) => (
                <View key={index} style={styles.tableRow}>
                  <Text style={[styles.tableCol, styles.tableCol1]}>{index + 1}</Text>
                  <Text style={[styles.tableCol, styles.tableCol2]}>
                    {service.name || "—"}
                  </Text>
                  <Text style={[styles.tableCol, styles.tableCol3]}>
                    {service.quantity || 1}
                  </Text>
                  <Text style={[styles.tableCol, styles.tableCol4]}>
                    {formatCurrency(service.price)}
                  </Text>
                  <Text style={[styles.tableCol, styles.tableCol5]}>
                    {formatCurrency(service.total)}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Equipos */}
        {data.equipment && data.equipment.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>EQUIPOS</Text>
            <View style={styles.table}>
              <View style={[styles.tableRow, styles.tableHeader]}>
                <Text style={[styles.tableCol, styles.tableCol1]}>#</Text>
                <Text style={[styles.tableCol, styles.tableCol2]}>Equipo</Text>
                <Text style={[styles.tableCol, styles.tableCol3]}>Cant.</Text>
                <Text style={[styles.tableCol, styles.tableCol4]}>P. Unit.</Text>
                <Text style={[styles.tableCol, styles.tableCol5]}>Subtotal</Text>
              </View>
              {data.equipment.map((item, index) => (
                <View key={index} style={styles.tableRow}>
                  <Text style={[styles.tableCol, styles.tableCol1]}>{index + 1}</Text>
                  <Text style={[styles.tableCol, styles.tableCol2]}>
                    {item.name || "—"}
                  </Text>
                  <Text style={[styles.tableCol, styles.tableCol3]}>
                    {item.quantity || 1}
                  </Text>
                  <Text style={[styles.tableCol, styles.tableCol4]}>
                    {formatCurrency(item.price)}
                  </Text>
                  <Text style={[styles.tableCol, styles.tableCol5]}>
                    {formatCurrency(item.total)}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Trabajadores */}
        {data.workers && data.workers.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>PERSONAL ASIGNADO</Text>
            <View style={styles.table}>
              <View style={[styles.tableRow, styles.tableHeader]}>
                <Text style={[styles.tableCol, styles.tableCol1]}>#</Text>
                <Text style={[styles.tableCol, styles.tableCol2]}>Nombre</Text>
                <Text style={[styles.tableCol, styles.tableCol3]}>Rol</Text>
                <Text style={[styles.tableCol, styles.tableCol4]}>Horas</Text>
                <Text style={[styles.tableCol, styles.tableCol5]}>Costo</Text>
              </View>
              {data.workers.map((worker, index) => (
                <View key={index} style={styles.tableRow}>
                  <Text style={[styles.tableCol, styles.tableCol1]}>{index + 1}</Text>
                  <Text style={[styles.tableCol, styles.tableCol2]}>
                    {worker.name || "—"}
                  </Text>
                  <Text style={[styles.tableCol, styles.tableCol3]}>
                    {worker.role || "—"}
                  </Text>
                  <Text style={[styles.tableCol, styles.tableCol4]}>
                    {worker.hours || "—"}
                  </Text>
                  <Text style={[styles.tableCol, styles.tableCol5]}>
                    {formatCurrency(worker.cost)}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Totales */}
        <View style={styles.totalSection}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Subtotal:</Text>
            <Text style={styles.totalValue}>{formatCurrency(totals.subtotal)}</Text>
          </View>
          {isFactura && (
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>IGV (18%):</Text>
              <Text style={styles.totalValue}>{formatCurrency(totals.igv)}</Text>
            </View>
          )}
          <View style={styles.totalRow}>
            <Text style={[styles.totalLabel, { fontSize: 14 }]}>TOTAL:</Text>
            <Text style={[styles.totalValue, { fontSize: 14 }]}>
              {formatCurrency(totals.total)}
            </Text>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text>
            Este documento ha sido generado electrónicamente y tiene validez legal.
          </Text>
          <Text>
            Para cualquier consulta, comuníquese al (01) 234-5678 o visite
            www.musicevents.com.pe
          </Text>
          <Text style={{ marginTop: 5 }}>
            Documento generado el {dayjs().format("DD/MM/YYYY HH:mm:ss")}
          </Text>
        </View>
      </Page>
    </Document>
  );
};

export const EventReceiptModal = ({ open, onClose, eventData }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  const { control, handleSubmit, watch, formState: { errors } } = useForm({
    defaultValues: {
      receiptType: "boleta",
      clientType: "persona",
      clientName: "",
      clientDocument: "",
      clientAddress: "",
    },
  });

  const receiptType = watch("receiptType");
  const clientType = watch("clientType");

  const [pdfReady, setPdfReady] = useState(false);
  const [formData, setFormData] = useState(null);

  // Verificar si todos los pagos están aprobados
  const allPaymentsApproved = useMemo(() => {
    if (!eventData?.payments) return false;
    return eventData.payments.every(
      (payment) => payment.status?.toLowerCase() === "aprobado"
    );
  }, [eventData]);

  const hasPendingPayments = useMemo(() => {
    if (!eventData?.payments) return true;
    return eventData.payments.some(
      (payment) => payment.status?.toLowerCase() === "pendiente"
    );
  }, [eventData]);

  const canGenerateReceipt = allPaymentsApproved && !hasPendingPayments;

  const onSubmit = (data) => {
    const pdfData = {
      ...data,
      eventName: eventData?.name,
      eventCode: eventData?.event_code,
      eventDate: eventData?.event_date,
      eventLocation: eventData?.location,
      totalAmount: eventData?.total_price,
      services: eventData?.services || [],
      equipment: eventData?.equipment || [],
      workers: eventData?.workers || [],
      receiptNumber: `${data.receiptType === "factura" ? "F" : "B"}001-${String(
        Math.floor(Math.random() * 100000)
      ).padStart(5, "0")}`,
    };

    setFormData(pdfData);
    setPdfReady(true);
  };

  const handleClose = () => {
    setPdfReady(false);
    setFormData(null);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          bgcolor: isDark ? "#141414" : "#ffffff",
          backgroundImage: "none",
        },
      }}
    >
      <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Receipt sx={{ color: theme.palette.primary.main }} />
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Generar Comprobante
          </Typography>
        </Box>
        <IconButton onClick={handleClose} size="small">
          <Close />
        </IconButton>
      </DialogTitle>

      <Divider />

      <DialogContent sx={{ pt: 3 }}>
        {!canGenerateReceipt && (
          <Alert severity="warning" sx={{ mb: 3, borderRadius: 2 }}>
            <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
              No se puede generar el comprobante
            </Typography>
            <Typography variant="body2">
              {hasPendingPayments
                ? "Existen pagos pendientes por aprobar."
                : "Todos los pagos deben estar completados y aprobados."}
            </Typography>
          </Alert>
        )}

        <Card sx={{ mb: 3, bgcolor: isDark ? "#1a1a1a" : "#f5f5f5", borderRadius: 2 }}>
          <CardContent>
            <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
              Información del Evento
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">
                  Evento:
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {eventData?.name || "—"}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">
                  Código:
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {eventData?.event_code || "—"}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">
                  Fecha:
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {eventData?.event_date
                    ? dayjs(eventData.event_date).format("DD/MM/YYYY")
                    : "—"}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">
                  Monto Total:
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {formatCurrency(eventData?.total_price)}
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            {/* Tipo de Comprobante */}
            <FormControl component="fieldset">
              <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                Tipo de Comprobante *
              </Typography>
              <Controller
                name="receiptType"
                control={control}
                render={({ field }) => (
                  <RadioGroup {...field} row>
                    <FormControlLabel
                      value="boleta"
                      control={<Radio />}
                      label="Boleta de Venta"
                    />
                    <FormControlLabel
                      value="factura"
                      control={<Radio />}
                      label="Factura"
                    />
                  </RadioGroup>
                )}
              />
            </FormControl>

            {/* Tipo de Cliente */}
            <FormControl component="fieldset">
              <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                Emitir como *
              </Typography>
              <Controller
                name="clientType"
                control={control}
                render={({ field }) => (
                  <RadioGroup {...field} row>
                    <FormControlLabel
                      value="persona"
                      control={<Radio />}
                      label="Persona Natural"
                    />
                    <FormControlLabel
                      value="empresa"
                      control={<Radio />}
                      label="Empresa"
                    />
                  </RadioGroup>
                )}
              />
            </FormControl>

            {/* Nombre/Razón Social */}
            <Controller
              name="clientName"
              control={control}
              rules={{ required: "Este campo es requerido" }}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label={
                    clientType === "empresa" ? "Razón Social" : "Nombre Completo"
                  }
                  placeholder={
                    clientType === "empresa"
                      ? "Ej: MUSIC EVENTS SAC"
                      : "Ej: Juan Pérez García"
                  }
                  error={!!errors.clientName}
                  helperText={errors.clientName?.message}
                  disabled={!canGenerateReceipt}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                    },
                  }}
                />
              )}
            />

            {/* Documento */}
            <Controller
              name="clientDocument"
              control={control}
              rules={{
                required: "Este campo es requerido",
                pattern: {
                  value:
                    receiptType === "factura"
                      ? /^\d{11}$/
                      : /^\d{8}$|^\d{11}$/,
                  message:
                    receiptType === "factura"
                      ? "RUC debe tener 11 dígitos"
                      : "DNI debe tener 8 dígitos o RUC 11 dígitos",
                },
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label={receiptType === "factura" ? "RUC" : "DNI/RUC"}
                  placeholder={
                    receiptType === "factura" ? "Ej: 20123456789" : "Ej: 12345678"
                  }
                  error={!!errors.clientDocument}
                  helperText={errors.clientDocument?.message}
                  disabled={!canGenerateReceipt}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                    },
                  }}
                />
              )}
            />

            {/* Dirección (opcional) */}
            <Controller
              name="clientAddress"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Dirección (opcional)"
                  placeholder="Ej: Av. Principal 123, Lima"
                  disabled={!canGenerateReceipt}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                    },
                  }}
                />
              )}
            />
          </Box>
        </form>
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

        {!pdfReady ? (
          <Button
            onClick={handleSubmit(onSubmit)}
            variant="contained"
            startIcon={<Receipt />}
            disabled={!canGenerateReceipt}
            sx={{
              textTransform: "none",
              borderRadius: 2,
              fontWeight: 600,
            }}
          >
            Generar Comprobante
          </Button>
        ) : (
          <PDFDownloadLink
            document={
              <ReceiptPDF
                data={formData}
                receiptType={receiptType}
                clientType={clientType}
              />
            }
            fileName={`${receiptType}_${formData?.receiptNumber}_${dayjs().format(
              "YYYYMMDD"
            )}.pdf`}
            style={{ textDecoration: "none" }}
          >
            {({ loading }) => (
              <Button
                variant="contained"
                startIcon={<Download />}
                disabled={loading}
                sx={{
                  textTransform: "none",
                  borderRadius: 2,
                  fontWeight: 600,
                  bgcolor: theme.palette.success.main,
                  color: theme.palette.getContrastText(theme.palette.success.main),
                  "&:hover": {
                    bgcolor: theme.palette.success.dark,
                  },
                }}
              >
                {loading ? "Generando PDF..." : "Descargar PDF"}
              </Button>
            )}
          </PDFDownloadLink>
        )}
      </DialogActions>
    </Dialog>
  );
};