const Anomaly = require('../models/Anomaly');
const SensorReading = require('../models/SensorReading');

// GET /api/anomalies
exports.getAnomalies = async (req, res, next) => {
  try {
    const { stationId, severity, status, limit = 50 } = req.query;
    let filter = {};
    if (stationId) filter.stationId = stationId;
    if (severity) filter.severity = severity;
    if (status) filter.status = status;

    const anomalies = await Anomaly.find(filter);
    const list = anomalies._data || (Array.isArray(anomalies) ? anomalies : []);
    const sorted = list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, parseInt(limit));

    res.json({
      success: true,
      count: sorted.length,
      data: sorted
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/anomalies/:id
exports.getAnomalyById = async (req, res, next) => {
  try {
    const anomaly = await Anomaly.findById(req.params.id) || await Anomaly.findOne({ _id: req.params.id });

    if (!anomaly) {
      return res.status(404).json({ success: false, message: 'Anomaly not found' });
    }

    // Fetch surrounding readings for the timeline (Normal -> Normal -> Spike -> Recovery)
    let timelineReadings = [];
    if (anomaly.stationId) {
      const readingsQuery = await SensorReading.find({ stationId: anomaly.stationId });
      const allReadings = readingsQuery._data || (Array.isArray(readingsQuery) ? readingsQuery : []);
      timelineReadings = allReadings.slice(-12);
    }

    res.json({
      success: true,
      data: {
        anomaly,
        timeline: timelineReadings
      }
    });
  } catch (err) {
    next(err);
  }
};

// PATCH /api/anomalies/:id
exports.updateAnomaly = async (req, res, next) => {
  try {
    const { status, operatorNotes } = req.body;
    const anomaly = await Anomaly.findByIdAndUpdate(
      req.params.id,
      { status, operatorNotes, updatedAt: new Date() },
      { new: true }
    );

    if (!anomaly) {
      return res.status(404).json({ success: false, message: 'Anomaly record not found' });
    }

    res.json({
      success: true,
      data: anomaly
    });
  } catch (err) {
    next(err);
  }
};
