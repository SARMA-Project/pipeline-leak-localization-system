import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { FirebaseProvider } from './contexts/FirebaseContext';
import { Layout } from './components/Layout';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { DigitalTwin } from './pages/DigitalTwin';
import { LiveMap } from './pages/LiveMap';
import { Analytics } from './pages/Analytics';
import { PredictiveMaintenance } from './pages/PredictiveMaintenance';
import { Alarms } from './pages/Alarms';
import { Communications } from './pages/Communications';
import { EmergencyResponse } from './pages/EmergencyResponse';
import { OperatorPanel } from './pages/OperatorPanel';
import { Settings } from './pages/Settings';
import { AIAssistant } from './pages/AIAssistant';
import { MobileRemote } from './pages/MobileRemote';

function App() {
  return (
    <FirebaseProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/remote" element={<MobileRemote />} />
          
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="twin" element={<DigitalTwin />} />
            <Route path="map" element={<LiveMap />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="maintenance" element={<PredictiveMaintenance />} />
            <Route path="alarms" element={<Alarms />} />
            <Route path="communications" element={<Communications />} />
            <Route path="operator" element={<OperatorPanel />} />
            <Route path="settings" element={<Settings />} />
            <Route path="emergency" element={<EmergencyResponse />} />
            <Route path="ai" element={<AIAssistant />} />
          </Route>
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </FirebaseProvider>
  );
}

export default App;
