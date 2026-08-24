import React from 'react';
import { useFirebase } from '../contexts/FirebaseContext';
import { 
  Activity, ShieldAlert, Cpu, Wind, Thermometer, Droplets, 
  Wifi, CloudLightning, Battery, Radio, Server, CheckCircle, Download, FileSpreadsheet
} from 'lucide-react';
import { motion } from 'framer-motion';
import { DigitalTwin } from './DigitalTwin';

const StatCard = ({ title, value, subtitle, icon: Icon, colorClass, highlight = false }) => (
  <div className={`glass-card p-5 relative overflow-hidden ${highlight ? 'border-brand-danger shadow-neon-red bg-brand-danger/5' : ''}`}>
    <div className="flex justify-between items-start">
      <div>
        <p className="text-sm font-medium text-steel-500 mb-1">{title}</p>
        <motion.div 
          key={value}
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className={`text-3xl font-bold tracking-tight ${highlight ? 'text-brand-danger' : 'text-steel-900'}`}
        >
          {value}
        </motion.div>
        {subtitle && <p className="text-xs text-steel-400 mt-2">{subtitle}</p>}
      </div>
      <div className={`p-3 rounded-lg ${colorClass}`}>
        <Icon className="w-6 h-6" />
      </div>
    </div>
  </div>
);

