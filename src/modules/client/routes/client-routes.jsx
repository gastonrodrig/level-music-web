import { Navigate, Route, Routes } from "react-router-dom";
import { DashboardPage,
   EventMadePage,
   EventsOngoingPage,
   QuotationPage, 
   QuotationDetailsPage,
   ProfilePage,
   ReprogramingsRequestsPage,
   QuotationPaymentsPage
} from "../pages";
import { ClientLayout } from '../layout/client-layout';

export const ClientRoutes = () => {
  return (
    <Routes>
      <Route element={<ClientLayout />}>
        {/* Dashboard */}
        <Route path="/" element={<DashboardPage />} />

        {/* Eventos */}
        <Route path="events-made" element={<EventMadePage />} />
        <Route path="events-ongoing" element={<EventsOngoingPage />} />
        <Route path="quotations" element={<QuotationPage />} />
        <Route path="quotations/details" element={<QuotationDetailsPage />} />
        <Route path="reprogramming-requests" element={<ReprogramingsRequestsPage />} />
        <Route path="quotations/payments" element={<QuotationPaymentsPage />} />

        {/* Clientes */}
        <Route path="edit-profile" element={<ProfilePage />} />

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/not-found" replace />} />
      </Route>
    </Routes>
  );
};
