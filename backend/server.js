const express = require("express");
require('dotenv').config();
const cors = require("cors");
const bodyParser = require("body-parser");
require('./config/db'); // This line executes db.js and connects to MySQL

// Import routes
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const officeRoutes = require('./routes/offices');

const app = express();
const PORT = 5000;

// Core Middleware
app.use(cors());
app.use(bodyParser.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/offices', officeRoutes);

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});