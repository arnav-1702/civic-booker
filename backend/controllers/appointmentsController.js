// backend/controllers/appointmentsController.js
const db = require('../config/db');

exports.createAppointment = (req, res) => {
  const { timeslotId } = req.body;
  const userId = req.user.id; // Get user ID from the userAuth middleware

  if (!timeslotId) {
    return res.status(400).json({ success: false, message: "Time slot ID is required." });
  }

  // Check if the slot is available before booking
  db.query('SELECT * FROM timeslots WHERE id = ?', [timeslotId], (err, slots) => {
    if (err) return res.status(500).json({ success: false, message: err.message });

    const slot = slots[0];
    if (!slot) {
      return res.status(404).json({ success: false, message: "Time slot not found." });
    }
    if (slot.booked_count >= slot.capacity) {
      return res.status(400).json({ success: false, message: "This time slot is already full." });
    }

    // If available, create the appointment and update the booked_count
    const newAppointment = { userId, timeslotId };
    db.query('INSERT INTO appointments SET ?', newAppointment, (err, result) => {
      if (err) return res.status(500).json({ success: false, message: err.message });

      db.query('UPDATE timeslots SET booked_count = booked_count + 1 WHERE id = ?', [timeslotId], (err, updateResult) => {
        if (err) return res.status(500).json({ success: false, message: err.message });
        res.json({ success: true, message: "Appointment booked successfully!" });
      });
    });
  });
};