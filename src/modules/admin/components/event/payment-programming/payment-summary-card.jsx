import {
  Box,
  Typography,
  Grid,
  Divider,
  useTheme,
  Button,
} from "@mui/material";
import { CalendarMonth, AccountBalanceWallet, Payment } from "@mui/icons-material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { useFormContext } from "react-hook-form";
import dayjs from "dayjs";

export const PaymentSummaryCard = ({ 
  selected, 
  totalGeneral, 
  totalAnticipo, 
  saldoRestante, 
  subtotalEquipments, 
  subtotalWorkers, 
  subtotalServices,
  equipments,
  workers,
  services,
  eventDate,
  isButtonDisabled
}) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const { watch, setValue, register, formState: { errors } } = useFormContext();

  if (!selected) return null;

  const formatCurrency = (val) => `S/ ${val.toLocaleString("es-PE", { minimumFractionDigits: 2 })}`;

  return (
    <Box sx={{ mb: 4 }}>
      {/* Divider */}
      <Divider sx={{ my: 2 }} />

      {/* Título */}
      <Typography
        sx={{
          mb: 2,
          fontWeight: 600,
          display: "flex",
          alignItems: "center",
          gap: 1,
        }}
      >
        <AccountBalanceWallet />
        Resumen de Pagos
      </Typography>

      {/* Contenido */}
      <Grid container spacing={2} alignItems="stretch" sx={{ mb: 3 }}>

        {/* Total General */}
        <Grid item xs={12} md={4}>
          <Box
            sx={{
              p: 3,
              borderRadius: 3,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              height: "100%",
              bgcolor: isDark ? "#273159" : "#f5f8ff",
              color: isDark ? "#e3f2fd" : "#0d47a1"
            }}
          >
            <Box>
              <Typography sx={{ fontSize: 18, fontWeight: 600, color: isDark ? "#aad2ff" : "#1565c0" }}>
                Total General del Evento
              </Typography>

              <Typography sx={{ fontSize: 34, fontWeight: 700, my: 1, color: isDark ? "#fff" : "#000" }}>
                {formatCurrency(totalGeneral)}
              </Typography>

              <Typography sx={{ fontSize: 15, color: isDark ? "#cfd8dc" : "text.secondary" }}>
                Equipos:
                <span style={{ float: "right" }}>{formatCurrency(subtotalEquipments)}</span>
              </Typography>
              <Typography sx={{ fontSize: 15, color: isDark ? "#cfd8dc" : "text.secondary" }}>
                Trabajadores:
                <span style={{ float: "right" }}>{formatCurrency(subtotalWorkers)}</span>
              </Typography>
              <Typography sx={{ fontSize: 15, color: isDark ? "#cfd8dc" : "text.secondary" }}>
                Servicios Adicionales:
                <span style={{ float: "right" }}>{formatCurrency(subtotalServices)}</span>
              </Typography>
            </Box>
          </Box>
        </Grid>

        {/* Pago Parcial */}
        <Grid item xs={12} md={4}>
          <Box
            sx={{
              p: 3,
              borderRadius: 3,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              height: "100%",
              bgcolor: isDark ? "#1e3c33" : "#f1faf4",
              color: isDark ? "#b9f6ca" : "#1b5e20"
            }}
          >
            <Box>
              <Typography sx={{ fontSize: 18, fontWeight: 600, color: isDark ? "#8df1b6" : "#2e7d32" }}>
                Pago Parcial (Anticipo)
              </Typography>

              <Typography sx={{ fontSize: 34, fontWeight: 700, my: 1, color: isDark ? "#fff" : "#000" }}>
                {formatCurrency(totalAnticipo)}
              </Typography>

              <Typography sx={{ mb: 1, fontWeight: 500, color: "text.primary" }}>
                Composición:
              </Typography>

              <Typography sx={{ fontSize: 14 }}>
                • Equipos:
                <span style={{ float: "right" }}>
                  {formatCurrency(
                    equipments.reduce((acc, e) => acc + (e.hourly_rate || 0) * (e.hours || 1) * 0.5, 0)
                  )}
                </span>
              </Typography>

              <Typography sx={{ fontSize: 14 }}>
                • Trabajadores:
                <span style={{ float: "right" }}>
                  {formatCurrency(
                    workers.reduce((acc, w) => acc + (w.hourly_rate || 0) * (w.hours || 1) * 0.5, 0)
                  )}
                </span>
              </Typography>

              <Typography sx={{ fontSize: 14 }}>
                • Servicios Adicionales:
                <span style={{ float: "right" }}>
                  {formatCurrency(
                    services.reduce((acc, s) => {
                      const percentage =
                        (s.payment_percentage_required || 0) > 50
                          ? s.payment_percentage_required / 100
                          : 0.5;
                      return acc + (s.hourly_rate || 0) * (s.hours || 1) * percentage;
                    }, 0)
                  )}
                </span>
              </Typography>
            </Box>

            <Box>
              <Divider sx={{ my: 2, borderColor: isDark ? "#2e7d32" : "#c8e6c9" }} />
              <Box display="flex" alignItems="center" gap={1}>
                <CalendarMonth fontSize="small" />
                <Typography sx={{ fontSize: 14, fontWeight: 500, color: "text.primary" }}>
                  Fecha de vencimiento
                </Typography>
              </Box>

              <DemoContainer components={["DatePicker"]}>
                <DatePicker
                  label="Fecha Anticipo"
                  value={
                    watch("partialPaymentDate")
                      ? dayjs(watch("partialPaymentDate"))
                      : null
                  }
                  onChange={(date) => {
                    const formatted = date ? date.startOf("day").format("YYYY-MM-DDTHH:mm:ssZ") : "";
                    setValue("partialPaymentDate", formatted);
                  }}
                  minDate={dayjs().startOf("day")}
                  maxDate={eventDate ? dayjs(eventDate).startOf("day") : null}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      ...register("partialPaymentDate", {
                        required: "La fecha del anticipo es obligatoria",
                      }),
                      error: !!errors.partialPaymentDate,
                      helperText: errors.partialPaymentDate?.message ?? "",
                    },
                  }}
                />
              </DemoContainer>
            </Box>
          </Box>
        </Grid>

        {/* Pago Final */}
        <Grid item xs={12} md={4}>
          <Box
            sx={{
              p: 3,
              borderRadius: 3,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              height: "100%",
              bgcolor: isDark ? "#4e342e" : "#fff3e0",
              color: isDark ? "#ffccbc" : "#bf360c"
            }}
          >
            <Box>
              <Typography sx={{ fontSize: 18, fontWeight: 600, color: isDark ? "#ffab91" : "#e64a19" }}>
                Pago Final (Saldo)
              </Typography>

              <Typography sx={{ fontSize: 34, fontWeight: 700, my: 1, color: isDark ? "#fff" : "#000" }}>
                {formatCurrency(saldoRestante)}
              </Typography>

              <Typography sx={{ mb: 1, fontWeight: 500, color: "text.primary" }}>Cálculo:</Typography>

              <Typography sx={{ fontSize: 14 }}>
                Total General:
                <span style={{ float: "right" }}>{formatCurrency(totalGeneral)}</span>
              </Typography>

              <Typography sx={{ fontSize: 14 }}>
                - Pago Parcial:
                <span style={{ float: "right" }}>{formatCurrency(totalAnticipo)}</span>
              </Typography>

              <Divider sx={{ my: 1, borderColor: isDark ? "#795548" : "#ffccbc" }} />

              <Typography sx={{ fontSize: 14 }}>
                = Saldo Restante:
                <span
                  style={{
                    float: "right",
                    fontWeight: 600,
                    color: isDark ? "#ffab91" : "#d84315",
                  }}
                >
                  {formatCurrency(saldoRestante)}
                </span>
              </Typography>
            </Box>

            <Box>
              <Divider sx={{ my: 2, borderColor: isDark ? "#795548" : "#ffccbc" }} />
              <Box display="flex" alignItems="center" gap={1}>
                <CalendarMonth fontSize="small" />
                <Typography sx={{ fontSize: 14, fontWeight: 500, color: "text.primary" }}>
                  Fecha de vencimiento
                </Typography>
              </Box>

              <DemoContainer components={["DatePicker"]}>
                <DatePicker
                  label="Fecha Saldo"
                  value={
                    watch("finalPaymentDate")
                      ? dayjs(watch("finalPaymentDate"))
                      : null
                  }
                  onChange={(date) => {
                    const formatted = date ? date.startOf("day").format("YYYY-MM-DDTHH:mm:ssZ") : "";
                    setValue("finalPaymentDate", formatted);
                  }}
                  minDate={dayjs().startOf("day")}
                  maxDate={eventDate ? dayjs(eventDate).startOf("day") : null}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      ...register("finalPaymentDate", {
                        required: "La fecha del saldo es obligatoria",
                      }),
                      error: !!errors.finalPaymentDate,
                      helperText: errors.finalPaymentDate?.message ?? "",
                    },
                  }}
                />
              </DemoContainer>
            </Box>
          </Box>
        </Grid>
      </Grid>

      {/* Divider */}
      <Divider sx={{ my: 2 }} />

       {/* Botón Final */}
      <Box display="flex" justifyContent="flex-end" mt={3}>
        <Button
          type="submit"
          variant="contained"
          startIcon={<Payment />}
          disabled={isButtonDisabled}
          sx={{
            mt: 1,
            backgroundColor: "#212121",
            color: "#fff",
            textTransform: "none",
            py: 1.5,
            borderRadius: 2,
            fontWeight: 600,
          }}
        >
          Confirmar y Crear Pagos
        </Button>
      </Box>

      {/* Botón FinalZZO */}
    </Box>
  );
};
