import React, { useState } from 'react';
import { useFirebase } from '../contexts/FirebaseContext';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Legend } from 'recharts';
import { Wind, Thermometer, Radio, FileSpreadsheet } from 'lucide-react';
import clsx from 'clsx';

export const Analytics = () => {
  const { analytics, flowMode, activeLeakCm, changeAnalyticsTimeframe, loading } = useFirebase();
  const [activeRange, setActiveRange] = useState('24H');

  if (loading || !analytics) return <div className="p-4 text-xs font-bold text-steel-500">Loading Analytics...</div>;

  const formatTime = (isoStr) => {
    const d = new Date(isoStr);
    if (activeRange === '1Y' || activeRange === '5Y') {
      return `${d.getMonth() + 1}/${d.getFullYear().toString().slice(-2)}`;
    }
    if (activeRange === '7D' || activeRange === '30D') {
      return `${d.getDate()}/${d.getMonth() + 1}`;
    }
    return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
  };

  const isLeak = activeLeakCm !== null && activeLeakCm !== undefined;
  const timeRanges = ['1H', '6H', '12H', '24H', '7D', '30D', '1Y', '5Y'];

  const handleRangeChange = (r) => {
    setActiveRange(r);
    if (changeAnalyticsTimeframe) {
      changeAnalyticsTimeframe(r);
    }
  };

  const exportAnalyticsCSV = () => {
    const headers = "Timestamp,Node4_Pressure_bar,Node5_Pressure_bar,Node4_Acoustic_dB,Node5_Acoustic_dB,Node4_Temp_C,Node5_Temp_C\n";
    let rows = "";

    analytics.forEach(pt => {
      rows += `${pt.time},${pt.node4Pressure},${pt.node5Pressure},${pt.node4Acoustic},${pt.node5Acoustic},${pt.node4Temp},${pt.node5Temp}\n`;
    });

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Leak_Busters_SCADA_Analytics_${activeRange}_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="h-full flex flex-col justify-between space-y-2 overflow-hidden max-h-[calc(100vh-5rem)]">
      {/* Top Header Controls Bar */}
      <div className="flex justify-between items-center py-1 border-b border-steel-200">
        <div>
          <h1 className="text-xl font-bold text-steel-900 leading-tight">Leak Busters Multi-Sensor Analytics</h1>
          <p className="text-xs text-steel-500">Node 4 vs Node 5 Step Responses (All 3 Graphs In One Screen View)</p>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={exportAnalyticsCSV}
            className="btn-secondary text-xs py-1 px-2.5 flex items-center space-x-1 font-bold shadow-sm"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
            <span>Export CSV</span>
          </button>

          {/* Timeframe Selector */}
          <div className="flex bg-white rounded-md border border-steel-200 p-0.5 shadow-sm">
            {timeRanges.map(r => (
              <button
                key={r}
                onClick={() => handleRangeChange(r)}
                className={clsx(
                  "px-2 py-0.5 text-[11px] font-bold rounded transition-colors",
                  activeRange === r ? "bg-brand-primary text-white" : "text-steel-500 hover:text-steel-900"
                )}
              >
                {r}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* GRAPH 1: PRESSURE DYNAMICS (bar) */}
      <div className="glass-panel p-3 flex-1 min-h-0 flex flex-col">
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs font-bold text-steel-800 flex items-center">
            <Wind className="w-3.5 h-3.5 mr-1.5 text-brand-primary" />
            Pressure Dynamics (bar) — Node 4 Inlet vs Node 5 Outlet
          </span>
          <span className="text-[10px] text-steel-500 font-semibold">Step Change at Center</span>
        </div>
        <div className="flex-1 w-full min-h-0">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={analytics} margin={{ top: 5, right: 15, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorP4" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorP5" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
              <XAxis dataKey="time" tickFormatter={formatTime} stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
              <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} domain={[0, 1.2]} />
              <RechartsTooltip contentStyle={{ borderRadius: '6px', border: '1px solid #e2e8f0', fontSize: '11px', padding: '4px 8px' }} labelFormatter={formatTime} />
              <Legend verticalAlign="top" height={20} iconSize={8} wrapperStyle={{ fontSize: '10px' }} />
              <Area type="monotone" name="Node 4 Pressure (Inlet bar)" dataKey="node4Pressure" stroke="#0ea5e9" strokeWidth={2} fillOpacity={1} fill="url(#colorP4)" />
              <Area type="monotone" name="Node 5 Pressure (Outlet bar)" dataKey="node5Pressure" stroke="#f59e0b" strokeWidth={2} fillOpacity={1} fill="url(#colorP5)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* GRAPH 2: ACOUSTIC WAVEFORM (dB) */}
      <div className="glass-panel p-3 flex-1 min-h-0 flex flex-col">
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs font-bold text-steel-800 flex items-center">
            <Radio className="w-3.5 h-3.5 mr-1.5 text-brand-danger" />
            Acoustic Waveform Intensity (dB) — Acoustic Sensor Comparison
          </span>
          <span className="text-[10px] text-steel-500 font-semibold">Step Change at Center</span>
        </div>
        <div className="flex-1 w-full min-h-0">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={analytics} margin={{ top: 5, right: 15, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorA4" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorA5" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
              <XAxis dataKey="time" tickFormatter={formatTime} stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
              <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} domain={[0, 120]} />
              <RechartsTooltip contentStyle={{ borderRadius: '6px', border: '1px solid #e2e8f0', fontSize: '11px', padding: '4px 8px' }} labelFormatter={formatTime} />
              <Legend verticalAlign="top" height={20} iconSize={8} wrapperStyle={{ fontSize: '10px' }} />
              <Area type="monotone" name="Node 4 Acoustic (dB)" dataKey="node4Acoustic" stroke="#ef4444" strokeWidth={2} fillOpacity={1} fill="url(#colorA4)" />
              <Area type="monotone" name="Node 5 Acoustic (dB)" dataKey="node5Acoustic" stroke="#8b5cf6" strokeWidth={2} fillOpacity={1} fill="url(#colorA5)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* GRAPH 3: JOULE-THOMSON TEMPERATURE (°C) */}
      <div className="glass-panel p-3 flex-1 min-h-0 flex flex-col">
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs font-bold text-steel-800 flex items-center">
            <Thermometer className="w-3.5 h-3.5 mr-1.5 text-brand-warning" />
            Joule-Thomson Temperature Cooling (°C)
          </span>
          <span className="text-[10px] text-steel-500 font-semibold">Step Change at Center</span>
        </div>
        <div className="flex-1 w-full min-h-0">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={analytics} margin={{ top: 5, right: 15, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorT4" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorT5" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
              <XAxis dataKey="time" tickFormatter={formatTime} stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
              <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} domain={[20, 30]} />
              <RechartsTooltip contentStyle={{ borderRadius: '6px', border: '1px solid #e2e8f0', fontSize: '11px', padding: '4px 8px' }} labelFormatter={formatTime} />
              <Legend verticalAlign="top" height={20} iconSize={8} wrapperStyle={{ fontSize: '10px' }} />
              <Area type="monotone" name="Node 4 Temp (°C)" dataKey="node4Temp" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorT4)" />
              <Area type="monotone" name="Node 5 Temp (°C)" dataKey="node5Temp" stroke="#f59e0b" strokeWidth={2} fillOpacity={1} fill="url(#colorT5)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
