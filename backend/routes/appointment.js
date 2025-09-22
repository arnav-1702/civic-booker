const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const {
  createAppointment,
  getUserAppointments,
  deleteAppointment,
} = require('../controllers/appointmentController');

// @route   POST api/appointments
// @desc    Create an appointment
// @access  Private
router.post('/', auth, createAppointment);

// @route   GET api/appointments
// @desc    Get user's appointments
// @access  Private
router.get('/', auth, getUserAppointments);

// @route   DELETE api/appointments/:id
// @desc    Delete an appointment
// @access  Private
router.delete('/:id', auth, deleteAppointment);

module.exports = router;