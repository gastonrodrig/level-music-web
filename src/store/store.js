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
  clientSlice,
  extraDataSlice
} from './';

export const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    theme: themeSlice.reducer,
    eventType: eventTypeSlice.reducer,
    eventFeatured: eventFeaturedSlice.reducer,
    workers: workersSlice.reducer,
    workerTypes: workerTypesSlice.reducer,
    extraData: extraDataSlice.reducer,
    stepper: stepperSlice.reducer,
    ui: uiSlice.reducer,
    provider: providerSlice.reducer,
    service: serviceSlice.reducer,
    serviceType: serviceTypeSlice.reducer,
    resource: resourceSlice.reducer,
    maintenance: maintenanceSlice.reducer,
    client: clientSlice.reducer,
  },
});
