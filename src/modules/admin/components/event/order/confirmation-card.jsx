import {
  Card,
  CardContent,
  Typography,
  Button,
  useTheme,
  Grid,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { useEventStore, useQuotationStore } from "../../../../../hooks";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useMemo } from "react";

export const ConfirmationCard = () => {
  const { selected } = useQuotationStore();
  const { loading, startSendingPurchaseOrder } = useEventStore();
  const navigate = useNavigate();

  const theme = useTheme();

  const { handleSubmit } = useForm();

  const totalProviders = new Set(
    (selected?.assignations || []).map((a) => a.service_provider_name)
  ).size;

  const pluralLabel =
    totalProviders === 1 ? "1 proveedor" : `${totalProviders} proveedores`;

  const onSubmit = async () => {
    const result = await startSendingPurchaseOrder(selected._id);
    if (result) navigate("/admin/event-ongoing");
  }

  const isButtonDisabled = useMemo(() => loading, [loading]);

  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: 3,
        bgcolor: theme.palette.mode === "dark" ? "#1f1e1e" : "#f5f5f5",
        mb: 3,
      }}
    >
      <CardContent>
        <Grid
          container
          alignItems="center"
          justifyContent="space-between"
          spacing={2}
        >
          {/* Texto de la izquierda */}
          <Grid item xs={12} md={9}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              Enviar Órdenes de Compra
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Se enviará un correo con los detalles del evento a cada proveedor ({pluralLabel})
            </Typography>
          </Grid>

          {/* Botón */}
          <Grid item xs={12} md={3}>
            <Button
              variant="contained"
              onClick={handleSubmit(onSubmit)}
              fullWidth
              startIcon={<SendIcon />}
              sx={{
                py: 1,
                boxShadow: "none",
                textTransform: "none",
                fontWeight: 600,
                color: "#fff",
                borderRadius: 2,
              }}
              disabled={isButtonDisabled}
            >
              Enviar Órdenes de Compra
            </Button>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};
