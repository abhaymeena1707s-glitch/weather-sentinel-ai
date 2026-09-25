const { createModel } = require('./modelFactory');

const userSchema = {
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['ADMIN', 'OPERATOR', 'FIELD_ENGINEER', 'VIEWER'], 
    default: 'OPERATOR' 
  },
  department: { type: String, default: 'Meteorological Operations' }
};

module.exports = createModel('User', userSchema);
