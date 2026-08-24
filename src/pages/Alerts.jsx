import React, { useState } from 'react';
import { useFirebase } from '../contexts/FirebaseContext';
import { AlertTriangle, CheckCircle, Map, Search, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import clsx from 'clsx';

export const Alerts = () => {
  const { alerts, loading } = useFirebase();
  const navigate = useNavigate();
  const [filter, setFilter] = useState('All');

  if (loading) return <div className="text-gray-900 p-6">Loading Alerts...</div>;

  const alertsList = Object.values(alerts || {}).sort((a, b) => new Date(b.time) - new Date(a.time));
  
  const filteredAlerts = alertsList.filter(alert => {
    if (filter === 'All') return true;
    if (filter === 'Unacknowledged') return !alert.acknowledged;
    return alert.severity === filter;
  });

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Alert Center</h1>
          <p className="text-gray-600 mt-1">System warnings, leaks, and maintenance alerts</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="relative">
            <select 
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="appearance-none bg-white border border-gray-200 rounded-lg pl-4 pr-10 py-2 text-gray-900 focus:outline-none focus:border-brand-primary"
            >
              <option value="All">All Alerts</option>
              <option value="Unacknowledged">Unacknowledged</option>
              <option value="Critical">Critical</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
            </select>
            <Filter className="w-4 h-4 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 pointer-events-none" />
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 space-y-4">
        {filteredAlerts.length === 0 ? (
          <div className="glass-panel p-12 text-center flex flex-col items-center justify-center">
            <CheckCircle className="w-16 h-16 text-brand-secondary mb-4 opacity-50" />
            <h3 className="text-xl text-gray-900 font-bold">No Active Alerts</h3>
            <p className="text-gray-600 mt-2">All systems are operating normally.</p>
          </div>
        ) : (
          filteredAlerts.map(alert => {
            const severityColors = {
              Critical: 'border-brand-danger bg-brand-danger/10 text-brand-danger',
              High: 'border-[#f97316] bg-[#f97316]/10 text-[#f97316]',
              Medium: 'border-brand-warning bg-brand-warning/10 text-brand-warning',
              Low: 'border-brand-primary bg-brand-primary/10 text-brand-primary'
            };
            
            const colorClass = severityColors[alert.severity] || severityColors.Low;

            return (
              <div 
                key={alert.id}
                className={clsx(
                  "glass-panel p-5 border-l-4 transition-all hover:bg-white",
                  colorClass,
                  alert.acknowledged && "opacity-60"
                )}
              >
                <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                  <div className="flex items-start space-x-4">
                    <div className={clsx("p-2 rounded-full", colorClass)}>
                      <AlertTriangle className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-3 mb-1">
                        <h3 className="text-lg font-bold text-gray-900">{alert.description}</h3>
                        <span className={clsx("px-2 py-0.5 rounded text-xs font-bold uppercase", colorClass.replace('bg-', 'bg-opacity-20 bg-'))}>
                          {alert.severity}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600 flex items-center space-x-4">
                        <span>Node: {alert.node.toUpperCase()}</span>
                        <span>•</span>
                        <span>Location: {alert.location}</span>
                        <span>•</span>
                        <span>Time: {new Date(alert.time).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3 self-end md:self-auto">
                    {!alert.acknowledged && (
                      <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-lg transition-colors border border-gray-200 text-sm">
                        <CheckCircle className="w-4 h-4" />
                        <span>Acknowledge</span>
                      </button>
                    )}
                    <button 
                      onClick={() => navigate('/map')}
                      className="flex items-center space-x-2 px-4 py-2 bg-brand-primary/20 text-brand-primary hover:bg-brand-primary hover:text-gray-900 rounded-lg transition-colors border border-brand-primary/30 text-sm"
                    >
                      <Map className="w-4 h-4" />
                      <span>View Map</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
