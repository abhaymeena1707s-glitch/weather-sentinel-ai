const mongoose = require('mongoose');
const { getCollection } = require('../config/memoryStore');
const { isInMemory } = require('../config/db');

function createModel(name, schemaDef) {
  let mongooseModel = null;
  try {
    const schema = new mongoose.Schema(schemaDef, { timestamps: true });
    mongooseModel = mongoose.models[name] || mongoose.model(name, schema);
  } catch (err) {
    // If mongoose fails or schema error
    console.warn(`Mongoose schema init for ${name}:`, err.message);
  }

  // Proxy object that dynamically routes to Mongoose or MemoryCollection
  return new Proxy({}, {
    get(target, prop) {
      if (!isInMemory() && mongoose.connection.readyState === 1 && mongooseModel) {
        return mongooseModel[prop];
      }
      const mem = getCollection(name);
      if (typeof mem[prop] === 'function') {
        return mem[prop].bind(mem);
      }
      return mem[prop];
    }
  });
}

module.exports = { createModel };
