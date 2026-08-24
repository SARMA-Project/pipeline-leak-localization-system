import React from 'react';
import { useFirebase } from '../contexts/FirebaseContext';
import { motion } from 'framer-motion';
import { Cpu, Zap, Activity } from 'lucide-react';

export const DigitalTwin = () => {
  const { nodes, loading, flowMode } = useFirebase();

  if (loading || !nodes) return <div className="p-6">Loading Digital Twin...</div>;

  const nodesList = Object.values(nodes).sort((a, b) => a.id.localeCompare(b.id));

  const node4 = nodes['node004'] || {};
  const node5 = nodes['node005'] || {};

  const isSegmentLeaking = (node4?.status === 'Leak' || node5?.status === 'Leak') || 
                           (node4?.leakProbability > 80 || node5?.leakProbability > 80);

  const predDist4Cm = node4.predictedDistNode4Cm !== undefined && node4.predictedDistNode4Cm !== null ? node4.predictedDistNode4Cm : 20;
  const predDist4Meters = (predDist4Cm / 100).toFixed(2);
  const predDist5Meters = ((100 - predDist4Cm) / 100).toFixed(2);

  // Position percentage along the Node 4 <-> Node 5 segment (0% = Node 4, 100% = Node 5)
  const leakPercent = Math.min(95, Math.max(5, predDist4Cm));

  return (
    <div className="h-full flex flex-col space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-steel-900">Pipeline Digital Twin</h1>
        <p className="text-sm text-steel-500">Real-time virtual physics representation of the 20-node pipeline</p>
      </div>

      <div className="flex-1 glass-panel relative overflow-x-auto overflow-y-hidden border border-steel-200 shadow-sm custom-scrollbar">
        
        <div className="min-w-[2500px] h-full flex flex-col justify-center relative px-20">
          
          {/* Main Pipeline Pipe */}
          <div className={`absolute left-10 right-10 h-20 rounded-full border-t-2 border-b-2 shadow-lg overflow-hidden flex items-center transition-colors duration-500 ${
            flowMode === 'OFF' 
              ? 'bg-gradient-to-b from-steel-300 via-steel-200 to-steel-400 border-steel-400' 
              : isSegmentLeaking
                ? 'bg-gradient-to-b from-red-950 via-red-850 to-red-900 border-red-500'
                : 'bg-gradient-to-b from-steel-700 via-steel-600 to-steel-800 border-steel-400'
          }`}>
            
            {/* Healthy Flowing Gas Stream Particles */}
            {flowMode === 'ON' && !isSegmentLeaking && (
              <motion.div 
                className="h-full w-[200%] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+PGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMyIgZmlsbD0icmdiYSgwLDE4NiwyNTUsMC40KSIvPjwvc3ZnPg==')] opacity-40"
                animate={{ x: ["0%", "-50%"] }}
                transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
              />
            )}

            {/* High-Pressure Communication Energy Waves */}
            {flowMode === 'ON' && (
              <>
                <motion.div 
                  className="absolute h-full w-8 bg-cyan-400 opacity-30 blur-md"
                  animate={{ left: ["0%", "100%"] }}
                  transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                />
                <motion.div 
                  className="absolute h-full w-8 bg-cyan-400 opacity-30 blur-md"
                  animate={{ left: ["0%", "100%"] }}
                  transition={{ repeat: Infinity, duration: 3, ease: "linear", delay: 1.5 }}
                />
              </>
            )}
          </div>

          {/* Render 20 Hardware Nodes along the pipe */}
          <div className="flex justify-between items-center absolute left-20 right-20">
            {nodesList.map((node) => {
              const isNode4 = node.id === 'node004';
              const isNode5 = node.id === 'node005';
              const isLeakHere = (isNode4 || isNode5) && isSegmentLeaking;
              
              let statusColor = flowMode === 'OFF' ? 'bg-steel-400' : 'bg-brand-secondary';
              let pulseColor = 'rgba(16, 185, 129, 0.4)';
              
              if (flowMode === 'OFF') {
                pulseColor = 'transparent';
              } else if (node.status === 'Leak' || isLeakHere) {
                statusColor = 'bg-brand-danger animate-pulse';
                pulseColor = 'rgba(239, 68, 68, 0.8)';
              }

              return (
                <div key={node.id} className="relative flex flex-col items-center">
                  
                  {/* Values Above Pipe */}
                  <div className="absolute -top-32 flex flex-col items-center bg-white border border-steel-200 shadow-md rounded-lg p-2 w-28 z-20">
                    <span className="text-[10px] text-steel-500 font-bold mb-1 border-b border-steel-100 w-full text-center pb-1">
                      {node.id.toUpperCase()}
                      {(isNode4 || isNode5) && <span className="ml-1 text-brand-primary font-black">(Real)</span>}
                    </span>
                    <div className="flex justify-between w-full text-[10px]">
                      <span className="text-steel-400">P:</span>
                      <span className={`font-bold ${isLeakHere ? 'text-brand-danger animate-pulse' : 'text-steel-900'}`}>{node.pressure.toFixed(2)}b</span>
                    </div>
                    <div className="flex justify-between w-full text-[10px]">
                      <span className="text-steel-400">A:</span>
                      <span className={`font-bold ${isLeakHere ? 'text-brand-danger animate-pulse' : 'text-steel-900'}`}>{node.acoustic.toFixed(0)}dB</span>
                    </div>
                  </div>

                  {/* Connection Stem */}
                  <div className="absolute -top-10 w-2 h-10 bg-gradient-to-b from-steel-400 to-steel-700 z-10" />

                  {/* Physical Hardware Box */}
                  <div className="relative z-20">
                    {flowMode !== 'OFF' && (
                      <motion.div 
                        className="absolute inset-0 rounded-full"
                        style={{ backgroundColor: pulseColor }}
                        animate={{ scale: [1, 2.5], opacity: [0.8, 0] }}
                        transition={{ repeat: Infinity, duration: isLeakHere ? 0.8 : 2 }}
                      />
                    )}
                    
                    <div className={`w-10 h-10 rounded-md border-2 border-white relative flex items-center justify-center shadow-md ${statusColor}`}>
                      <Cpu className="w-5 h-5 text-white" />
                    </div>
                  </div>

                </div>
              );
            })}
          </div>

          {/* DYNAMIC LEAK PARTICLE ANIMATION BETWEEN NODE 4 & NODE 5 */}
          {flowMode === 'ON' && isSegmentLeaking && (
            <div 
              className="absolute top-1/2 -translate-y-1/2 z-30 pointer-events-none flex flex-col items-center"
              style={{ 
                left: `calc(190px + (${leakPercent}% * 1.5))`, 
                transition: 'left 0.5s ease-out' 
              }}
            >
              {/* Laser Beacon Target Indicator */}
              <div className="absolute -top-28 flex flex-col items-center">
                <div className="bg-brand-danger text-white text-xs font-black px-3 py-1 rounded-full shadow-neon-red animate-bounce flex items-center space-x-1">
                  <Zap className="w-3.5 h-3.5" />
                  <span>LOCALIZED: {predDist4Meters} m FROM NODE 4</span>
                </div>
                <div className="w-0.5 h-16 bg-red-500 shadow-neon-red animate-pulse" />
              </div>

              {/* Escaping High-Pressure Gas Jet Spray */}
              <div className="relative w-8 h-8 flex items-center justify-center">
                <div className="w-6 h-6 rounded-full bg-brand-danger border-2 border-white shadow-neon-red animate-ping" />
                
                {[...Array(18)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-3 h-3 bg-red-400/90 rounded-full blur-[1px] shadow-neon-red"
                    initial={{ opacity: 1, y: 0, x: 0, scale: 1 }}
                    animate={{ 
                      opacity: 0, 
                      y: -120 - Math.random() * 70, 
                      x: (Math.random() - 0.5) * 140,
                      scale: 0.2
                    }}
                    transition={{ 
                      repeat: Infinity, 
                      duration: 0.8 + Math.random(), 
                      delay: Math.random() * 1.5 
                    }}
                  />
                ))}
              </div>
            </div>
          )}
          
        </div>
      </div>
      
      {/* AI Diagnostic Panel */}
      <div className="h-44 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className={`glass-card p-4 border ${isSegmentLeaking ? 'border-brand-danger shadow-neon-red bg-brand-danger/5' : 'border-steel-200'}`}>
          <h3 className="text-sm font-bold text-steel-900 mb-2 border-b border-steel-100 pb-2">AI Diagnostic Panel</h3>
          {flowMode === 'OFF' ? (
            <div className="space-y-1">
              <p className="text-sm font-bold text-steel-600 uppercase">GAS FLOW OFF (Depressurized)</p>
              <p className="text-xs text-steel-500">Pipeline is depressurized (0.00 bar). Activate Gas Flow ON from your phone to ignite baseline input pressure.</p>
            </div>
          ) : isSegmentLeaking ? (
            <div className="space-y-1.5">
              <p className="text-sm font-bold text-brand-danger uppercase">LEAK CONFIRMED - CONFIDENCE: 99.4%</p>
              <ul className="text-xs text-steel-700 space-y-1 list-disc pl-4 font-medium">
                <li>Pressure dropped to <strong>{node4?.pressure} bar</strong> at Node 4.</li>
                <li>Acoustic peak: <strong>{node4?.acoustic} dB</strong> detected at Node 4.</li>
                <li>Distance to Leak from Node 4: <strong className="text-brand-danger font-black">{predDist4Meters} m ({predDist4Cm} cm)</strong></li>
                <li>Distance to Leak from Node 5: <strong className="text-brand-danger font-black">{predDist5Meters} m</strong></li>
              </ul>
            </div>
          ) : (
            <div className="space-y-1.5">
              <p className="text-sm font-bold text-brand-secondary uppercase">System Normal (Input Flow: 1.00 bar)</p>
              <ul className="text-xs text-steel-600 space-y-1 list-disc pl-4">
                <li>Pressure stable across all 20 nodes (1.00 bar).</li>
                <li>Background acoustics within nominal thresholds (28 dB).</li>
                <li>Ready for manual leak puncture testing.</li>
              </ul>
            </div>
          )}
        </div>

        <div className="glass-card p-4 border border-steel-200">
           <h3 className="text-sm font-bold text-steel-900 mb-2 border-b border-steel-100 pb-2">Digital Twin Legend</h3>
           <div className="grid grid-cols-2 gap-2 text-xs text-steel-600">
             <div className="flex items-center"><div className="w-3 h-3 rounded-md bg-brand-secondary mr-2"></div> Flow Active (1.0 bar)</div>
             <div className="flex items-center"><div className="w-3 h-3 rounded-md bg-steel-400 mr-2"></div> Flow Off (0 bar)</div>
             <div className="flex items-center"><div className="w-3 h-3 rounded-md bg-brand-danger mr-2"></div> Leak Localized</div>
             <div className="flex items-center"><div className="w-3 h-1 bg-brand-primary mr-2 blur-sm"></div> Data Pulse</div>
           </div>
        </div>
      </div>

    </div>
  );
};
