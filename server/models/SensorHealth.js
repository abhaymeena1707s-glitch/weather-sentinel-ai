const { createModel } = require('./modelFactory');

const sensorHealthSchema = {
  stationId: { type: String, required: true },
  sensorType: { 
    type: String, 
    enum: ['temperature', 'pressure', 'humidity'], 
    required: true 
  },
  sensorId: { type: String },
  healthScore: { type: Number, required: true, default: 85 }, // 0 to 100
  driftRate: { type: String, default: '+0.05°C/week' },
  noiseLevel: { 
    type: String, 
    enum: ['LOW', 'MEDIUM', 'HIGH'], 
    default: 'LOW' 
  },
  spikeCount: { type: Number, default: 0 },
  missingDataRate: { type: Number, default: 0.1 }, // percentage
  calibrationDate: { type: Date, default: Date.now },
  failureRisk: { 
    type: String, 
    enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'], 
    default: 'LOW' 
  },
  degradationTrend: { 
    type: String, 
    enum: ['stable', 'declining', 'rapid_decline', 'improving'], 
    default: 'stable' 
  },
  history: [{
    timestamp: { type: Date, default: Date.now },
    score: { type: Number }
  }],
  maintenanceRecommendation: { type: String }
};

module.exports = createModel('SensorHealth', sensorHealthSchema);
