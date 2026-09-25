import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Radio,
  MapPin,
  AlertTriangle,
  Activity,
  HeartPulse,
  ShieldAlert,
  Wrench,
  FileBarChart2,
  Cpu,
  FlaskConical,
  Settings,
  LogOut,
  Smartphone,
  CheckCircle2
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useSentinel } from '../../context/SentinelContext';

const NAV_ITEMS = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/stations', label: 'Stations', icon: Radio },
  { to: '/live-map', label: 'Live Map', icon: MapPin },
  { to: '/alerts', label: 'Alerts', icon: AlertTriangle, badge: true },
  { to: '/anomalies', label: 'Anomaly Analysis', icon: Activity },
  { to: '/sensor-health', label: 'Sensor Health', icon: HeartPulse },
  { to: '/quarantine', label: 'Quarantine', icon: ShieldAlert },
  { to: '/maintenance', label: 'Maintenance', icon: Wrench },
  { to: '/reports', label: 'Reports', icon: FileBarChart2 },
  { to: '/model-performance', label: 'Model Performance', icon: Cpu },
  { to: '/simulator', label: 'Simulator', icon: FlaskConical, highlight: true },
  { to: '/settings', label: 'Settings', icon: Settings },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const { recentAlerts, isMobileMode, toggleMobileMode } = useSentinel();
  const navigate = useNavigate();

  const activeAlertsCount = recentAlerts.filter(a => a.status === 'ACTIVE').length;

  return (
    <aside className="w-64 bg-navy-900 border-r border-navy-700 flex flex-col flex-shrink-0 text-slate-300 select-none">
      {/* Brand Header */}
      <div className="p-4 border-b border-navy-700/60 flex items-center justify-between">
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => navigate('/dashboard')}>
          <div className="w-9 h-9 rounded-lg bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400">
            <Radio className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-white tracking-wide leading-none">
              Weather Sentinel <span className="text-blue-400">AI</span>
            </h1>
            <p className="text-[10px] text-slate-400 mt-1 font-medium">AWS Quality Control</p>
          </div>
        </div>
      </div>

      {/* Tagline Badge */}
      <div className="px-4 py-2 bg-navy-800/40 border-b border-navy-700/40 text-[11px] text-slate-400 italic">
        "Trustworthy Weather Data. Safer Decisions."
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 px-3 py-3 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `
                flex items-center justify-between px-3 py-2 text-xs font-medium rounded-md transition-colors
                ${isActive
                  ? 'bg-blue-600 text-white font-semibold shadow-sm'
                  : item.highlight
                    ? 'bg-amber-500/10 text-amber-300 border border-amber-500/20 hover:bg-amber-500/20'
                    : 'text-slate-300 hover:bg-navy-800 hover:text-white'
                }
              `}
            >
              <div className="flex items-center space-x-3">
                <Icon className={`w-4 h-4 ${item.highlight ? 'text-amber-400' : ''}`} />
                <span>{item.label}</span>
              </div>
              {item.badge && activeAlertsCount > 0 && (
                <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-red-500 text-white">
                  {activeAlertsCount}
                </span>
              )}
              {item.highlight && (
                <span className="px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider rounded bg-amber-500/20 text-amber-300">
                  Demo
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Mobile Device Simulator Toggle */}
      <div className="px-3 py-2 border-t border-navy-700/60">
        <button
          onClick={toggleMobileMode}
          className={`w-full flex items-center justify-between px-3 py-2 text-xs rounded-md border transition-all ${
            isMobileMode
              ? 'bg-blue-600/30 border-blue-500 text-blue-300'
              : 'bg-navy-800/80 border-navy-700 text-slate-300 hover:bg-navy-800 hover:text-white'
          }`}
          title="Toggle Android/iOS Mobile Simulator View"
        >
          <div className="flex items-center space-x-2">
            <Smartphone className="w-4 h-4 text-cyan-400" />
            <span>Mobile UI View</span>
          </div>
          <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase ${
            isMobileMode ? 'bg-blue-500 text-white' : 'bg-slate-700 text-slate-300'
          }`}>
            {isMobileMode ? 'ON' : 'OFF'}
          </span>
        </button>
      </div>

      {/* System Status & User Section */}
      <div className="p-3 border-t border-navy-700/80 bg-navy-950/60">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-[11px] text-slate-400 font-medium">Engine: Operational</span>
          </div>
          <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
            {user?.role || 'OPERATOR'}
          </span>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-navy-800">
          <div className="truncate pr-2">
            <p className="text-xs font-medium text-white truncate">{user?.name || 'Operator'}</p>
            <p className="text-[10px] text-slate-400 truncate">{user?.email || 'operator@weathersentinel.ai'}</p>
          </div>
          <button
            onClick={logout}
            className="p-1.5 rounded hover:bg-navy-800 text-slate-400 hover:text-red-400 transition-colors"
            title="Log out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
