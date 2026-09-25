const Station = require('../models/Station');
const StationProfile = require('../models/StationProfile');
const SensorHealth = require('../models/SensorHealth');
const SensorReading = require('../models/SensorReading');
const Alert = require('../models/Alert');

// GET /api/stations
exports.getStations = async (req, res, next) => {
  try {
    const { status, search } = req.query;
    let filter = {};
    if (status) filter.status = status;
    if (search) {
      filter.$or = [
        { stationId: { $regex: search, $options: 'i' } },
        { name: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } }
      ];
    }

    const stations = await Station.find(filter);
    const stationList = stations._data || (Array.isArray(stations) ? stations : []);

    // Summary KPI metrics
    const total = stationList.length;
    const online = stationList.filter(s => s.status !== 'offline').length;
    const offline = stationList.filter(s => s.status === 'offline').length;
    const normal = stationList.filter(s => s.status === 'normal').length;
    const anomalies = stationList.filter(s => s.status === 'anomaly').length;
    const quarantined = stationList.filter(s => s.status === 'quarantined').length;
    const warning = stationList.filter(s => s.status === 'warning').length;

    res.json({
      success: true,
      count: total,
      kpis: {
        total,
        online,
        offline,
        normal,
        anomalies,
        quarantined,
        warning,
        maintenanceRequired: 3
      },
      data: stationList
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/stations/:id
exports.getStationById = async (req, res, next) => {
  try {
    const stationId = req.params.id;
    const station = await Station.findOne({ stationId }) || await Station.findById(req.params.id);

    if (!station) {
      return res.status(404).json({ success: false, message: 'Station not found' });
    }

    const profile = await StationProfile.findOne({ stationId: station.stationId });
    const healthRecords = await SensorHealth.find({ stationId: station.stationId });
    const healthList = healthRecords._data || (Array.isArray(healthRecords) ? healthRecords : []);

    const recentReadings = await SensorReading.find({ stationId: station.stationId });
    const readingsList = (recentReadings._data || (Array.isArray(recentReadings) ? recentReadings : [])).slice(-30);

    const alerts = await Alert.find({ stationId: station.stationId });
    const alertList = (alerts._data || (Array.isArray(alerts) ? alerts : [])).slice(-5);

    res.json({
      success: true,
      data: {
        station,
        profile,
        sensorHealth: healthList,
        recentReadings: readingsList,
        alerts: alertList
      }
    });
  } catch (err) {
    next(err);
  }
};

// POST /api/stations
exports.createStation = async (req, res, next) => {
  try {
    const station = await Station.create(req.body);
    res.status(201).json({ success: true, data: station });
  } catch (err) {
    next(err);
  }
};

// GET /api/station-personality/:stationId
exports.getStationPersonality = async (req, res, next) => {
  try {
    const { stationId } = req.params;
    let profile = await StationProfile.findOne({ stationId });
    if (!profile) {
      profile = {
        stationId,
        morning: { tempMin: 24, tempMax: 29, humidityMin: 60, humidityMax: 80, pressureMin: 1002, pressureMax: 1007 },
        afternoon: { tempMin: 31, tempMax: 37, humidityMin: 55, humidityMax: 70, pressureMin: 1000, pressureMax: 1005 },
        night: { tempMin: 22, tempMax: 26, humidityMin: 70, humidityMax: 88, pressureMin: 1004, pressureMax: 1009 },
        typicalNoise: '±0.25°C, ±0.4 hPa, ±1.5%',
        typicalRateOfChange: '< 1.8°C/hr',
        historicalAnomalyFrequency: '0.42% (Normal Baseline)'
      };
    }

    res.json({
      success: true,
      data: profile
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/trust-score/:stationId
exports.getTrustScore = async (req, res, next) => {
  try {
    const { stationId } = req.params;
    const station = await Station.findOne({ stationId });
    const trustScore = station ? station.trustScore : 87;

    res.json({
      success: true,
      stationId,
      trustScore,
      components: {
        temporalConsistency: 92,
        physicalConsistency: 95,
        multivariateConsistency: 88,
        spatialAgreement: 84,
        sensorHealth: 72,
        dataFreshness: 99
      }
    });
  } catch (err) {
    next(err);
  }
};
