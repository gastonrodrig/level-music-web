import React from 'react';
import { Snackbar, Alert } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useSelector, useDispatch } from 'react-redux';

// Estilo personalizado del Alert
const CustomAlert = styled(Alert)(({ theme }) => ({
  backgroundColor: '#1D1D1D',
  color: '#ffffff',
  fontWeight: 500,
  borderRadius: '8px',
  boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.5)',
  alignItems: 'center',
  '& .MuiAlert-icon': {
    display: 'none',
  },
}));

export const GlobalSnackbar = () => {
  const dispatch = useDispatch();
  const { open, message } = useSelector((state) => state.ui.snackbar);

  const handleClose = () => {
    dispatch({ type: 'ui/closeSnackbar' });
  };

  return (
    <Snackbar
      open={open}
      autoHideDuration={5000}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
    >
      <CustomAlert onClose={handleClose} sx={{ width: '100%' }}>
        {message}
      </CustomAlert>
    </Snackbar>
  );
};
