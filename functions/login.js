const admin = require('firebase-admin');
const serviceAccount = {
    projectId: process.env.FIREBASE_PROJECT_ID,
    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
};

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});
const db = admin.firestore();

exports.handler = async (event) => {
    const { username, password, hwid } = JSON.parse(event.body);

    // Check if user exists
    const userDoc = await db.collection('users').doc(username).get();
    if (!userDoc.exists) {
        return {
            statusCode: 400,
            body: JSON.stringify({ message: 'User not found!' }),
        };
    }

    const userData = userDoc.data();

    // Check password (hash in production)
    if (userData.password !== password) {
        return {
            statusCode: 400,
            body: JSON.stringify({ message: 'Incorrect password!' }),
        };
    }

    // Check HWID
    if (userData.hwid !== hwid) {
        return {
            statusCode: 400,
            body: JSON.stringify({ message: 'HWID mismatch!' }),
        };
    }

    return {
        statusCode: 200,
        body: JSON.stringify({ message: 'Login successful!' }),
    };
};
