/**
 * Modular Anomaly Engine for Weather Sentinel AI
 * Layer 1: Physical QC
 * Layer 2: Temporal QC
 * Layer 3: Multivariate QC
 * Layer 4: Spatial/Neighbor QC
 * Layer 5: Station Personality QC
 */

// Global Physical meteorological bounds (WMO standards)
const PHYSICAL_BOUNDS = {
  temperature: { min: -40.0, max: 60.0, maxRateOfChangePerMin: 2.0 },
  pressure: { min: 870.0, max: 1085.0, maxRateOfChangePerMin: 1.5 },
  humidity: { min: 0.0, max: 100.0, maxRateOfChangePerMin: 5.0 }
};

/**
 * 1. Physical Quality Control
 */
function checkPhysicalQC(reading) {
  const flags = [];
  const { temperature, pressure, humidity } = reading;

  // Missing data detection
  if (temperature === null || temperature === undefined || isNaN(temperature)) {
    flags.push({ parameter: 'temperature', type: 'MISSING_VALUE', severity: 'HIGH' });
  } else if (temperature < PHYSICAL_BOUNDS.temperature.min || temperature > PHYSICAL_BOUNDS.temperature.max) {
    flags.push({
      parameter: 'temperature',
      type: 'PHYSICAL_LIMIT_EXCEEDED',
      severity: 'CRITICAL',
      value: temperature,
      message: `Temperature ${temperature}°C outside physical limits (-40 to 60°C)`
    });
  }

  if (pressure === null || pressure === undefined || isNaN(pressure)) {
    flags.push({ parameter: 'pressure', type: 'MISSING_VALUE', severity: 'HIGH' });
  } else if (pressure < PHYSICAL_BOUNDS.pressure.min || pressure > PHYSICAL_BOUNDS.pressure.max) {
    flags.push({
      parameter: 'pressure',
      type: 'PHYSICAL_LIMIT_EXCEEDED',
      severity: 'CRITICAL',
      value: pressure,
      message: `Pressure ${pressure} hPa outside physical limits (870 to 1085 hPa)`
    });
  }

  if (humidity === null || humidity === undefined || isNaN(humidity)) {
    flags.push({ parameter: 'humidity', type: 'MISSING_VALUE', severity: 'HIGH' });
  } else if (humidity < PHYSICAL_BOUNDS.humidity.min || humidity > PHYSICAL_BOUNDS.humidity.max) {
    flags.push({
      parameter: 'humidity',
      type: 'PHYSICAL_LIMIT_EXCEEDED',
      severity: 'CRITICAL',
      value: humidity,
      message: `Humidity ${humidity}% outside physically possible limits (0 to 100%)`
    });
  }

  return {
    passed: flags.length === 0,
    score: flags.length === 0 ? 100 : Math.max(0, 100 - flags.length * 40),
    flags
  };
}

/**
 * 2. Temporal Quality Control
 * Analyzes rolling window, z-scores, rate of change, flatline/frozen sensors, and spikes
 */
