const SensorHealth = require('../models/SensorHealth');
const Station = require('../models/Station');

// GET /api/sensor-health
exports.getAllSensorHealth = async (req, res, next) => {
  try {
    const { stationId } = req.query;
    let filter = {};
    if (stationId) filter.stationId = stationId;

    const health = await SensorHealth.find(filter);
    const list = health._data || (Array.isArray(health) ? health : []);

    res.json({
      success: true,
      count: list.length,
      data: list
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/sensor-health/:stationId
exports.getStationSensorHealth = async (req, res, next) => {
  try {
    const { stationId } = req.params;
    const healthRecords = await SensorHealth.find({ stationId });
    const list = healthRecords._data || (Array.isArray(healthRecords) ? healthRecords : []);

    const station = await Station.findOne({ stationId });

    res.json({
      success: true,
      stationId,
      overallHealth: station ? station.healthScore : 82,
      sensors: list
    });
  } catch (err) {
    next(err);
  }
};
