const QuarantineRecord = require('../models/QuarantineRecord');
const SensorReading = require('../models/SensorReading');
const Station = require('../models/Station');

// GET /api/quarantine
exports.getQuarantineRecords = async (req, res, next) => {
  try {
    const { status, stationId, parameter, limit = 50 } = req.query;
    let filter = {};
    if (status) filter.status = status;
    if (stationId) filter.stationId = stationId;
    if (parameter) filter.parameter = parameter;

    const records = await QuarantineRecord.find(filter);
    const list = records._data || (Array.isArray(records) ? records : []);
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

// PATCH /api/quarantine/:id
// Handles VERIFY, REJECT, ACCEPT_RAW, APPLY_CORRECTION, RESTORE
exports.updateQuarantineRecord = async (req, res, next) => {
  try {
    const { action, operatorNotes, verifiedBy = 'Field Operator' } = req.body;
    const record = await QuarantineRecord.findById(req.params.id) || await QuarantineRecord.findOne({ _id: req.params.id });

    if (!record) {
      return res.status(404).json({ success: false, message: 'Quarantine record not found' });
    }

    let newStatus = record.status;
    let appliedValue = null;

    if (action === 'VERIFY') {
      newStatus = 'VERIFIED';
    } else if (action === 'REJECT') {
      newStatus = 'REJECTED';
    } else if (action === 'APPLY_CORRECTION') {
      newStatus = 'CORRECTED';
      appliedValue = record.expectedValue;
      // Also update the underlying reading if readingId exists
      if (record.readingId) {
        await SensorReading.findByIdAndUpdate(record.readingId, {
          isCorrected: true,
          qualityStatus: 'CORRECTED',
          correctedTemperature: record.expectedValue?.temperature,
          correctedPressure: record.expectedValue?.pressure,
          correctedHumidity: record.expectedValue?.humidity
        });
      }
    } else if (action === 'ACCEPT_RAW') {
      newStatus = 'VERIFIED';
      appliedValue = record.observedValue;
      if (record.readingId) {
        await SensorReading.findByIdAndUpdate(record.readingId, {
          qualityStatus: 'VERIFIED',
          isQuarantined: false
        });
      }
    } else if (action === 'RESTORE') {
      newStatus = 'RESTORED';
    }

    const updated = await QuarantineRecord.findByIdAndUpdate(
      record._id,
      {
        status: newStatus,
        operatorNotes: operatorNotes || record.operatorNotes,
        verifiedBy,
        verifiedAt: new Date(),
        appliedValue
      },
      { new: true }
    );

    // If quarantine resolved, check if station status should be un-quarantined
    const remainingQuarantined = await QuarantineRecord.find({
      stationId: record.stationId,
      status: 'QUARANTINED'
    });
    const remainingList = remainingQuarantined._data || (Array.isArray(remainingQuarantined) ? remainingQuarantined : []);
    if (remainingList.length === 0) {
      await Station.findOneAndUpdate({ stationId: record.stationId }, { status: 'normal' });
    }

    res.json({
      success: true,
      message: `Quarantine record updated with action: ${action}`,
      data: updated
    });
  } catch (err) {
    next(err);
  }
};
