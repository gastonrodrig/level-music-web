import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import { App } from './App.jsx';
import { GlobalSnackbar } from './shared/ui/components/';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import '@fontsource/mulish';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <LocalizationProvider 
          dateAdapter={AdapterDayjs} 
          adapterLocale="es"
        >
          <App />
          <GlobalSnackbar /> 
        </LocalizationProvider>
      </BrowserRouter>
    </Provider>
  </StrictMode>
);
