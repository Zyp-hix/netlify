// login.js (Netlify function)
const fs = require('fs');
const path = require('path');

exports.handler = async function(event, context) {
    const { username, password, hwid } = JSON.parse(event.body);
    
    const usersFilePath = path.join(__dirname, 'data', 'users.json');
    const logFilePath = path.join(__dirname, 'data', 'activity_logs.json');  // Log file path

    try {
        // Read the users file to check if the user exists
        const usersData = fs.readFileSync(usersFilePath, 'utf8');
        const users = JSON.parse(usersData);

        const user = users.find(u => u.username === username && u.password === password);

        if (!user) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: 'Invalid username or password' })
            };
        }

        // Check HWID (Hardware ID)
        if (user.hwid !== hwid) {
            return {
                statusCode: 403,
                body: JSON.stringify({ message: 'HWID mismatch' })
            };
        }

        // Log the login event
        const logEntry = {
            timestamp: Date.now(),
            action: 'User Logged In',
            username,
            hwid
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
            body: JSON.stringify({ message: 'Login successful' })
        };
    } catch (err) {
        console.error('Error logging in', err);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Error logging in' })
        };
    }
};
