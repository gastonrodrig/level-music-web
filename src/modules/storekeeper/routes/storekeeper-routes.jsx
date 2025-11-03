import { Navigate, Route, Routes } from "react-router-dom";
import { StorekeeperLayout } from "../layout/storekeeper-layout";
import {
  DashboardPage,
  MovementsPage,
  ProfilePage,
  ReportsPage,
} from "../pages";

export const StorekeeperRoutes = () => {
  return (
    <Routes>
      <Route element={<StorekeeperLayout />}>
        {/* Dashboard */}
        <Route path="/" element={<DashboardPage />} />

        {/* Movements */}
        <Route path="movements" element={<MovementsPage />} />

        {/* Reports */}
        <Route path="reports" element={<ReportsPage />} />

        {/* Profile */}
        <Route path="view-profile" element={<ProfilePage />} />

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/not-found" replace />} />
      </Route>
    </Routes>
  );
};
