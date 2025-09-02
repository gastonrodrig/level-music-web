import { Navigate, Route, Routes } from "react-router-dom";
import { DashboardPage,
   EventMadePage,
   EventToDoPage, 
  ProfilePage
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
       {/* Clientes */}
        <Route path="edit-profile" element={<ProfilePage />} />
            
       <Route path="*" element={<Navigate to="/not-found" replace />} />
      </Route>
    </Routes>
  );
};