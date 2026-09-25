const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Station = require('../models/Station');
const SensorReading = require('../models/SensorReading');
const Anomaly = require('../models/Anomaly');
const Alert = require('../models/Alert');
const SensorHealth = require('../models/SensorHealth');
const Maintenance = require('../models/Maintenance');
const QuarantineRecord = require('../models/QuarantineRecord');
const StationProfile = require('../models/StationProfile');
const ModelPerformance = require('../models/ModelPerformance');
const { connectDB } = require('../config/db');

// 25 Realistic Indian Automatic Weather Stations
const DEMO_STATIONS = [
  { id: 'AWS-042', name: 'Chikkamagaluru Hill Station', location: 'Chikkamagaluru, Karnataka', lat: 13.32, lng: 75.77, ele: 842, status: 'anomaly', health: 72, trust: 87, temp: 55.0, press: 987.2, hum: 96.0 },
  { id: 'AWS-017', name: 'Shivamogga Agri Sector', location: 'Shivamogga, Karnataka', lat: 13.92, lng: 75.57, ele: 569, status: 'warning', health: 61, trust: 76, temp: 33.4, press: 1003.1, hum: 88.0 },
  { id: 'AWS-009', name: 'Hassan Valley AWS', location: 'Hassan, Karnataka', lat: 13.00, lng: 76.10, ele: 957, status: 'quarantined', health: 58, trust: 64, temp: 31.0, press: 1004.5, hum: 62.0 },
  { id: 'AWS-001', name: 'Bengaluru Central AWS', location: 'Bengaluru Urban, Karnataka', lat: 12.97, lng: 77.59, ele: 920, status: 'normal', health: 94, trust: 96, temp: 31.2, press: 1004.2, hum: 64.0 },
  { id: 'AWS-002', name: 'Bengaluru North Observatory', location: 'Yelahanka, Karnataka', lat: 13.10, lng: 77.60, ele: 915, status: 'normal', health: 91, trust: 94, temp: 31.6, press: 1003.8, hum: 62.5 },
  { id: 'AWS-003', name: 'Mysuru Heritage Station', location: 'Mysuru, Karnataka', lat: 12.29, lng: 76.63, ele: 763, status: 'normal', health: 89, trust: 92, temp: 32.4, press: 1005.0, hum: 66.0 },
  { id: 'AWS-004', name: 'Mandya Sugarcane Belt AWS', location: 'Mandya, Karnataka', lat: 12.52, lng: 76.89, ele: 678, status: 'normal', health: 93, trust: 95, temp: 32.8, press: 1004.6, hum: 65.2 },
  { id: 'AWS-005', name: 'Tumakuru Industrial AWS', location: 'Tumakuru, Karnataka', lat: 13.34, lng: 77.10, ele: 822, status: 'normal', health: 88, trust: 91, temp: 33.1, press: 1003.2, hum: 59.0 },
  { id: 'AWS-006', name: 'Kolar Gold Fields Station', location: 'Kolar, Karnataka', lat: 12.96, lng: 78.27, ele: 819, status: 'normal', health: 92, trust: 93, temp: 32.0, press: 1004.0, hum: 61.0 },
  { id: 'AWS-007', name: 'Chikkaballapura Hills AWS', location: 'Chikkaballapura, Karnataka', lat: 13.43, lng: 77.72, ele: 914, status: 'normal', health: 87, trust: 90, temp: 30.8, press: 1003.7, hum: 63.8 },
  { id: 'AWS-008', name: 'Ramanagara Silk City AWS', location: 'Ramanagara, Karnataka', lat: 12.72, lng: 77.28, ele: 747, status: 'normal', health: 95, trust: 97, temp: 32.6, press: 1004.9, hum: 65.5 },
  { id: 'AWS-010', name: 'Madikeri Coorg Highland AWS', location: 'Kodagu, Karnataka', lat: 12.42, lng: 75.73, ele: 1150, status: 'normal', health: 86, trust: 89, temp: 26.5, press: 994.2, hum: 82.0 },
  { id: 'AWS-011', name: 'Mangaluru Coastal Port AWS', location: 'Dakshina Kannada, Karnataka', lat: 12.91, lng: 74.85, ele: 22, status: 'normal', health: 90, trust: 91, temp: 33.5, press: 1011.2, hum: 78.0 },
  { id: 'AWS-012', name: 'Udupi Maritime Station', location: 'Udupi, Karnataka', lat: 13.34, lng: 74.74, ele: 18, status: 'normal', health: 92, trust: 93, temp: 33.2, press: 1010.8, hum: 79.5 },
  { id: 'AWS-013', name: 'Karwar Western Coast AWS', location: 'Uttara Kannada, Karnataka', lat: 14.81, lng: 74.13, ele: 12, status: 'normal', health: 88, trust: 89, temp: 32.9, press: 1011.5, hum: 81.0 },
  { id: 'AWS-014', name: 'Hubballi Junction AWS', location: 'Dharwad, Karnataka', lat: 15.36, lng: 75.12, ele: 671, status: 'normal', health: 94, trust: 95, temp: 34.1, press: 1002.3, hum: 52.0 },
  { id: 'AWS-015', name: 'Belagavi Border AWS', location: 'Belagavi, Karnataka', lat: 15.84, lng: 74.49, ele: 762, status: 'normal', health: 89, trust: 92, temp: 31.8, press: 1003.5, hum: 61.0 },
  { id: 'AWS-016', name: 'Dharwad University AWS', location: 'Dharwad, Karnataka', lat: 15.45, lng: 75.00, ele: 732, status: 'normal', health: 93, trust: 94, temp: 33.8, press: 1002.9, hum: 54.0 },
  { id: 'AWS-018', name: 'Davangere Agro-Met AWS', location: 'Davangere, Karnataka', lat: 14.46, lng: 75.92, ele: 602, status: 'normal', health: 90, trust: 92, temp: 34.5, press: 1003.0, hum: 51.0 },
  { id: 'AWS-019', name: 'Ballari Thermal Zone AWS', location: 'Ballari, Karnataka', lat: 15.13, lng: 76.92, ele: 495, status: 'normal', health: 87, trust: 89, temp: 36.2, press: 1001.2, hum: 44.0 },
  { id: 'AWS-020', name: 'Kalaburagi Sun City AWS', location: 'Kalaburagi, Karnataka', lat: 17.32, lng: 76.83, ele: 454, status: 'normal', health: 91, trust: 93, temp: 37.0, press: 1000.5, hum: 41.0 },
  { id: 'AWS-021', name: 'Bidar Plateau Station', location: 'Bidar, Karnataka', lat: 17.91, lng: 77.51, ele: 664, status: 'normal', health: 88, trust: 90, temp: 35.2, press: 1002.1, hum: 46.0 },
  { id: 'AWS-022', name: 'Raichur Doab AWS', location: 'Raichur, Karnataka', lat: 16.20, lng: 77.35, ele: 407, status: 'normal', health: 92, trust: 94, temp: 36.8, press: 1001.8, hum: 43.5 },
  { id: 'AWS-023', name: 'Koppal Heritage Met AWS', location: 'Koppal, Karnataka', lat: 15.34, lng: 76.15, ele: 530, status: 'anomaly', health: 65, trust: 69, temp: 34.0, press: 945.0, hum: 50.0 }, // Pressure Anomaly
  { id: 'AWS-024', name: 'Gadag Met Observatory', location: 'Gadag, Karnataka', lat: 15.43, lng: 75.63, ele: 655, status: 'normal', health: 95, trust: 96, temp: 34.2, press: 1003.4, hum: 53.0 },
  { id: 'AWS-025', name: 'Chitradurga Fort AWS', location: 'Chitradurga, Karnataka', lat: 14.22, lng: 76.40, ele: 732, status: 'normal', health: 93, trust: 95, temp: 33.7, press: 1003.8, hum: 55.0 }
];

