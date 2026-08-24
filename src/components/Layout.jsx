import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Map as MapIcon, 
  Activity, 
  Settings as SettingsIcon,
  LogOut,
  Bell,
  Cpu,
  Wifi,
  CloudLightning,
  ShieldAlert,
  Menu,
  X
} from 'lucide-react';
import { useFirebase } from '../contexts/FirebaseContext';

export const Layout = () => {
  const navigate = useNavigate();
  const { isUsingMock, metrics, nodes } = useFirebase();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSignOut = () => {
    navigate('/login');
  };

  const hasLeak = Object.values(nodes).some(n => n.status === 'Leak' || n.leakProbability > 80);

  const navItems = [
    { path: '/', label: 'Overview & Twin', icon: LayoutDashboard },
    { path: '/map', label: 'GIS Pipeline Map', icon: MapIcon },
    { path: '/analytics', label: 'Sensor Analytics', icon: CloudLightning },
    { path: '/alarms', label: 'Alarms & Events', icon: Bell },
    { path: '/settings', label: 'ESP32 & Settings', icon: SettingsIcon },
  ];

  return (
    <div className="flex h-screen bg-steel-50 overflow-hidden font-sans">
      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 z-30 md:hidden backdrop-blur-sm"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed md:relative inset-y-0 left-0 w-64 bg-white border-r border-steel-200 flex flex-col shadow-md z-40 transition-transform duration-300 ${
        mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      }`}>
        <div className="h-16 flex items-center justify-between px-6 border-b border-steel-200">
          <div className="flex items-center">
            <Activity className="w-6 h-6 text-brand-primary mr-2" />
            <span className="text-xl font-bold text-steel-900 tracking-tight">LEAK <span className="text-brand-primary">BUSTERS</span> SCADA</span>
          </div>
          <button 
            className="md:hidden text-steel-500 hover:text-steel-800"
            onClick={() => setMobileMenuOpen(false)}
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center px-3 py-2.5 rounded-lg transition-all duration-200 group ${
                    isActive 
                      ? 'bg-brand-primary/10 text-brand-primary font-semibold shadow-sm' 
                      : 'text-steel-600 hover:bg-steel-50 hover:text-steel-900'
                  }`
                }
              >
                <Icon className="w-5 h-5 mr-3 flex-shrink-0" />
                <span className="text-sm">{item.label}</span>
              </NavLink>
            );
          })}

          {hasLeak && (
            <div className="pt-2 mt-2 border-t border-steel-200">
              <NavLink
                to="/emergency"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center px-3 py-3 rounded-lg bg-brand-danger/10 text-brand-danger font-bold hover:bg-brand-danger/20 transition-all border border-brand-danger/30 shadow-neon-red animate-pulse"
              >
                <ShieldAlert className="w-5 h-5 mr-3 flex-shrink-0" />
                <span className="text-sm uppercase tracking-wide">Emergency SOP</span>
              </NavLink>
            </div>
          )}
        </nav>

        <div className="p-4 border-t border-steel-200">
          <button 
            onClick={handleSignOut}
            className="flex items-center w-full px-3 py-2 text-sm font-medium text-steel-600 rounded-lg hover:bg-steel-50 hover:text-brand-danger transition-colors"
          >
            <LogOut className="w-5 h-5 mr-3" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        <header className="h-16 bg-white/90 backdrop-blur-md border-b border-steel-200 flex items-center justify-between px-4 md:px-6 z-10 shadow-sm">
          <div className="flex items-center space-x-3">
            <button 
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden p-2 text-steel-600 hover:bg-steel-100 rounded-lg"
            >
              <Menu className="w-6 h-6" />
            </button>

            {isUsingMock ? (
              <div className="flex items-center px-2.5 py-1 bg-brand-warning/10 border border-brand-warning/20 rounded-full">
                <div className="w-2 h-2 rounded-full bg-brand-warning mr-1.5 animate-pulse"></div>
                <span className="text-[11px] font-semibold text-brand-warning uppercase">Sim Mode</span>
              </div>
            ) : (
              <div className="flex items-center px-2.5 py-1 bg-brand-secondary/10 border border-brand-secondary/20 rounded-full">
                <div className="w-2 h-2 rounded-full bg-brand-secondary mr-1.5"></div>
                <span className="text-[11px] font-semibold text-brand-secondary uppercase">Live System</span>
              </div>
            )}
            
            <div className="hidden lg:flex items-center space-x-6 text-xs text-steel-600 font-medium">
              <div className="flex items-center">
                <Wifi className="w-3.5 h-3.5 mr-1.5 text-brand-primary" />
                Latency: {metrics?.network?.latency?.toFixed(0) || 0}ms
              </div>
              <div className="flex items-center">
                <Cpu className="w-3.5 h-3.5 mr-1.5 text-brand-secondary" />
                AI Edge Conf: {metrics?.ai?.overallConfidence?.toFixed(1) || 0}%
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <button className="relative p-2 text-steel-400 hover:text-steel-600 transition-colors">
              <Bell className="w-5 h-5" />
              {hasLeak && <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-brand-danger rounded-full border-2 border-white animate-pulse"></span>}
            </button>

            <div className="flex items-center space-x-3 border-l border-steel-200 pl-4">
              <div className="text-right">
                <div className="text-sm font-bold text-steel-900">Control Room Alpha</div>
                <div className="text-xs text-steel-500">Chief Operator</div>
              </div>
              <div className="w-9 h-9 rounded-full bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center text-brand-primary font-bold shadow-sm">
                OP
              </div>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-auto p-4 md:p-6 scroll-smooth">
          <div className="max-w-7xl mx-auto h-full">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
};
