import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { SentinelProvider } from './context/SentinelContext';
import Layout from './components/layout/Layout';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Stations from './pages/Stations';
import StationDetails from './pages/StationDetails';
import LiveMap from './pages/LiveMap';
import Alerts from './pages/Alerts';
import Anomalies from './pages/Anomalies';
import SensorHealth from './pages/SensorHealth';
import Quarantine from './pages/Quarantine';
import Maintenance from './pages/Maintenance';
import Reports from './pages/Reports';
import ModelPerformance from './pages/ModelPerformance';
import Simulator from './pages/Simulator';
import Settings from './pages/Settings';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <SentinelProvider>
          <Routes>
            <Route path="/login" element={<Login />} />

            <Route path="/" element={<Layout />}>
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="stations" element={<Stations />} />
              <Route path="stations/:id" element={<StationDetails />} />
              <Route path="live-map" element={<LiveMap />} />
              <Route path="alerts" element={<Alerts />} />
              <Route path="alerts/:id" element={<StationDetails />} />
              <Route path="anomalies" element={<Anomalies />} />
              <Route path="anomalies/:id" element={<StationDetails />} />
              <Route path="sensor-health" element={<SensorHealth />} />
              <Route path="quarantine" element={<Quarantine />} />
              <Route path="maintenance" element={<Maintenance />} />
              <Route path="reports" element={<Reports />} />
              <Route path="model-performance" element={<ModelPerformance />} />
              <Route path="simulator" element={<Simulator />} />
              <Route path="settings" element={<Settings />} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Route>
          </Routes>
        </SentinelProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
