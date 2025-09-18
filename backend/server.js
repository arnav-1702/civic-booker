const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mysql = require("mysql2");

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MySQL connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",          // your MySQL user
  password: "Akkulkarni@0217", // your MySQL password
  database: "civicbooker"    // your database name
});

db.connect((err) => {
  if (err) {
    console.error("MySQL connection error:", err);
  } else {
    console.log("✅ Connected to MySQL");
  }
});

// Create users table if not exists
const createUsersTable = `
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  username VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
`;

db.query(createUsersTable, (err) => {
  if (err) console.error("Error creating users table:", err);
});

// Hardcoded admin
const admin = { username: "admin", password: "admin123", role: "admin" };

// REGISTER endpoint
app.post("/register", (req, res) => {
  const { name, email, username, password } = req.body;

  if (!name || !email || !username || !password) {
    return res.status(400).json({ success: false, message: "All fields are required" });
  }

  // Check if user/email already exists
  const checkQuery = "SELECT * FROM users WHERE email = ? OR username = ?";
  db.query(checkQuery, [email, username], (err, results) => {
    if (err) return res.status(500).json({ success: false, message: err.message });

    if (results.length > 0) {
      return res.status(400).json({ success: false, message: "Email or username already exists" });
    }

    // Insert new user
    const insertQuery = "INSERT INTO users (name, email, username, password) VALUES (?, ?, ?, ?)";
    db.query(insertQuery, [name, email, username, password], (err, result) => {
      if (err) return res.status(500).json({ success: false, message: err.message });

      return res.json({ success: true, message: "Registration successful" });
    });
  });
});

// LOGIN endpoint
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  // Admin login
  if (username === admin.username && password === admin.password) {
    return res.json({
      success: true,
      message: "Admin login successful",
      user: { username: admin.username, role: "admin" }
    });
  }

  // User login
  const query = "SELECT * FROM users WHERE username = ? AND password = ?";
  db.query(query, [username, password], (err, results) => {
    if (err) return res.status(500).json({ success: false, message: err.message });

    if (results.length === 0) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    const user = results[0];
    return res.json({ success: true, message: "User login successful", user });
  });
});

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
