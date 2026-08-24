import React from 'react';
import { Wrench, ShieldAlert, CheckCircle, Clock } from 'lucide-react';

export const PredictiveMaintenance = () => {
  return (
    <div className="h-full flex flex-col space-y-6 pb-6">
      <div>
        <h1 className="text-2xl font-bold text-steel-900">Predictive Maintenance AI</h1>
        <p className="text-sm text-steel-500">Machine learning trend analysis for failure prediction</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-panel p-6 col-span-2">
          <h3 className="text-lg font-bold text-steel-900 mb-4 border-b border-steel-100 pb-2">Critical Components Risk Analysis</h3>
          
          <div className="space-y-4">
            <div className="p-4 border border-steel-200 rounded-lg hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-bold text-steel-900 flex items-center">
                    <ShieldAlert className="w-4 h-4 text-brand-danger mr-2" />
                    Pipe Corrosion (Segment 12)
                  </h4>
                  <p className="text-xs text-steel-500 mt-1">Slight micro-acoustic anomalies detected over 30 days.</p>
                </div>
                <span className="bg-brand-danger/10 text-brand-danger px-2 py-1 rounded text-xs font-bold uppercase">High Risk</span>
              </div>
              <div className="flex justify-between text-sm mt-4 text-steel-600">
                <span>Remaining Useful Life (RUL): <strong className="text-steel-900">14 Days</strong></span>
                <span>Probability: <strong className="text-brand-danger">85%</strong></span>
              </div>
            </div>

            <div className="p-4 border border-steel-200 rounded-lg hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-bold text-steel-900 flex items-center">
                    <Clock className="w-4 h-4 text-brand-warning mr-2" />
                    Battery Degradation (Node 08)
                  </h4>
                  <p className="text-xs text-steel-500 mt-1">Solar charge cycle efficiency dropped by 12%.</p>
                </div>
                <span className="bg-brand-warning/10 text-brand-warning px-2 py-1 rounded text-xs font-bold uppercase">Med Risk</span>
              </div>
              <div className="flex justify-between text-sm mt-4 text-steel-600">
                <span>Remaining Useful Life (RUL): <strong className="text-steel-900">45 Days</strong></span>
                <span>Probability: <strong className="text-brand-warning">60%</strong></span>
              </div>
            </div>
            
            <div className="p-4 border border-steel-200 rounded-lg hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-bold text-steel-900 flex items-center">
                    <CheckCircle className="w-4 h-4 text-brand-secondary mr-2" />
                    Pressure Valve Integrity (Erode Hub)
                  </h4>
                  <p className="text-xs text-steel-500 mt-1">Valve actuations performing within nominal timing.</p>
                </div>
                <span className="bg-brand-secondary/10 text-brand-secondary px-2 py-1 rounded text-xs font-bold uppercase">Low Risk</span>
              </div>
              <div className="flex justify-between text-sm mt-4 text-steel-600">
                <span>Remaining Useful Life (RUL): <strong className="text-steel-900">&gt; 3 Years</strong></span>
                <span>Probability: <strong className="text-brand-secondary">5%</strong></span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="glass-card p-6 border-t-4 border-t-brand-primary">
            <h3 className="text-sm font-bold text-steel-900 uppercase mb-1">Next Scheduled Maintenance</h3>
            <div className="text-3xl font-bold text-brand-primary mb-2">12 Oct 2026</div>
            <p className="text-sm text-steel-600">Routine sensor calibration and physical inspection of Relay Station 2.</p>
            <button className="mt-4 w-full btn-secondary text-sm">View Schedule</button>
          </div>

          <div className="glass-card p-6">
            <h3 className="text-sm font-bold text-steel-900 uppercase mb-4 border-b border-steel-100 pb-2">AI Recommendations</h3>
            <ul className="space-y-3 text-sm text-steel-600">
              <li className="flex items-start">
                <Wrench className="w-4 h-4 mr-2 text-steel-400 mt-0.5 flex-shrink-0" />
                <span>Dispatch technician to Node 08 to clean solar panel surface before next month.</span>
              </li>
              <li className="flex items-start">
                <Wrench className="w-4 h-4 mr-2 text-steel-400 mt-0.5 flex-shrink-0" />
                <span>Schedule ultrasonic thickness testing for Segment 12 due to acoustic drift.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
