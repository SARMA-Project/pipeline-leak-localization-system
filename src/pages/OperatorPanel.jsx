import React from 'react';
import { Users, Shield, Clock, FileText } from 'lucide-react';

export const OperatorPanel = () => {
  const auditLogs = [
    { id: 1, user: 'John Doe', role: 'Supervisor', action: 'Acknowledged Alarm ALM-9921', time: '10 mins ago' },
    { id: 2, user: 'Jane Smith', role: 'Engineer', action: 'Updated Leak Thresholds', time: '1 hour ago' },
    { id: 3, user: 'System', role: 'AI Engine', action: 'Automated Diagnostic Run', time: '2 hours ago' },
    { id: 4, user: 'Mike Johnson', role: 'Operator', action: 'Logged In', time: '5 hours ago' },
  ];

  return (
    <div className="h-full flex flex-col space-y-6 pb-6">
      <div>
        <h1 className="text-2xl font-bold text-steel-900">Operator Panel</h1>
        <p className="text-sm text-steel-500">Access control and system audit logs</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-1">
        <div className="space-y-6">
          <div className="glass-card p-6 border-t-4 border-t-brand-primary">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-brand-primary/10 flex items-center justify-center">
                <Users className="w-6 h-6 text-brand-primary" />
              </div>
              <div>
                <h3 className="font-bold text-steel-900">Control Room Alpha</h3>
                <p className="text-sm text-brand-primary font-bold">Chief Operator Level</p>
              </div>
            </div>
            <div className="space-y-2 mt-4 text-sm text-steel-600">
              <p className="flex justify-between"><span>Status:</span> <span className="font-bold text-brand-secondary">Active Shift</span></p>
              <p className="flex justify-between"><span>Clearance:</span> <span className="font-bold">Level 4</span></p>
              <p className="flex justify-between"><span>Shift Ends:</span> <span className="font-bold">18:00 HRS</span></p>
            </div>
          </div>

          <div className="glass-card p-6">
            <h3 className="text-sm font-bold text-steel-900 mb-4 border-b border-steel-100 pb-2">Active Personnel</h3>
            <ul className="space-y-3 text-sm">
               <li className="flex justify-between items-center">
                 <span className="font-medium text-steel-900">Jane Smith (Eng)</span>
                 <span className="w-2 h-2 rounded-full bg-brand-secondary"></span>
               </li>
               <li className="flex justify-between items-center">
                 <span className="font-medium text-steel-900">Mike Johnson (Op)</span>
                 <span className="w-2 h-2 rounded-full bg-brand-secondary"></span>
               </li>
               <li className="flex justify-between items-center opacity-50">
                 <span className="font-medium text-steel-900">Sarah Connor (Sup)</span>
                 <span className="w-2 h-2 rounded-full bg-steel-300"></span>
               </li>
            </ul>
          </div>
        </div>

        <div className="col-span-2 glass-panel p-6 flex flex-col">
          <div className="flex justify-between items-center mb-4 border-b border-steel-100 pb-2">
            <h3 className="text-lg font-bold text-steel-900 flex items-center">
              <Shield className="w-5 h-5 mr-2 text-steel-600" />
              System Audit Trail
            </h3>
            <button className="text-xs font-bold text-brand-primary hover:underline flex items-center">
              <FileText className="w-3 h-3 mr-1" /> Export CSV
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            <div className="space-y-4">
              {auditLogs.map(log => (
                <div key={log.id} className="flex items-start space-x-4 p-3 hover:bg-steel-50 rounded-lg transition-colors">
                  <div className="mt-1"><Clock className="w-4 h-4 text-steel-400" /></div>
                  <div className="flex-1">
                    <p className="text-sm text-steel-900">
                      <span className="font-bold">{log.user}</span> ({log.role}) 
                      <span className="mx-2 text-steel-400">•</span> 
                      {log.action}
                    </p>
                    <p className="text-xs text-steel-500 mt-1">{log.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
