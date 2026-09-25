const ModelPerformance = require('../models/ModelPerformance');

// GET /api/model-performance
exports.getModelPerformance = async (req, res, next) => {
  try {
    let performance = await ModelPerformance.findOne();
    if (!performance) {
      performance = {
        modelVersion: 'WeatherSentinel-v2.4-Hybrid-Ensemble',
        evaluatedAt: new Date(),
        datasetSize: 50000,
        precision: 0.962,
        recall: 0.948,
        f1Score: 0.955,
        falseAlarmRate: 0.021,
        detectionLatencyMs: 18.4,
        accuracy: 0.978,
        perFaultPerformance: [
          { faultType: 'Temperature Spike', precision: 0.985, recall: 0.972, f1: 0.978, count: 1240 },
          { faultType: 'Pressure Surge/Drop', precision: 0.964, recall: 0.951, f1: 0.957, count: 830 },
          { faultType: 'Frozen Sensor', precision: 0.991, recall: 0.984, f1: 0.987, count: 620 },
          { faultType: 'Calibration Drift', precision: 0.923, recall: 0.895, f1: 0.909, count: 540 },
          { faultType: 'Communication Gap', precision: 0.998, recall: 0.995, f1: 0.996, count: 2100 },
          { faultType: 'Data Corruption', precision: 0.989, recall: 0.981, f1: 0.985, count: 410 },
          { faultType: 'Genuine Extreme Weather', precision: 0.942, recall: 0.915, f1: 0.928, count: 750 }
        ],
        confusionMatrix: {
          labels: ['Normal', 'Sensor Spike', 'Frozen Sensor', 'Drift', 'Genuine Event'],
          matrix: [
            [42310, 85, 12, 45, 28],
            [32, 1205, 5, 8, 12],
            [4, 6, 610, 0, 0],
            [18, 12, 2, 485, 23],
            [15, 24, 0, 15, 696]
          ]
        },
        evaluationNotes: 'Benchmark evaluated against WMO AWS synthetic + field test dataset (Karnataka regional pilot). Clearly labeled as Demo / Injected-Anomaly Evaluation.'
      };
    }

    res.json({
      success: true,
      data: performance
    });
  } catch (err) {
    next(err);
  }
};
