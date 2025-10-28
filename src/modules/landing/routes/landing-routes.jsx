import { Routes, Route, Navigate } from 'react-router-dom';
import {
  HomePage,
  EventsPage,
  ActivationErrorPage,
  ActivationProcessingPage,
  ActivationSuccessPage,
  AppointmentPage,
} from "../pages";

export const LandingRoutes = () => {
  return (
    <Routes>
      <Route index element={<HomePage />} />
      <Route path="events" element={<EventsPage />} />
      <Route path="appointment" element={<AppointmentPage />} />
      <Route path="t/:token" element={<ActivationProcessingPage />} />
      <Route path="activation/error" element={<ActivationErrorPage />} />
      <Route path="activation/success" element={<ActivationSuccessPage />} />
      <Route path="*" element={<Navigate to="/not-found" replace />} />
    </Routes>
  );
};
