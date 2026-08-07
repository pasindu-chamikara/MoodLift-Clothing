import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

admin.initializeApp();

// Example Cloud Function: Triggered when a new user signs up
export const onUserCreated = functions.auth.user().onCreate(async (user) => {
  const db = admin.firestore();
  
  // Create a user profile in Firestore
  await db.collection("users").doc(user.uid).set({
    id: user.uid,
    email: user.email,
    displayName: user.displayName || "New Customer",
    role: "customer",
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  functions.logger.info(`User profile created for ${user.uid}`);
});

// Example HTTP Function
export const helloWorld = functions.https.onRequest((request, response) => {
  response.send("Hello from Moodlift Clothing Backend!");
});
