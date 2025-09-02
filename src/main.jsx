import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import { App } from './App.jsx';
import { GlobalSnackbar } from './shared/ui/components/';

import '@fontsource/mulish';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
        <GlobalSnackbar /> 
      </BrowserRouter>
    </Provider>
  </StrictMode>
);
