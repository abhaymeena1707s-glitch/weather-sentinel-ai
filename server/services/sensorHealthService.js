/**
 * Sensor Digital Twin & Virtual Health Modeling Service
 */
const SensorHealth = require('../models/SensorHealth');

async function updateSensorTwinOnReading({
  stationId,
  reading,
  evidenceFusion
}) {
  const sensors = ['temperature', 'pressure', 'humidity'];
  const results = {};

  for (const sensorType of sensors) {
    let healthDoc = await SensorHealth.findOne({ stationId, sensorType });
    if (!healthDoc) {
      healthDoc = await SensorHealth.create({
        stationId,
        sensorType,
        healthScore: sensorType === 'humidity' ? 61 : sensorType === 'temperature' ? 82 : 96,
        driftRate: sensorType === 'humidity' ? '+1.2% / month' : '+0.18°C / week',
        noiseLevel: sensorType === 'humidity' ? 'HIGH' : 'LOW',
        spikeCount: 0,
        missingDataRate: 0.2,
        failureRisk: sensorType === 'humidity' ? 'MEDIUM' : 'LOW',
        degradationTrend: sensorType === 'humidity' ? 'declining' : 'stable',
        history: [
          { timestamp: new Date(Date.now() - 3600000 * 24 * 7), score: 88 },
          { timestamp: new Date(Date.now() - 3600000 * 24 * 3), score: 85 },
          { timestamp: new Date(Date.now() - 3600000 * 24 * 1), score: 82 },
          { timestamp: new Date(), score: 82 }
        ],
        maintenanceRecommendation: sensorType === 'humidity' ? 'Inspect humidity sensor within 7 days.' : 'Routine scheduled recalibration'
      });
    }

    // If an anomaly occurred on this sensor
    if (evidenceFusion.eventType !== 'NORMAL' && evidenceFusion.featureContributions[sensorType] > 40) {
      const penalty = evidenceFusion.severity === 'CRITICAL' ? 12 : 6;
      healthDoc.healthScore = Math.max(20, healthDoc.healthScore - penalty);
      healthDoc.spikeCount = (healthDoc.spikeCount || 0) + 1;
      healthDoc.degradationTrend = healthDoc.healthScore < 65 ? 'declining' : 'stable';
      healthDoc.failureRisk = healthDoc.healthScore < 50 ? 'CRITICAL' : healthDoc.healthScore < 70 ? 'MEDIUM' : 'LOW';
      healthDoc.maintenanceRecommendation = `Inspect ${sensorType} sensor. Telemetry anomaly recorded.`;
      
      // Append to history
      if (!healthDoc.history) healthDoc.history = [];
      healthDoc.history.push({ timestamp: new Date(), score: healthDoc.healthScore });
      if (healthDoc.history.length > 20) healthDoc.history.shift();

      await SensorHealth.findByIdAndUpdate(healthDoc._id, healthDoc);
    }

    results[sensorType] = healthDoc;
  }

  // Calculate composite station health
  const scores = Object.values(results).map(r => r.healthScore);
  const compositeHealth = Math.round(scores.reduce((a, b) => a + b, 0) / (scores.length || 1));

  return {
    stationHealth: compositeHealth,
    sensorTwins: results
  };
}

module.exports = { updateSensorTwinOnReading };
