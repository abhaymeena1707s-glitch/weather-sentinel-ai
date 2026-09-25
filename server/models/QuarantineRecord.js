const { createModel } = require('./modelFactory');

const quarantineRecordSchema = {
  readingId: { type: String, required: true },
  stationId: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  parameter: { type: String, default: 'temperature' },
  observedValue: { type: Object }, // e.g. { temperature: 55, pressure: 987.2, humidity: 96 }
  expectedValue: { type: Object }, // e.g. { temperature: 31.8, pressure: 1003.2, humidity: 64.5 }
  anomalyScore: { type: Number, default: 94 },
  rootCause: { type: String, default: 'Probable Temperature Sensor Fault' },
  status: { 
    type: String, 
    enum: ['QUARANTINED', 'VERIFIED', 'REJECTED', 'CORRECTED', 'RESTORED'], 
    default: 'QUARANTINED' 
  },
  operatorNotes: { type: String, default: '' },
  verifiedBy: { type: String },
  verifiedAt: { type: Date },
  appliedValue: { type: Object }
};

module.exports = createModel('QuarantineRecord', quarantineRecordSchema);
