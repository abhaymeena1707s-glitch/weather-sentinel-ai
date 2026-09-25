import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Bell, FlaskConical, Clock, ShieldCheck, ChevronRight } from 'lucide-react';
import { useSentinel } from '../../context/SentinelContext';

export default function Topbar() {
  const navigate = useNavigate();
  const { recentAlerts } = useSentinel();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/stations?search=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  const activeAlerts = recentAlerts.filter(a => a.status === 'ACTIVE');

  return (
    <header className="h-14 bg-white border-b border-sentinel-border flex items-center justify-between px-6 flex-shrink-0 z-20">
      {/* Search Bar & Station Quickjump */}
      <div className="flex items-center space-x-4">
        <form onSubmit={handleSearch} className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search Station ID, Location, Sensor..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 pr-4 py-1.5 text-xs bg-slate-50 border border-sentinel-border rounded-md w-72 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white transition-all text-sentinel-text placeholder:text-slate-400"
          />
        </form>

        <div className="hidden lg:flex items-center space-x-2 text-xs">
          <span className="text-slate-400">Quick Access:</span>
          <button
            onClick={() => navigate('/stations/AWS-042')}
            className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 hover:bg-blue-100 font-medium transition-colors border border-blue-200 flex items-center space-x-1"
          >
            <span>Primary Demo: AWS-042</span>
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Right Controls: Clocks, Simulator Trigger, Alerts */}
      <div className="flex items-center space-x-4">
        {/* UTC / Local Clock */}
        <div className="hidden sm:flex items-center space-x-2 text-[11px] text-slate-500 bg-slate-50 px-2.5 py-1 rounded border border-sentinel-border">
          <Clock className="w-3.5 h-3.5 text-slate-400" />
          <span>UTC: {currentTime.toISOString().substring(11, 19)}</span>
          <span className="text-slate-300">|</span>
          <span className="font-semibold text-slate-700">IST: {currentTime.toLocaleTimeString()}</span>
        </div>

        {/* Quick Simulator Button */}
        <button
          onClick={() => navigate('/simulator')}
          className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold rounded bg-amber-500 hover:bg-amber-600 text-white shadow-sm transition-all"
        >
          <FlaskConical className="w-3.5 h-3.5" />
          <span>Launch Simulator</span>
        </button>

        {/* Alerts Bell */}
        <div className="relative">
          <button
            onClick={() => navigate('/alerts')}
            className="p-1.5 rounded-full hover:bg-slate-100 text-slate-600 relative transition-colors"
            title="View Active Alerts"
          >
            <Bell className="w-4 h-4" />
            {activeAlerts.length > 0 && (
              <span className="absolute top-0 right-0 w-2 h-2 rounded-full bg-red-600 ring-2 ring-white"></span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
