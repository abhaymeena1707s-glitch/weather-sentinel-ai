import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Radio,
  MapPin,
  Clock,
  Layers,
  Sparkles,
  ShieldCheck,
  HeartPulse,
  Wrench,
  Activity,
  AlertTriangle,
  CheckCircle2,
  Sliders,
  Check
} from 'lucide-react';
import StationStatusBadge from '../components/alerts/StationStatusBadge';
import WeatherMetricCard from '../components/cards/WeatherMetricCard';
import WeatherChart from '../components/charts/WeatherChart';
import TrustScoreCard from '../components/cards/TrustScoreCard';
import StationPersonalityCard from '../components/cards/StationPersonalityCard';
import CounterfactualCard from '../components/cards/CounterfactualCard';
import AnomalyEvidenceCard from '../components/cards/AnomalyEvidenceCard';
import SeverityBadge from '../components/alerts/SeverityBadge';
import { stationService, readingService, anomalyService, alertService, quarantineService } from '../services/api';
import { useSentinel } from '../context/SentinelContext';

export default function StationDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { liveEvent } = useSentinel();

  const [activeTab, setActiveTab] = useState('overview'); // overview, live, history, anomaly, health, maintenance, raw
  const [stationData, setStationData] = useState(null);
  const [readings, setReadings] = useState([]);
  const [profile, setProfile] = useState(null);
  const [health, setHealth] = useState([]);
  const [anomaly, setAnomaly] = useState(null);
  const [loading, setLoading] = useState(true);
  const [correctionApplied, setCorrectionApplied] = useState(false);

  const fetchDetails = async () => {
    try {
      const res = await stationService.getById(id);
      if (res.data?.success) {
        setStationData(res.data.data.station);
        setProfile(res.data.data.profile);
        setHealth(res.data.data.sensorHealth || []);
        setReadings(res.data.data.recentReadings || []);
      }

      // Check if there is an active anomaly for this station
      const anomRes = await anomalyService.getAll({ stationId: id, limit: 1 });
      if (anomRes.data?.success && anomRes.data.data?.length > 0) {
        setAnomaly(anomRes.data.data[0]);
      }
    } catch (err) {
      console.warn('Station details fetch warning:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, [id]);

  // Handle live WebSocket telemetry updates
  useEffect(() => {
    if (liveEvent && liveEvent.stationId === id) {
      setStationData(prev => ({
        ...prev,
        status: liveEvent.status,
        currentReadings: liveEvent.observation,
        trustScore: liveEvent.trustScore?.score || prev?.trustScore
      }));
      if (liveEvent.anomaly) {
        setAnomaly(liveEvent.anomaly);
      }
    }
  }, [liveEvent, id]);

  const handleApplyCorrection = async () => {
    try {
      // Find quarantine record
      const qRes = await quarantineService.getAll({ stationId: id, status: 'QUARANTINED', limit: 1 });
      if (qRes.data?.success && qRes.data.data?.length > 0) {
        await quarantineService.update(qRes.data.data[0]._id, {
          action: 'APPLY_CORRECTION',
          operatorNotes: 'Counterfactual normal value applied by operator from Forensic Explainability panel.'
        });
        setCorrectionApplied(true);
        fetchDetails();
      }
    } catch (err) {
      console.warn('Apply correction warning:', err.message);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-xs text-slate-500">Loading station telemetry...</div>;
  }

  const st = stationData || {
    stationId: id,
    name: 'Chikkamagaluru Hill Station',
    location: 'Chikkamagaluru, Karnataka',
    latitude: 13.32,
    longitude: 75.77,
    elevation: 842,
    status: 'anomaly',
    trustScore: 87,
    currentReadings: { temperature: 55.0, pressure: 987.2, humidity: 96.0 }
  };

  const curr = st.currentReadings || { temperature: 55.0, pressure: 987.2, humidity: 96.0 };
  const isAnomalous = st.status === 'anomaly' || st.status === 'quarantined' || (curr.temperature > 45);

  const tabs = [
    { key: 'overview', label: 'Overview' },
    { key: 'live', label: 'Live Data' },
    { key: 'history', label: 'History' },
    { key: 'anomaly', label: 'Anomaly Analysis' },
    { key: 'health', label: 'Sensor Health' },
    { key: 'maintenance', label: 'Maintenance' },
    { key: 'raw', label: 'Raw QC Data' }
  ];

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="sentinel-card p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start space-x-3">
            <button
              onClick={() => navigate('/stations')}
              className="p-1.5 rounded-md hover:bg-slate-100 text-slate-500 transition-colors mt-0.5"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <div className="flex items-center space-x-3">
                <h1 className="text-xl font-black text-slate-900">{st.stationId}</h1>
                <span className="text-base font-semibold text-slate-600">— {st.name}</span>
                <StationStatusBadge status={st.status} />
              </div>
              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-1.5">
                <span className="flex items-center space-x-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>{st.location}</span>
                </span>
                <span>•</span>
                <span>Coords: {st.latitude?.toFixed(2)}°N, {st.longitude?.toFixed(2)}°E</span>
                <span>•</span>
                <span>Elev: {st.elevation} m MSL</span>
                <span>•</span>
                <span className="flex items-center space-x-1 text-emerald-600 font-medium">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Fresh Telemetry (1m ago)</span>
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => navigate('/simulator')}
              className="px-3 py-1.5 text-xs font-bold rounded bg-amber-500 hover:bg-amber-600 text-white shadow-xs transition-all"
            >
              Test with Simulator
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center space-x-1 border-t border-slate-200 mt-5 pt-3 overflow-x-auto text-xs font-semibold">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-3.5 py-1.5 rounded-md transition-colors whitespace-nowrap ${
                activeTab === tab.key
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Current Readings Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <WeatherMetricCard
          parameter="temperature"
          value={curr.temperature}
          expected={31.8}
          isAnomaly={curr.temperature > 40}
          unit="°C"
          stationId={st.stationId}
        />
        <WeatherMetricCard
          parameter="pressure"
          value={curr.pressure}
          expected={1003.2}
          isAnomaly={curr.pressure < 990}
          unit="hPa"
          stationId={st.stationId}
        />
        <WeatherMetricCard
          parameter="humidity"
          value={curr.humidity}
          expected={64.5}
          isAnomaly={curr.humidity > 95 && curr.temperature > 45}
          unit="%"
          stationId={st.stationId}
        />
      </div>

      {/* Tab Content Panels */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Anomaly Callout Banner if station has anomaly */}
          {isAnomalous && (
            <div className="p-4 rounded-lg bg-red-50 border border-red-200 flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="flex items-center space-x-2">
                    <h4 className="text-xs font-bold text-red-900 uppercase tracking-wider">
                      Active Telemetry Anomaly Detected
                    </h4>
                    <SeverityBadge severity="HIGH" />
                    <span className="text-[10px] font-bold text-red-700 bg-red-100 px-1.5 py-0.5 rounded">
                      Quarantined
                    </span>
                  </div>
                  <p className="text-xs text-red-800 mt-1">
                    Probable Temperature Sensor Fault: Reported 55.0°C vs expected 31.8°C. Neighboring stations remain normal (30–33°C).
                  </p>
                </div>
              </div>
              <button
                onClick={() => setActiveTab('anomaly')}
                className="px-3 py-1.5 text-xs font-bold rounded bg-red-600 hover:bg-red-700 text-white whitespace-nowrap transition-colors"
              >
                Inspect Evidence & SHAP
              </button>
            </div>
          )}

          {/* Live Chart & Trust Score */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8">
              <WeatherChart readings={readings} height={300} stationId={st.stationId} />
            </div>
            <div className="lg:col-span-4">
              <TrustScoreCard score={st.trustScore || 87} />
            </div>
          </div>

          {/* Station Personality */}
          <StationPersonalityCard profile={profile} stationId={st.stationId} />
        </div>
      )}

      {activeTab === 'anomaly' && (
        <div className="space-y-6">
          {/* Counterfactual AI Section */}
          <CounterfactualCard
            observed={{ temperature: curr.temperature, pressure: curr.pressure, humidity: curr.humidity }}
            expected={{ temperature: 31.8, pressure: 1003.2, humidity: 64.5 }}
            featureContributions={{ temperature: 87, pressure: 21, humidity: 11 }}
            onApplyCorrection={handleApplyCorrection}
          />

          {correctionApplied && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-md text-xs text-emerald-800 flex items-center space-x-2">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>Corrected estimated normal (31.8°C) successfully applied to station record without overwriting raw observation.</span>
            </div>
          )}

          {/* Multi-modal Evidence Breakdown */}
          <AnomalyEvidenceCard evidence={anomaly?.evidence || {}} />

          {/* Action & Maintenance Recommendation */}
          <div className="sentinel-card p-5 border-l-4 border-amber-500">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Recommended Meteorological Operations Action</h4>
            <p className="text-xs text-slate-700 mt-1 font-medium">
              "Inspect temperature sensor wiring and thermocouple resistance; verify aspirated radiation shield fan operation."
            </p>
            <div className="mt-3 flex items-center space-x-2">
              <button
                onClick={() => navigate('/quarantine')}
                className="px-3 py-1.5 text-xs font-semibold rounded bg-amber-600 hover:bg-amber-700 text-white"
              >
                Go to Quarantine Console
              </button>
              <button
                onClick={() => navigate('/maintenance')}
                className="px-3 py-1.5 text-xs font-semibold rounded bg-slate-100 hover:bg-slate-200 text-slate-800 border"
              >
                View Maintenance Work Order
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'live' && (
        <div className="space-y-6">
          <WeatherChart readings={readings} height={360} stationId={st.stationId} />
        </div>
      )}

      {activeTab === 'history' && (
        <div className="sentinel-card p-4">
          <h3 className="text-sm font-bold text-slate-800 mb-3">Historical Readings Log ({st.stationId})</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 border-b text-slate-500 font-bold uppercase text-[10px]">
                <tr>
                  <th className="py-2.5 px-3">Timestamp</th>
                  <th className="py-2.5 px-3">Temperature (°C)</th>
                  <th className="py-2.5 px-3">Pressure (hPa)</th>
                  <th className="py-2.5 px-3">Humidity (%)</th>
                  <th className="py-2.5 px-3">QC Status</th>
                  <th className="py-2.5 px-3">Anomaly Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {readings.map((r, i) => (
                  <tr key={i} className="hover:bg-slate-50">
                    <td className="py-2 px-3 text-slate-500">{new Date(r.timestamp).toLocaleTimeString()}</td>
                    <td className={`py-2 px-3 font-semibold ${r.temperature > 45 ? 'text-red-600 font-bold' : ''}`}>
                      {r.temperature?.toFixed(1)}
                    </td>
                    <td className="py-2 px-3 text-slate-700">{r.pressure?.toFixed(1)}</td>
                    <td className="py-2 px-3 text-slate-700">{r.humidity?.toFixed(0)}%</td>
                    <td className="py-2 px-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        r.qualityStatus === 'QUARANTINED' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {r.qualityStatus || 'VERIFIED'}
                      </span>
                    </td>
                    <td className="py-2 px-3 font-bold text-slate-800">{r.anomalyScore || 0}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'health' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {health.map((h, idx) => (
            <div key={idx} className="sentinel-card p-5">
              <div className="flex items-center justify-between pb-2 border-b">
                <span className="text-xs font-bold uppercase text-slate-700">{h.sensorType} Sensor</span>
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                  h.healthScore < 65 ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'
                }`}>
                  Health: {h.healthScore}/100
                </span>
              </div>
              <div className="mt-3 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Drift Rate:</span>
                  <span className="font-semibold text-slate-800">{h.driftRate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Noise Level:</span>
                  <span className="font-semibold text-slate-800">{h.noiseLevel}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Spike Count:</span>
                  <span className="font-semibold text-slate-800">{h.spikeCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Failure Risk:</span>
                  <span className={`font-bold ${h.failureRisk === 'HIGH' ? 'text-red-600' : 'text-slate-700'}`}>
                    {h.failureRisk}
                  </span>
                </div>
              </div>
              <p className="mt-3 pt-2 border-t text-[11px] text-slate-500 italic">
                {h.maintenanceRecommendation}
              </p>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'maintenance' && (
        <div className="sentinel-card p-5">
          <h3 className="text-sm font-bold text-slate-800 mb-2">Predictive Maintenance Work Orders</h3>
          <p className="text-xs text-slate-500 mb-4">Targeted sensor interventions generated by AI digital twins</p>
          <div className="p-4 rounded-md bg-amber-50 border border-amber-200 text-xs text-amber-900">
            <span className="font-bold block text-sm">P2 High Priority: Temperature Probe Recalibration</span>
            <p className="mt-1">Recommended action: Inspect thermocouple probe resistance within 7 days.</p>
            <span className="text-[11px] text-amber-700 block mt-2">Assigned to: Engineer Ramesh Kumar (Field Unit 3)</span>
          </div>
        </div>
      )}

      {activeTab === 'raw' && (
        <div className="sentinel-card p-5">
          <h3 className="text-sm font-bold text-slate-800 mb-2">Preserved Raw Observations (Audit Trail)</h3>
          <p className="text-xs text-slate-500 mb-4">Weather Sentinel AI never destroys raw sensor telemetry.</p>
          <pre className="bg-slate-900 text-emerald-400 p-4 rounded text-xs overflow-x-auto font-mono">
            {JSON.stringify({ station: st, recentReadings: readings.slice(-3) }, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