function checkTemporalQC(currentReading, recentReadings = []) {
  if (!recentReadings || recentReadings.length < 2) {
    return {
      passed: true,
      score: 95,
      flags: [],
      zScores: { temperature: 0, pressure: 0, humidity: 0 },
      rateOfChange: { temperature: 0, pressure: 0, humidity: 0 }
    };
  }

  const flags = [];
  const last = recentReadings[recentReadings.length - 1];
  const lastTime = new Date(last.timestamp).getTime();
  const currTime = new Date(currentReading.timestamp || Date.now()).getTime();
  const timeDeltaMin = Math.max(1, (currTime - lastTime) / (1000 * 60));

  // Rate of change calculation
  const dTemp = Math.abs(currentReading.temperature - last.temperature) / timeDeltaMin;
  const dPress = Math.abs(currentReading.pressure - last.pressure) / timeDeltaMin;
  const dHum = Math.abs(currentReading.humidity - last.humidity) / timeDeltaMin;

  if (dTemp > PHYSICAL_BOUNDS.temperature.maxRateOfChangePerMin) {
    flags.push({
      parameter: 'temperature',
      type: 'SUDDEN_SPIKE',
      severity: 'HIGH',
      delta: (currentReading.temperature - last.temperature).toFixed(1),
      message: `Sudden temperature spike of ${(currentReading.temperature - last.temperature).toFixed(1)}°C in ${timeDeltaMin.toFixed(0)} min`
    });
  }

  if (dPress > PHYSICAL_BOUNDS.pressure.maxRateOfChangePerMin) {
    flags.push({
      parameter: 'pressure',
      type: 'SUDDEN_SPIKE',
      severity: 'HIGH',
      delta: (currentReading.pressure - last.pressure).toFixed(1),
      message: `Abnormal pressure surge of ${(currentReading.pressure - last.pressure).toFixed(1)} hPa in ${timeDeltaMin.toFixed(0)} min`
    });
  }

  if (dHum > PHYSICAL_BOUNDS.humidity.maxRateOfChangePerMin) {
    flags.push({
      parameter: 'humidity',
      type: 'SUDDEN_SPIKE',
      severity: 'MEDIUM',
      delta: (currentReading.humidity - last.humidity).toFixed(1),
      message: `Abrupt humidity jump of ${(currentReading.humidity - last.humidity).toFixed(1)}% in ${timeDeltaMin.toFixed(0)} min`
    });
  }

  // Flatline / Frozen sensor detection
  if (recentReadings.length >= 6) {
    const last6 = recentReadings.slice(-6);
    const tempFrozen = last6.every(r => Math.abs(r.temperature - currentReading.temperature) < 0.001);
    const pressFrozen = last6.every(r => Math.abs(r.pressure - currentReading.pressure) < 0.001);
    const humFrozen = last6.every(r => Math.abs(r.humidity - currentReading.humidity) < 0.001);

    if (tempFrozen) {
      flags.push({ parameter: 'temperature', type: 'FROZEN_SENSOR', severity: 'HIGH', message: 'Temperature sensor reported identical value for 6+ consecutive intervals' });
    }
    if (pressFrozen) {
      flags.push({ parameter: 'pressure', type: 'FROZEN_SENSOR', severity: 'HIGH', message: 'Pressure sensor frozen at constant value' });
    }
    if (humFrozen) {
      flags.push({ parameter: 'humidity', type: 'FROZEN_SENSOR', severity: 'HIGH', message: 'Humidity sensor frozen at constant value' });
    }
  }

  // Rolling stats & Z-score
  const calcStats = (arr, key) => {
    const vals = arr.map(r => r[key]).filter(v => v !== null && !isNaN(v));
    if (vals.length < 3) return { mean: vals[0] || 0, std: 1 };
    const mean = vals.reduce((a, b) => a + b, 0) / vals.length;
    const variance = vals.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / vals.length;
    const std = Math.sqrt(variance) || 0.1;
    return { mean, std };
  };

  const tempStats = calcStats(recentReadings, 'temperature');
  const pressStats = calcStats(recentReadings, 'pressure');
  const humStats = calcStats(recentReadings, 'humidity');

  const zTemp = (currentReading.temperature - tempStats.mean) / tempStats.std;
  const zPress = (currentReading.pressure - pressStats.mean) / pressStats.std;
  const zHum = (currentReading.humidity - humStats.mean) / humStats.std;

  if (Math.abs(zTemp) > 3.5) {
    flags.push({ parameter: 'temperature', type: 'STATISTICAL_OUTLIER', severity: 'HIGH', zScore: zTemp.toFixed(2), message: `Temperature Z-score ${zTemp.toFixed(2)} indicates extreme outlier relative to station history` });
  }

  return {
    passed: flags.length === 0,
    score: Math.max(0, 100 - flags.length * 30),
    flags,
    zScores: { temperature: zTemp, pressure: zPress, humidity: zHum },
    rateOfChange: { temperature: dTemp, pressure: dPress, humidity: dHum },
    rollingMeans: { temperature: tempStats.mean, pressure: pressStats.mean, humidity: humStats.mean }
  };
}

/**
 * 3. Multivariate Quality Control
 * Evaluates thermodynamic consistency between T, P, RH
 */
function checkMultivariateQC(reading) {
  const { temperature: T, pressure: P, humidity: RH } = reading;
  const flags = [];

  // Magnified thermodynamic relationships:
  // Saturation Vapor pressure approx: Es = 6.112 * exp((17.67 * T) / (T + 243.5))
  // Actual Vapor pressure: E = (RH / 100) * Es
  // In typical surface meteorology, extreme heat (e.g. >50°C) with super-saturated tropical humidity (>95%) and severe pressure depression
  // without an intense synoptic cyclone is physically discordant.
  if (T > 48 && RH > 90) {
    flags.push({
      type: 'MULTIVARIATE_DISCORDANCE',
      severity: 'HIGH',
      message: `Extreme heat (${T}°C) with saturated humidity (${RH}%) is physically discordant under non-cyclonic conditions`
    });
  }

  // Severe pressure drop with neither temperature drop nor precipitation/humidity saturation
  if (P < 980 && RH < 30) {
    flags.push({
      type: 'PRESSURE_HUMIDITY_DISCORDANCE',
      severity: 'MEDIUM',
      message: `Extreme low pressure (${P} hPa) without corresponding atmospheric moisture`
    });
  }

  return {
    passed: flags.length === 0,
    score: flags.length === 0 ? 100 : Math.max(20, 100 - flags.length * 35),
    flags
  };
}

/**
 * 4. Spatial / Neighbor Station Quality Control
 * Compares observation with neighboring stations in spatial consensus
 */
