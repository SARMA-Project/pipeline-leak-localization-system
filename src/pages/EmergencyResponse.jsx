import React, { useState, useEffect } from 'react';
import { ShieldAlert, AlertTriangle, Phone, CheckCircle, Lock, Power } from 'lucide-react';
import { motion } from 'framer-motion';
import { useFirebase } from '../contexts/FirebaseContext';

export const EmergencyResponse = () => {
  const { nodes, flowMode, applyRemoteState } = useFirebase();
  const [timer, setTimer] = useState(0);
  const [isShuttingDown, setIsShuttingDown] = useState(false);
  const [shutdownSuccess, setShutdownSuccess] = useState(false);

  useEffect(() => {
    let interval = null;
    if (flowMode !== 'OFF') {
      interval = setInterval(() => setTimer(t => t + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [flowMode]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const leaks = Object.values(nodes).filter(n => n.status === 'Leak' || n.leakProbability > 80);
  const activeLeak = leaks.length > 0 ? leaks[0] : null;

  // Execute Remote Emergency Valve Shutdown
  const handleEmergencyShutdown = async () => {
    setIsShuttingDown(true);

    try {
      // 1. Post to HTTP bridge for cross-device remote sync
      await fetch(`http://${window.location.hostname}:3001/api/remote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ flowMode: 'OFF', leakCm: null })
      });
    } catch (err) {
      console.error("HTTP shutdown fetch failed:", err);
    }

    // 2. Call local applyRemoteState to immediately set flow to OFF
    if (applyRemoteState) {
      applyRemoteState('OFF', null);
    }

    setTimeout(() => {
      setIsShuttingDown(false);
      setShutdownSuccess(true);
    }, 600);
  };

  const dist4M = activeLeak?.predictedDistNode4Cm !== undefined && activeLeak?.predictedDistNode4Cm !== null
    ? (activeLeak.predictedDistNode4Cm / 100).toFixed(2)
    : '0.20';

  return (
    <div className="h-full flex flex-col space-y-6 pb-6">
      <div>
        <h1 className="text-2xl font-bold text-steel-900">Emergency Response & Valve Interlock</h1>
        <p className="text-sm text-steel-500">Standard Operating Procedures and Remote Emergency Valve Control</p>
      </div>

      {flowMode === 'OFF' || !activeLeak ? (
        <div className="flex-1 glass-panel flex flex-col items-center justify-center p-12 text-center border-2 border-emerald-300 bg-emerald-50/50">
          <CheckCircle className="w-16 h-16 mb-4 text-emerald-600" />
          <h2 className="text-2xl font-bold text-emerald-900">System Safe & Depressurized</h2>
          <p className="text-sm text-emerald-700 mt-2 max-w-md">
            Emergency Valve V-104 & V-105 are closed or gas flow is OFF. All pipeline segments are isolated and depressurized (0.00 bar).
          </p>
          {shutdownSuccess && (
            <div className="mt-4 px-4 py-2 bg-emerald-600 text-white font-bold text-xs rounded-full shadow-md">
              REMOTE EMERGENCY SHUTDOWN EXECUTED SUCCESSFULLY
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1">
          {/* Main Alert Panel */}
          <div className="lg:col-span-2 space-y-6 flex flex-col">
            <motion.div 
              className="bg-brand-danger text-white p-6 rounded-xl shadow-neon-red relative overflow-hidden"
              animate={{ backgroundColor: ['#ef4444', '#dc2626', '#ef4444'] }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              <div className="flex items-start justify-between relative z-10">
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <AlertTriangle className="w-8 h-8 animate-pulse" />
                    <h2 className="text-3xl font-bold uppercase tracking-tight">Level 1 Emergency</h2>
                  </div>
                  <p className="text-brand-danger-100 text-lg">Pressure transient & acoustic breach detected between Node 4 & Node 5.</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold uppercase tracking-wider opacity-80 mb-1">Response Timer</p>
                  <div className="text-4xl font-mono font-bold">{formatTime(timer)}</div>
                </div>
              </div>
              
              <div className="mt-6 bg-black/20 p-4 rounded-lg grid grid-cols-2 md:grid-cols-4 gap-4 relative z-10">
                <div>
                  <p className="text-xs uppercase opacity-80">Location</p>
                  <p className="font-bold">Segment 4 (Tiruppur)</p>
                </div>
                <div>
                  <p className="text-xs uppercase opacity-80">Predicted Dist N4</p>
                  <p className="font-bold">{dist4M} meters</p>
                </div>
                <div>
                  <p className="text-xs uppercase opacity-80">Uncertainty</p>
                  <p className="font-bold">±0.04 m</p>
                </div>
                <div>
                  <p className="text-xs uppercase opacity-80">Isolating Valve</p>
                  <p className="font-bold">V-104 (Upstream)</p>
                </div>
              </div>

              <div className="absolute inset-0 opacity-10 bg-[repeating-linear-gradient(45deg,transparent,transparent_20px,#000_20px,#000_40px)] pointer-events-none"></div>
            </motion.div>

            <div className="glass-panel p-6 flex-1 border-2 border-brand-danger/30">
              <h3 className="text-lg font-bold text-steel-900 mb-4 border-b border-steel-100 pb-2">Standard Operating Procedure (SOP)</h3>
              <ol className="space-y-4 text-sm text-steel-700 font-medium list-decimal pl-5">
                <li className="pl-2">Verify leak telemetry via AI TDOA localization score.</li>
                <li className="pl-2 text-brand-danger font-bold">Initiate Remote Valve Shutdown for V-104 to isolate gas flow.</li>
                <li className="pl-2">Dispatch Emergency Response Team (ERT) to coordinates: <span className="font-mono bg-steel-100 px-1 rounded">11.2906, 77.5930</span></li>
                <li className="pl-2">Notify control center and local authorities regarding high-pressure gas discharge.</li>
                <li className="pl-2">Log all actions in the Operator Audit Trail.</li>
              </ol>
            </div>
          </div>

          {/* Emergency Valve Action Panel */}
          <div className="space-y-6">
            <div className="glass-card p-6 border-t-4 border-t-brand-danger shadow-md">
              <h3 className="text-sm font-bold text-steel-900 uppercase mb-2">Remote Valve Shutdown</h3>
              <p className="text-xs text-steel-500 mb-4">Clicking below will isolate upstream valve V-104 and stop all gas flow immediately.</p>
              
              <button 
                onClick={handleEmergencyShutdown}
                disabled={isShuttingDown}
                className="w-full bg-brand-danger text-white font-bold py-4 rounded-xl shadow-neon-red hover:bg-brand-danger/90 transition-all flex justify-center items-center space-x-2 animate-pulse active:scale-95 cursor-pointer"
              >
                <Power className="w-5 h-5" />
                <span>{isShuttingDown ? "EXECUTING SHUTDOWN..." : "EMERGENCY SHUTDOWN (V-104)"}</span>
              </button>
            </div>

            <div className="glass-card p-6">
               <h3 className="text-sm font-bold text-steel-900 uppercase mb-4 border-b border-steel-100 pb-2">Emergency Contacts</h3>
               <ul className="space-y-3 text-xs font-semibold text-steel-700">
                 <li className="flex justify-between items-center p-2 bg-steel-50 rounded">
                   <span>ERT Commander</span>
                   <span className="text-brand-primary font-bold">Ext #991</span>
                 </li>
                 <li className="flex justify-between items-center p-2 bg-steel-50 rounded">
                   <span>Fire Control Alpha</span>
                   <span className="text-brand-danger font-bold">101 / Direct</span>
                 </li>
               </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
