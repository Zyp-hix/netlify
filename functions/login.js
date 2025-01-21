const fs = require('fs');
const path = require('path');

// Define file path
const USERS_FILE = path.join(__dirname, '../data/users.json');

// Load users
const loadData = (filePath) => {
  try {
    const data = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    return [];
  }
};

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ message: 'Method Not Allowed' }),
    };
  }

  const { username, password, hwid } = JSON.parse(event.body);

  // Load users from file
  const users = loadData(USERS_FILE);
  const user = users.find((user) => user.username === username);

  if (!user) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'User not found' }),
    };
  }

  // Check password (in a real-world case, you would hash passwords)
  if (user.password !== password) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Invalid password' }),
    };
  }

  // Check HWID
  if (user.hwid !== hwid) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'HWID mismatch' }),
    };
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'Login successful' }),
  };
};
