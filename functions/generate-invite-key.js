const fs = require('fs');
const path = require('path');

// Define file path for invite keys
const INVITE_FILE = path.join(__dirname, '../data/invite_keys.json');
const ADMIN_USERNAME = 'admin'; // Change this to your admin username
const ADMIN_PASSWORD = 'admin_password'; // Change this to your admin password
const logAction = require('./logConsole');

// Load data
const loadData = (filePath) => {
  try {
    const data = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    return [];
  }
};

// Save data to file
const saveData = (filePath, data) => {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};

// Generate a random invite key
const generateInviteKey = () => {
  return Math.random().toString(36).substr(2, 8);
};

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ message: 'Method Not Allowed' }),
    };
  }

  const { username, password } = JSON.parse(event.body);

  // Validate admin credentials
  if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
    return {
      statusCode: 403,
      body: JSON.stringify({ message: 'Unauthorized' }),
    };
  }

  // Generate a new invite key
  const inviteKey = generateInviteKey();
  const inviteKeys = loadData(INVITE_FILE);

  // Check if the invite key already exists (unlikely, but just in case)
  if (inviteKeys.some((key) => key.key === inviteKey)) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Invite key already exists' }),
    };
  }

  // Save the invite key to the file (not yet claimed)
  inviteKeys.push({ key: inviteKey, claimed: false });
  saveData(INVITE_FILE, inviteKeys);

  // Log the invite key generation action
  logAction({
    action: 'Invite key generated',
    username: ADMIN_USERNAME,
    inviteKey,
  });

  return {
    statusCode: 200,
    body: JSON.stringify({ inviteKey }),
  };
};
