import {
  Box,
  Typography,
  Stack,
  Avatar,
  Card,
  CardContent,
  MenuItem,
  TextField,
  useTheme,
  Alert,
  IconButton,
  Divider,
} from "@mui/material";
import { AccountBalance, Info, Delete } from "@mui/icons-material";
import { InfoBox, PaymentFormFields } from "..";
import { Controller, useFormContext } from "react-hook-form";

const paymentMethods = [
  {
    id: "yape",
    name: "Yape",
    description: "Pago instantáneo",
    color: "#9c27b0",
    logo: "https://i.postimg.cc/MHYc1qSn/YAPE.jpg",
    availableFor: ["online", "local"],
    maxAmount: 500,
    requiresProof: true,
  },
  {
    id: "plin",
    name: "Plin",
    description: "Pago instantáneo",
    color: "#2196f3",
    logo: "https://i.postimg.cc/NG8237Hf/logo-plin.jpg",
    availableFor: ["online", "local"],
    maxAmount: 500,
    requiresProof: true,
  },
  {
    id: "transfer",
    name: "Transferencia",
    description: "Transferencia Bancaria",
    color: "#607d8b",
    icon: <AccountBalance sx={{ fontSize: 20 }} />,
    availableFor: ["online", "local"],
    requiresProof: true,
  },
  {
    id: "cash",
    name: "Efectivo",
    description: "Pago en el local",
    color: "#4caf50",
    icon: "S/",
    availableFor: ["local"],
    requiresProof: false,
  },
];

