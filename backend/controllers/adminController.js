// File: backend/controllers/adminController.js

const db = require('../config/db');

// --- EXISTING FUNCTIONS (NO CHANGES) ---

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

exports.createTimeslot = (req, res) => {
  const { officeId, date, startTime, endTime, capacity } = req.body;

  if (!officeId || !date || !startTime || !endTime || !capacity) {
    return res.status(400).json({ success: false, message: "All fields are required." });
  }

  const dateObj = new Date(date);
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const day = String(dateObj.getDate()).padStart(2, '0');
  const formattedDate = `${year}-${month}-${day}`;

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


// --- CORRECTED FUNCTIONS FOR ADMIN DASHBOARD ---

exports.getAdminStats = (req, res) => {
  const sql = `
    SELECT
      (SELECT COUNT(*) FROM appointments) as totalBookings,
      (SELECT COUNT(*) FROM appointments WHERE status = 'CONFIRMED') as confirmedBookings,
      (SELECT COUNT(*) FROM offices) as totalOffices,
      (SELECT COUNT(*) FROM timeslots) as totalSlots;
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error("DATABASE QUERY ERROR:", err);
      return res.status(500).json({ success: false, message: "Failed to fetch admin stats." });
    }

    const statsData = results[0];
    const occupancyRate = statsData.totalSlots > 0 ? (statsData.totalBookings / statsData.totalSlots) * 100 : 0;

    const stats = {
      totalBookings: statsData.totalBookings,
      confirmedBookings: statsData.confirmedBookings,
      totalOffices: statsData.totalOffices,
      totalSlots: statsData.totalSlots,
      occupancyRate: parseFloat(occupancyRate.toFixed(1)),
    };

    res.json({ success: true, stats });
  });
};


exports.getAllAppointments = (req, res) => {
  // FINAL CORRECTED SQL QUERY
  const sql = `
    SELECT
      a.id,
      a.createdAt AS bookingTime,
      a.status,
      u.name AS fullName, -- FINAL FIX: Use the correct 'name' column and alias it to 'fullName'.
      u.email,
      o.name AS officeName,
      t.startTime,
      t.endTime
    FROM appointments AS a
    JOIN users AS u ON a.userId = u.id
    JOIN timeslots AS t ON a.timeslotId = t.id
    JOIN offices AS o ON t.officeId = o.id
    ORDER BY a.createdAt DESC
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error("DATABASE QUERY ERROR:", err);
      return res.status(500).json({ success: false, message: "Failed to fetch appointments." });
    }

    const bookings = results.map(row => ({
      id: row.id,
      bookingTime: row.bookingTime,
      status: row.status,
      user: {
        fullName: row.fullName,
        email: row.email,
      },
      office: {
        name: row.officeName,
      },
      slot: {
        startTime: row.startTime,
        endTime: row.endTime,
      },
    }));

    res.json({ success: true, bookings });
  });
};


exports.cancelAppointment = (req, res) => {
  const { id } = req.params;
  const sql = "UPDATE appointments SET status = 'CANCELLED' WHERE id = ?";

  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error("DATABASE UPDATE ERROR:", err);
      return res.status(500).json({ success: false, message: "Failed to cancel appointment." });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: "Appointment not found." });
    }
    res.json({ success: true, message: "Appointment cancelled successfully." });
  });
};