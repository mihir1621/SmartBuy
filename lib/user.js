import { prisma } from "./prisma";

/**
 * Safely resolves a User ID from a session.
 * Handles legacy sessions where the ID might be a phone number.
 */
export async function getSessionUserId(session) {
    if (!session?.user?.id) return null;

    const parsedId = parseInt(session.user.id);

    // Check if it's a valid Int (32-bit limit is 2147483647)
    // Most phone numbers are 10 digits starting with something that makes them > 2 billion.
    if (isNaN(parsedId) || parsedId > 2147483647) {
        // Likely a phone number string (Legacy Session)
        const user = await prisma.user.findUnique({
            where: { phone: session.user.id.toString() }
        });
        return user ? user.id : null;
    }

    return parsedId;
}
