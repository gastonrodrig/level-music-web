import {
  Modal,
  Box,
  Typography,
  IconButton,
  TextField,
  Button,
} from "@mui/material";
import { Close, Add } from "@mui/icons-material";
import { useState } from "react";

export const ServiceFieldModal = ({
  open,
  onClose,
  attributes,
  onAddAttribute,
  onAddCustom,
}) => {
  const [customName, setCustomName] = useState("");

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{ p: 4, bgcolor: "#23232a", borderRadius: 3, maxWidth: 800, mx: "auto", mt: "30vh" }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6">Agregar Campo</Typography>
          <IconButton onClick={onClose}><Close /></IconButton>
        </Box>

        <Typography fontWeight={500} mb={2}>
          Atributos disponibles del tipo de servicio:
        </Typography>
        {attributes?.map((attr, idx) => (
          <Box key={idx} sx={{ mb: 2, display: "flex", alignItems: "center", gap: 1, bgcolor: "#000", borderRadius: 3, p: 1 }}>
            <IconButton color="primary" onClick={() => onAddAttribute(attr)}>
              <Add />
            </IconButton>
            <TextField
              value={`${attr.name} (${attr.type})`}
              fullWidth
              disabled
              sx={{
                "& .MuiInputBase-input.Mui-disabled": {
                  color: "black",
                  fontWeight: 500,
                  backgroundColor: "transparent",
                },
              }}
            />
            {attr.required && <Typography color="error">*</Typography>}
          </Box>
        ))}

        <Typography fontWeight={500} mt={2} mb={1}>
          O crear campo personalizado:
        </Typography>
        <Box display="flex" gap={1}>
          <TextField
            placeholder="Nombre del campo"
            fullWidth
            value={customName}
            onChange={(e) => setCustomName(e.target.value)}
          />
          <Button
            variant="contained"
            disabled={!customName}
            onClick={() => {
              onAddCustom(customName);
              setCustomName("");
            }}
          >
            <Add />
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};
