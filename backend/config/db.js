// backend/config/db.js

const mysql = require('mysql2');
require('dotenv').config();

// Use createPool to allow for multiple simultaneous connections and transactions
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10, // Adjust as needed
  queueLimit: 0
});

// The 'pool' object now has the .getConnection() method
module.exports = pool;