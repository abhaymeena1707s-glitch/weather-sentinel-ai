const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');
const stationController = require('../controllers/stationController');
const readingController = require('../controllers/readingController');
const anomalyController = require('../controllers/anomalyController');
const alertController = require('../controllers/alertController');
const healthController = require('../controllers/healthController');
const maintenanceController = require('../controllers/maintenanceController');
const quarantineController = require('../controllers/quarantineController');
const simulatorController = require('../controllers/simulatorController');
const modelPerformanceController = require('../controllers/modelPerformanceController');

const { protect } = require('../middleware/auth');

// Auth routes
router.post('/auth/login', authController.login);
router.get('/auth/me', protect, authController.getMe);

// Station routes
router.get('/stations', stationController.getStations);
router.post('/stations', protect, stationController.createStation);
router.get('/stations/:id', stationController.getStationById);
router.get('/station-personality/:stationId', stationController.getStationPersonality);
router.get('/trust-score/:stationId', stationController.getTrustScore);

// Reading & Observation routes
router.get('/readings', readingController.getReadings);
router.post('/readings', readingController.createReading);
router.post('/observations', readingController.createReading);
router.get('/readings/:stationId', readingController.getStationReadings);
router.get('/explain/:readingId', readingController.explainReading);

// Anomaly routes
router.get('/anomalies', anomalyController.getAnomalies);
router.get('/anomalies/:id', anomalyController.getAnomalyById);
router.patch('/anomalies/:id', anomalyController.updateAnomaly);

// Alert routes
router.get('/alerts', alertController.getAlerts);
router.get('/alerts/:id', alertController.getAlertById);
router.patch('/alerts/:id', alertController.updateAlert);

// Sensor Health routes
router.get('/sensor-health', healthController.getAllSensorHealth);
router.get('/sensor-health/:stationId', healthController.getStationSensorHealth);

// Maintenance routes
router.get('/maintenance', maintenanceController.getMaintenanceTickets);
router.get('/maintenance/:id', maintenanceController.getMaintenanceById);
router.patch('/maintenance/:id', maintenanceController.updateMaintenance);

// Quarantine routes
router.get('/quarantine', quarantineController.getQuarantineRecords);
router.patch('/quarantine/:id', quarantineController.updateQuarantineRecord);

// Simulator routes
router.post('/simulator/inject', simulatorController.injectAnomaly);

// Model Performance routes
router.get('/model-performance', modelPerformanceController.getModelPerformance);

module.exports = router;
