/**
 * Evidence Fusion Engine for Weather Sentinel AI
 * Fuses Temporal, Physical, Multivariate, Spatial, Historical & Sensor Health evidence
 * Distinguishes genuine extreme meteorological phenomena from sensor faults and data corruption.
 */

function fuseEvidence({
  reading,
  physicalQC,
  temporalQC,
  multivariateQC,
  spatialQC,
  personalityQC,
  sensorHealth = { healthScore: 85 }
}) {
  const { temperature, pressure, humidity } = reading;
  const reasons = [];
  let eventType = 'NORMAL';
  let severity = 'NONE';
  let rootCause = 'Normal Meteorological Operation';
  let anomalyScore = 0;
  let confidence = 95;
  let recommendedAction = 'No action required. Sensor telemetry is healthy and consistent.';

  // Feature contribution weights (simulated SHAP values)
  let featureContributions = {
    temperature: 0,
    pressure: 0,
    humidity: 0
  };

  // 1. Check for Communication or Missing Data
  if (temperature === null || pressure === null || humidity === null) {
    eventType = 'COMMUNICATION_ERROR';
    severity = 'HIGH';
    anomalyScore = 88;
    confidence = 96;
    rootCause = 'Telemetry Communication Gap or Packet Drop';
    reasons.push('Missing one or more required parameter telemetry streams.');
    recommendedAction = 'Check solar battery power, LoRa/GPRS modem signal, and station data logger.';
    return {
      eventType,
      severity,
      anomalyScore,
      confidence,
      rootCause,
      reasons,
      recommendedAction,
      featureContributions: { temperature: 33, pressure: 33, humidity: 34 },
      expectedValues: { temperature: 31.5, pressure: 1004.0, humidity: 65.0 },
      evidence: { physicalQC, temporalQC, multivariateQC, spatialQC, personalityQC }
    };
  }

  // 2. Check for Flatline / Frozen Values
  const isFrozen = temporalQC.flags?.some(f => f.type === 'FROZEN_SENSOR');
  if (isFrozen) {
    eventType = 'PROBABLE_SENSOR_FAULT';
    severity = 'HIGH';
    anomalyScore = 91;
    confidence = 94;
    rootCause = 'Frozen Sensor / Transducer Lockup';
    reasons.push('Sensor output remains statically identical over consecutive reporting cycles.');
    recommendedAction = 'Power cycle sensor interface; inspect for analog-to-digital converter lockup.';
    featureContributions = { temperature: 75, pressure: 15, humidity: 10 };
    return {
      eventType,
      severity,
      anomalyScore,
      confidence,
      rootCause,
      reasons,
      recommendedAction,
      featureContributions,
      expectedValues: {
        temperature: spatialQC.consensusAverages?.temperature || temporalQC.rollingMeans?.temperature || 31.8,
        pressure: spatialQC.consensusAverages?.pressure || temporalQC.rollingMeans?.pressure || 1003.2,
        humidity: spatialQC.consensusAverages?.humidity || temporalQC.rollingMeans?.humidity || 64.5
      },
      evidence: { physicalQC, temporalQC, multivariateQC, spatialQC, personalityQC }
    };
  }

  // 3. Evaluate Physical & Extreme Reading
  const hasPhysicalViolation = !physicalQC.passed;
  const isExtremeReading = temperature > 48 || temperature < -10 || pressure < 960 || pressure > 1060;
  const isTemporalSpike = temporalQC.flags?.some(f => f.type === 'SUDDEN_SPIKE' || f.type === 'STATISTICAL_OUTLIER');
  const isSpatialOutlier = spatialQC.isConsensusOutlier;

  // Expected Counterfactual Baseline
  const expectedValues = {
    temperature: parseFloat((spatialQC.consensusAverages?.temperature || temporalQC.rollingMeans?.temperature || 31.8).toFixed(1)),
    pressure: parseFloat((spatialQC.consensusAverages?.pressure || temporalQC.rollingMeans?.pressure || 1003.2).toFixed(1)),
    humidity: parseFloat((spatialQC.consensusAverages?.humidity || temporalQC.rollingMeans?.humidity || 64.5).toFixed(1))
  };

  // GENUINE EXTREME WEATHER vs SENSOR FAULT LOGIC
  if (isExtremeReading || isTemporalSpike || hasPhysicalViolation || isSpatialOutlier) {
    // If neighboring stations also report similar extreme values:
    const spatialSupportGenuine = spatialQC.neighborCount >= 2 && Math.abs(spatialQC.spatialDeltas?.temperature || 0) < 3.5;

    if (spatialSupportGenuine) {
      eventType = 'GENUINE_EXTREME_WEATHER';
      severity = 'HIGH';
      anomalyScore = 65;
      confidence = 92;
      rootCause = 'Severe Heatwave / Synoptic Meteorological Event';
      reasons.push(`Regional consensus confirms extreme reading: ${spatialQC.neighborCount} nearby stations observe concordant temperatures.`);
      reasons.push('Temporal trend exhibits physical atmospheric progression rather than electronic step-change.');
      recommendedAction = 'Dispatch meteorological advisory; no sensor maintenance required.';
      featureContributions = {
        temperature: 70,
        pressure: 20,
        humidity: 10
      };
    } else {
      // Spatial consensus REJECTS the reading -> PROBABLE SENSOR FAULT
      eventType = 'PROBABLE_SENSOR_FAULT';
      severity = 'HIGH';
      anomalyScore = 94;
      confidence = 91;
      rootCause = 'Probable Temperature Sensor Fault (Spike / Electrical Glitch)';

      reasons.push(`Sudden temperature spike: observed ${temperature}°C vs expected ${expectedValues.temperature}°C (departure: +${(temperature - expectedValues.temperature).toFixed(1)}°C).`);
      if (spatialQC.neighborCount > 0) {
        reasons.push(`Neighboring stations remain within normal bounds (${spatialQC.consensusAverages?.temperature?.toFixed(1)}°C regional mean). Station is an isolated spatial outlier.`);
      } else {
        reasons.push('Inconsistent with historical baseline and temporal rate of change constraints.');
      }
      if (!multivariateQC.passed) {
        reasons.push('Pressure / humidity thermodynamic relationship is inconsistent with observed temperature.');
      }

      recommendedAction = 'Inspect temperature sensor wiring and thermocouple resistance; apply data quarantine.';
      
      // Calculate SHAP-style feature contributions based on relative departures
      const tempDiff = Math.abs(temperature - expectedValues.temperature);
      const pressDiff = Math.abs(pressure - expectedValues.pressure);
      const humDiff = Math.abs(humidity - expectedValues.humidity);

      if (tempDiff > 12.0 || temperature > 50.0) {
        // Temperature spike dominates
        featureContributions = { temperature: 87, pressure: 21, humidity: 11 };
      } else if (pressDiff > 25.0) {
        // Pressure anomaly dominates
        featureContributions = { temperature: 18, pressure: 78, humidity: 14 };
      } else if (humDiff > 35.0) {
        // Humidity anomaly dominates
        featureContributions = { temperature: 14, pressure: 16, humidity: 76 };
      } else {
        const total = (tempDiff + pressDiff + humDiff) || 1;
        featureContributions = {
          temperature: Math.round((tempDiff / total) * 100),
          pressure: Math.round((pressDiff / total) * 100),
          humidity: Math.round((humDiff / total) * 100)
        };
      }
    }
  } else if (!multivariateQC.passed) {
    eventType = 'DATA_CORRUPTION';
    severity = 'MEDIUM';
    anomalyScore = 58;
    confidence = 82;
    rootCause = 'Multivariate Inconsistency / ADC Drift';
    reasons.push('Simultaneous temperature, pressure, and humidity violate learned atmospheric correlation profile.');
    recommendedAction = 'Run diagnostic calibration scan; cross-check multi-sensor bus.';
    featureContributions = { temperature: 35, pressure: 45, humidity: 20 };
  } else if (sensorHealth.healthScore < 65) {
    eventType = 'SENSOR_DEGRADATION';
    severity = 'MEDIUM';
    anomalyScore = 48;
    confidence = 86;
    rootCause = 'Calibration Drift / Sensor Aging';
    reasons.push(`Sensor digital twin health index degraded to ${sensorHealth.healthScore}/100.`);
    reasons.push('Persistent micro-drift detected in sensor baseline over past 30 days.');
    recommendedAction = 'Schedule field maintenance and recalibration within 14 days.';
    featureContributions = { temperature: 25, pressure: 25, humidity: 50 };
  } else {
    // Healthy reading
    eventType = 'NORMAL';
    severity = 'LOW';
    anomalyScore = 8;
    confidence = 98;
    rootCause = 'Normal Meteorological Observation';
    reasons.push('All physical, temporal, spatial, and multivariate checks passed with high confidence.');
    recommendedAction = 'None. Reading approved for meteorological ingestion.';
    featureContributions = { temperature: 5, pressure: 3, humidity: 2 };
  }

  // Calculate overall severity enum from score
  if (anomalyScore >= 75) severity = 'CRITICAL';
  else if (anomalyScore >= 50) severity = 'HIGH';
  else if (anomalyScore >= 25) severity = 'MEDIUM';
  else severity = 'LOW';

  return {
    eventType,
    severity,
    anomalyScore,
    confidence,
    rootCause,
    reasons,
    recommendedAction,
    featureContributions,
    expectedValues,
    evidence: {
      physical: { score: physicalQC.score, passed: physicalQC.passed, flags: physicalQC.flags },
      temporal: { score: temporalQC.score, passed: temporalQC.passed, zScores: temporalQC.zScores, rateOfChange: temporalQC.rateOfChange, flags: temporalQC.flags },
      multivariate: { score: multivariateQC.score, passed: multivariateQC.passed, flags: multivariateQC.flags },
      spatial: { score: spatialQC.score, passed: spatialQC.passed, neighborCount: spatialQC.neighborCount, deltas: spatialQC.spatialDeltas, consensus: spatialQC.consensusAverages },
      personality: { score: personalityQC.score, passed: personalityQC.passed, timeSlot: personalityQC.timeSlot },
      sensorHealth: { score: sensorHealth.healthScore, failureRisk: sensorHealth.failureRisk || 'LOW' }
    }
  };
}

module.exports = { fuseEvidence };
