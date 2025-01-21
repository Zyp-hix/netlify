// logConsole.js (Netlify function)
const fs = require('fs');
const path = require('path');

exports.handler = async function(event, context) {
    const logFilePath = path.join(__dirname, 'data', 'activity_logs.json');  // Log file path
    
    try {
        // Read activity logs
        const data = fs.readFileSync(logFilePath, 'utf8');
        const logs = JSON.parse(data);

        // Return logs with relevant information
        return {
            statusCode: 200,
            body: JSON.stringify({ logs })
        };
    } catch (err) {
        console.error('Error reading log file', err);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Error reading log file' })
        };
    }
};
