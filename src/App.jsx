import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

import Layout        from './components/Layout';
import Login         from './pages/Login';
import Register      from './pages/Register';
import Dashboard     from './pages/Dashboard';
import Invoices      from './pages/Invoices';
import CreateInvoice from './pages/CreateInvoice';
import InvoiceDetail from './pages/InvoiceDetail';
import Receipts      from './pages/Receipts';
import Clients       from './pages/Clients';
import Settings      from './pages/Settings';

function ProtectedRoute() {
  const { currentUser, loading } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-primary-800 border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-500 text-sm">Loading InvoicePro…</p>
        </div>
      </div>
    );
  }
  return currentUser ? <Outlet /> : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login"    element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route index             element={<Dashboard />} />
          <Route path="invoices">
            <Route index           element={<Invoices />} />
            <Route path="new"      element={<CreateInvoice />} />
            <Route path=":id"      element={<InvoiceDetail />} />
            <Route path=":id/edit" element={<CreateInvoice />} />
          </Route>
          <Route path="receipts"   element={<Receipts />} />
          <Route path="clients"    element={<Clients />} />
          <Route path="settings"   element={<Settings />} />
        </Route>
      </Route>

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
