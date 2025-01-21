// logConsole.js (Netlify function)

const fs = require('fs');
const path = require('path');

exports.handler = async function(event, context) {
    const logFilePath = path.join(__dirname, 'data', 'activity_logs.json');
    
    // Read activity logs
    try {
        const data = fs.readFileSync(logFilePath, 'utf8');
        const logs = JSON.parse(data);
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
