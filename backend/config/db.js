const mysql = require("mysql2");

// Create the connection to the database
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Akkulkarni@0217", // your MySQL password
  database: "civicbooker"       // your database name
});

// Connect to the database
db.connect((err) => {
  if (err) {
    console.error("MySQL connection error:", err);
  } else {
    console.log("✅ Connected to MySQL");
  }
});

module.exports = db;