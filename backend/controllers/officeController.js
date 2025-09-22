const db = require('../config/db');

// This function for getting ALL offices is already correct
exports.getAllOffices = (req, res) => {
  db.query('SELECT * FROM offices', (err, results) => {
    if (err) return res.status(500).json({ success: false, message: err.message });
    res.json({ success: true, offices: results });
  });
};

// --- START OF NEW CODE ---
// This new function gets a SINGLE office by its ID
exports.getOfficeById = (req, res) => {
  const { officeId } = req.params; // Get the ID from the URL

  db.query('SELECT * FROM offices WHERE id = ?', [officeId], (err, results) => {
    if (err) return res.status(500).json({ success: false, message: err.message });

    if (results.length === 0) {
      return res.status(404).json({ success: false, message: "Office not found" });
    }

    res.json({ success: true, office: results[0] });
  });
};
// --- END OF NEW CODE ---


// This function for getting timeslots is also correct
exports.getAvailableTimeslots = (req, res) => {
  const { officeId } = req.params;
  const sql = "SELECT * FROM timeslots WHERE officeId = ? AND status = 'available' AND startTime > NOW()";
  
  db.query(sql, [officeId], (err, results) => {
    if (err) return res.status(500).json({ success: false, message: err.message });
    res.json({ success: true, timeslots: results });
  });
};