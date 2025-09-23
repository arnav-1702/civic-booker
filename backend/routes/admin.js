// File: backend/routes/admin.js

const express = require('express');
const router = express.Router();
const adminAuth = require('../middleware/adminAuth');

// Import all controller functions with new names
const { 
  createOffice, 
  createTimeslot,
  getAdminStats,
  getAllAppointments, // <-- Renamed
  cancelAppointment   // <-- Renamed
} = require('../controllers/adminController');

// --- Existing Routes ---
router.post('/offices', adminAuth, createOffice);
router.post('/timeslots', adminAuth, createTimeslot);

// --- New Routes for Admin Dashboard (with correct function names) ---
router.get('/stats', adminAuth, getAdminStats);
router.get('/bookings', adminAuth, getAllAppointments); // Route path remains the same for the frontend
router.put('/bookings/:id/cancel', adminAuth, cancelAppointment); // Route path remains the same


module.exports = router;