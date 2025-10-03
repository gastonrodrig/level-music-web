import { Navigate, Route, Routes } from "react-router-dom";
import { DashboardPage,
   EventMadePage,
   EventToDoPage,
   QuotationPage, 
   EventQuotesDetails,
   ProfilePage,
   ReprogramingsRequestsPage
} from "../pages";
import { ClientLayout } from '../layout/client-layout';

export const ClientRoutes = () => {
  return (
    <Routes>
      <Route element={<ClientLayout />}>
        {/* Dashboard */}
        <Route path="/" element={<DashboardPage />} />

        {/* Eventos */}
        <Route path="event-made" element={<EventMadePage />} />
        <Route path="event-to-do" element={<EventToDoPage />} />
        <Route path="event-quotes" element={<QuotationPage />} />
        <Route path="event-quotes/details" element={<EventQuotesDetails />} />
        <Route path="reprogramings-requests" element={<ReprogramingsRequestsPage />} />
        {/* Clientes */}
        <Route path="edit-profile" element={<ProfilePage />} />

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/not-found" replace />} />
      </Route>
    </Routes>
  );
};
