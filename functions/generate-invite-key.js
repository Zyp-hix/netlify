const fs = require('fs');
const path = require('path');

// Define file path for invite keys
const INVITE_FILE = path.join(__dirname, '../data/invite_keys.json');

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

  return {
    statusCode: 200,
    body: JSON.stringify({ inviteKey }),
  };
};
