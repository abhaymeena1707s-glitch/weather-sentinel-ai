const Station = require('../models/Station');
const SensorReading = require('../models/SensorReading');
const Anomaly = require('../models/Anomaly');
const Alert = require('../models/Alert');
const QuarantineRecord = require('../models/QuarantineRecord');
const StationProfile = require('../models/StationProfile');
const SensorHealth = require('../models/SensorHealth');

const {
  checkPhysicalQC,
  checkTemporalQC,
  checkMultivariateQC,
  checkSpatialQC,
  checkStationPersonalityQC
} = require('./anomalyService');
const { fuseEvidence } = require('./evidenceFusionService');
const { calculateTrustScore } = require('./trustScoreService');
const { updateSensorTwinOnReading } = require('./sensorHealthService');
const { checkAndCreateMaintenanceTicket } = require('./maintenanceService');
const { runMlInference } = require('./mlService');

let socketIO = null;

function setSocketIO(io) {
  socketIO = io;
}

function getSocketIO() {
  return socketIO;
}

/**
 * Main observation processing pipeline
 */
async function processObservation(observation) {
  const { stationId, temperature, pressure, humidity, timestamp = new Date() } = observation;

  // 1. Fetch Station & Profile
  let station = await Station.findOne({ stationId });
  if (!station) {
    station = await Station.create({
      stationId,
      name: `Automatic Weather Station ${stationId}`,
      location: 'Karnataka Regional Sector',
      latitude: 12.9716,
      longitude: 77.5946,
      elevation: 920,
      status: 'normal'
    });
  }

  const profile = await StationProfile.findOne({ stationId });

  // 2. Fetch Recent Readings for Temporal Analysis
  const recentQuery = await SensorReading.find({ stationId });
  const recentReadings = recentQuery._data 
    ? recentQuery._data.slice(-15) 
    : (Array.isArray(recentQuery) ? recentQuery.slice(-15) : []);

  // 3. Fetch Neighboring Stations for Spatial Consensus
  const allStationsQuery = await Station.find({ status: { $ne: 'offline' } });
  const allStations = allStationsQuery._data || (Array.isArray(allStationsQuery) ? allStationsQuery : []);
  
  // Find stations within regional radius (excluding current)
  const neighbors = allStations.filter(s => s.stationId !== stationId);
  const neighborReadings = neighbors
    .map(n => n.currentReadings)
    .filter(r => r && r.temperature !== undefined);

  // 4. Run QC Layers
  const physicalQC = checkPhysicalQC(observation);
  const temporalQC = checkTemporalQC(observation, recentReadings);
  const multivariateQC = checkMultivariateQC(observation);
  const spatialQC = checkSpatialQC(observation, neighborReadings);
  const personalityQC = checkStationPersonalityQC(observation, profile);

  // 5. ML Model Inference (FastAPI or Mock fallback)
  const mlResult = await runMlInference({
    observation,
    stationHistory: recentReadings,
    neighborReadings
  });

  // 6. Sensor Digital Twin Health State
  const tempHealth = await SensorHealth.findOne({ stationId, sensorType: 'temperature' });
  const stationHealthScore = tempHealth ? tempHealth.healthScore : (station.healthScore || 85);

  // 7. Evidence Fusion Engine
  const fusion = fuseEvidence({
    reading: observation,
    physicalQC,
    temporalQC,
    multivariateQC,
    spatialQC,
    personalityQC,
    sensorHealth: { healthScore: stationHealthScore }
  });

  // 8. Calculate Dynamic Trust Score
  const trustData = calculateTrustScore({
    physicalScore: physicalQC.score,
    temporalScore: temporalQC.score,
    multivariateScore: multivariateQC.score,
    spatialScore: spatialQC.score,
    sensorHealth: stationHealthScore,
    lastSeen: timestamp
  });

  // Determine Quarantine Status
  const isAnomalous = fusion.eventType !== 'NORMAL';
  const shouldQuarantine = isAnomalous && fusion.eventType !== 'GENUINE_EXTREME_WEATHER';

  let qualityStatus = 'VERIFIED';
  if (shouldQuarantine) qualityStatus = 'QUARANTINED';
  else if (fusion.eventType === 'GENUINE_EXTREME_WEATHER') qualityStatus = 'SUSPICIOUS';

  // 9. Save Sensor Reading
  const readingDoc = await SensorReading.create({
    stationId,
    timestamp: new Date(timestamp),
    temperature,
    pressure,
    humidity,
    qualityStatus,
    anomalyScore: fusion.anomalyScore,
    confidence: fusion.confidence,
    severity: fusion.severity,
    rootCause: fusion.rootCause,
    expectedTemperature: fusion.expectedValues.temperature,
    expectedPressure: fusion.expectedValues.pressure,
    expectedHumidity: fusion.expectedValues.humidity,
    isQuarantined: shouldQuarantine,
    isCorrected: false,
    correctedTemperature: fusion.expectedValues.temperature,
    correctedPressure: fusion.expectedValues.pressure,
    correctedHumidity: fusion.expectedValues.humidity,
    modelVersion: 'WeatherSentinel-v2.4-Hybrid',
    evidence: fusion.evidence,
    featureContributions: fusion.featureContributions
  });

  let anomalyDoc = null;
  let alertDoc = null;

  // 10. Handle Anomaly and Alert Generation
  if (isAnomalous) {
    anomalyDoc = await Anomaly.create({
      stationId,
      readingId: readingDoc._id ? readingDoc._id.toString() : null,
      type: fusion.rootCause,
      severity: fusion.severity,
      score: fusion.anomalyScore,
      confidence: fusion.confidence,
      reasons: fusion.reasons,
      evidence: fusion.evidence,
      featureContributions: fusion.featureContributions,
      observedValues: { temperature, pressure, humidity },
      expectedValues: fusion.expectedValues,
      rootCause: fusion.rootCause,
      recommendedAction: fusion.recommendedAction,
      status: shouldQuarantine ? 'QUARANTINED' : 'ACTIVE'
    });

    alertDoc = await Alert.create({
      stationId,
      readingId: readingDoc._id ? readingDoc._id.toString() : null,
      anomalyId: anomalyDoc._id ? anomalyDoc._id.toString() : null,
      type: fusion.rootCause,
      severity: fusion.severity,
      message: `${fusion.rootCause}: Observed ${temperature}°C, Expected ${fusion.expectedValues.temperature}°C (${fusion.reasons[0] || ''})`,
      timestamp: new Date(timestamp),
      status: 'ACTIVE',
      rootCause: fusion.rootCause,
      confidence: fusion.confidence,
      observedValue: `${temperature}°C / ${pressure} hPa / ${humidity}%`,
      expectedValue: `${fusion.expectedValues.temperature}°C / ${fusion.expectedValues.pressure} hPa / ${fusion.expectedValues.humidity}%`
    });

    if (shouldQuarantine) {
      await QuarantineRecord.create({
        readingId: readingDoc._id ? readingDoc._id.toString() : null,
        stationId,
        timestamp: new Date(timestamp),
        parameter: fusion.featureContributions.temperature > 50 ? 'temperature' : 'multivariate',
        observedValue: { temperature, pressure, humidity },
        expectedValue: fusion.expectedValues,
        anomalyScore: fusion.anomalyScore,
        rootCause: fusion.rootCause,
        status: 'QUARANTINED'
      });
    }
  }

  // 11. Update Sensor Digital Twin and Trigger Maintenance Check
  const twinResult = await updateSensorTwinOnReading({
    stationId,
    reading: observation,
    evidenceFusion: fusion
  });

  if (isAnomalous && fusion.eventType === 'PROBABLE_SENSOR_FAULT') {
    await checkAndCreateMaintenanceTicket({
      stationId,
      sensorType: fusion.featureContributions.temperature > 50 ? 'temperature' : 'humidity',
      healthScore: twinResult.stationHealth,
      failureRisk: fusion.severity === 'CRITICAL' ? 'CRITICAL' : 'HIGH',
      reason: fusion.reasons[0]
    });
  }

  // 12. Update Station Status
  let newStationStatus = 'normal';
  if (shouldQuarantine) newStationStatus = 'anomaly';
  else if (fusion.eventType === 'GENUINE_EXTREME_WEATHER') newStationStatus = 'warning';
  else if (twinResult.stationHealth < 60) newStationStatus = 'warning';

  await Station.findByIdAndUpdate(station._id, {
    status: newStationStatus,
    lastSeen: new Date(timestamp),
    healthScore: twinResult.stationHealth,
    trustScore: trustData.score,
    currentReadings: {
      temperature,
      pressure,
      humidity,
      timestamp: new Date(timestamp)
    }
  });

  // 13. Emit Real-time Socket.IO Event
  const updatePayload = {
    stationId,
    observation: {
      temperature,
      pressure,
      humidity,
      timestamp
    },
    fusion,
    trustScore: trustData,
    status: newStationStatus,
    readingId: readingDoc._id,
    alert: alertDoc,
    anomaly: anomalyDoc
  };

  if (socketIO) {
    socketIO.emit('observation:new', updatePayload);
    if (alertDoc) {
      socketIO.emit('alert:new', alertDoc);
    }
  }

  return {
    reading: readingDoc,
    fusion,
    trustData,
    alert: alertDoc,
    anomaly: anomalyDoc,
    stationStatus: newStationStatus
  };
}

module.exports = {
  processObservation,
  setSocketIO,
  getSocketIO
};
