const fs = require('fs');
const path = require('path');

// Define log file path
const LOG_FILE = path.join(__dirname, '../data/activity_logs.json');

// Load logs
const loadLogs = () => {
  try {
    const data = fs.readFileSync(LOG_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    return [];
  }
};

// Save logs
const saveLogs = (logs) => {
  fs.writeFileSync(LOG_FILE, JSON.stringify(logs, null, 2));
};

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ message: 'Method Not Allowed' }),
    };
  }

  const { action, username, inviteKey } = JSON.parse(event.body);
  const logs = loadLogs();
  
  const logEntry = {
    timestamp: new Date(),
    action,
    username,
    inviteKey,
  };
  
  logs.push(logEntry);
  saveLogs(logs);

  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'Action logged successfully' }),
  };
};
