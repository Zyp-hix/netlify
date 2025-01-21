const fs = require('fs');
const path = require('path');

// Define file paths
const USERS_FILE = path.join(__dirname, '../data/users.json');
const INVITE_FILE = path.join(__dirname, '../data/invite_keys.json');

// Load users and invite keys
const loadData = (filePath) => {
  try {
    const data = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    return [];
  }
};

// Save data to files
const saveData = (filePath, data) => {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ message: 'Method Not Allowed' }),
    };
  }

  const { username, password, hwid, inviteKey } = JSON.parse(event.body);
  
  // Load invite keys and check if the provided invite key exists
  const inviteKeys = loadData(INVITE_FILE);
  const invite = inviteKeys.find((key) => key.key === inviteKey && !key.claimed);
  
  if (!invite) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Invalid or already claimed invite key' }),
    };
  }

  // Check if user already exists
  const users = loadData(USERS_FILE);
  const existingUser = users.find((user) => user.username === username);

  if (existingUser) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'User already exists' }),
    };
  }

  // Register the new user with HWID
  const newUser = {
    username,
    password,
    hwid,
    createdAt: new Date(),
  };
  
  users.push(newUser);
  saveData(USERS_FILE, users);

  // Mark the invite key as claimed
  invite.claimed = true;
  saveData(INVITE_FILE, inviteKeys);

  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'User registered successfully' }),
  };
};
