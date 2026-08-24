import React from 'react';
import { Download, FileText, Calendar, Filter } from 'lucide-react';

export const Reports = () => {
  return (
    <div className="space-y-6 h-full">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Reports & Export</h1>
        <p className="text-gray-600 mt-1">Generate system health and incident reports</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-panel p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Generate Report</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">Report Type</label>
              <select className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:border-brand-primary">
                <option>System Health Overview</option>
                <option>Incident & Alert Log</option>
                <option>Node Battery Status</option>
                <option>Leak Detection Analysis</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">Time Range</label>
              <select className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:border-brand-primary">
                <option>Last 24 Hours</option>
                <option>Last 7 Days</option>
                <option>Last 30 Days</option>
                <option>Custom Range</option>
              </select>
            </div>

            <div className="pt-4 flex space-x-4">
              <button className="flex-1 btn-primary flex items-center justify-center space-x-2">
                <FileText className="w-5 h-5" />
                <span>Generate PDF</span>
              </button>
              <button className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-900 font-medium py-2 px-4 rounded-lg transition-colors duration-300 border border-gray-200 flex items-center justify-center space-x-2">
                <Download className="w-5 h-5" />
                <span>Export CSV</span>
              </button>
            </div>
          </div>
        </div>

        <div className="glass-panel p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Recent Reports</h3>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-white/50 border border-gray-200 hover:border-gray-200 transition-colors cursor-pointer">
                <div className="flex items-center space-x-3">
                  <FileText className="w-8 h-8 text-brand-primary opacity-80" />
                  <div>
                    <p className="text-gray-900 font-medium text-sm">Weekly Health Summary</p>
                    <p className="text-xs text-gray-600">Generated on Oct {20 - i}, 2026</p>
                  </div>
                </div>
                <button className="text-gray-600 hover:text-gray-900 p-2">
                  <Download className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
