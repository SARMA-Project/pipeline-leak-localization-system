import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, Lock, User, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

export const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    // Simulate auth
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden font-sans">
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0 z-0 opacity-20">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+PGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMiIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjMpIi8+PC9zdmc+')] opacity-20" />
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
          className="absolute -top-40 -right-40 w-96 h-96 bg-brand-primary rounded-full blur-[100px]"
        />
        <motion.div 
          animate={{ scale: [1, 1.5, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ repeat: Infinity, duration: 10, ease: "easeInOut", delay: 2 }}
          className="absolute -bottom-40 -left-40 w-96 h-96 bg-brand-secondary rounded-full blur-[100px]"
        />
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-xl bg-brand-primary flex items-center justify-center shadow-neon-blue">
            <Activity className="w-10 h-10 text-gray-900" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 tracking-tight">
          EDGE AI Control
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Wireless Acoustic Sensor Grid System
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="glass-panel p-8 sm:p-10 shadow-glass border-t border-gray-300">
          <form className="space-y-6" onSubmit={handleLogin}>
            <div>
              <label className="block text-sm font-medium text-gray-600">
                Operator ID / Email
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-600" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-white border border-gray-200 block w-full pl-10 pr-3 py-3 rounded-lg text-gray-900 placeholder-industrial-500 focus:outline-none focus:ring-1 focus:ring-brand-primary focus:border-brand-primary transition-colors"
                  placeholder="admin@scada.system"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600">
                Password
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-600" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-white border border-gray-200 block w-full pl-10 pr-3 py-3 rounded-lg text-gray-900 placeholder-industrial-500 focus:outline-none focus:ring-1 focus:ring-brand-primary focus:border-brand-primary transition-colors"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 bg-white border-gray-200 rounded text-brand-primary focus:ring-brand-primary focus:ring-offset-industrial-900"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-600">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="font-medium text-brand-primary hover:text-blue-400 transition-colors">
                  Forgot password?
                </a>
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center items-center space-x-2 btn-primary py-3"
              >
                <span>Sign in to Control Panel</span>
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </form>
          
          <div className="mt-6 border-t border-gray-200 pt-6 text-center">
            <p className="text-xs text-gray-600">Authorized Personnel Only. Secure SCADA Interface.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
