const { processObservation } = require('../services/ingestionService');
const Station = require('../models/Station');
const SensorReading = require('../models/SensorReading');

// POST /api/simulator/inject
exports.injectAnomaly = async (req, res, next) => {
  try {
    const {
      stationId = 'AWS-042',
      anomalyType = 'TEMPERATURE_SPIKE',
      severity = 'HIGH',
      customValues = {},
      noiseLevel = 0.5
    } = req.body;

    const station = await Station.findOne({ stationId }) || await Station.findOne({ stationId: 'AWS-042' });
    const targetStationId = station ? station.stationId : 'AWS-042';

    // Base baseline normal readings
    let temp = 32.2 + (Math.random() - 0.5) * noiseLevel;
    let press = 1003.5 + (Math.random() - 0.5) * noiseLevel;
    let hum = 65.0 + (Math.random() - 0.5) * noiseLevel * 2;

    switch (anomalyType.toUpperCase()) {
      case 'TEMPERATURE_SPIKE':
        temp = customValues.temperature !== undefined ? parseFloat(customValues.temperature) : 55.0;
        press = customValues.pressure !== undefined ? parseFloat(customValues.pressure) : 987.2;
        hum = customValues.humidity !== undefined ? parseFloat(customValues.humidity) : 96.0;
        break;

      case 'PRESSURE_SPIKE':
        press = 942.0; // severe abrupt barometric drop
        temp = 31.8;
        hum = 64.0;
        break;

      case 'HUMIDITY_SPIKE':
        hum = 99.8;
        temp = 32.0;
        press = 1002.5;
        break;

      case 'FROZEN_VALUE':
        // Generate reading identical to previous
        const lastReading = await SensorReading.findOne({ stationId: targetStationId });
        temp = lastReading ? lastReading.temperature : 31.4;
        press = lastReading ? lastReading.pressure : 1004.1;
        hum = lastReading ? lastReading.humidity : 63.2;
        break;

      case 'CALIBRATION_DRIFT':
        temp = 39.4; // drifting upwards steadily without meteorological backing
        press = 1004.0;
        hum = 62.0;
        break;

      case 'COMMUNICATION_GAP':
      case 'MISSING_DATA':
        temp = null;
        press = 1003.0;
        hum = null;
        break;

      case 'DATA_CORRUPTION':
        temp = 999.9; // impossible value
        press = -12.0;
        hum = 250.0;
        break;

      case 'GENUINE_EXTREME_WEATHER':
        // In extreme weather, we set the observation to extreme high (e.g. 52°C heatwave)
        // AND we also set neighboring stations to high (51.5°C, 52.8°C) so spatial consensus agrees!
        temp = 52.4;
        press = 998.0;
        hum = 38.0;

        // Temporarily adjust 3 neighbor stations so regional consensus matches
        const neighbors = await Station.find({ stationId: { $ne: targetStationId } });
        const neighborList = (neighbors._data || (Array.isArray(neighbors) ? neighbors : [])).slice(0, 3);
        for (const n of neighborList) {
          await Station.findByIdAndUpdate(n._id, {
            currentReadings: {
              temperature: 51.5 + (Math.random() * 2),
              pressure: 997.5 + (Math.random() * 2),
              humidity: 37.0 + (Math.random() * 4),
              timestamp: new Date()
            }
          });
        }
        break;

      default:
        temp = 55.0;
        press = 987.2;
        hum = 96.0;
        break;
    }

    // Process through the full real-time ingestion pipeline
    const result = await processObservation({
      stationId: targetStationId,
      temperature: temp !== null ? parseFloat(Number(temp).toFixed(2)) : null,
      pressure: press !== null ? parseFloat(Number(press).toFixed(2)) : null,
      humidity: hum !== null ? parseFloat(Number(hum).toFixed(2)) : null,
      timestamp: new Date()
    });

    res.json({
      success: true,
      message: `Injected simulated anomaly: ${anomalyType} on station ${targetStationId}`,
      simulatedParameters: {
        stationId: targetStationId,
        anomalyType,
        injected: { temperature: temp, pressure: press, humidity: hum }
      },
      pipelineResult: result
    });
  } catch (err) {
    next(err);
  }
};
