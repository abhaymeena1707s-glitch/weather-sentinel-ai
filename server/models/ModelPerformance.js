const { createModel } = require('./modelFactory');

const modelPerformanceSchema = {
  modelVersion: { type: String, default: 'v2.4-Hybrid-Ensemble' },
  evaluatedAt: { type: Date, default: Date.now },
  datasetSize: { type: Number, default: 50000 },
  precision: { type: Number, default: 0.962 },
  recall: { type: Number, default: 0.948 },
  f1Score: { type: Number, default: 0.955 },
  falseAlarmRate: { type: Number, default: 0.021 },
  detectionLatencyMs: { type: Number, default: 18.4 },
  accuracy: { type: Number, default: 0.978 },
  perFaultPerformance: [{
    faultType: { type: String },
    precision: { type: Number },
    recall: { type: Number },
    f1: { type: Number },
    count: { type: Number }
  }],
  confusionMatrix: {
    labels: [{ type: String }],
    matrix: [[{ type: Number }]]
  }
};

module.exports = createModel('ModelPerformance', modelPerformanceSchema);
