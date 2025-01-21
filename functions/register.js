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
    const { username, password, hwid, inviteKey } = JSON.parse(event.body);

    // Check if invite key is valid
    const inviteDoc = await db.collection('invite_keys').doc(inviteKey).get();
    if (!inviteDoc.exists || inviteDoc.data().claimed) {
        return {
            statusCode: 400,
            body: JSON.stringify({ message: 'Invalid or already claimed invite key!' }),
        };
    }

    // Create new user document
    const userDocRef = db.collection('users').doc(username);
    await userDocRef.set({
        username,
        password,  // In production, hash the password
        hwid,
        inviteKey,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    // Mark invite key as claimed
    await db.collection('invite_keys').doc(inviteKey).update({ claimed: true });

    return {
        statusCode: 200,
        body: JSON.stringify({ message: 'Registration successful!' }),
    };
};
