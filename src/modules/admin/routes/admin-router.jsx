import { Routes, Route, Navigate } from 'react-router-dom';
import { 
  DashboardPage, 
  EventOnGoing,
  EventQuotationReprograming,
  EventTypePage,
  EventQuotationsPage,
  WorkerPage,
  WorkerTypePage,
  EquipmentPage,
  EquipmentMaintenancePage,
  StorehousePage,
  ServicePage,
  ServiceAddPage,
  ServiceEditPage,
  ServiceTypePage,
  ProviderPage,
  EventFeaturedPage,
  ClientPersonPage,
  ClientCompanyPage,
  AssignResourcesPage,
  EventQuotationAddPage,
  EventQuotationEditPage,
  RequestsPage,
  ReschedulePage,
  EventPaymentsProgrammingPage
} from '../pages';
import { AdminLayout } from '../layout/admin-layout';

export const AdminRoutes = () => {
  return (
    <Routes>
      <Route element={<AdminLayout />}>
        {/* Dashboard */}
        <Route path="/" element={<DashboardPage />} />

        {/* Eventos */}
        <Route path="event-ongoing" element={<EventOnGoing />} />
        <Route path="event-ongoing/reprogramming" element={<EventQuotationReprograming />} />
        <Route path="event-types" element={<EventTypePage />} />
        <Route path="quotations" element={<EventQuotationsPage />} />
        <Route path="quotations/assign" element={<AssignResourcesPage />} />
        <Route path="quotations/new" element={<EventQuotationAddPage />} />
        <Route path="quotations/edit" element={<EventQuotationEditPage />} />
        <Route path="quotations/payments-programming" element={<EventPaymentsProgrammingPage />} />
        <Route path="featured-events" element={<EventFeaturedPage />} />
        
        {/* Reprogramaciones */}
        <Route path="requests" element={<RequestsPage />} />
        <Route path="reschedule" element={<ReschedulePage />} />

       {/* Trabajadores */}
        <Route path="workers" element={<WorkerPage />} />
        <Route path="worker-types" element={<WorkerTypePage />} />

        {/* Equipos */}
        <Route path="equipments" element={<EquipmentPage />} />
        <Route path="equipment-maintenance" element={<EquipmentMaintenancePage />} />

        {/* Almacén */}
        <Route path="storehouse" element={<StorehousePage />} />

        {/* Servicios */}
        <Route path="service" element={<ServicePage />} />
        <Route path="service/new" element={<ServiceAddPage />} />
        <Route path="service/edit" element={<ServiceEditPage />} />
        <Route path="service-type" element={<ServiceTypePage />} />
        <Route path="provider" element={<ProviderPage />} />

        {/* Clientes */}
        <Route path="client-person" element={<ClientPersonPage />} />
        <Route path="client-company" element={<ClientCompanyPage />} />

        {/* Rutas no encontradas */}
        <Route path="*" element={<Navigate to="/not-found" replace />} />
      </Route>
    </Routes>
  );
};
