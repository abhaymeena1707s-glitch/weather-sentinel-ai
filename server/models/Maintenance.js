const { createModel } = require('./modelFactory');

const maintenanceSchema = {
  stationId: { type: String, required: true },
  sensorType: { 
    type: String, 
    enum: ['temperature', 'pressure', 'humidity', 'all'], 
    required: true 
  },
  status: { 
    type: String, 
    enum: ['REQUIRED', 'DUE_SOON', 'SCHEDULED', 'COMPLETED'], 
    default: 'DUE_SOON' 
  },
  failureRisk: { 
    type: String, 
    enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'], 
    default: 'MEDIUM' 
  },
  priority: { 
    type: String, 
    enum: ['P1_CRITICAL', 'P2_HIGH', 'P3_MEDIUM', 'P4_LOW'], 
    default: 'P3_MEDIUM' 
  },
  currentHealth: { type: Number, default: 65 },
  recommendedAction: { type: String, required: true },
  dueDate: { type: Date },
  assignedTo: { type: String, default: 'Unassigned' },
  notes: { type: String }
};

module.exports = createModel('Maintenance', maintenanceSchema);
