const { createModel } = require('./modelFactory');

const sensorReadingSchema = {
  stationId: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  temperature: { type: Number },
  pressure: { type: Number },
  humidity: { type: Number },
  qualityStatus: {
    type: String,
    enum: ['RAW', 'SUSPICIOUS', 'QUARANTINED', 'VERIFIED', 'CORRECTED', 'REJECTED'],
    default: 'RAW'
  },
  anomalyScore: { type: Number, default: 0 },
  confidence: { type: Number, default: 100 },
  severity: {
    type: String,
    enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL', 'NONE'],
    default: 'NONE'
  },
  rootCause: { type: String, default: 'Normal' },
  expectedTemperature: { type: Number },
  expectedPressure: { type: Number },
  expectedHumidity: { type: Number },
  isQuarantined: { type: Boolean, default: false },
  isCorrected: { type: Boolean, default: false },
  correctedTemperature: { type: Number },
  correctedPressure: { type: Number },
  correctedHumidity: { type: Number },
  modelVersion: { type: String, default: 'WeatherSentinel-v2.4-Hybrid' },
  evidence: { type: Object, default: {} },
  featureContributions: { type: Object, default: {} }
};

module.exports = createModel('SensorReading', sensorReadingSchema);
