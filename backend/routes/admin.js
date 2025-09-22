const express = require('express');
const router = express.Router();
const adminAuth = require('../middleware/adminAuth');
const { createOffice, createTimeslot } = require('../controllers/adminController');

// POST /api/admin/offices
router.post('/offices', adminAuth, createOffice);

// POST /api/admin/timeslots
router.post('/timeslots', adminAuth, createTimeslot);

module.exports = router;