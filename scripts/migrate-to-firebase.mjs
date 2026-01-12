

import 'xhr2'; // Polyfill for XMLHttpRequest
import { initializeApp } from "firebase/app";
import { getFirestore, collection, doc, setDoc } from "firebase/firestore";
import { getAuth, signInAnonymously } from "firebase/auth";
import { PrismaClient } from '@prisma/client';

const firebaseConfig = {
    apiKey: "AIzaSyBxEAHoeL5GkbHojHXczyovB1ejPeZKnqY",
    authDomain: "smartbuy-c1da0.firebaseapp.com",
    projectId: "smartbuy-c1da0",
    storageBucket: "smartbuy-c1da0.firebasestorage.app",
    messagingSenderId: "154213146796",
    appId: "1:154213146796:web:c6975c03df73156ba63f09"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Initialize Prisma
const prisma = new PrismaClient();

async function migrateUsers() {
    console.log('Starting Users Migration...');
    const users = await prisma.user.findMany();

    let count = 0;
    for (const user of users) {
        // Use user ID or email as document ID for easier lookup
        // Here converting ID to string
        const userRef = doc(db, "users", user.id.toString());

        await setDoc(userRef, {
            id: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: user.role,
            createdAt: user.createdAt.toISOString(),
            // Note: Passwords are not migrated as they rely on Auth provider
        });
        count++;
    }
    console.log(`Migrated ${count} users.`);
}

async function migrateProducts() {
    console.log('Starting Products Migration...');
    const products = await prisma.product.findMany();

    let count = 0;
    for (const product of products) {
        const productRef = doc(db, "products", product.id.toString());

        await setDoc(productRef, {
            id: product.id,
            name: product.name,
            category: product.category,
            price: product.price,
            originalPrice: product.originalPrice,
            discount: product.discount,
            rating: product.rating,
            reviews: product.reviews,
            brand: product.brand,
            image: product.image,
            images: product.images || [], // JSON field
            description: product.description,
            stock: product.stock,
            inStock: product.inStock,
            isNew: product.isNew,
            createdAt: product.createdAt.toISOString(),
            updatedAt: product.updatedAt.toISOString(),
            sellerId: product.sellerId
        });
        count++;
    }
    console.log(`Migrated ${count} products.`);
}


async function main() {
    try {
        const auth = getAuth(app);
        console.log("Attempting to sign in anonymously...");
        try {
            await signInAnonymously(auth);
            console.log("Signed in anonymously.");
        } catch (authError) {
            console.warn("Anonymous Cloud Auth failed. Proceeding as unauthenticated (writes may fail if rules deny access).");
            console.warn("Reason:", authError.code || authError.message);
            console.warn("To fix: Enable Anonymous Auth in Firebase Console, or relax Firestore Rules.");
        }

        await migrateUsers();
        await migrateProducts();
        console.log("Migration completed successfully.");
    } catch (error) {
        console.error("Migration failed:", error);
    } finally {
        await prisma.$disconnect();
        // Firebase client SDK keeps connection open, we might need to exit process
        process.exit(0);
    }
}

main();
