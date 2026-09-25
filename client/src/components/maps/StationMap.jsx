import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { useNavigate } from 'react-router-dom';
import StationStatusBadge from '../alerts/StationStatusBadge';

// Create Leaflet DivIcons matching station status colors
const createCustomIcon = (status) => {
  const colorMap = {
    normal: '#16A34A',      // green
    warning: '#D97706',     // amber
    anomaly: '#DC2626',     // red
    quarantined: '#EAB308', // yellow
    offline: '#64748B'      // gray
  };

  const color = colorMap[status?.toLowerCase()] || '#16A34A';
  const isPulsing = status === 'anomaly';

  const html = `
    <div style="position: relative; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center;">
      ${isPulsing ? `<div style="position: absolute; width: 28px; height: 28px; border-radius: 50%; background: ${color}; opacity: 0.4; animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>` : ''}
      <div style="width: 16px; height: 16px; border-radius: 50%; background: ${color}; border: 2.5px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>
    </div>
  `;

  return L.divIcon({
    html,
    className: 'custom-leaflet-marker',
    iconSize: [24, 24],
    iconAnchor: [12, 12]
  });
};

export default function StationMap({ stations = [], selectedStationId, height = '450px' }) {
  const navigate = useNavigate();

  // Center around Karnataka AWS regional cluster (approx 14.2° N, 76.0° E)
  const defaultCenter = [14.0, 76.2];

  return (
    <div className="w-full rounded-lg overflow-hidden border border-sentinel-border shadow-xs relative" style={{ height }}>
      <MapContainer
        center={defaultCenter}
        zoom={7}
        scrollWheelZoom={true}
        className="w-full h-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {stations.map((st) => {
          const lat = st.latitude || 13.0;
          const lng = st.longitude || 77.0;
          const readings = st.currentReadings || {};

          return (
            <Marker
              key={st.stationId || st._id}
              position={[lat, lng]}
              icon={createCustomIcon(st.status)}
            >
              <Popup className="sentinel-popup">
                <div className="p-1 min-w-[200px]">
                  <div className="flex items-center justify-between border-b pb-1.5 mb-2">
                    <span className="font-bold text-xs text-slate-900">{st.stationId}</span>
                    <StationStatusBadge status={st.status} />
                  </div>
                  <p className="text-[11px] font-medium text-slate-700">{st.name}</p>
                  <p className="text-[10px] text-slate-500 mb-2">{st.location}</p>

                  <div className="grid grid-cols-3 gap-1 bg-slate-50 p-2 rounded text-center mb-2 border border-slate-100">
                    <div>
                      <span className="text-[9px] text-slate-400 block font-medium">Temp</span>
                      <span className="text-xs font-bold text-slate-800">
                        {readings.temperature !== undefined ? `${Number(readings.temperature).toFixed(1)}°C` : '--'}
                      </span>
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-400 block font-medium">Press</span>
                      <span className="text-xs font-bold text-slate-800">
                        {readings.pressure !== undefined ? `${Number(readings.pressure).toFixed(0)}` : '--'}
                      </span>
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-400 block font-medium">Hum</span>
                      <span className="text-xs font-bold text-slate-800">
                        {readings.humidity !== undefined ? `${Number(readings.humidity).toFixed(0)}%` : '--'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] mb-3">
                    <span className="text-slate-500">Trust Score:</span>
                    <span className="font-bold text-blue-700">{st.trustScore || 85}/100</span>
                  </div>

                  <button
                    onClick={() => navigate(`/stations/${st.stationId}`)}
                    className="w-full py-1 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded transition-colors"
                  >
                    View Station Details
                  </button>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      {/* Map Legend Overlay */}
      <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-xs p-2.5 rounded-md border border-sentinel-border shadow-md z-[1000] text-[10px] space-y-1">
        <span className="font-bold text-slate-700 block mb-1">Station Status</span>
        <div className="flex items-center space-x-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
          <span>Normal (22)</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="w-2.5 h-2.5 rounded-full bg-red-600"></span>
          <span>Anomaly (2)</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
          <span>Warning / Extreme</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="w-2.5 h-2.5 rounded-full bg-yellow-500"></span>
          <span>Quarantined (1)</span>
        </div>
      </div>
    </div>
  );
}
