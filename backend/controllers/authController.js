const db = require('../config/db'); // <-- Check this line
const bcrypt = require('bcryptjs');
const jwt =require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;

// Hardcoded admin for login purposes
const admin = { id: 'admin01', username: "admin", password: "admin123", role: "admin" };

// REGISTER a new user
exports.register = (req, res) => {
  const { name, email, username, password } = req.body;

  // 1. Validate input
  if (!name || !email || !username || !password) {
    return res.status(400).json({ success: false, message: 'Please provide all required fields.' });
  }

  // 2. Check if user already exists
  const checkUserSql = 'SELECT email FROM users WHERE email = ? OR username = ?';
  db.query(checkUserSql, [email, username], (err, results) => {
    if (err) {
      console.error("DATABASE QUERY ERROR:", err);
      return res.status(500).json({ success: false, message: 'Server error during user check.' });
    }

    if (results.length > 0) {
      return res.status(409).json({ success: false, message: 'A user with that email or username already exists.' });
    }

    // 3. Hash the password for security
    bcrypt.hash(password, 10, (err, hashedPassword) => {
      if (err) {
        return res.status(500).json({ success: false, message: 'Error hashing password.' });
      }

      // 4. Insert the new user into the database
      const newUser = {
        name,
        email,
        username,
        password: hashedPassword
      };

      const insertUserSql = 'INSERT INTO users SET ?';
      db.query(insertUserSql, newUser, (err, result) => {
        if (err) {
          console.error("DATABASE INSERTION ERROR:", err);
          return res.status(500).json({ success: false, message: 'Failed to register user.' });
        }

        // 5. Send success response
        return res.status(201).json({ success: true, message: 'User registered successfully!' });
      });
    });
  });
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