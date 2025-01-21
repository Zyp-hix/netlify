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
    // Only allow admin to generate invite keys (authentication should be added here)
    const inviteKey = Math.random().toString(36).substr(2, 8); // Random 8-character invite key

    // Save invite key to Firestore with `claimed` as false
    await db.collection('invite_keys').doc(inviteKey).set({
        claimed: false,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    return {
        statusCode: 200,
        body: JSON.stringify({ inviteKey }),
    };
};