async function seedDatabase() {
  console.log('🌱 Starting Weather Sentinel AI Database Seeder...');
  await connectDB();

  // Clear existing documents
  await User.deleteMany({});
  await Station.deleteMany({});
  await SensorReading.deleteMany({});
  await Anomaly.deleteMany({});
  await Alert.deleteMany({});
  await SensorHealth.deleteMany({});
  await Maintenance.deleteMany({});
  await QuarantineRecord.deleteMany({});
  await StationProfile.deleteMany({});
  await ModelPerformance.deleteMany({});

  // 1. Seed Users with hashed passwords
  console.log('👤 Seeding Demo Users...');
  const users = [
    {
      name: 'System Administrator',
      email: 'admin@weathersentinel.ai',
      password: await bcrypt.hash('Admin@123', 10),
      role: 'ADMIN',
      department: 'Directorate of Meteorological IT & AI'
    },
    {
      name: 'Duty Meteorological Operator',
      email: 'operator@weathersentinel.ai',
      password: await bcrypt.hash('Operator@123', 10),
      role: 'OPERATOR',
      department: '24/7 Weather Surveillance Operations'
    },
    {
      name: 'Senior Field Instrumentation Engineer',
      email: 'engineer@weathersentinel.ai',
      password: await bcrypt.hash('Engineer@123', 10),
      role: 'FIELD_ENGINEER',
      department: 'AWS Network Maintenance & Calibration'
    },
    {
      name: 'Regional Forecaster / Viewer',
      email: 'viewer@weathersentinel.ai',
      password: await bcrypt.hash('Viewer@123', 10),
      role: 'VIEWER',
      department: 'Disaster Management & Public Services'
    }
  ];
  await User.insertMany(users);

  // 2. Seed 25 AWS Stations
  console.log('📡 Seeding 25 Automatic Weather Stations...');
  for (const st of DEMO_STATIONS) {
    await Station.create({
      stationId: st.id,
      name: st.name,
      location: st.location,
      state: 'Karnataka',
      latitude: st.lat,
      longitude: st.lng,
      elevation: st.ele,
      status: st.status,
      lastSeen: new Date(),
      temperatureSensorId: `${st.id}-TEMP-PT100`,
      pressureSensorId: `${st.id}-PRESS-BARO`,
      humiditySensorId: `${st.id}-HUM-CAPAC`,
      healthScore: st.health,
      trustScore: st.trust,
      currentReadings: {
        temperature: st.temp,
        pressure: st.press,
        humidity: st.hum,
        timestamp: new Date()
      }
    });

    // 3. Station Personality Baselines
    await StationProfile.create({
      stationId: st.id,
      morning: {
        tempMin: parseFloat((st.temp - 8).toFixed(1)),
        tempMax: parseFloat((st.temp - 2).toFixed(1)),
        humidityMin: 65,
        humidityMax: 85,
        pressureMin: 1002,
        pressureMax: 1008
      },
      afternoon: {
        tempMin: parseFloat((st.temp - 1).toFixed(1)),
        tempMax: parseFloat((st.temp + 4).toFixed(1)),
        humidityMin: 45,
        humidityMax: 65,
        pressureMin: 998,
        pressureMax: 1005
      },
      night: {
        tempMin: parseFloat((st.temp - 10).toFixed(1)),
        tempMax: parseFloat((st.temp - 5).toFixed(1)),
        humidityMin: 75,
        humidityMax: 92,
        pressureMin: 1003,
        pressureMax: 1009
      },
      typicalNoise: '±0.20°C, ±0.3 hPa, ±1.2%',
      typicalRateOfChange: '< 1.8°C/hr',
      historicalAnomalyFrequency: st.id === 'AWS-042' ? '1.82% (Recent Spike)' : '0.38% (Normal)'
    });

    // 4. Sensor Digital Twins
    await SensorHealth.create({
      stationId: st.id,
      sensorType: 'temperature',
      sensorId: `${st.id}-TEMP-PT100`,
      healthScore: st.id === 'AWS-042' ? 61 : (st.id === 'AWS-017' ? 78 : 94),
      driftRate: st.id === 'AWS-042' ? '+0.18°C/week' : '+0.02°C/week',
      noiseLevel: st.id === 'AWS-042' ? 'HIGH' : 'LOW',
      spikeCount: st.id === 'AWS-042' ? 3 : 0,
      missingDataRate: 0.1,
      failureRisk: st.id === 'AWS-042' ? 'HIGH' : 'LOW',
      degradationTrend: st.id === 'AWS-042' ? 'declining' : 'stable',
      maintenanceRecommendation: st.id === 'AWS-042' ? 'Inspect temperature sensor wiring and probe resistance.' : 'Routine scheduled recalibration'
    });

    await SensorHealth.create({
      stationId: st.id,
      sensorType: 'pressure',
      sensorId: `${st.id}-PRESS-BARO`,
      healthScore: st.id === 'AWS-023' ? 52 : 92,
      driftRate: '+0.01 hPa/month',
      noiseLevel: st.id === 'AWS-023' ? 'HIGH' : 'LOW',
      spikeCount: st.id === 'AWS-023' ? 2 : 0,
      missingDataRate: 0.05,
      failureRisk: st.id === 'AWS-023' ? 'MEDIUM' : 'LOW',
      degradationTrend: st.id === 'AWS-023' ? 'declining' : 'stable',
      maintenanceRecommendation: st.id === 'AWS-023' ? 'Calibrate barometric sensor pressure port.' : 'Normal operation'
    });

    await SensorHealth.create({
      stationId: st.id,
      sensorType: 'humidity',
      sensorId: `${st.id}-HUM-CAPAC`,
      healthScore: st.id === 'AWS-017' ? 58 : 88,
      driftRate: st.id === 'AWS-017' ? '+1.8% / month (High Drift)' : '+0.2% / month',
      noiseLevel: st.id === 'AWS-017' ? 'MEDIUM' : 'LOW',
      spikeCount: 1,
      missingDataRate: 0.3,
      failureRisk: st.id === 'AWS-017' ? 'MEDIUM' : 'LOW',
      degradationTrend: st.id === 'AWS-017' ? 'declining' : 'stable',
      maintenanceRecommendation: st.id === 'AWS-017' ? 'Inspect humidity sensor within 7 days.' : 'Normal operation'
    });

    // 5. Seed Historical Readings for each station (past 12 intervals)
    for (let i = 12; i >= 1; i--) {
      const readingTime = new Date(Date.now() - i * 10 * 60 * 1000);
      let t = st.temp + (Math.random() - 0.5) * 0.6;
      let p = st.press + (Math.random() - 0.5) * 0.4;
      let h = st.hum + (Math.random() - 0.5) * 1.5;

      // Make history prior to anomaly normal for AWS-042 (31-33°C)
      if (st.id === 'AWS-042' && i > 1) {
        t = 31.8 + (Math.random() - 0.5) * 0.8;
        p = 1003.5 + (Math.random() - 0.5) * 0.5;
        h = 64.0 + (Math.random() - 0.5) * 2.0;
      }

      await SensorReading.create({
        stationId: st.id,
        timestamp: readingTime,
        temperature: parseFloat(t.toFixed(1)),
        pressure: parseFloat(p.toFixed(1)),
        humidity: parseFloat(h.toFixed(1)),
        qualityStatus: (st.id === 'AWS-042' && i === 1) ? 'QUARANTINED' : 'VERIFIED',
        anomalyScore: (st.id === 'AWS-042' && i === 1) ? 94 : 4,
        confidence: 91,
        severity: (st.id === 'AWS-042' && i === 1) ? 'HIGH' : 'LOW',
        rootCause: (st.id === 'AWS-042' && i === 1) ? 'Probable Temperature Sensor Fault' : 'Normal',
        expectedTemperature: 31.8,
        expectedPressure: 1003.2,
        expectedHumidity: 64.5,
        isQuarantined: (st.id === 'AWS-042' && i === 1)
      });
    }
  }

  // 6. Explicitly Seed the AWS-042 PRIMARY DEMO SCENARIO Alert and Anomaly
  console.log('🚨 Seeding Primary Demo Scenario Anomaly on AWS-042...');
  const anomalyAWS042 = await Anomaly.create({
    stationId: 'AWS-042',
    type: 'Temperature Spike',
    severity: 'HIGH',
    score: 94,
    confidence: 91,
    reasons: [
      'Sudden temperature spike: observed 55.0°C vs expected 31.8°C (+23.2°C departure in 10 minutes).',
      'Neighboring stations within 30km (AWS-017, AWS-009) report 31–33°C. AWS-042 is an isolated spatial outlier.',
      'Multivariate check: 55°C at 96% humidity represents physical discordance without a tropical cyclone.',
      'Temporal check: Z-score +5.82 exceeds 3.5-sigma outlier boundary.'
    ],
    evidence: {
      temporal: { score: 18, passed: false, zScore: 5.82, rateOfChange: '23.2°C/interval' },
      spatial: { score: 12, passed: false, neighborConsensus: 32.1, delta: '+22.9°C' },
      multivariate: { score: 25, passed: false, flags: ['SUPER_SATURATED_HEAT_DISCORDANCE'] },
      physical: { score: 90, passed: true },
      historical: { score: 20, passed: false, diurnalDeviation: '+19.5°C' },
      sensorHealth: { score: 61, failureRisk: 'HIGH' }
    },
    featureContributions: {
      temperature: 87,
      pressure: 21,
      humidity: 11
    },
    observedValues: {
      temperature: 55.0,
      pressure: 987.2,
      humidity: 96.0
    },
    expectedValues: {
      temperature: 31.8,
      pressure: 1003.2,
      humidity: 64.5
    },
    rootCause: 'Probable Temperature Sensor Fault (Spike / Electrical Glitch)',
    recommendedAction: 'Inspect temperature sensor wiring and thermocouple resistance; apply data quarantine.',
    status: 'QUARANTINED'
  });

  await Alert.create({
    stationId: 'AWS-042',
    anomalyId: anomalyAWS042._id ? anomalyAWS042._id.toString() : null,
    type: 'Temperature Spike',
    severity: 'HIGH',
    message: 'AWS-042: Temperature spike detected (55.0°C observed, 31.8°C expected). Confidence: 91%.',
    timestamp: new Date(),
    status: 'ACTIVE',
    rootCause: 'Probable Temperature Sensor Fault',
    confidence: 91,
    observedValue: '55.0°C / 987.2 hPa / 96.0%',
    expectedValue: '31.8°C / 1003.2 hPa / 64.5%'
  });

  await QuarantineRecord.create({
    readingId: 'AWS042-DEMO-READING',
    stationId: 'AWS-042',
    timestamp: new Date(),
    parameter: 'temperature',
    observedValue: { temperature: 55.0, pressure: 987.2, humidity: 96.0 },
    expectedValue: { temperature: 31.8, pressure: 1003.2, humidity: 64.5 },
    anomalyScore: 94,
    rootCause: 'Probable Temperature Sensor Fault',
    status: 'QUARANTINED',
    operatorNotes: 'Flagged by Weather Sentinel AI Evidence Fusion Engine. Awaiting field validation.'
  });

  // Seed secondary alert on AWS-017 (Humidity Drift)
  await Alert.create({
    stationId: 'AWS-017',
    type: 'Humidity Drift',
    severity: 'MEDIUM',
    message: 'AWS-017: Humidity calibration drift (+1.8%/month) detected over 30-day baseline.',
    timestamp: new Date(Date.now() - 3600000 * 2),
    status: 'ACTIVE',
    rootCause: 'Sensor Degradation (Humidity Calibration Drift)',
    confidence: 86,
    observedValue: '88.0% (Drifting)',
    expectedValue: '72.5%'
  });

  // Seed secondary alert on AWS-009 (Communication Gap)
  await Alert.create({
    stationId: 'AWS-009',
    type: 'Communication Gap',
    severity: 'MEDIUM',
    message: 'AWS-009: Telemetry communication gap of 42 minutes detected on GPRS modem.',
    timestamp: new Date(Date.now() - 3600000 * 4),
    status: 'ACKNOWLEDGED',
    rootCause: 'Communication Telemetry Drop',
    confidence: 96,
    observedValue: 'Telemetry Silence (42m)',
    expectedValue: '10m Heartbeat'
  });

  // Seed Maintenance Tickets
  console.log('🔧 Seeding Predictive Maintenance Tickets...');
  await Maintenance.create({
    stationId: 'AWS-042',
    sensorType: 'temperature',
    status: 'REQUIRED',
    failureRisk: 'HIGH',
    priority: 'P2_HIGH',
    currentHealth: 61,
    recommendedAction: 'Inspect temperature sensor wiring and thermocouple probe resistance within 7 days.',
    dueDate: new Date(Date.now() + 7 * 24 * 3600 * 1000),
    assignedTo: 'Engineer Ramesh Kumar (Field Unit 3)',
    notes: 'Triggered by high-severity 55.0°C isolated spike. Sensor health index down to 61/100.'
  });

  await Maintenance.create({
    stationId: 'AWS-017',
    sensorType: 'humidity',
    status: 'DUE_SOON',
    failureRisk: 'MEDIUM',
    priority: 'P3_MEDIUM',
    currentHealth: 58,
    recommendedAction: 'Inspect humidity sensor within 7 days. Recalibrate capacitive polymer element.',
    dueDate: new Date(Date.now() + 5 * 24 * 3600 * 1000),
    assignedTo: 'Unassigned',
    notes: 'Persistent positive drift exceeding 1.8%/month threshold.'
  });

  await Maintenance.create({
    stationId: 'AWS-023',
    sensorType: 'pressure',
    status: 'DUE_SOON',
    failureRisk: 'MEDIUM',
    priority: 'P3_MEDIUM',
    currentHealth: 52,
    recommendedAction: 'Check barometric transducer reference port for dust blockage.',
    dueDate: new Date(Date.now() + 10 * 24 * 3600 * 1000),
    assignedTo: 'Unassigned',
    notes: 'Barometer showed abnormal 945.0 hPa dip without regional correlation.'
  });

  // Seed Model Performance
  await ModelPerformance.create({
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
    }
  });

  console.log('✅ Database seeded successfully with 25 AWS stations, demo accounts, alerts, and primary AWS-042 scenario!');
}

if (require.main === module) {
  seedDatabase().then(() => process.exit(0)).catch(err => {
    console.error('Seed Error:', err);
    process.exit(1);
  });
}

module.exports = seedDatabase;
