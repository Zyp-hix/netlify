// login.js (Netlify function)
const fs = require('fs');
const path = require('path');

exports.handler = async function(event, context) {
    const { username, password, hwid } = JSON.parse(event.body);
    
    const usersFilePath = path.join(__dirname, 'data', 'users.json');
    
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
                body: JSON.stringify({ message: 'Invalid HWID' })
            };
        }

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
