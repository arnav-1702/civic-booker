const db = require('../config/db');

exports.getAllOffices = (req, res) => {
  const query = "SELECT * FROM offices";
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ success: false, message: err.message });
    res.json({ success: true, offices: results });
  });
};

exports.getAvailableTimeslots = (req, res) => {
  const { officeId } = req.params;
  const query = "SELECT * FROM timeslots WHERE officeId = ? AND status = 'available' AND startTime > NOW()";
  db.query(query, [officeId], (err, results) => {
    if (err) return res.status(500).json({ success: false, message: err.message });
    res.json({ success: true, timeslots: results });
  });
};