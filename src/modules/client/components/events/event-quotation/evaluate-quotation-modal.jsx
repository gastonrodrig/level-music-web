import {
  Modal,
  Box,
  Typography,
  Button,
  IconButton,
  Stack,
  useTheme,
} from "@mui/material";
import { Close, EditNote } from "@mui/icons-material";
import { useForm } from "react-hook-form";
import { useAuthStore, useQuotationStore } from "../../../../../hooks";
import { useMemo } from "react";

export const EventEvaluateModal = ({
  open = false,
  onClose = () => {},
  quotationId,
}) => {
  const isDark = useTheme().palette.mode === "dark";
  const { _id } = useAuthStore();
  const { startEvaluateQuotation, loading } = useQuotationStore();
  const { handleSubmit, setValue } = useForm();

  const isButtonDisabled = useMemo(() => loading, [loading]);

  const onSubmit = async (data) => {
    const success = await startEvaluateQuotation(quotationId, data, _id);
    if (success) onClose();
  };

  const handleAction = (statusValue) => {
    setValue("status", statusValue);
    handleSubmit(onSubmit)();
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: { xs: "90%", sm: 380 },
          bgcolor: "background.paper",
          borderRadius: 4,
          boxShadow: 24,
          p: 4,
        }}
      >
        {/* Header */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <EditNote color="primary" />
            <Typography variant="h6" fontWeight={600}>
              Evaluar cotización
            </Typography>
          </Stack>
          <IconButton onClick={onClose}>
            <Close />
          </IconButton>
        </Box>

        {/* Textos */}
        <Typography variant="body2" color="text.secondary" mb={1.5}>
          Revisa los detalles de tu evento y confirma si deseas continuar.
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={3}>
          Al aprobar, se habilitará el primer pago parcial para reservar tu evento.
        </Typography>

        {/* Botones */}
        <Stack direction="row" spacing={2} justifyContent="center">
          <Button
            type="button"
            variant="contained"
            sx={{
              mt: 1,
              backgroundColor: "primary.main",
              color: "#fff",
              textTransform: "none",
              py: 1.5,
              px: 4,
              borderRadius: 2,
              fontWeight: 600,
              flex: 1,
              "&:hover": {
                backgroundColor: "primary.dark",
              },
            }}
            onClick={() => handleAction("Aprobado")}
            disabled={isButtonDisabled}
          >
            Aprobar
          </Button>

          <Button
            type="button"
            variant="contained"
            sx={{
              mt: 1,
              backgroundColor: "#212121",
              color: "#fff",
              textTransform: "none",
              py: 1.5,
              px: 4,
              borderRadius: 2,
              fontWeight: 600,
              flex: 1,
              "&:hover": {
                backgroundColor: "#424242",
              },
            }}
            onClick={() => handleAction("En Revisión")}
            disabled={isButtonDisabled}
          >
            Rechazar
          </Button>
        </Stack>
      </Box>
    </Modal>
  );
};
