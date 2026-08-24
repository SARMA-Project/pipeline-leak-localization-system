import React from 'react';
import { useFirebase } from '../contexts/FirebaseContext';
import { Wifi, Radio, Zap, Activity } from 'lucide-react';

export const Communications = () => {
  const { communications, loading } = useFirebase();

  if (loading || !communications) return <div className="p-6">Loading Communications Data...</div>;

  const avgRssi = communications.reduce((acc, c) => acc + c.rssi, 0) / communications.length;
  const avgLatency = communications.reduce((acc, c) => acc + c.latency, 0) / communications.length;

  return (
    <div className="h-full flex flex-col space-y-6 pb-6">
      <div>
        <h1 className="text-2xl font-bold text-steel-900">Network & Communications</h1>
        <p className="text-sm text-steel-500">LoRaWAN topology and signal health monitoring</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="glass-card p-4 border-t-4 border-t-brand-primary">
          <p className="text-xs font-bold text-steel-500 uppercase mb-1">Avg RSSI (Signal)</p>
          <p className="text-2xl font-bold text-steel-900">{avgRssi.toFixed(1)} dBm</p>
        </div>
        <div className="glass-card p-4 border-t-4 border-t-brand-secondary">
          <p className="text-xs font-bold text-steel-500 uppercase mb-1">Network Latency</p>
          <p className="text-2xl font-bold text-steel-900">{avgLatency.toFixed(0)} ms</p>
        </div>
        <div className="glass-card p-4 border-t-4 border-t-brand-warning">
          <p className="text-xs font-bold text-steel-500 uppercase mb-1">Packet Success</p>
          <p className="text-2xl font-bold text-steel-900">99.8%</p>
        </div>
        <div className="glass-card p-4 border-t-4 border-t-brand-info">
          <p className="text-xs font-bold text-steel-500 uppercase mb-1">Topology Type</p>
          <p className="text-2xl font-bold text-steel-900">Star-Mesh</p>
        </div>
      </div>

      <div className="glass-panel p-6 flex-1 overflow-hidden flex flex-col">
        <h3 className="text-lg font-bold text-steel-900 mb-4 border-b border-steel-100 pb-2">Node Communication Telemetry</h3>
        
        <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-steel-50 text-steel-500 text-xs uppercase tracking-wider sticky top-0 z-10">
                <th className="p-3 font-bold rounded-tl-lg">Node ID</th>
                <th className="p-3 font-bold">Network</th>
                <th className="p-3 font-bold">RSSI (dBm)</th>
                <th className="p-3 font-bold">SNR</th>
                <th className="p-3 font-bold">Latency (ms)</th>
                <th className="p-3 font-bold">Packet Loss</th>
                <th className="p-3 font-bold rounded-tr-lg">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-steel-100">
              {communications.map((comm) => {
                const isPoorSignal = comm.rssi < -85;
                return (
                  <tr key={comm.nodeId} className="hover:bg-steel-50/50 transition-colors">
                    <td className="p-3 font-bold text-steel-900 text-sm flex items-center">
                      <Radio className="w-4 h-4 mr-2 text-brand-primary" />
                      {comm.nodeId.toUpperCase()}
                    </td>
                    <td className="p-3 text-sm text-steel-600">{comm.type}</td>
                    <td className={`p-3 text-sm font-bold ${isPoorSignal ? 'text-brand-warning' : 'text-brand-secondary'}`}>
                      {comm.rssi.toFixed(1)}
                    </td>
                    <td className="p-3 text-sm text-steel-600">{comm.snr.toFixed(1)}</td>
                    <td className="p-3 text-sm text-steel-600">{comm.latency.toFixed(0)}</td>
                    <td className="p-3 text-sm">
                      {comm.packetLoss > 0 ? (
                        <span className="text-brand-danger font-bold">{comm.packetLoss}</span>
                      ) : (
                        <span className="text-brand-secondary font-bold">0</span>
                      )}
                    </td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${
                        isPoorSignal ? 'bg-brand-warning/10 text-brand-warning' : 'bg-brand-secondary/10 text-brand-secondary'
                      }`}>
                        {isPoorSignal ? 'Degraded' : 'Optimal'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
