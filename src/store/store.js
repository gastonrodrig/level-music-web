import { configureStore } from '@reduxjs/toolkit';
import { 
  authSlice,
  themeSlice,
  workersSlice,
  workerTypesSlice,
  providerSlice,
  serviceTypeSlice,
  stepperSlice,
  uiSlice,
  serviceSlice,
  eventTypeSlice,
  eventFeaturedSlice,
  resourceSlice,
  maintenanceSlice,
  clientProfileSlice,
  clientPersonSlice,
  clientCompanySlice,
  quotationSlice
} from './';

export const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    theme: themeSlice.reducer,
    eventType: eventTypeSlice.reducer,
    eventFeatured: eventFeaturedSlice.reducer,
    workers: workersSlice.reducer,
    workerTypes: workerTypesSlice.reducer,
    stepper: stepperSlice.reducer,
    ui: uiSlice.reducer,
    provider: providerSlice.reducer,
    service: serviceSlice.reducer,
    serviceType: serviceTypeSlice.reducer,
    resource: resourceSlice.reducer,
    maintenance: maintenanceSlice.reducer,
    clientProfile: clientProfileSlice.reducer,
    clientPerson: clientPersonSlice.reducer,
    clientCompany: clientCompanySlice.reducer,
    quotation: quotationSlice.reducer,
  },
});
