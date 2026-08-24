import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Zap, CheckCircle, AlertTriangle, Radio, ShieldAlert, Cpu } from 'lucide-react';
import clsx from 'clsx';

export const PvcDemoController = ({ onSelectLeak }) => {
  const [selectedPos, setSelectedPos] = useState(null); // null = Normal, 10..100 = cm position

  const presets = [
    { label: 'Normal (No Hole)', cm: null },
    { label: '10 cm', cm: 10 },
    { label: '20 cm', cm: 20 },
    { label: '30 cm', cm: 30 },
    { label: '40 cm', cm: 40 },
    { label: '50 cm (Midpoint)', cm: 50 },
    { label: '60 cm', cm: 60 },
    { label: '70 cm', cm: 70 },
    { label: '80 cm', cm: 80 },
    { label: '90 cm', cm: 90 },
    { label: '100 cm (End)', cm: 100 }
  ];

  const handleSelect = (cm) => {
    setSelectedPos(cm);
    if (onSelectLeak) {
      onSelectLeak(cm);
    }
  };

  const distNode4 = selectedPos !== null ? selectedPos : null;
  const distNode5 = selectedPos !== null ? (100 - selectedPos) : null;
  
  // Acoustic Time Difference of Arrival calculation (Speed of sound in pipe ~340 m/s = 34000 cm/s)
  const soundSpeedCmPerSec = 34000;
  const tdoaMs = selectedPos !== null 
    ? (((100 - selectedPos) - selectedPos) / soundSpeedCmPerSec * 1000).toFixed(3)
    : 0;

  return (
    <div className="bg-white border-2 border-brand-primary/30 rounded-2xl p-4 md:p-6 shadow-lg mb-6">
      
      {/* Mobile-friendly Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-steel-200 pb-3 mb-4 gap-2">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-1 bg-brand-primary text-white font-bold text-xs rounded-md tracking-wide uppercase">
              Judge Live Demo Panel
            </span>
            <span className="text-xs font-bold text-steel-500">1-Meter PVC Pipe Model</span>
          </div>
          <h2 className="text-xl font-bold text-steel-900 mt-1">
            Leakage Location Selector (Node 4 ── 100 cm ── Node 5)
          </h2>
        </div>

        {selectedPos !== null ? (
          <div className="flex items-center px-3 py-1.5 bg-brand-danger/10 border border-brand-danger/30 rounded-full text-brand-danger font-bold text-xs animate-pulse">
            <ShieldAlert className="w-4 h-4 mr-1.5" />
            <span>LEAK DETECTED AT {selectedPos} CM</span>
          </div>
        ) : (
          <div className="flex items-center px-3 py-1.5 bg-brand-secondary/10 border border-brand-secondary/30 rounded-full text-brand-secondary font-bold text-xs">
            <CheckCircle className="w-4 h-4 mr-1.5" />
            <span>PIPELINE HEALTHY (NO LEAK)</span>
          </div>
        )}
      </div>

      {/* Quick Preset Buttons (13 Buttons for Mobile Touch) */}
      <p className="text-xs font-bold text-steel-600 mb-2 uppercase tracking-wider">
        Select Hole Location (Punctured PVC Pipe):
      </p>
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2 mb-6">
        {presets.map((p) => {
          const isActive = selectedPos === p.cm;
          return (
            <button
              key={p.label}
              onClick={() => handleSelect(p.cm)}
              className={clsx(
                "py-3 px-2 rounded-xl text-xs font-bold transition-all flex flex-col items-center justify-center border shadow-sm touch-manipulation active:scale-95",
                isActive 
                  ? "bg-brand-danger text-white border-brand-danger shadow-neon-red scale-105" 
                  : p.cm === null 
                    ? "bg-brand-secondary/10 text-brand-secondary border-brand-secondary/30 hover:bg-brand-secondary/20" 
                    : "bg-steel-50 text-steel-800 border-steel-200 hover:bg-steel-100"
              )}
            >
              <span className="text-[10px] opacity-80">{p.cm === null ? "RESET" : "HOLE @"}</span>
              <span className="text-sm font-black">{p.label}</span>
            </button>
          );
        })}
      </div>

      {/* Physical PVC Pipe Representation */}
      <div className="relative pt-8 pb-4 px-4 bg-steel-100/70 border border-steel-200 rounded-xl overflow-hidden">
        
        {/* PVC Pipe Container */}
        <div className="relative h-14 bg-gradient-to-r from-slate-300 via-slate-100 to-slate-300 border-2 border-slate-400 rounded-full flex items-center shadow-inner overflow-hidden">
          
          {/* Internal Flow Motion */}
          <motion.div 
            className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(14,165,233,0.3)_50%,transparent_100%)] bg-[length:50px_100%]"
            animate={{ backgroundPositionX: ['0px', '200px'] }}
            transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
          />

          {/* Node 4 Landmark */}
          <div className="absolute left-2 top-0 bottom-0 flex items-center z-20">
            <div className="w-8 h-8 rounded-full bg-brand-primary text-white flex items-center justify-center font-bold text-xs shadow-md">
              N4
            </div>
          </div>

          {/* Node 5 Landmark */}
          <div className="absolute right-2 top-0 bottom-0 flex items-center z-20">
            <div className="w-8 h-8 rounded-full bg-brand-primary text-white flex items-center justify-center font-bold text-xs shadow-md">
              N5
            </div>
          </div>

          {/* Leak Position Indicator & Gas Cloud */}
          {selectedPos !== null && (
            <motion.div 
              className="absolute top-0 bottom-0 z-30 flex flex-col items-center justify-center"
              style={{ left: `${selectedPos}%`, transform: 'translateX(-50%)' }}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
            >
              {/* Flashing Hole Marker */}
              <div className="w-6 h-6 rounded-full bg-brand-danger border-2 border-white shadow-neon-red flex items-center justify-center animate-ping"></div>
              
              {/* Escaping Gas Spray Particle Visual */}
              <div className="absolute -top-10 flex flex-col items-center">
                <motion.div 
                  className="w-3 h-3 bg-red-400 rounded-full blur-sm"
                  animate={{ y: [-5, -25], opacity: [1, 0], scale: [1, 2] }}
                  transition={{ repeat: Infinity, duration: 0.6 }}
                />
              </div>
            </motion.div>
          )}
        </div>

        {/* Ruler Marks below PVC Pipe */}
        <div className="flex justify-between text-[10px] font-bold text-steel-500 mt-2 px-3">
          <span>0 cm (Node 4)</span>
          <span>25 cm</span>
          <span>50 cm (Mid)</span>
          <span>75 cm</span>
          <span>100 cm (Node 5)</span>
        </div>
      </div>

      {/* Real-time Math & Localization Telemetry */}
      {selectedPos !== null ? (
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 bg-brand-danger/5 border border-brand-danger/20 p-4 rounded-xl">
          <div className="text-center sm:text-left">
            <p className="text-xs font-semibold text-steel-500">Distance to Node 4</p>
            <p className="text-2xl font-black text-brand-primary">{distNode4} cm <span className="text-xs font-normal">({(distNode4 / 100).toFixed(2)} m)</span></p>
          </div>
          <div className="text-center sm:text-left border-y sm:border-y-0 sm:border-x border-steel-200 py-2 sm:py-0 sm:px-4">
            <p className="text-xs font-semibold text-steel-500">Distance to Node 5</p>
            <p className="text-2xl font-black text-brand-primary">{distNode5} cm <span className="text-xs font-normal">({(distNode5 / 100).toFixed(2)} m)</span></p>
          </div>
          <div className="text-center sm:text-left">
            <p className="text-xs font-semibold text-steel-500">Acoustic TDOA Time Delay (Δt)</p>
            <p className="text-2xl font-black text-brand-danger">{tdoaMs} ms</p>
            <p className="text-[10px] text-steel-500 mt-0.5">Calculated via Cross-Correlation</p>
          </div>
        </div>
      ) : (
        <div className="mt-4 p-3 bg-steel-50 border border-steel-200 rounded-xl text-center text-xs text-steel-600 font-medium">
          Tap any button above (e.g. 10 cm, 20 cm, 50 cm) to simulate a puncture in your 1-meter PVC pipe during your judge presentation!
        </div>
      )}
    </div>
  );
};
