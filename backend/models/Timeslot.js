const createTimeslotsTable = `
  CREATE TABLE IF NOT EXISTS timeslots (
    id INT AUTO_INCREMENT PRIMARY KEY,
    officeId INT,
    startTime DATETIME NOT NULL,
    endTime DATETIME NOT NULL,
    status ENUM('available', 'booked') DEFAULT 'available',
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (officeId) REFERENCES offices(id) ON DELETE CASCADE
  )
`;

module.exports = createTimeslotsTable;