import {
  Box,
  Typography,
  Stack,
  Avatar,
  Button,
  useTheme,
  IconButton,
  Card,
  CardActionArea,
  CardContent,
} from "@mui/material";
import {
  RadioButtonUnchecked,
  RadioButtonChecked,
  ContentCopy,
  AccountBalance,
  CreditCard,
  PhoneIphone,
  CheckCircle,
} from "@mui/icons-material";

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

export const PaymentMethodSelector = ({
  paymentMethod,
  bankData,
  onMethodChange,
  onCopy,
  paymentTab = "manual",
  onTabChange,
  quotationData,
}) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  const colors = {
    innerCardBg: isDark ? "#141414" : "#fcfcfc",
    infoBg: isDark ? "#2d2d2dff" : "#f5f5f5",
    infoBorder: isDark ? "#515151ff" : "#e0e0e0",
    textPrimary: isDark ? "#fff" : "#000",
    textSecondary: isDark ? "#999" : "#666",
    border: isDark ? "#333" : "#e0e0e0",
    borderActive: theme.palette.primary.main,
  };

  return (
    <Box sx={{ p: 1 }}>
      <Typography variant="h6" sx={{ mb: 3, fontWeight: 500, color: colors.textPrimary }}>
        Método de pago
      </Typography>

      {/* Tabs */}
      <Box
        sx={{
          display: "flex",
          gap: 0,
          mb: 3,
          bgcolor: isDark ? "#2d2d2d" : "#e0e0e0",
          borderRadius: 2,
          p: 0.5,
        }}
      >
        <Button
          fullWidth
          variant={paymentTab === "mercadopago" ? "contained" : "text"}
          onClick={() => onTabChange?.("mercadopago")}
          startIcon={<CreditCard />}
          sx={{
            bgcolor: paymentTab === "mercadopago" ? (isDark ? "#1a1a1a" : "#fff") : "transparent",
            color: paymentTab === "mercadopago" ? colors.textPrimary : colors.textSecondary,
            boxShadow: "none",
            textTransform: "none",
            fontWeight: 600,
            "&:hover": {
              bgcolor: paymentTab === "mercadopago" ? (isDark ? "#1a1a1a" : "#fff") : (isDark ? "#3d3d3d" : "#d0d0d0"),
            },
          }}
        >
          Mercado Pago
        </Button>
        <Button
          fullWidth
          variant={paymentTab === "manual" ? "contained" : "text"}
          onClick={() => onTabChange?.("manual")}
          startIcon={<PhoneIphone />}
          sx={{
            bgcolor: paymentTab === "manual" ? (isDark ? "#1a1a1a" : "#fff") : "transparent",
            color: paymentTab === "manual" ? colors.textPrimary : colors.textSecondary,
            boxShadow: "none",
            textTransform: "none",
            fontWeight: 600,
            "&:hover": {
              bgcolor: paymentTab === "manual" ? (isDark ? "#1a1a1a" : "#fff") : (isDark ? "#3d3d3d" : "#d0d0d0"),
            },
          }}
        >
          Pago Manual
        </Button>
      </Box>

      {/* Contenido según tab seleccionado */}
      {paymentTab === "mercadopago" ? (
        <Box>
          {/* Card informativo de Mercado Pago */}
          <Card
            elevation={0}
            sx={{
              border: `2px solid ${theme.palette.primary.main}`,
              borderRadius: 2,
              bgcolor: isDark ? "rgba(33, 150, 243, 0.1)" : "rgba(33, 150, 243, 0.05)",
              mb: 3,
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                <CreditCard sx={{ color: theme.palette.primary.main }} />
                <Typography variant="subtitle1" sx={{ fontWeight: 600, color: colors.textPrimary }}>
                  Pago con Mercado Pago
                </Typography>
              </Box>
              
              <Typography variant="body2" sx={{ color: colors.textSecondary, mb: 2 }}>
                Completa el formulario de pago de forma segura.
              </Typography>

              <Stack spacing={1}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <CheckCircle sx={{ fontSize: 18, color: "#4caf50" }} />
                  <Typography variant="body2" sx={{ color: colors.textPrimary }}>
                    Tarjetas de crédito y débito
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <CheckCircle sx={{ fontSize: 18, color: "#4caf50" }} />
                  <Typography variant="body2" sx={{ color: colors.textPrimary }}>
                    Pago en cuotas disponible
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <CheckCircle sx={{ fontSize: 18, color: "#4caf50" }} />
                  <Typography variant="body2" sx={{ color: colors.textPrimary }}>
                    Proceso 100% seguro
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>

          {/* Monto a pagar */}
          <Card
            elevation={0}
            sx={{
              border: `1px solid ${colors.border}`,
              borderRadius: 2,
              bgcolor: colors.innerCardBg,
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Typography variant="caption" sx={{ color: colors.textSecondary, display: "block", mb: 1 }}>
                Monto a pagar:
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 700, color: colors.textPrimary }}>
                S/ {quotationData?.advancePayment?.toFixed(2) || "4580,00"}
              </Typography>
            </CardContent>
          </Card>
        </Box>
      ) : (
        <Box>
          {/* Opciones de Pago con CardActionArea */}
          <Stack spacing={2} sx={{ mb: 3 }}>
            {paymentMethods.map((method) => (
              <Card
                key={method.id}
                elevation={0}
                sx={{
                  border:
                    paymentMethod === method.id
                      ? `2px solid ${colors.borderActive}`
                      : `1px solid ${colors.border}`,
                  borderRadius: 2,
                  bgcolor: colors.innerCardBg,
                  transition: "all 0.2s",
                }}
              >
                <CardActionArea onClick={() => onMethodChange(method.id)}>
                  <CardContent sx={{ p: 2, display: "flex", alignItems: "center", gap: 2 }}>
                    {paymentMethod === method.id ? (
                      <RadioButtonChecked sx={{ color: colors.borderActive }} />
                    ) : (
                      <RadioButtonUnchecked sx={{ color: colors.textSecondary }} />
                    )}

                    {/* Avatar con Logo o Icono */}
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
                      <Avatar sx={{ bgcolor: method.color, width: 40, height: 40 }}>
                        {method.icon}
                      </Avatar>
                    )}

                    <Box>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600, color: colors.textPrimary }}>
                        {method.name}
                      </Typography>
                      <Typography variant="caption" sx={{ color: colors.textSecondary }}>
                        {method.description}
                      </Typography>
                    </Box>
                  </CardContent>
                </CardActionArea>
              </Card>
            ))}
          </Stack>

          {/* Datos según método seleccionado */}
          {paymentMethod === "yape" && (
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
                  <Avatar
                    src="https://i.postimg.cc/MHYc1qSn/YAPE.jpg"
                    alt="Yape"
                    sx={{ width: 24, height: 24, bgcolor: "#fff" }}
                  />
                  <Typography variant="subtitle2" sx={{ color: colors.textPrimary, fontWeight: 600 }}>
                    Datos para Yape
                  </Typography>
                </Box>
                <Stack spacing={2}>
                  <InfoBox
                    isDark={isDark}
                    label="Número"
                    value={bankData.yapeNumber}
                    onCopy={() => onCopy(bankData.yapeNumber)}
                  />
                  <InfoBox isDark={isDark} label="Nombre" value={bankData.yapeName} />
                </Stack>
              </CardContent>
            </Card>
          )}

          {paymentMethod === "plin" && (
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
                  <Avatar
                    src="https://i.postimg.cc/NG8237Hf/logo-plin.jpg"
                    alt="Plin"
                    sx={{ width: 24, height: 24, bgcolor: "#fff" }}
                  />
                  <Typography variant="subtitle2" sx={{ color: colors.textPrimary, fontWeight: 600 }}>
                    Datos para Plin
                  </Typography>
                </Box>
                <Stack spacing={2}>
                  <InfoBox
                    isDark={isDark}
                    label="Número"
                    value={bankData.plinNumber}
                    onCopy={() => onCopy(bankData.plinNumber)}
                  />
                  <InfoBox isDark={isDark} label="Nombre" value={bankData.plinName} />
                </Stack>
              </CardContent>
            </Card>
          )}

          {paymentMethod === "transfer" && (
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
                  <AccountBalance sx={{ fontSize: 20, color: colors.textPrimary }} />
                  <Typography variant="subtitle2" sx={{ color: colors.textPrimary, fontWeight: 600 }}>
                    Datos Bancarios
                  </Typography>
                </Box>
                <Stack spacing={2}>
                  <InfoBox isDark={isDark} label="Banco" value={bankData.banco} />
                  <InfoBox
                    isDark={isDark}
                    label="Cuenta"
                    value={bankData.cuenta}
                    onCopy={() => onCopy(bankData.cuenta)}
                  />
                  <InfoBox isDark={isDark} label="CCI" value={bankData.cci} onCopy={() => onCopy(bankData.cci)} />
                  <InfoBox isDark={isDark} label="Titular" value={bankData.titular} />
                  <InfoBox isDark={isDark} label="RUC" value={bankData.ruc} />
                </Stack>
              </CardContent>
            </Card>
          )}
        </Box>
      )}
    </Box>
  );
};

const InfoBox = ({ isDark, label, value, onCopy }) => {
  const colors = {
    infoBg: isDark ? "#2d2d2dff" : "#f5f5f5",
    infoBorder: isDark ? "#515151ff" : "#e0e0e0",
    textPrimary: isDark ? "#fff" : "#000",
    textSecondary: isDark ? "#999" : "#666",
  };

  return (
    <Box
      sx={{
        border: `1px solid ${colors.infoBorder}`,
        borderRadius: 2,
        bgcolor: colors.infoBg,
        p: 1.5,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <Box>
        <Typography fontSize={13} color={colors.textSecondary}>
          {label}
        </Typography>
        <Typography fontSize={14} fontWeight={500} color={colors.textPrimary}>
          {value ?? "-"}
        </Typography>
      </Box>
      {onCopy && (
        <IconButton size="small" onClick={onCopy}>
          <ContentCopy sx={{ fontSize: 16, color: colors.textSecondary}} />
        </IconButton>
      )}
    </Box>
  );
};
