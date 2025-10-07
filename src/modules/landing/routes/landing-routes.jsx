import { Routes, Route, Navigate } from 'react-router-dom';
import { HomePage, EventsPage, QuotationPage } from '../pages';
import { LandingLayout } from '../layout/landing-layout';
import { ActivationPage } from '../pages';

export const LandingRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="events" element={<EventsPage />} />
      <Route
        path="quotation"
        element={
          <LandingLayout>
            <QuotationPage />
          </LandingLayout>
        }
      />
      <Route path="activation" element={<ActivationPage />} />
      <Route path="*" element={<Navigate to="/not-found" replace />} />
    </Routes>
  );
};
