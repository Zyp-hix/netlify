// deleteAccount.js (Netlify function)
const fs = require('fs');
const path = require('path');

const usersFilePath = path.join(__dirname, 'users.json');

exports.handler = async function(event, context) {
    const { username, ownerToken } = JSON.parse(event.body);

    // Only allow the owner to delete accounts (check if the ownerToken matches)
    if (ownerToken !== 'your-owner-token-here') {
        return {
            statusCode: 403,
            body: JSON.stringify({ message: 'Unauthorized' }),
        };
    }

    // Read user data from file
    const users = JSON.parse(fs.readFileSync(usersFilePath, 'utf-8'));

    // Find and remove the user by username
    const updatedUsers = users.filter(u => u.username !== username);

    if (users.length === updatedUsers.length) {
        return {
            statusCode: 404,
            body: JSON.stringify({ message: 'User not found' }),
        };
    }

    // Save the updated user data back to the file
    fs.writeFileSync(usersFilePath, JSON.stringify(updatedUsers, null, 2));

    return {
        statusCode: 200,
        body: JSON.stringify({ message: 'Account deleted successfully' }),
    };
};
