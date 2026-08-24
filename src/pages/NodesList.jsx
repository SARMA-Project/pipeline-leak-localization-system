import React, { useState, useMemo } from 'react';
import { useFirebase } from '../contexts/FirebaseContext';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, MoreVertical, Battery, Signal, Cpu } from 'lucide-react';
import clsx from 'clsx';

export const NodesList = () => {
  const { nodes, loading } = useFirebase();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const filteredNodes = useMemo(() => {
    if (!nodes) return [];
    return Object.values(nodes).filter(node => {
      const matchesSearch = node.id.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'All' || node.status === statusFilter;
      return matchesSearch && matchesStatus;
    }).sort((a, b) => a.id.localeCompare(b.id));
  }, [nodes, searchTerm, statusFilter]);

  if (loading) return <div className="text-gray-900 p-6">Loading Nodes...</div>;

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Node Management</h1>
          <p className="text-gray-600 mt-1">Monitor and configure ESP32/ESP8266 sensor nodes</p>
        </div>
        
        <div className="flex items-center space-x-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600" />
            <input 
              type="text" 
              placeholder="Search Node ID..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-lg pl-10 pr-4 py-2 text-gray-900 placeholder-industrial-400 focus:outline-none focus:border-brand-primary"
            />
          </div>
          <div className="relative">
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="appearance-none bg-white border border-gray-200 rounded-lg pl-4 pr-10 py-2 text-gray-900 focus:outline-none focus:border-brand-primary"
            >
              <option value="All">All Status</option>
              <option value="Healthy">Healthy</option>
              <option value="Warning">Warning</option>
              <option value="Leak">Leak</option>
              <option value="Offline">Offline</option>
            </select>
            <Filter className="w-4 h-4 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 pointer-events-none" />
          </div>
        </div>
      </div>

      <div className="flex-1 glass-panel rounded-xl overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/50 border-b border-gray-200 text-gray-600 text-sm">
                <th className="px-6 py-4 font-medium">Node ID</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Master Node</th>
                <th className="px-6 py-4 font-medium">Battery</th>
                <th className="px-6 py-4 font-medium">Signal (RSSI)</th>
                <th className="px-6 py-4 font-medium">Sensors</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredNodes.map(node => (
                <tr 
                  key={node.id} 
                  className="hover:bg-gray-100/50 transition-colors cursor-pointer"
                  onClick={() => navigate(`/node/${node.id}`)}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded bg-white flex items-center justify-center border border-gray-200">
                        <Cpu className="w-4 h-4 text-gray-600" />
                      </div>
                      <span className="font-bold text-gray-900">{node.id.toUpperCase()}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={clsx(
                      "px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border",
                      node.status === 'Healthy' ? "bg-brand-secondary/10 text-brand-secondary border-brand-secondary/20" :
                      node.status === 'Warning' ? "bg-brand-warning/10 text-brand-warning border-brand-warning/20" :
                      node.status === 'Leak' ? "bg-brand-danger/10 text-brand-danger border-brand-danger/20" :
                      "bg-gray-100 text-gray-600 border-gray-200"
                    )}>
                      {node.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{node.masterNode}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <Battery className={clsx("w-4 h-4", node.battery < 20 ? "text-brand-danger" : "text-brand-secondary")} />
                      <span className="text-gray-900">{node.battery.toFixed(0)}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <Signal className="w-4 h-4 text-gray-600" />
                      <span className="text-gray-900">{node.signal.toFixed(0)} dBm</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-2">
                      <span className="text-xs bg-white px-2 py-1 rounded text-gray-600" title={`Gas: ${node.gas.toFixed(0)} ppm`}>Gas</span>
                      <span className="text-xs bg-white px-2 py-1 rounded text-gray-600" title={`Acoustic: ${node.acoustic.toFixed(0)} dB`}>Acst</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-gray-600 hover:text-gray-900 p-2 rounded-lg hover:bg-white transition-colors" onClick={(e) => { e.stopPropagation(); navigate(`/node/${node.id}`); }}>
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredNodes.length === 0 && (
            <div className="text-center py-12 text-gray-600">
              No nodes found matching your criteria.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
