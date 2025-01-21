const fs = require('fs');
const path = require('path');

// Define chat log file path
const CHAT_FILE = path.join(__dirname, '../data/chat_messages.json');

// Load chat messages
const loadMessages = () => {
  try {
    const data = fs.readFileSync(CHAT_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    return [];
  }
};

// Save chat messages
const saveMessages = (messages) => {
  fs.writeFileSync(CHAT_FILE, JSON.stringify(messages, null, 2));
};

exports.handler = async (event) => {
  if (event.httpMethod === 'GET') {
    const messages = loadMessages();
    return {
      statusCode: 200,
      body: JSON.stringify({ messages }),
    };
  }

  if (event.httpMethod === 'POST') {
    const { username, message } = JSON.parse(event.body);
    
    // Save the message
    const messages = loadMessages();
    messages.push({ username, message, timestamp: new Date() });
    saveMessages(messages);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Message posted' }),
    };
  }
};