export const PaymentManualContent = ({ 
  paymentNumber,
  paymentId,
  colors, 
  bankData, 
  onCopy,
  onRemove,
  isLast
}) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const { 
    watch, 
    control, 
    register, 
    setValue, 
    formState: { errors } 
  } = useFormContext({
    mode: "onBlur",
  });

  const currentMethod = watch(`manualPayments.${paymentNumber - 1}.method`);
  const selectedMethod = paymentMethods.find((m) => m.id === currentMethod);

  const selectedPaymentLocation = watch("selectedPaymentLocation");

  const availableMethods = paymentMethods.filter((method) =>
    method.availableFor.includes(selectedPaymentLocation)
  );

  return (
    <Box sx={{ mb: isLast ? 0 : 3 }}>
      {/* Card Principal con todo el contenido */}
      <Card
        elevation={0}
        sx={{
          borderRadius: 2,
          border: `1px solid ${colors.border}`,
          bgcolor: isDark ? "#141414" : "#FAF9FA",
        }}
      >
        <CardContent sx={{ p: 2.5 }}>
          {/* Header con Avatar y Título */}
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2.5 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Avatar
                sx={{
                  bgcolor: selectedMethod?.color || colors.border,
                  width: 40,
                  height: 40,
                }}
                src={selectedMethod?.logo}
              >
                {selectedMethod?.icon}
              </Avatar>
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, color: colors.textPrimary }}>
                  Pago {paymentNumber}
                </Typography>
                <Typography variant="caption" sx={{ color: colors.textSecondary }}>
                  {selectedMethod?.name || "Selecciona un método"}
                </Typography>
              </Box>
            </Box>

            {/* Botón eliminar */}
            {onRemove && (
              <IconButton 
                size="small" 
                onClick={onRemove}
                sx={{ 
                  color: "#f44336",
                  "&:hover": {
                    bgcolor: isDark ? "rgba(244, 67, 54, 0.1)" : "rgba(244, 67, 54, 0.05)",
                  }
                }}
              >
                <Delete fontSize="small" />
              </IconButton>
            )}
          </Box>

          {/* Grid de Método de pago y Monto */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
              gap: 2,
              mb: 2.5,
            }}
          >
            {/* Método de pago */}
            <Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mb: 1 }}>
                <Typography variant="body2" sx={{ fontWeight: 600, color: colors.textPrimary }}>
                  Método de pago *
                </Typography>
              </Box>
              <Controller
                control={control}
                name={`manualPayments.${paymentNumber - 1}.method`}
                render={({ field }) => (
                  <TextField
                    select
                    fullWidth
                    {...field}
                    size="small"
                  >
                  {availableMethods.map((method) => (
                    <MenuItem key={method.id} value={method.id}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                        {method.logo ? (
                          <Avatar
                            src={method.logo}
                            sx={{ width: 20, height: 20, bgcolor: "#fff" }}
                          />
                        ) : (
                          <Avatar
                            sx={{
                              bgcolor: method.color,
                              width: 20,
                              height: 20,
                              fontSize: 12,
                              fontWeight: 700,
                            }}
                          >
                            {method.icon}
                          </Avatar>
                        )}
                        <Typography fontSize={14}>{method.name}</Typography>
                      </Box>
                    </MenuItem>
                  ))}
                </TextField>
                )}
              />
            </Box>

            {/* Monto */}
            <Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mb: 1 }}>
                <Typography
                  variant="body2"
                  sx={{ fontWeight: 600, color: colors.textPrimary }}
                >
                  Monto (S/) *
                </Typography>
              </Box>

              <TextField
                fullWidth
                size="small"
                placeholder="0.00"
                {...register(`manualPayments.${paymentNumber - 1}.amount`, {
                  required: "El monto es obligatorio",
                })}
                onChange={(e) => {
                  const value = e.target.value;
                  setValue(
                    `manualPayments.${paymentNumber - 1}.amount`,
                    value === "" ? "" : parseFloat(value)
                  );
                }}
                value={watch(`manualPayments.${paymentNumber - 1}.amount`) || ""}
                error={!!errors?.manualPayments?.[paymentNumber - 1]?.amount}
                helperText={
                  errors?.manualPayments?.[paymentNumber - 1]?.amount?.message || ""
                }
              />
            </Box>

          </Box>

          {/* Detalles según método seleccionado */}
          {currentMethod === "yape" && (
            <PaymentDetailCard
              title="Datos para Yape"
              icon="https://i.postimg.cc/MHYc1qSn/YAPE.jpg"
              fields={[
                { label: "Número", value: bankData.yapeNumber, copy: true },
                { label: "Nombre", value: bankData.yapeName },
              ]}
              colors={colors}
              isDark={isDark}
              onCopy={onCopy}
            />
          )}

          {currentMethod === "plin" && (
            <PaymentDetailCard
              title="Datos para Plin"
              icon="https://i.postimg.cc/NG8237Hf/logo-plin.jpg"
              fields={[
                { label: "Número", value: bankData.plinNumber, copy: true },
                { label: "Nombre", value: bankData.plinName },
              ]}
              colors={colors}
              isDark={isDark}
              onCopy={onCopy}
            />
          )}

          {currentMethod === "transfer" && (
            <PaymentDetailCard
              title="Datos Bancarios"
              icon={<AccountBalance sx={{ fontSize: 20 }} />}
              fields={[
                { label: "Banco", value: bankData.banco },
                { label: "Cuenta", value: bankData.cuenta, copy: true },
                { label: "CCI", value: bankData.cci, copy: true },
                { label: "Titular", value: bankData.titular },
              ]}
              colors={colors}
              isDark={isDark}
              onCopy={onCopy}
            />
          )}

          {currentMethod === "cash" && (
            <Alert
              icon={<Info />}
              severity="warning"
              sx={{
                borderRadius: 2,
                bgcolor: isDark ? "rgba(255, 152, 0, 0.1)" : "rgba(255, 152, 0, 0.05)",
                color: colors.textPrimary,
                border: `1px solid ${isDark ? "#ff9800" : "#ffb74d"}`,
                "& .MuiAlert-icon": {
                  color: "#ff9800",
                },
              }}
            >
              <Typography variant="body2" fontWeight={600} mb={0.5}>
                Pago en Efectivo (Solo Local)
              </Typography>
              <Typography variant="caption">
                Este pago no requiere comprobante pero debe ser confirmado por el administrador en el local.
              </Typography>
            </Alert>
          )}

          {/* Campos de formulario (Número de operación y comprobante) - Para todos excepto efectivo */}
          {selectedMethod?.requiresProof && (
            <>
              <Divider sx={{ my: 3, borderColor: colors.border }} />
              <PaymentFormFields paymentId={paymentId} />
            </>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

// Subcomponente interno
const PaymentDetailCard = ({ title, icon, fields, colors, isDark, onCopy }) => (
  <Box
    sx={{
      p: 2,
      borderRadius: 2,
      bgcolor: isDark ? "rgba(33, 33, 33, 1)" : "rgba(255, 255, 255, 1)",
      border: `1px solid ${isDark ? "#5a5a5aff" : "#d9d9d9ff"}`,
      mb: 2,
    }}
  >
    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
      {typeof icon === "string" ? (
        <Avatar src={icon} sx={{ width: 20, height: 20, bgcolor: "#fff" }} />
      ) : (
        <Box sx={{ color: colors.textPrimary }}>{icon}</Box>
      )}
      <Typography variant="body2" sx={{ color: colors.textPrimary, fontWeight: 600 }}>
        {title}
      </Typography>
    </Box>

    <Stack spacing={1.5}>
      {fields.map(({ label, value, copy }) => (
        <InfoBox
          key={label}
          isDark={isDark}
          label={label}
          value={value}
          onCopy={copy ? () => onCopy(value) : undefined}
        />
      ))}
    </Stack>
  </Box>
);
