const Alert = require('../models/Alert');

// GET /api/alerts
exports.getAlerts = async (req, res, next) => {
  try {
    const { status, severity, stationId, limit = 50 } = req.query;
    let filter = {};
    if (status) filter.status = status;
    if (severity) filter.severity = severity;
    if (stationId) filter.stationId = stationId;

    const alerts = await Alert.find(filter);
    const list = alerts._data || (Array.isArray(alerts) ? alerts : []);
    const sorted = list.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).slice(0, parseInt(limit));

    res.json({
      success: true,
      count: sorted.length,
      data: sorted
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/alerts/:id
exports.getAlertById = async (req, res, next) => {
  try {
    const alert = await Alert.findById(req.params.id) || await Alert.findOne({ _id: req.params.id });

    if (!alert) {
      return res.status(404).json({ success: false, message: 'Alert not found' });
    }

    res.json({
      success: true,
      data: alert
    });
  } catch (err) {
    next(err);
  }
};

// PATCH /api/alerts/:id
exports.updateAlert = async (req, res, next) => {
  try {
    const { status, acknowledgedBy } = req.body;
    const update = { status, updatedAt: new Date() };
    if (status === 'ACKNOWLEDGED') {
      update.acknowledgedBy = acknowledgedBy || 'Operator (DEMO)';
    }
    if (status === 'RESOLVED') {
      update.resolvedAt = new Date();
    }

    const alert = await Alert.findByIdAndUpdate(req.params.id, update, { new: true });

    if (!alert) {
      return res.status(404).json({ success: false, message: 'Alert not found' });
    }

    res.json({
      success: true,
      data: alert
    });
  } catch (err) {
    next(err);
  }
};
