const db = require('../config/db'); // <-- Check this line
const bcrypt = require('bcryptjs');
const jwt =require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;

// Hardcoded admin for login purposes
const admin = { id: 'admin01', username: "admin", password: "admin123", role: "admin" };

// REGISTER a new user
exports.register = (req, res) => {
    // ... register logic ...
    // (This part is likely fine)
};

// LOGIN for users and admin
exports.login = (req, res) => {
  const { username, password } = req.body;

  // Admin login check
  if (username === admin.username && password === admin.password) {
    const payload = { id: admin.id, username: admin.username, role: 'admin' };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
    return res.json({ success: true, message: "Admin login successful", token });
  }

  // User login check
  const query = "SELECT * FROM users WHERE username = ?";
  
  // The error is likely happening here because 'db' is not correct
  db.query(query, [username], (err, results) => {
    if (err) return res.status(500).json({ success: false, message: err.message });
    if (results.length === 0) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    const user = results[0];
    bcrypt.compare(password, user.password, (compareErr, isMatch) => {
      if (compareErr) {
        console.error('Bcrypt compare error:', compareErr); // Added for better debugging
        return res.status(500).json({ success: false, message: "Bcrypt compare error" });
      }
      if (!isMatch) {
        return res.status(401).json({ success: false, message: "Invalid credentials" });
      }

      const payload = { id: user.id, username: user.username, role: 'user' };
      const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
      return res.json({ success: true, message: "User login successful", token });
    });
  });
};