function checkSpatialQC(currentReading, neighborReadings = []) {
  if (!neighborReadings || neighborReadings.length === 0) {
    return {
      passed: true,
      score: 85, // neutral
      neighborCount: 0,
      spatialDeltas: { temperature: 0, pressure: 0, humidity: 0 },
      isConsensusOutlier: false,
      message: 'No immediate neighbor stations available for spatial consensus'
    };
  }

  // Calculate neighbor consensus average
  const validTemp = neighborReadings.map(n => n.temperature).filter(v => v !== null && !isNaN(v));
  const validPress = neighborReadings.map(n => n.pressure).filter(v => v !== null && !isNaN(v));
  const validHum = neighborReadings.map(n => n.humidity).filter(v => v !== null && !isNaN(v));

  const avgTemp = validTemp.reduce((a, b) => a + b, 0) / (validTemp.length || 1);
  const avgPress = validPress.reduce((a, b) => a + b, 0) / (validPress.length || 1);
  const avgHum = validHum.reduce((a, b) => a + b, 0) / (validHum.length || 1);

  const deltaTemp = currentReading.temperature - avgTemp;
  const deltaPress = currentReading.pressure - avgPress;
  const deltaHum = currentReading.humidity - avgHum;

  const flags = [];
  let isConsensusOutlier = false;

  // Temperature spatial discordance threshold: > 6.0°C deviation from regional consensus
  if (Math.abs(deltaTemp) > 8.0) {
    flags.push({
      parameter: 'temperature',
      type: 'SPATIAL_DISAGREEMENT',
      severity: 'HIGH',
      delta: deltaTemp.toFixed(1),
      consensus: avgTemp.toFixed(1),
      message: `Station reports ${currentReading.temperature}°C while ${neighborReadings.length} neighboring stations average ${avgTemp.toFixed(1)}°C (delta: ${deltaTemp > 0 ? '+' : ''}${deltaTemp.toFixed(1)}°C)`
    });
    isConsensusOutlier = true;
  } else if (Math.abs(deltaTemp) > 4.5) {
    flags.push({
      parameter: 'temperature',
      type: 'SPATIAL_DISAGREEMENT_MODERATE',
      severity: 'MEDIUM',
      delta: deltaTemp.toFixed(1),
      consensus: avgTemp.toFixed(1),
      message: `Moderate temperature departure from regional consensus (${avgTemp.toFixed(1)}°C)`
    });
  }

  if (Math.abs(deltaPress) > 12.0) {
    flags.push({
      parameter: 'pressure',
      type: 'SPATIAL_DISAGREEMENT',
      severity: 'HIGH',
      delta: deltaPress.toFixed(1),
      consensus: avgPress.toFixed(1),
      message: `Station pressure ${currentReading.pressure} hPa deviates by ${deltaPress.toFixed(1)} hPa from neighbor consensus (${avgPress.toFixed(1)} hPa)`
    });
    isConsensusOutlier = true;
  }

  return {
    passed: flags.length === 0,
    score: flags.length === 0 ? 100 : Math.max(10, 100 - flags.length * 40),
    flags,
    neighborCount: neighborReadings.length,
    consensusAverages: { temperature: avgTemp, pressure: avgPress, humidity: avgHum },
    spatialDeltas: { temperature: deltaTemp, pressure: deltaPress, humidity: deltaHum },
    isConsensusOutlier
  };
}

/**
 * 5. Adaptive Station Personality QC
 * Compares with station's learned historical baseline for current time of day
 */
function checkStationPersonalityQC(reading, profile) {
  if (!profile) {
    return { passed: true, score: 90, flags: [] };
  }

  const hour = new Date(reading.timestamp || Date.now()).getHours();
  let timeSlot = 'morning';
  if (hour >= 11 && hour < 17) timeSlot = 'afternoon';
  else if (hour >= 17 || hour < 5) timeSlot = 'night';

  const bounds = profile[timeSlot] || profile.morning;
  const flags = [];

  if (reading.temperature < bounds.tempMin - 4 || reading.temperature > bounds.tempMax + 4) {
    flags.push({
      parameter: 'temperature',
      type: 'STATION_PERSONALITY_VIOLATION',
      severity: 'MEDIUM',
      message: `Reading ${reading.temperature}°C deviates significantly from station's learned ${timeSlot} baseline (${bounds.tempMin}°C - ${bounds.tempMax}°C)`
    });
  }

  return {
    passed: flags.length === 0,
    score: flags.length === 0 ? 100 : 60,
    flags,
    timeSlot,
    expectedRange: bounds
  };
}

module.exports = {
  checkPhysicalQC,
  checkTemporalQC,
  checkMultivariateQC,
  checkSpatialQC,
  checkStationPersonalityQC,
  PHYSICAL_BOUNDS
};
