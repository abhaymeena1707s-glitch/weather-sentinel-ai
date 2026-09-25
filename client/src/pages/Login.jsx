import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Radio, ShieldCheck, Lock, Mail, ArrowRight, UserCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const res = await login(email, password);
    if (res.success) {
      navigate('/dashboard');
    } else {
      setError(res.error || 'Invalid credentials');
    }
  };

  // Demo user fast-fill
  const fillDemoUser = (demoEmail, demoPass) => {
    setEmail(demoEmail);
    setPassword(demoPass);
  };

  return (
    <div className="min-h-screen w-screen flex items-center justify-center bg-slate-900 px-4 relative overflow-hidden">
      {/* Background Subtle Radar / Grid glow */}
      <div className="absolute inset-0 bg-[radial-gradient(#1e3a8a_1px,transparent_1px)] [background-size:24px_24px] opacity-20"></div>

      <div className="max-w-md w-full bg-navy-900 border border-navy-700/80 rounded-2xl shadow-2xl p-8 relative z-10 text-white">
        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400 mx-auto mb-3 shadow-lg">
            <Radio className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Weather Sentinel AI</h1>
          <p className="text-xs text-blue-400 font-semibold tracking-wider uppercase mt-1">
            AWS Quality Control & Anomaly Detection
          </p>
          <p className="text-xs text-slate-400 italic mt-2">
            "Trustworthy Weather Data. Safer Decisions."
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-md bg-red-500/20 border border-red-500/40 text-red-300 text-xs">
            {error}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Meteorological ID / Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="operator@weathersentinel.ai"
                className="w-full pl-9 pr-3 py-2 text-xs bg-navy-950 border border-navy-700 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-white placeholder:text-slate-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Access Credential / Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-9 pr-3 py-2 text-xs bg-navy-950 border border-navy-700 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-white placeholder:text-slate-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-500 rounded-md text-xs font-bold uppercase tracking-wider text-white shadow-md transition-all flex items-center justify-center space-x-2"
          >
            <span>{loading ? 'Authenticating...' : 'Sign In to Command Center'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* One-Click Demo Credentials (Evaluation Ready) */}
        <div className="mt-6 pt-5 border-t border-navy-800">
          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2 text-center">
            One-Click Evaluator Accounts (Demo Mode)
          </p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              onClick={() => fillDemoUser('operator@weathersentinel.ai', 'Operator@123')}
              className="p-2 rounded bg-navy-800/80 hover:bg-navy-800 border border-navy-700 text-left transition-colors"
            >
              <span className="font-bold text-blue-300 block text-[11px]">Duty Operator</span>
              <span className="text-[10px] text-slate-400 block truncate">operator@weathersentinel.ai</span>
            </button>

            <button
              type="button"
              onClick={() => fillDemoUser('admin@weathersentinel.ai', 'Admin@123')}
              className="p-2 rounded bg-navy-800/80 hover:bg-navy-800 border border-navy-700 text-left transition-colors"
            >
              <span className="font-bold text-emerald-300 block text-[11px]">Administrator</span>
              <span className="text-[10px] text-slate-400 block truncate">admin@weathersentinel.ai</span>
            </button>

            <button
              type="button"
              onClick={() => fillDemoUser('engineer@weathersentinel.ai', 'Engineer@123')}
              className="p-2 rounded bg-navy-800/80 hover:bg-navy-800 border border-navy-700 text-left transition-colors"
            >
              <span className="font-bold text-amber-300 block text-[11px]">Field Engineer</span>
              <span className="text-[10px] text-slate-400 block truncate">engineer@weathersentinel.ai</span>
            </button>

            <button
              type="button"
              onClick={() => fillDemoUser('viewer@weathersentinel.ai', 'Viewer@123')}
              className="p-2 rounded bg-navy-800/80 hover:bg-navy-800 border border-navy-700 text-left transition-colors"
            >
              <span className="font-bold text-slate-300 block text-[11px]">Viewer / Forecaster</span>
              <span className="text-[10px] text-slate-400 block truncate">viewer@weathersentinel.ai</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
