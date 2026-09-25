import React, { useState, useEffect } from 'react';
import StationMap from '../components/maps/StationMap';
import { stationService } from '../services/api';
import { Search, Filter, Radio } from 'lucide-react';

export default function LiveMap() {
  const [stations, setStations] = useState([]);
  const [filter, setFilter] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    stationService.getAll({ status: filter, search }).then(res => {
      if (res.data?.success) {
        setStations(res.data.data);
      }
    });
  }, [filter, search]);

  return (
    <div className="space-y-4 h-[calc(100vh-100px)] flex flex-col">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 flex-shrink-0">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center space-x-2">
            <Radio className="w-5 h-5 text-blue-600" />
            <span>Synoptic AWS Network Geospatial Map</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Regional spatial consensus & cluster monitoring across Karnataka meteorological telemetry network
          </p>
        </div>

        {/* Filters */}
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search station or city..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-3 py-1.5 text-xs bg-white border border-sentinel-border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 w-48"
            />
          </div>

          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="text-xs bg-white border border-sentinel-border rounded-md px-3 py-1.5"
          >
            <option value="">All 25 Stations</option>
            <option value="normal">Normal</option>
            <option value="anomaly">Anomalies</option>
            <option value="warning">Warning / Extreme</option>
            <option value="quarantined">Quarantined</option>
            <option value="offline">Offline</option>
          </select>
        </div>
      </div>

      {/* Map Container */}
      <div className="flex-1 w-full min-h-0">
        <StationMap stations={stations} height="100%" />
      </div>
    </div>
  );
}
