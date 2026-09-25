import React, { createContext, useContext, useState, useEffect } from 'react';
import { getSocket } from '../services/socket';
import { alertService } from '../services/api';

const SentinelContext = createContext(null);

export const SentinelProvider = ({ children }) => {
  const [liveEvent, setLiveEvent] = useState(null);
  const [recentAlerts, setRecentAlerts] = useState([]);
  const [toast, setToast] = useState(null);
  const [isMobileMode, setIsMobileMode] = useState(false); // Mobile frame toggle

  useEffect(() => {
    // Initial fetch of recent alerts
    alertService.getAll({ limit: 10 }).then(res => {
      if (res.data?.success) {
        setRecentAlerts(res.data.data);
      }
    }).catch(err => console.warn('Alerts fetch warning:', err.message));

    // Connect to WebSocket
    const socket = getSocket();

    const handleNewObservation = (data) => {
      setLiveEvent(data);
      if (data.alert) {
        setRecentAlerts(prev => [data.alert, ...prev.slice(0, 9)]);
        setToast({
          id: Date.now(),
          type: data.fusion?.severity || 'HIGH',
          title: `Alert on ${data.stationId}`,
          message: data.fusion?.rootCause || 'Anomaly detected',
          timestamp: new Date()
        });
      }
    };

    const handleNewAlert = (alert) => {
      setRecentAlerts(prev => [alert, ...prev.slice(0, 9)]);
      setToast({
        id: Date.now(),
        type: alert.severity,
        title: `CRITICAL ALERT: ${alert.stationId}`,
        message: alert.message,
        timestamp: new Date()
      });
    };

    socket.on('observation:new', handleNewObservation);
    socket.on('alert:new', handleNewAlert);

    return () => {
      socket.off('observation:new', handleNewObservation);
      socket.off('alert:new', handleNewAlert);
    };
  }, []);

  const dismissToast = () => setToast(null);

  return (
    <SentinelContext.Provider value={{
      liveEvent,
      recentAlerts,
      toast,
      dismissToast,
      isMobileMode,
      setIsMobileMode,
      toggleMobileMode: () => setIsMobileMode(prev => !prev)
    }}>
      {children}
    </SentinelContext.Provider>
  );
};

export const useSentinel = () => useContext(SentinelContext);
