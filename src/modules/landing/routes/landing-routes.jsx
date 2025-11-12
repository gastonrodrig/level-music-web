import { Routes, Route, Navigate } from 'react-router-dom';
import {
  HomePage,
  EventsPage,
  AppointmentPage,
} from "../pages";

export const LandingRoutes = () => {
  return (
    <Routes>
      <Route index element={<HomePage />} />
      <Route path="events" element={<EventsPage />} />
      <Route path="appointment" element={<AppointmentPage />} />
      <Route path="*" element={<Navigate to="/not-found" replace />} />
    </Routes>
  );
};
