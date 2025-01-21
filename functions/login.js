// login.js - Netlify function to handle login requests
const fs = require('fs');
const path = require('path');

// Assume that user data (including HWID) is stored in a JSON file (you should use a real database in production)
const usersFilePath = path.join(__dirname, 'users.json');

exports.handler = async function(event, context) {
  const { username, password, hwid } = JSON.parse(event.body);

  // Read user data from file (mock example)
  const users = JSON.parse(fs.readFileSync(usersFilePath, 'utf-8'));
  
  // Find the user by username
  const user = users.find(u => u.username === username);

  if (!user) {
    return {
      statusCode: 401,
      body: JSON.stringify({ message: 'Invalid credentials' }),
    };
  }

  // Check if the password is correct
  if (user.password !== password) {
    return {
      statusCode: 401,
      body: JSON.stringify({ message: 'Invalid credentials' }),
    };
  }

  // Check if the HWID matches
  if (user.hwid !== hwid) {
    return {
      statusCode: 403,
      body: JSON.stringify({ message: 'Invalid HWID' }),
    };
  }

  // Login success
  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'Login successful' }),
  };
};
