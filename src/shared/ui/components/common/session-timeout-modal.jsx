import { Modal, Box, Typography, Button } from '@mui/material';

export const SessionTimeoutModal = ({ open, countdown, onLogout }) => {
  return (
    <Modal open={open} disableEscapeKeyDown>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          bgcolor: 'background.paper',
          p: 4,
          borderRadius: 3,
          textAlign: 'center',
          boxShadow: 24,
          minWidth: 340,
          maxWidth: 420,
          mx: 2,
        }}
      >
        <Typography
          variant="h6"
          gutterBottom
          sx={{
            color: 'primary.main',
            fontWeight: 700,
            mb: 1.5,
          }}
        >
          Tu sesión ha expirado
        </Typography>
        <Typography
          variant="body1"
          gutterBottom
          sx={{ color: 'text.secondary', mb: 2 }}
        >
          Serás redirigido en <b>{countdown}</b> segundos...
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={onLogout}
          sx={{
            borderRadius: 2,
            px: 4,
            fontWeight: 600,
            boxShadow: 2,
            textTransform: 'none',
          }}
        >
          Cerrar sesión ahora
        </Button>
      </Box>
    </Modal>
  );
};
