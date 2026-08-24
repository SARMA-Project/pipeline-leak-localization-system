import React, { useState } from 'react';
import { Smartphone, Power, ShieldAlert, CheckCircle, Wifi, Play, Square } from 'lucide-react';
import clsx from 'clsx';

export const MobileRemote = () => {
  const [flowMode, setFlowMode] = useState('OFF'); // 'OFF' | 'ON'
  const [leakCm, setLeakCm] = useState(null);       // null | 10..100 cm
  const [statusMsg, setStatusMsg] = useState('Ready');

  const serverUrl = `http://${window.location.hostname}:3001/api/remote`;

  const sendRemoteCommand = async (newFlow, newLeakCm) => {
    setFlowMode(newFlow);
    setLeakCm(newLeakCm);

    try {
      const response = await fetch(serverUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ flowMode: newFlow, leakCm: newLeakCm })
      });
      if (response.ok) {
        setStatusMsg('Synced to SCADA Display');
      } else {
        setStatusMsg('Sync Error');
      }
    } catch (err) {
      console.error('Remote HTTP post failed:', err);
      const bc = new BroadcastChannel('scada_remote_channel');
      bc.postMessage({ flowMode: newFlow, leakCm: newLeakCm });
      bc.close();
      setStatusMsg('Synced via Broadcast');
    }
  };

  const presets = [
    { label: '0.10 m', cm: 10 },
    { label: '0.20 m', cm: 20 },
    { label: '0.30 m', cm: 30 },
    { label: '0.40 m', cm: 40 },
    { label: '0.50 m (Mid)', cm: 50 },
    { label: '0.60 m', cm: 60 },
    { label: '0.70 m', cm: 70 },
    { label: '0.80 m', cm: 80 },
    { label: '0.90 m', cm: 90 },
    { label: '1.00 m', cm: 100 },
  ];

  const leakMeters = leakCm !== null ? (leakCm / 100).toFixed(2) : null;

  return (
    <div className="min-h-screen bg-slate-950 text-white p-4 flex flex-col justify-between font-sans selection:bg-none">
      <div>
        {/* Top Header */}
        <div className="flex justify-between items-center border-b border-slate-800 pb-3 mb-4">
          <div className="flex items-center space-x-2">
            <Smartphone className="w-6 h-6 text-sky-400" />
            <div>
              <h1 className="text-base font-bold tracking-tight">Leak Busters Controller</h1>
              <p className="text-[10px] text-slate-400">Handheld Mobile Interface</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-1 px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/30 rounded-full text-emerald-400 text-xs font-semibold">
            <Wifi className="w-3.5 h-3.5 animate-pulse" />
            <span>{statusMsg}</span>
          </div>
        </div>

        {/* SECTION 1: GAS FLOW CONTROLS */}
        <p className="text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">
          Step 1: Gas Flow Controls
        </p>
        <div className="grid grid-cols-2 gap-3 mb-6">
          <button
            onClick={() => sendRemoteCommand('OFF', null)}
            className={clsx(
              "py-4 px-3 rounded-2xl font-black text-sm flex items-center justify-center space-x-2 border transition-all active:scale-95 touch-manipulation shadow-lg",
              flowMode === 'OFF'
                ? "bg-slate-800 text-slate-200 border-slate-600 ring-2 ring-slate-400"
                : "bg-slate-900 text-slate-400 border-slate-800 opacity-60"
            )}
          >
            <Square className="w-4 h-4 fill-slate-400" />
            <span>GAS FLOW OFF</span>
          </button>

          <button
            onClick={() => sendRemoteCommand('ON', null)}
            className={clsx(
              "py-4 px-3 rounded-2xl font-black text-sm flex items-center justify-center space-x-2 border transition-all active:scale-95 touch-manipulation shadow-lg",
              flowMode === 'ON' && leakCm === null
                ? "bg-emerald-600 text-white border-emerald-400 shadow-neon-green ring-2 ring-emerald-300"
                : flowMode === 'ON'
                  ? "bg-emerald-950 text-emerald-300 border-emerald-800"
                  : "bg-slate-900 text-slate-400 border-slate-800 opacity-60"
            )}
          >
            <Play className="w-4 h-4 fill-emerald-400" />
            <span>GAS FLOW ON</span>
          </button>
        </div>

        {/* Status Indicator Banner */}
        <div className={clsx(
          "p-3 rounded-xl border text-xs font-bold flex items-center justify-between mb-6 shadow-md transition-all",
          flowMode === 'OFF' 
            ? "bg-slate-800/80 border-slate-700 text-slate-300"
            : leakCm !== null
              ? "bg-red-500/20 border-red-500/50 text-red-300 animate-pulse"
              : "bg-emerald-500/20 border-emerald-500/50 text-emerald-300"
        )}>
          <div className="flex items-center space-x-2">
            {flowMode === 'OFF' ? (
              <Power className="w-4 h-4 text-slate-400" />
            ) : leakCm !== null ? (
              <ShieldAlert className="w-4 h-4 text-red-400" />
            ) : (
              <CheckCircle className="w-4 h-4 text-emerald-400" />
            )}
            <span>
              {flowMode === 'OFF'
                ? "PIPE EMPTY (FLOW OFF)"
                : leakCm !== null
                  ? `LEAK TRIGGERED @ ${leakMeters} METERS`
                  : "FLOW ACTIVE (1.0 BAR - NO LEAK)"}
            </span>
          </div>
        </div>

        {/* SECTION 2: LEAK LOCATION BUTTONS IN METERS */}
        <div className="flex justify-between items-center mb-2">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Step 2: Puncture Location (Meters)
          </p>
          {flowMode === 'OFF' && (
            <span className="text-[10px] text-amber-400 font-bold uppercase">Turn Flow ON First</span>
          )}
        </div>

        {/* Clear Leak Button */}
        {flowMode === 'ON' && leakCm !== null && (
          <button
            onClick={() => sendRemoteCommand('ON', null)}
            className="w-full py-3 mb-3 bg-emerald-600 text-white font-bold rounded-xl text-xs flex items-center justify-center space-x-2 shadow-md border border-emerald-400 active:scale-95"
          >
            <CheckCircle className="w-4 h-4" />
            <span>CLEAR LEAK (NORMAL 1.0 BAR FLOW)</span>
          </button>
        )}

        {/* Preset Buttons in Meters */}
        <div className={clsx("grid grid-cols-2 gap-2.5", flowMode === 'OFF' && "opacity-40 pointer-events-none")}>
          {presets.map((p) => {
            const isSelected = leakCm === p.cm;
            const dist4M = (p.cm / 100).toFixed(2);
            const dist5M = ((100 - p.cm) / 100).toFixed(2);

            return (
              <button
                key={p.label}
                disabled={flowMode === 'OFF'}
                onClick={() => sendRemoteCommand('ON', p.cm)}
                className={clsx(
                  "py-3.5 px-3 rounded-xl font-bold text-xs transition-all flex flex-col items-center justify-center border shadow-sm touch-manipulation active:scale-95",
                  isSelected
                    ? "bg-red-600 text-white border-red-400 shadow-neon-red scale-[1.02]"
                    : "bg-slate-900 text-slate-200 border-slate-800 hover:bg-slate-800"
                )}
              >
                <span className="text-[10px] opacity-60">PUNCTURE LOCATION</span>
                <span className="text-base font-black mt-0.5">{p.label}</span>
                <span className="text-[9px] opacity-50 mt-0.5">N4: {dist4M}m | N5: {dist5M}m</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-6 text-center text-[10px] text-slate-500">
        Connected to HTTP Bridge `http://{window.location.hostname}:3001`
      </div>
    </div>
  );
};
