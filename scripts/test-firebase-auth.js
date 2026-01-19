
const { initializeApp } = require("firebase/app");
const { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } = require("firebase/auth");

const firebaseConfig = {
    apiKey: "AIzaSyBxEAHoeL5GkbHojHXczyovB1ejPeZKnqY",
    authDomain: "smartbuy-c1da0.firebaseapp.com",
    projectId: "smartbuy-c1da0",
    storageBucket: "smartbuy-c1da0.firebasestorage.app",
    messagingSenderId: "154213146796",
    appId: "1:154213146796:web:c6975c03df73156ba63f09"
};

async function testAuth() {
    console.log("Initializing Firebase...");
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);

    const testEmail = `test_${Date.now()}@example.com`;
    const testPass = "TestPass123!";

    console.log(`Attempting to create user: ${testEmail}`);

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, testEmail, testPass);
        console.log("SUCCESS: User created!", userCredential.user.uid);
    } catch (error) {
        console.error("FAILURE: Auth Error");
        console.error("Code:", error.code);
        console.error("Message:", error.message);

        if (error.code === 'auth/operation-not-allowed') {
            console.log("\n>>> DIAGNOSIS: The 'Email/Password' provider is DISABLED in the Firebase Console.");
            console.log(">>> ACTION: Go to https://console.firebase.google.com/project/smartbuy-c1da0/authentication/providers and enable it.");
        }
    }
}

testAuth();
