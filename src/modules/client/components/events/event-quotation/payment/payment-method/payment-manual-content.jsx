import {
  Box,
  Typography,
  Stack,
  Avatar,
  Card,
  CardContent,
  CardActionArea,
  Alert,
} from "@mui/material";
import {
  RadioButtonUnchecked,
  RadioButtonChecked,
  AccountBalance,
} from "@mui/icons-material";
import { InfoBox } from "..";
import { useFormContext } from "react-hook-form";

const paymentMethods = [
  {
    id: "yape",
    name: "Yape",
    description: "Pago instantáneo",
    color: "#9c27b0",
    logo: "https://i.postimg.cc/MHYc1qSn/YAPE.jpg",
  },
  {
    id: "plin",
    name: "Plin",
    description: "Pago instantáneo",
    color: "#2196f3",
    logo: "https://i.postimg.cc/NG8237Hf/logo-plin.jpg",
  },
  {
    id: "transfer",
    name: "Transferencia Bancaria",
    description: "BCP, Interbank, BBVA, etc.",
    color: "#607d8b",
    icon: <AccountBalance sx={{ fontSize: 24 }} />,
  },
];

export const PaymentManualContent = ({ isDark, colors, bankData, onCopy }) => {
  const { watch, setValue } = useFormContext();
  const paymentMethod = watch("selectedPaymentMethod");
  const amount = watch("amount");

  const disableManualPayments = amount > 500;

  return (
    <Box>
      {/* Lista de métodos */}
      <Stack spacing={2} sx={{ mb: 3 }}>
        {paymentMethods.map((method) => {
          const isDisabled =
            disableManualPayments &&
            (method.id === "yape" || method.id === "plin");

          return (
            <Card
              key={method.id}
              elevation={0}
              sx={{
                border:
                  paymentMethod === method.id
                    ? `2px solid ${colors.borderActive}`
                    : `1px solid ${colors.border}`,
                borderRadius: 2,
                bgcolor: isDisabled
                  ? "action.disabledBackground"
                  : colors.innerCardBg,
                opacity: isDisabled ? 0.6 : 1,
                transition: "all 0.2s",
              }}
            >
              <CardActionArea
                disabled={isDisabled}
                onClick={() => !isDisabled && setValue("selectedPaymentMethod", method.id)}
              >
                <CardContent
                  sx={{
                    p: 2,
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                  }}
                >
                  {paymentMethod === method.id ? (
                    <RadioButtonChecked sx={{ color: colors.borderActive }} />
                  ) : (
                    <RadioButtonUnchecked sx={{ color: colors.textSecondary }} />
                  )}

                  {/* Logo / ícono */}
                  {method.logo ? (
                    <Avatar
                      src={method.logo}
                      alt={method.name}
                      sx={{
                        width: 40,
                        height: 40,
                        bgcolor: "#fff",
                        border: `1px solid ${colors.border}`,
                      }}
                    />
                  ) : (
                    <Avatar
                      sx={{
                        bgcolor: method.color,
                        width: 40,
                        height: 40,
                      }}
                    >
                      {method.icon}
                    </Avatar>
                  )}

                  <Box>
                    <Typography
                      variant="subtitle1"
                      sx={{
                        fontWeight: 600,
                        color: colors.textPrimary,
                      }}
                    >
                      {method.name}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{ color: colors.textSecondary }}
                    >
                      {method.description}
                    </Typography>
                  </Box>
                </CardContent>
              </CardActionArea>
            </Card>
          );
        })}
      </Stack>

      {/* Detalles según método */}
      {paymentMethod === "yape" && (
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

      {paymentMethod === "plin" && (
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

      {paymentMethod === "transfer" && (
        <PaymentDetailCard
          title="Datos Bancarios"
          icon={<AccountBalance sx={{ fontSize: 20 }} />}
          fields={[
            { label: "Banco", value: bankData.banco },
            { label: "Cuenta", value: bankData.cuenta, copy: true },
            { label: "CCI", value: bankData.cci, copy: true },
            { label: "Titular", value: bankData.titular },
            { label: "RUC", value: bankData.ruc },
          ]}
          colors={colors}
          isDark={isDark}
          onCopy={onCopy}
        />
      )}
    </Box>
  );
};

// Subcomponente interno (sin cambios)
const PaymentDetailCard = ({ title, icon, fields, colors, isDark, onCopy }) => (
  <Card
    elevation={0}
    sx={{
      borderRadius: 2,
      border: `1px solid ${colors.border}`,
      bgcolor: colors.innerCardBg,
    }}
  >
    <CardContent sx={{ p: 3 }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
        {typeof icon === "string" ? (
          <Avatar src={icon} sx={{ width: 24, height: 24, bgcolor: "#fff" }} />
        ) : (
          icon
        )}
        <Typography
          variant="subtitle2"
          sx={{ color: colors.textPrimary, fontWeight: 600 }}
        >
          {title}
        </Typography>
      </Box>

      <Stack spacing={2}>
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
    </CardContent>
  </Card>
);
