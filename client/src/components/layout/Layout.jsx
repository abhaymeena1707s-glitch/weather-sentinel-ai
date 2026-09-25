import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import MobileNav from './MobileNav';
import { useSentinel } from '../../context/SentinelContext';
import { AlertCircle, X, ShieldAlert, Smartphone } from 'lucide-react';

export default function Layout() {
  const { toast, dismissToast, isMobileMode, toggleMobileMode } = useSentinel();

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-sentinel-bg">
      {/* Toast Alert Banner */}
      {toast && (
        <div className="fixed top-4 right-4 z-50 max-w-md w-full bg-navy-900 border border-red-500/50 shadow-xl rounded-lg p-4 text-white flex items-start space-x-3 animate-bounce">
          <ShieldAlert className="w-6 h-6 text-red-400 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h4 className="text-xs font-bold text-red-300 uppercase tracking-wider">{toast.title}</h4>
            <p className="text-xs text-slate-200 mt-0.5">{toast.message}</p>
            <span className="text-[10px] text-slate-400 mt-1 block">Live Engine Telemetry Alert</span>
          </div>
          <button onClick={dismissToast} className="text-slate-400 hover:text-white p-1">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* When Mobile Mode is toggled on a desktop, render an iPhone/Android simulation canvas */}
      {isMobileMode ? (
        <div className="flex-1 flex flex-col items-center justify-center bg-slate-900 p-4 overflow-y-auto relative w-full h-full">
          {/* Top Banner to exit simulator */}
          <div className="absolute top-3 left-6 right-6 flex items-center justify-between text-xs text-slate-300 bg-navy-800/90 px-4 py-2 rounded-lg border border-navy-700">
            <div className="flex items-center space-x-2">
              <Smartphone className="w-4 h-4 text-cyan-400" />
              <span className="font-semibold text-white">Weather Sentinel Mobile UI Simulator (Android / iOS)</span>
              <span className="text-[10px] text-slate-400">— Fully interactive native mobile experience</span>
            </div>
            <button
              onClick={toggleMobileMode}
              className="px-2.5 py-1 text-xs font-semibold rounded bg-blue-600 hover:bg-blue-500 text-white"
            >
              Back to Command Center Desktop
            </button>
          </div>

          {/* Smartphone Frame */}
          <div className="w-[390px] h-[800px] bg-navy-950 border-[6px] border-slate-700 rounded-[44px] shadow-2xl overflow-hidden flex flex-col relative mt-8">
            {/* Speaker & Camera Notch */}
            <div className="w-36 h-5 bg-slate-800 rounded-b-xl mx-auto flex items-center justify-center">
              <div className="w-3 h-3 rounded-full bg-slate-900 mr-2"></div>
              <div className="w-10 h-1 bg-slate-700 rounded-full"></div>
            </div>

            {/* Mobile Status Bar */}
            <div className="px-6 py-1 flex items-center justify-between text-[11px] text-slate-400 font-medium">
              <span>09:41</span>
              <div className="flex items-center space-x-1.5 text-[10px]">
                <span>5G</span>
                <span>100%</span>
              </div>
            </div>

            {/* Screen Content */}
            <div className="flex-1 overflow-y-auto pb-16 bg-sentinel-bg">
              <Outlet />
            </div>

            {/* Mobile Bottom Navigation */}
            <MobileNav />
          </div>
        </div>
      ) : (
        /* Full Desktop Command Center Layout */
        <>
          {/* Desktop Left Sidebar (hidden on small mobile screens) */}
          <div className="hidden md:flex flex-shrink-0 h-full">
            <Sidebar />
          </div>

          {/* Right Main Stage */}
          <div className="flex-1 flex flex-col h-full overflow-hidden min-w-0">
            <Topbar />
            <main className="flex-1 overflow-y-auto p-4 md:p-6 pb-20 md:pb-6">
              <Outlet />
            </main>
          </div>

          {/* On native small screen mobile devices (<768px), display bottom navigation */}
          <div className="md:hidden">
            <MobileNav />
          </div>
        </>
      )}
    </div>
  );
}
