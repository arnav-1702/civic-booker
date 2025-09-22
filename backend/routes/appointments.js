// backend/routes/appointments.js
const express = require('express');
const router = express.Router();
const userAuth = require('../middleware/userAuth');
const { createAppointment } = require('../controllers/appointmentsController');

// POST /api/appointments
router.post('/', userAuth, createAppointment);

module.exports = router;