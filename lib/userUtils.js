import { prisma } from '@/lib/prisma';

export async function getPrismaUserFromFirebase(firebaseUid, userData = {}) {
    if (!firebaseUid) return null;

    // 1. Try to find by email or phone (Firebase UID is not in DB yet, or maybe map it?)
    // Ideally we should add a 'firebaseUid' column to User table, but to avoid schema changes for now:
    // We will assume unique Email or Phone.

    // Check if we can find user by email
    let user = null;
    if (userData.email) {
        user = await prisma.user.findUnique({ where: { email: userData.email } });
    }

    // Check by phone if not found
    if (!user && userData.phone) {
        user = await prisma.user.findUnique({ where: { phone: userData.phone } });
    }

    // If found, return ID
    if (user) {
        return user.id;
    }

    // If not found, create new user
    // We need at least email or phone to be unique conformant
    if (!userData.email && !userData.phone) {
        console.error("Cannot create user without email or phone");
        return null;
    }

    try {
        const newUser = await prisma.user.create({
            data: {
                name: userData.name || 'New User',
                email: userData.email || null,
                phone: userData.phone || `fb_${firebaseUid}`, // Fallback for phone unique constraint
                role: 'USER', // Default
                // storing firebaseUid currently not supported by schema, but we map via email/phone
            }
        });
        return newUser.id;
    } catch (error) {
        console.error("Error creating prisma user:", error);
        return null; // Handle duplicate or other errors
    }
}
