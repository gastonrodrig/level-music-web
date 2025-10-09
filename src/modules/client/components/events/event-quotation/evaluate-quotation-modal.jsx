import React from 'react';
import { Modal, Box, Typography, Button, IconButton } from '@mui/material';
import { Close } from '@mui/icons-material';

export const EventEvaluateModal = ({
  open = true,
  onClose = () => {},
  onApprove = () => {},
  onReject = () => {},
}) => {
  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: { xs: '90%', sm: 350 },
          bgcolor: 'background.paper',
          borderRadius: 4,
          boxShadow: 24,
          p: 4,
        }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6" fontWeight={600}>
            Evaluar Cotización
          </Typography>
          <IconButton onClick={onClose}>
            <Close />
          </IconButton>
        </Box>
        <Typography mb={3}>
          ¿Deseas aprobar o desaprobar esta cotización?
        </Typography>
        <Box display="flex" gap={2} justifyContent="center">
          <Button
            variant="contained"
            color="success"
            onClick={onApprove}
          >
            Aprobar
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={onReject}
          >
            Desaprobar
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};
