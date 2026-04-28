import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { BillingProvider, useBilling } from './context/BillingContext';

import Login from './components/Login';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import NewBill from './components/NewBill';
import Records from './components/Records';
import PrintView from './components/PrintView';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useBilling();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="new-bill" element={<NewBill />} />
        <Route path="records" element={<Records />} />
        <Route path="print/:id" element={<PrintView />} />
      </Route>
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <BillingProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </BillingProvider>
  );
};

export default App;
