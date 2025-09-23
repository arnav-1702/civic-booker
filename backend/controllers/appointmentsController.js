const db = require('../config/db');

/**
 * @desc    Create a new appointment for a logged-in user
 * @route   POST /api/appointments
 * @access  Private
 */
exports.createAppointment = (req, res) => {
  const { timeslotId } = req.body;
  const userId = req.user.id;

  if (!timeslotId) {
    return res.status(400).json({ success: false, message: "Time slot ID is required." });
  }

  // Use a connection pool for transactions
  db.getConnection((err, connection) => {
    if (err) {
      console.error("DATABASE CONNECTION ERROR:", err);
      return res.status(500).json({ success: false, message: "Database connection error." });
    }

    // Start a transaction to ensure data integrity
    connection.beginTransaction(err => {
      if (err) {
        connection.release();
        console.error("TRANSACTION START ERROR:", err);
        return res.status(500).json({ success: false, message: "Could not start transaction." });
      }

      // 1. Get the timeslot and lock the row to prevent overbooking
      const findSlotSql = 'SELECT * FROM timeslots WHERE id = ? FOR UPDATE';
      connection.query(findSlotSql, [timeslotId], (err, slots) => {
        if (err) {
          return connection.rollback(() => {
            connection.release();
            console.error("FIND SLOT QUERY ERROR:", err);
            res.status(500).json({ success: false, message: 'Error checking for the time slot.' });
          });
        }

        const slot = slots[0];

        if (!slot) {
          return connection.rollback(() => {
            connection.release();
            res.status(404).json({ success: false, message: 'Time slot not found.' });
          });
        }

        // 2. Check if the slot is already full
        if (slot.booked_count >= slot.capacity) {
          return connection.rollback(() => {
            connection.release();
            res.status(409).json({ success: false, message: 'This time slot is already full.' });
          });
        }

        // 3. Create the new appointment
        const createAppointmentSql = 'INSERT INTO appointments (userId, timeslotId, status) VALUES (?, ?, ?)';
        connection.query(createAppointmentSql, [userId, timeslotId, 'confirmed'], (err, result) => {
          if (err) {
            // Check for duplicate booking by the same user for the same slot
            if (err.code === 'ER_DUP_ENTRY') {
              return connection.rollback(() => {
                connection.release();
                res.status(409).json({ success: false, message: 'You have already booked this time slot.' });
              });
            }
            return connection.rollback(() => {
              connection.release();
              console.error("CREATE APPOINTMENT QUERY ERROR:", err);
              res.status(500).json({ success: false, message: 'Could not create the appointment.' });
            });
          }

          // 4. Update the booked_count in the timeslots table
          const updateSlotSql = 'UPDATE timeslots SET booked_count = booked_count + 1 WHERE id = ?';
          connection.query(updateSlotSql, [timeslotId], (err, result) => {
            if (err) {
              return connection.rollback(() => {
                connection.release();
                console.error("UPDATE SLOT QUERY ERROR:", err);
                res.status(500).json({ success: false, message: 'Could not update the time slot count.' });
              });
            }

            // 5. Commit the transaction if everything succeeded
            connection.commit(err => {
              if (err) {
                return connection.rollback(() => {
                  connection.release();
                  console.error("TRANSACTION COMMIT ERROR:", err);
                  res.status(500).json({ success: false, message: 'Could not finalize booking.' });
                });
              }

              // Success!
              connection.release();
              res.status(201).json({ success: true, message: 'Appointment booked successfully!' });
            });
          });
        });
      });
    });
  });
};

/**
 * @desc    Get all appointments for the logged-in user
 * @route   GET /api/appointments/my-bookings
 * @access  Private
 */
exports.getUserAppointments = (req, res) => {
  // Get the logged-in user's ID from the auth middleware
  const userId = req.user.id;

  // This SQL query joins the necessary tables to get all booking details
  const sql = `
    SELECT
      a.id,
      a.status,
      a.createdAt AS bookingTime,
      t.startTime,
      t.endTime,
      o.name AS officeName,
      o.location AS officeLocation,
      o.contact AS officeContact
    FROM appointments AS a
    JOIN timeslots AS t ON a.timeslotId = t.id
    JOIN offices AS o ON t.officeId = o.id
    WHERE a.userId = ?
    ORDER BY t.startTime DESC
  `;

  db.query(sql, [userId], (err, results) => {
    if (err) {
      console.error("DATABASE QUERY ERROR:", err);
      return res.status(500).json({ success: false, message: "Database error." });
    }
    
    // Send the bookings back to the frontend
    res.json({ success: true, bookings: results });
  });
};