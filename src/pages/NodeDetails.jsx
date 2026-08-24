import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useFirebase } from '../contexts/FirebaseContext';
import { 
  ArrowLeft, Cpu, Thermometer, Wind, Waves, 
  Battery, Activity, Signal, ShieldCheck,
  Zap, Settings2, RefreshCcw
} from 'lucide-react';

const DetailCard = ({ title, value, unit, icon: Icon, color }) => (
  <div className="glass-card flex items-center space-x-4">
    <div className={`p-4 rounded-xl ${color} bg-opacity-20 flex-shrink-0`}>
      <Icon className={`w-8 h-8 ${color.replace('bg-', 'text-')}`} />
    </div>
    <div>
      <p className="text-gray-600 text-sm font-medium">{title}</p>
      <div className="flex items-baseline space-x-1">
        <span className="text-2xl font-bold text-gray-900">
          {typeof value === 'number' ? value.toFixed(1) : value}
        </span>
        {unit && <span className="text-gray-600">{unit}</span>}
      </div>
    </div>
  </div>
);

export const NodeDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { nodes, loading } = useFirebase();

  if (loading) return <div className="text-gray-900 p-6">Loading Node Details...</div>;
  
  const node = nodes && nodes[id];

  if (!node) {
    return (
      <div className="text-center p-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Node Not Found</h2>
        <button 
          onClick={() => navigate('/nodes')}
          className="btn-primary"
        >
          Return to Nodes List
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 h-full pb-6">
      <div className="flex items-center space-x-4">
        <button 
          onClick={() => navigate(-1)}
          className="p-2 rounded-lg bg-white text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Cpu className="w-8 h-8 text-brand-primary" />
            {node.id.toUpperCase()}
          </h1>
          <p className="text-gray-600 mt-1 flex items-center space-x-2">
            <span>ESP32 Master Node</span>
            <span>•</span>
            <span className={node.status === 'Healthy' ? 'text-brand-secondary' : 'text-brand-warning'}>
              {node.status}
            </span>
            <span>•</span>
            <span>Last Update: {new Date(node.timestamp).toLocaleTimeString()}</span>
          </p>
        </div>
        <div className="ml-auto flex space-x-3">
          <button className="flex items-center space-x-2 px-4 py-2 bg-white rounded-lg text-gray-900 hover:bg-gray-100 transition-colors border border-gray-200">
            <RefreshCcw className="w-4 h-4" />
            <span>Reboot</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-2 bg-brand-primary/20 text-brand-primary rounded-lg hover:bg-brand-primary hover:text-gray-900 transition-colors border border-brand-primary/30">
            <Settings2 className="w-4 h-4" />
            <span>Configure</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <DetailCard title="Temperature" value={node.temperature} unit="°C" icon={Thermometer} color="bg-brand-primary" />
        <DetailCard title="Pressure" value={node.pressure} unit="bar" icon={Activity} color="bg-brand-accent" />
        <DetailCard title="Gas Concentration" value={node.gas} unit="ppm" icon={Wind} color="bg-brand-warning" />
        <DetailCard title="Acoustic Level" value={node.acoustic} unit="dB" icon={Waves} color="bg-brand-primary" />
        
        <DetailCard title="Battery" value={node.battery} unit="%" icon={Battery} color={node.battery > 20 ? "bg-brand-secondary" : "bg-brand-danger"} />
        <DetailCard title="Signal (RSSI)" value={node.signal} unit="dBm" icon={Signal} color="bg-brand-secondary" />
        <DetailCard title="Health Score" value={node.health} unit="%" icon={ShieldCheck} color="bg-brand-secondary" />
        <DetailCard title="Voltage" value={3.3 + Math.random() * 0.1} unit="V" icon={Zap} color="bg-brand-warning" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <div className="glass-panel p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4 border-b border-gray-200 pb-2">Hardware Information</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Master Controller</span>
              <span className="text-gray-900 font-medium">{node.masterNode}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">ESP Type</span>
              <span className="text-gray-900 font-medium">ESP32-WROOM-32</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Firmware Version</span>
              <span className="text-gray-900 font-medium">v2.4.1 (Latest)</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Solar Charging Status</span>
              <span className="text-brand-secondary font-medium flex items-center gap-1">
                <Zap className="w-4 h-4" /> Active (2.1W)
              </span>
            </div>
          </div>
        </div>

        <div className="glass-panel p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4 border-b border-gray-200 pb-2">Location Data</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Latitude</span>
              <span className="text-gray-900 font-medium">{node.latitude.toFixed(6)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Longitude</span>
              <span className="text-gray-900 font-medium">{node.longitude.toFixed(6)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">GPS Accuracy</span>
              <span className="text-gray-900 font-medium">± 2.5m</span>
            </div>
            <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-200">
              <span className="text-gray-600">AI Leak Probability</span>
              <span className={`font-bold ${node.leakProbability > 50 ? 'text-brand-danger shadow-neon-red' : 'text-brand-secondary'}`}>
                {node.leakProbability.toFixed(1)}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
