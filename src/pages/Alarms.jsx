import React, { useState } from 'react';
import { useFirebase } from '../contexts/FirebaseContext';
import { Bell, ShieldAlert, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import clsx from 'clsx';

export const Alarms = () => {
  const { alerts, loading } = useFirebase();
  const [activeTab, setActiveTab] = useState('All');

  if (loading || !alerts) return <div className="p-6">Loading Alarms...</div>;

  const filteredAlerts = activeTab === 'All' 
    ? alerts 
    : alerts.filter(a => a.severity === activeTab || (activeTab === 'Unacknowledged' && !a.acknowledged));

  const getIcon = (severity) => {
    switch(severity) {
      case 'Critical': return <ShieldAlert className="w-5 h-5 text-brand-danger" />;
      case 'Warning': return <AlertTriangle className="w-5 h-5 text-brand-warning" />;
      case 'Info': return <Bell className="w-5 h-5 text-brand-info" />;
      default: return <Bell className="w-5 h-5 text-steel-500" />;
    }
  };

  const getColorClass = (severity) => {
    switch(severity) {
      case 'Critical': return 'border-l-4 border-l-brand-danger bg-brand-danger/5';
      case 'Warning': return 'border-l-4 border-l-brand-warning bg-white';
      case 'Info': return 'border-l-4 border-l-brand-info bg-white';
      default: return 'bg-white border border-steel-200';
    }
  };

  const tabs = ['All', 'Critical', 'Warning', 'Info', 'Unacknowledged'];

  return (
    <div className="h-full flex flex-col space-y-6 pb-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-steel-900">Alarm Center</h1>
          <p className="text-sm text-steel-500">Global event tracking and incident management</p>
        </div>
        <button className="btn-secondary text-sm flex items-center">
          <CheckCircle className="w-4 h-4 mr-2" />
          Acknowledge All
        </button>
      </div>

      <div className="glass-panel p-6 flex-1 flex flex-col">
        {/* Tabs */}
        <div className="flex space-x-2 border-b border-steel-200 mb-6 pb-2">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={clsx(
                "px-4 py-2 text-sm font-semibold rounded-t-lg transition-all",
                activeTab === tab 
                  ? "text-brand-primary border-b-2 border-brand-primary" 
                  : "text-steel-500 hover:text-steel-900"
              )}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Alarm List */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
          {filteredAlerts.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-steel-400">
              <CheckCircle className="w-12 h-12 mb-3 text-steel-300" />
              <p>No alarms found for this filter.</p>
            </div>
          ) : (
            filteredAlerts.map(alert => (
              <div key={alert.id} className={`p-4 rounded-r-lg shadow-sm flex items-start justify-between ${getColorClass(alert.severity)}`}>
                <div className="flex items-start space-x-4">
                  <div className="mt-1">{getIcon(alert.severity)}</div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className="font-bold text-steel-900">{alert.type} Alarm</h4>
                      <span className="text-xs font-bold text-steel-500 bg-steel-100 px-2 py-0.5 rounded">{alert.id}</span>
                      {!alert.acknowledged && (
                        <span className="text-[10px] font-bold text-white bg-brand-danger px-2 py-0.5 rounded uppercase animate-pulse">New</span>
                      )}
                    </div>
                    <p className="text-sm text-steel-700 mt-1">{alert.description}</p>
                    <div className="flex items-center space-x-4 mt-2 text-xs text-steel-500 font-medium">
                      <span className="flex items-center"><Clock className="w-3 h-3 mr-1" /> {new Date(alert.time).toLocaleTimeString()}</span>
                      <span>Location: {alert.location} ({alert.node})</span>
                    </div>
                  </div>
                </div>
                
                {!alert.acknowledged && (
                  <button className="px-3 py-1 bg-white border border-steel-200 text-steel-600 rounded text-xs font-bold hover:bg-steel-50 transition-colors shadow-sm">
                    Acknowledge
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
