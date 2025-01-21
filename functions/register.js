// register.js (Netlify function)
const fs = require('fs');
const path = require('path');

exports.handler = async function(event, context) {
    const { username, password, hwid, inviteKey } = JSON.parse(event.body);
    
    const usersFilePath = path.join(__dirname, 'data', 'users.json');
    const inviteKeysFilePath = path.join(__dirname, 'data', 'invite_keys.json');
    const logFilePath = path.join(__dirname, 'data', 'activity_logs.json');  // Log file path

    try {
        // Check if invite key exists and is not used
        const inviteKeysData = fs.readFileSync(inviteKeysFilePath, 'utf8');
        const inviteKeys = JSON.parse(inviteKeysData);
        const inviteKeyData = inviteKeys.find(key => key.key === inviteKey && !key.used);

        if (!inviteKeyData) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: 'Invalid or used invite key' })
            };
        }

        // Mark the invite key as used
        inviteKeyData.used = true;
        fs.writeFileSync(inviteKeysFilePath, JSON.stringify(inviteKeys, null, 2));

        // Register the user
        let users = [];
        if (fs.existsSync(usersFilePath)) {
            const usersData = fs.readFileSync(usersFilePath, 'utf8');
            users = JSON.parse(usersData);
        }

        // Check if username already exists
        if (users.find(user => user.username === username)) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: 'Username already taken' })
            };
        }

        // Add new user to users array
        users.push({ username, password, hwid });
        fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));

        // Log the registration event
        const logEntry = {
            timestamp: Date.now(),
            action: 'User Registered',
            username,
            password,  // Use hashed password in production
            hwid,
            inviteKey
        };

        // Read existing logs
        let logs = [];
        if (fs.existsSync(logFilePath)) {
            const data = fs.readFileSync(logFilePath, 'utf8');
            logs = JSON.parse(data);
        }

        // Push the new log entry to logs
        logs.push(logEntry);

        // Write updated logs to the file
        fs.writeFileSync(logFilePath, JSON.stringify(logs, null, 2));

        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'User registered successfully' })
        };
    } catch (err) {
        console.error('Error registering user', err);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Error registering user' })
        };
    }
};
