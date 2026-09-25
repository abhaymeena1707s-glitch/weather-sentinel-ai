const { createModel } = require('./modelFactory');

const anomalySchema = {
  stationId: { type: String, required: true },
  readingId: { type: String },
  type: { type: String, required: true },
  severity: { 
    type: String, 
    enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'], 
    default: 'MEDIUM' 
  },
  score: { type: Number, required: true }, // 0 to 100
  confidence: { type: Number, required: true }, // 0 to 100
  reasons: [{ type: String }],
  evidence: {
    temporal: { type: Object },
    spatial: { type: Object },
    multivariate: { type: Object },
    physical: { type: Object },
    historical: { type: Object },
    sensorHealth: { type: Object }
  },
  featureContributions: {
    temperature: { type: Number, default: 0 },
    pressure: { type: Number, default: 0 },
    humidity: { type: Number, default: 0 }
  },
  observedValues: {
    temperature: { type: Number },
    pressure: { type: Number },
    humidity: { type: Number }
  },
  expectedValues: {
    temperature: { type: Number },
    pressure: { type: Number },
    humidity: { type: Number }
  },
  rootCause: { type: String },
  recommendedAction: { type: String },
  status: { 
    type: String, 
    enum: ['ACTIVE', 'INVESTIGATING', 'QUARANTINED', 'RESOLVED', 'FALSE_POSITIVE'], 
    default: 'ACTIVE' 
  },
  createdAt: { type: Date, default: Date.now }
};

module.exports = createModel('Anomaly', anomalySchema);
