import { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
  Box,
  Chip,
  TextField,
} from "@mui/material";
import { iconByCategory } from "../../constants"

export const ServiceModal = ({
  open,
  onClose,
  onSave,
  service,
  initialNote = "",
  simpleInline = false,
}) => {
  const [note, setNote] = useState(initialNote);

  const getIcon = (cat) => iconByCategory[cat];

  useEffect(() => {
    setNote(initialNote);
  }, [initialNote, open]);

  const body = (
    <Box>
      {!simpleInline && (
        <>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
            {service?.description}
          </Typography>
          {service?.category && (
            <Chip
              icon={getIcon(service.category)}
              label={service.category}
              size="small"
              variant="outlined"
              sx={{ mb: 2 }}
            />
          )}
        </>
      )}

      <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1 }}>
        Describe cómo quieres personalizar este servicio
      </Typography>
      <TextField
        fullWidth
        multiline
        minRows={simpleInline ? 3 : 6}
        placeholder="Ejemplo: Música pop/rock, evitar reggaetón, incluir primera danza..."
        value={note}
        onChange={(e) => setNote(e.target.value)}
        sx={{
          "& .MuiOutlinedInput-root": { borderRadius: 2 },
        }}
      />
    </Box>
  );

  if (simpleInline) {
    // versión simple embebida (para “otro servicio no listado”)
    return (
      <Box>
        {body}
        <Box sx={{ display: "flex", gap: 2, mt: 2, justifyContent: "flex-end" }}>
          <Button variant="outlined" onClick={onClose}>Cancelar</Button>
          <Button variant="contained" onClick={() => onSave(note)}>Guardar</Button>
        </Box>
      </Box>
    );
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        Personalizar: {service?.name}
      </DialogTitle>
      <DialogContent dividers sx={{ pt: 2 }}>{body}</DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button variant="outlined" onClick={onClose}>Cancelar</Button>
        <Button
          variant="contained"
          onClick={() => onSave(note)}
          disabled={!note?.trim()}
        >
          Guardar
        </Button>
      </DialogActions>
    </Dialog>
  );
};
