const { v4: uuidv4 } = require('uuid');

class MemoryCollection {
  constructor(name) {
    this.name = name;
    this.items = [];
  }

  _matchesFilter(item, filter = {}) {
    if (!filter || Object.keys(filter).length === 0) return true;
    for (const [key, val] of Object.entries(filter)) {
      if (val === undefined) continue;
      if (key === '_id' || key === 'id') {
        const itemId = item._id ? item._id.toString() : item.id;
        if (itemId !== (val ? val.toString() : val)) return false;
        continue;
      }
      if (typeof val === 'object' && val !== null && !Array.isArray(val)) {
        if ('$in' in val) {
          if (!val.$in.includes(item[key])) return false;
          continue;
        }
        if ('$gte' in val && !(item[key] >= val.$gte)) return false;
        if ('$lte' in val && !(item[key] <= val.$lte)) return false;
        if ('$gt' in val && !(item[key] > val.$gt)) return false;
        if ('$lt' in val && !(item[key] < val.$lt)) return false;
        if ('$ne' in val && item[key] === val.$ne) return false;
        if ('$regex' in val) {
          const reg = new RegExp(val.$regex, val.$options || 'i');
          if (!reg.test(item[key])) return false;
          continue;
        }
      } else {
        if (item[key] !== val) return false;
      }
    }
    return true;
  }

  async find(filter = {}) {
    let results = this.items.filter(item => this._matchesFilter(item, filter));
    
    // Return chainable query object
    const query = {
      _data: results,
      sort(sortObj) {
        if (!sortObj) return this;
        const [field, direction] = Object.entries(sortObj)[0] || [];
        if (field) {
          this._data.sort((a, b) => {
            const valA = a[field] instanceof Date ? a[field].getTime() : a[field];
            const valB = b[field] instanceof Date ? b[field].getTime() : b[field];
            if (valA < valB) return direction === -1 || direction === 'desc' ? 1 : -1;
            if (valA > valB) return direction === -1 || direction === 'desc' ? -1 : 1;
            return 0;
          });
        }
        return this;
      },
      limit(n) {
        if (typeof n === 'number') {
          this._data = this._data.slice(0, n);
        }
        return this;
      },
      skip(n) {
        if (typeof n === 'number') {
          this._data = this._data.slice(n);
        }
        return this;
      },
      select(fields) {
        return this; // mock select
      },
      populate(path) {
        return this; // mock populate
      },
      then(resolve, reject) {
        resolve(this._data.map(doc => ({ ...doc, toObject: () => ({ ...doc }), toJSON: () => ({ ...doc }) })));
      }
    };

    return query;
  }

  async findOne(filter = {}) {
    const item = this.items.find(doc => this._matchesFilter(doc, filter));
    if (!item) return null;
    return {
      ...item,
      toObject: () => ({ ...item }),
      toJSON: () => ({ ...item }),
      save: async function() { return this; }
    };
  }

  async findById(id) {
    return this.findOne({ _id: id });
  }

  async create(doc) {
    const newDoc = {
      _id: doc._id || uuidv4(),
      createdAt: new Date(),
      updatedAt: new Date(),
      ...doc
    };
    newDoc.toObject = () => ({ ...newDoc });
    newDoc.toJSON = () => ({ ...newDoc });
    newDoc.save = async function() { return this; };
    this.items.push(newDoc);
    return newDoc;
  }

  async insertMany(docs) {
    const created = [];
    for (const doc of docs) {
      created.push(await this.create(doc));
    }
    return created;
  }

  async updateOne(filter, update) {
    const index = this.items.findIndex(doc => this._matchesFilter(doc, filter));
    if (index === -1) return { matchedCount: 0, modifiedCount: 0 };
    const updateData = update.$set ? update.$set : update;
    this.items[index] = { ...this.items[index], ...updateData, updatedAt: new Date() };
    return { matchedCount: 1, modifiedCount: 1 };
  }

  async findByIdAndUpdate(id, update, options = { new: true }) {
    return this.findOneAndUpdate({ _id: id }, update, options);
  }

  async findOneAndUpdate(filter, update, options = { new: true }) {
    const index = this.items.findIndex(doc => this._matchesFilter(doc, filter));
    if (index === -1) {
      if (options.upsert) {
        const updateData = update.$set ? update.$set : update;
        return this.create({ ...filter, ...updateData });
      }
      return null;
    }
    const updateData = update.$set ? update.$set : update;
    this.items[index] = { ...this.items[index], ...updateData, updatedAt: new Date() };
    const doc = this.items[index];
    return {
      ...doc,
      toObject: () => ({ ...doc }),
      toJSON: () => ({ ...doc })
    };
  }

  async deleteMany(filter = {}) {
    const initialLen = this.items.length;
    this.items = this.items.filter(doc => !this._matchesFilter(doc, filter));
    return { deletedCount: initialLen - this.items.length };
  }

  async countDocuments(filter = {}) {
    return this.items.filter(doc => this._matchesFilter(doc, filter)).length;
  }
}

const collections = {};

const getCollection = (name) => {
  if (!collections[name]) {
    collections[name] = new MemoryCollection(name);
  }
  return collections[name];
};

module.exports = {
  getCollection,
  MemoryCollection
};
