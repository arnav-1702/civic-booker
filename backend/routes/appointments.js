// backend/routes/appointments.js
const express = require('express');
const router = express.Router();
const userAuth = require('../middleware/userAuth');

// 1. IMPORT the new function
const { createAppointment, getUserAppointments } = require('../controllers/appointmentsController');

// This route is correct
router.post('/', userAuth, createAppointment);

// 2. ADD this new route for fetching a user's bookings
router.get('/my-bookings', userAuth, getUserAppointments);

module.exports = router;