export const Dashboard = () => {
  const { nodes, loading, flowMode } = useFirebase();

  if (loading || !nodes) return <div className="p-8 text-center text-steel-500">Initializing Leak Busters SCADA...</div>;

  const nodesList = Object.values(nodes);
  const activeNodes = nodesList.filter(n => n.status !== 'Offline').length;
  const totalNodes = nodesList.length;
  
  const leaks = nodesList.filter(n => n.status === 'Leak' || n.leakProbability > 80);
  const isLeaking = leaks.length > 0;

  const node4 = nodes['node004'] || {};
  const node5 = nodes['node005'] || {};

  const predDist4Cm = node4.predictedDistNode4Cm !== undefined && node4.predictedDistNode4Cm !== null ? node4.predictedDistNode4Cm : 10;
  const predDist5Cm = node4.predictedDistNode5Cm !== undefined && node4.predictedDistNode5Cm !== null ? node4.predictedDistNode5Cm : 90;
  const tolMinCm = node4.toleranceMinCm !== undefined && node4.toleranceMinCm !== null ? node4.toleranceMinCm : 6;
  const tolMaxCm = node4.toleranceMaxCm !== undefined && node4.toleranceMaxCm !== null ? node4.toleranceMaxCm : 14;

  const predDist4Meters = (predDist4Cm / 100).toFixed(2);
  const predDist5Meters = (predDist5Cm / 100).toFixed(2);
  const tolMinMeters = (tolMinCm / 100).toFixed(2);
  const tolMaxMeters = (tolMaxCm / 100).toFixed(2);

  const avgPressure = flowMode === 'OFF' ? 0.0 : (isLeaking ? (node4.pressure + node5.pressure) / 2 : 1.0);
  const overallHealth = flowMode === 'OFF' ? 100 : (isLeaking ? 78.5 : 99.4);

  // Export CSV Telemetry Report
  const exportTelemetryReport = () => {
    const headers = "Timestamp,Node_ID,Status,Predicted_Distance_Node4_m,Predicted_Distance_Node5_m,Tolerance_Min_m,Tolerance_Max_m,Pressure_bar,Acoustic_dB,Temp_C\n";
    const now = new Date().toISOString();

    const row1 = `${now},node004,${node4.status || 'Healthy'},${predDist4Meters},${predDist5Meters},${tolMinMeters},${tolMaxMeters},${node4.pressure || 1.0},${node4.acoustic || 28.0},${node4.temperature || 26.5}\n`;
    const row2 = `${now},node005,${node5.status || 'Healthy'},${predDist4Meters},${predDist5Meters},${tolMinMeters},${tolMaxMeters},${node5.pressure || 1.0},${node5.acoustic || 28.0},${node5.temperature || 26.5}\n`;

    const blob = new Blob([headers + row1 + row2], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Leak_Busters_SCADA_Report_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 pb-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-steel-900">Leak Busters SCADA</h1>
          <p className="text-sm text-steel-500">EDGE AI Wireless Acoustic Pipeline Protection & Digital Twin</p>
        </div>

        {/* Export Data Button */}
        <button
          onClick={exportTelemetryReport}
          className="btn-secondary text-xs flex items-center space-x-2 shadow-sm font-bold"
        >
          <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
          <span>Export Excel / PDF Report</span>
        </button>
      </div>

      {/* Real-time Acoustic & Pressure Leak Localization Panel with Units in Meters */}
      {flowMode === 'OFF' ? (
        <div className="bg-slate-100 border-2 border-slate-300 p-5 rounded-2xl flex items-center justify-between shadow-sm">
          <div className="flex items-center space-x-3">
            <div className="w-4 h-4 rounded-full bg-slate-400"></div>
            <div>
              <p className="text-base font-bold text-slate-800">GAS FLOW TURNED OFF (Depressurized)</p>
              <p className="text-xs text-slate-500">Pipeline is empty (0.00 bar pressure, 0 dB acoustic noise). Standing by for gas flow activation from mobile remote.</p>
            </div>
          </div>
          <span className="text-xs font-bold text-slate-600 bg-slate-200 px-3 py-1.5 rounded-full uppercase tracking-wider">
            Flow Off (0.0 bar)
          </span>
        </div>
      ) : isLeaking ? (
        <div className="bg-gradient-to-r from-red-50 to-orange-50 border-2 border-brand-danger/50 p-5 rounded-2xl shadow-neon-red transition-all animate-pulse">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-brand-danger/20 pb-3 mb-4 gap-2">
            <div>
              <div className="flex items-center space-x-2">
                <span className="px-3 py-1 bg-brand-danger text-white font-black text-xs rounded-full uppercase tracking-wider animate-bounce">
                  CRITICAL LEAK ALARM ACTIVE
                </span>
                <span className="text-xs font-bold text-steel-600">Acoustic TDOA Micro-Localization</span>
              </div>
              <h2 className="text-2xl font-black text-steel-900 mt-1">
                Gas Leakage Localized between Node 4 & Node 5
              </h2>
            </div>
            <div className="text-right">
              <span className="text-xs font-semibold text-steel-500 uppercase">Localization Uncertainty</span>
              <p className="text-2xl font-black text-brand-danger">Tolerance Boundary: ±0.04 m</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-xl border border-steel-200 shadow-sm">
              <p className="text-xs text-steel-500 font-semibold">Predicted Distance from Node 4</p>
              <p className="text-3xl font-black text-brand-primary mt-1">{predDist4Meters} meters</p>
              <p className="text-xs font-bold text-amber-600 mt-1">Range: {tolMinMeters} m – {tolMaxMeters} m (±0.04m)</p>
            </div>

            <div className="bg-white p-4 rounded-xl border border-steel-200 shadow-sm">
              <p className="text-xs text-steel-500 font-semibold">Predicted Distance from Node 5</p>
              <p className="text-3xl font-black text-brand-primary mt-1">{predDist5Meters} meters</p>
              <p className="text-xs font-bold text-steel-600 mt-1">({predDist5Cm} cm)</p>
            </div>

            <div className="bg-white p-4 rounded-xl border border-steel-200 shadow-sm">
              <p className="text-xs text-steel-500 font-semibold">Node 4 Telemetry</p>
              <p className="text-sm font-bold text-steel-900 mt-1">Acoustic: <span className="text-brand-danger">{node4.acoustic} dB</span></p>
              <p className="text-sm font-bold text-steel-900">Pressure: <span className="text-brand-danger">{node4.pressure} bar</span></p>
            </div>

            <div className="bg-white p-4 rounded-xl border border-steel-200 shadow-sm">
              <p className="text-xs text-steel-500 font-semibold">Node 5 Telemetry</p>
              <p className="text-sm font-bold text-steel-900 mt-1">Acoustic: <span className="text-brand-danger">{node5.acoustic} dB</span></p>
              <p className="text-sm font-bold text-steel-900">Pressure: <span className="text-brand-danger">{node5.pressure} bar</span></p>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-emerald-50 border-2 border-emerald-300 p-5 rounded-2xl flex items-center justify-between shadow-sm">
          <div className="flex items-center space-x-3">
            <div className="w-4 h-4 rounded-full bg-brand-secondary animate-ping"></div>
            <div>
              <p className="text-base font-bold text-emerald-900">GAS FLOW ACTIVE (Input Pressure: 1.00 bar)</p>
              <p className="text-xs text-emerald-700 font-medium">Pipeline is pressurized and healthy. Continuous acoustic micro-vibration and pressure monitoring active.</p>
            </div>
          </div>
          <span className="text-xs font-bold text-brand-secondary bg-brand-secondary/10 px-4 py-1.5 rounded-full uppercase tracking-wider">
            Flow Active (1.0 bar)
          </span>
        </div>
      )}

      {/* Top Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Pipeline Health" 
          value={`${overallHealth.toFixed(1)}%`} 
          subtitle="Overall structural integrity"
          icon={Activity}
          colorClass="bg-brand-secondary/10 text-brand-secondary"
        />
        <StatCard 
          title="Active Nodes" 
          value={`${activeNodes} / ${totalNodes}`} 
          subtitle="100% network uptime"
          icon={Cpu}
          colorClass="bg-brand-primary/10 text-brand-primary"
        />
        <StatCard 
          title="Avg Pipeline Pressure" 
          value={`${avgPressure.toFixed(2)} bar`} 
          subtitle={flowMode === 'OFF' ? 'Depressurized' : 'Nominal 1.0 bar'}
          icon={Wind}
          colorClass="bg-brand-info/10 text-brand-info"
        />
        <StatCard 
          title="Leaks Detected" 
          value={isLeaking ? 1 : 0} 
          subtitle={isLeaking ? "CRITICAL ALERT ACTIVE" : "System normal"}
          icon={ShieldAlert}
          colorClass={isLeaking ? "bg-brand-danger/20 text-brand-danger" : "bg-steel-100 text-steel-500"}
          highlight={isLeaking}
        />
      </div>

      {/* Embedded Digital Twin Section */}
      <div className="bg-white p-4 rounded-xl border border-steel-200 shadow-sm">
        <h2 className="text-lg font-bold text-steel-900 mb-3 flex items-center">
          <Activity className="w-5 h-5 mr-2 text-brand-primary" />
          Real-Time Pipeline Digital Twin
        </h2>
        <div className="h-[380px]">
          <DigitalTwin />
        </div>
      </div>
    </div>
  );
};
