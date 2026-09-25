const Maintenance = require('../models/Maintenance');

// GET /api/maintenance
exports.getMaintenanceTickets = async (req, res, next) => {
  try {
    const { status, priority, stationId } = req.query;
    let filter = {};
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (stationId) filter.stationId = stationId;

    const tickets = await Maintenance.find(filter);
    const list = tickets._data || (Array.isArray(tickets) ? tickets : []);

    const summary = {
      required: list.filter(t => t.status === 'REQUIRED').length,
      dueSoon: list.filter(t => t.status === 'DUE_SOON').length,
      scheduled: list.filter(t => t.status === 'SCHEDULED').length,
      completed: list.filter(t => t.status === 'COMPLETED').length
    };

    res.json({
      success: true,
      count: list.length,
      summary,
      data: list
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/maintenance/:id
exports.getMaintenanceById = async (req, res, next) => {
  try {
    const ticket = await Maintenance.findById(req.params.id) || await Maintenance.findOne({ _id: req.params.id });
    if (!ticket) {
      return res.status(404).json({ success: false, message: 'Maintenance record not found' });
    }
    res.json({ success: true, data: ticket });
  } catch (err) {
    next(err);
  }
};

// PATCH /api/maintenance/:id
exports.updateMaintenance = async (req, res, next) => {
  try {
    const { status, assignedTo, notes } = req.body;
    const ticket = await Maintenance.findByIdAndUpdate(
      req.params.id,
      { status, assignedTo, notes, updatedAt: new Date() },
      { new: true }
    );
    if (!ticket) {
      return res.status(404).json({ success: false, message: 'Maintenance record not found' });
    }
    res.json({ success: true, data: ticket });
  } catch (err) {
    next(err);
  }
};
