const express = require('express');
const router = express.Router();
const { getAllOffices, getAvailableTimeslots } = require('../controllers/officeController');

// GET /api/offices
router.get('/', getAllOffices);

// GET /api/offices/:officeId/timeslots
router.get('/:officeId/timeslots', getAvailableTimeslots);

module.exports = router;