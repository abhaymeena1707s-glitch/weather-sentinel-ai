const { createModel } = require('./modelFactory');

const alertSchema = {
  stationId: { type: String, required: true },
  readingId: { type: String },
  anomalyId: { type: String },
  type: { type: String, required: true },
  severity: { 
    type: String, 
    enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'], 
    default: 'MEDIUM' 
  },
  message: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  status: { 
    type: String, 
    enum: ['ACTIVE', 'ACKNOWLEDGED', 'INVESTIGATING', 'RESOLVED'], 
    default: 'ACTIVE' 
  },
  rootCause: { type: String },
  confidence: { type: Number, default: 90 },
  observedValue: { type: String },
  expectedValue: { type: String },
  acknowledgedBy: { type: String },
  resolvedAt: { type: Date }
};

module.exports = createModel('Alert', alertSchema);
