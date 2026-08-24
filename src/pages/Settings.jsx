import React, { useState } from 'react';
import { Save, Bell, Shield, Database, Globe } from 'lucide-react';
import clsx from 'clsx';

export const Settings = () => {
  const [activeTab, setActiveTab] = useState('firebase');

  const tabs = [
    { id: 'firebase', label: 'Firebase Configuration', icon: Database },
    { id: 'alerts', label: 'Alert Thresholds', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'map', label: 'Map & Pipeline', icon: Globe },
  ];

  return (
    <div className="space-y-6 h-full pb-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">System Settings</h1>
        <p className="text-gray-600 mt-1">Configure dashboard parameters and integrations</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-2">
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={clsx(
                  "w-full flex items-center space-x-3 px-4 py-3 rounded-lg font-medium transition-colors",
                  isActive 
                    ? "bg-brand-primary/10 text-brand-primary border border-brand-primary/30" 
                    : "bg-white text-gray-600 hover:bg-gray-50 border border-transparent"
                )}
              >
                <Icon className="w-5 h-5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        <div className="lg:col-span-2 glass-panel p-6 shadow-sm border border-gray-200">
          {activeTab === 'firebase' && (
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-6 border-b border-gray-200 pb-4">Firebase Integration</h3>
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">Project ID</label>
                  <input 
                    type="text" 
                    defaultValue="pipeline-monitoring-scada"
                    className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">Database URL</label>
                  <input 
                    type="text" 
                    defaultValue="https://pipeline-monitoring-scada.firebaseio.com"
                    className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">API Key</label>
                  <input 
                    type="password" 
                    defaultValue="AIzaSyBxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                    className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary"
                  />
                </div>
                <div className="pt-4 flex justify-end">
                  <button className="btn-primary flex items-center space-x-2">
                    <Save className="w-5 h-5" />
                    <span>Save Configuration</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'alerts' && (
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-6 border-b border-gray-200 pb-4">Alert Thresholds</h3>
              <div className="space-y-5">
                <p className="text-gray-600">Configure sensitivity for pipeline leak detection AI.</p>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">Gas Concentration Warning (ppm)</label>
                  <input type="number" defaultValue={250} className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2 text-gray-900" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">Gas Concentration Critical (ppm)</label>
                  <input type="number" defaultValue={500} className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2 text-gray-900" />
                </div>
                <div className="pt-4 flex justify-end">
                  <button className="btn-primary">Save Thresholds</button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-6 border-b border-gray-200 pb-4">Notifications</h3>
              <p className="text-gray-600">Email and SMS configuration for critical events.</p>
              {/* placeholder */}
            </div>
          )}

          {activeTab === 'map' && (
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-6 border-b border-gray-200 pb-4">Map & Pipeline Data</h3>
              <p className="text-gray-600">Configure map tile layers and pipeline geometry details.</p>
              {/* placeholder */}
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
