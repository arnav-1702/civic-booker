const express = require('express');
const router = express.Router();

// 1. IMPORT the new function
const { getAllOffices, getOfficeById, getAvailableTimeslots } = require('../controllers/officeController');

// This route for all offices is correct
router.get('/', getAllOffices);

// --- START OF NEW CODE ---
// 2. ADD this new route for a single office. The ':officeId' is a URL parameter.
router.get('/:officeId', getOfficeById);
// --- END OF NEW CODE ---

// This route for timeslots is correct
router.get('/:officeId/timeslots', getAvailableTimeslots);

module.exports = router;