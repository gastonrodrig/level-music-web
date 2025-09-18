import {
  Modal,
  Box,
  Typography,
  IconButton,
  TextField,
  Button,
  useTheme,
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
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const [customName, setCustomName] = useState("");

  return (
    <Modal open={open} onClose={onClose}>
      <Box 
        sx={{ 
          p: 3, 
          bgcolor: "background.paper", 
          borderRadius: 3, 
          width: { xs: "90%", sm: 600 },
          mx: "auto", 
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      >
        <Box 
          display="flex" 
          justifyContent="space-between" 
          alignItems="center" 
          mb={2}
        >
          <Typography variant="h6" fontWeight={600}>
            Agregar Campo
          </Typography>
          <IconButton onClick={onClose}>
            <Close />
          </IconButton>
        </Box>

        <Typography fontWeight={500} mb={2}>
          Atributos disponibles del tipo de servicio:
        </Typography>
        {attributes?.map((attr, idx) => (
          <Box 
            key={idx} 
            sx={{ 
              mb: 2, 
              display: "flex", 
              alignItems: "center", 
              gap: 1, 
              bgcolor: isDark ? "#1f1e1e" : "#f5f5f5", 
              borderRadius: 3, 
              p: 1 
            }}
          >
            <IconButton color="primary" onClick={() => onAddAttribute(attr)}>
              <Add />
            </IconButton>
            <TextField
              value={`${attr.name} (${attr.type})`}
              fullWidth
              disabled
              sx={{
                "& .MuiInputBase-input.Mui-disabled": {
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
