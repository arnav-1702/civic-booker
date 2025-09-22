const db = require('../config/db');

// This function is correct and needs no changes.
exports.createOffice = (req, res) => {
  const { name, location, contact } = req.body;
  if (!name || !location) {
    return res.status(400).json({ success: false, message: "Office Name and Address are required." });
  }
  const newOffice = { name, location, contact };
  db.query('INSERT INTO offices SET ?', newOffice, (err, result) => {
    if (err) {
      console.error("DATABASE INSERTION ERROR:", err);
      return res.status(500).json({ success: false, message: "Failed to create office in the database." });
    }
    res.json({ success: true, message: "Office created successfully", officeId: result.insertId });
  });
};

// UPDATED function to safely format the date
exports.createTimeslot = (req, res) => {
  const { officeId, date, startTime, endTime, capacity } = req.body;

  if (!officeId || !date || !startTime || !endTime || !capacity) {
    return res.status(400).json({ success: false, message: "All fields are required." });
  }

  // --- START OF FIX ---
  // This new code safely parses the incoming date and formats it
  // into the YYYY-MM-DD format that MySQL requires.
  const dateObj = new Date(date);
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
  const day = String(dateObj.getDate()).padStart(2, '0');
  const formattedDate = `${year}-${month}-${day}`;
  // --- END OF FIX ---

  // Combine the correctly formatted date with the time
  const fullStartTime = `${formattedDate} ${startTime}`;
  const fullEndTime = `${formattedDate} ${endTime}`;

  const newTimeslot = {
    officeId,
    startTime: fullStartTime,
    endTime: fullEndTime,
    capacity,
    status: 'available'
  };

  db.query('INSERT INTO timeslots SET ?', newTimeslot, (err, result) => {
    if (err) {
      console.error("DATABASE INSERTION ERROR:", err);
      return res.status(500).json({ success: false, message: "Failed to create timeslot." });
    }
    res.json({ success: true, message: "Timeslot created successfully", timeslotId: result.insertId });
  });
};