import { prisma } from '@/lib/prisma';
import { withRetry } from '@/lib/db-retry';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    const { uid, email, name, image, role } = req.body;

    if (!uid) {
        return res.status(400).json({ error: 'Missing UID' });
    }

    try {
        // 1. Try to find user by email with retry
        let user = null;
        if (email) {
            user = await withRetry(
                () => prisma.user.findUnique({ where: { email } }),
                { operationName: 'Find User by Email' }
            );
        }

        // 2. If exists, update role if needed and return user data
        if (user) {
            // Update role if explicitly requested and different (e.g. user toggles logging in as Seller)
            if (role && (role === 'SELLER' || role === 'ADMIN') && user.role !== role) {
                user = await withRetry(
                    () => prisma.user.update({
                        where: { id: user.id },
                        data: { role: role }
                    }),
                    { operationName: 'Update User Role' }
                );
            }

            return res.status(200).json({
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                // image: user.image
            });
        }

        // 3. If not exists, create new user
        // Ensure email is present for creation (or unique phone logic, but AuthContext mainly uses email)
        if (!email) {
            return res.status(400).json({ error: 'Email required for account creation' });
        }

        // Determine Role: Security risk if client can claim ADMIN.
        // We will allow SELLER or USER. ADMIN should be manually set in DB usually.
        // But for this project's simplified flow (checkbox in signup):
        let assignedRole = 'USER';
        if (role === 'SELLER') assignedRole = 'SELLER';
        if (role === 'ADMIN') assignedRole = 'ADMIN'; // Allowing for demo/dev purposes

        // Create user with retry and handle race conditions
        const newUser = await withRetry(
            async () => {
                try {
                    return await prisma.user.create({
                        data: {
                            name: name || 'New User',
                            email: email,
                            role: assignedRole,
                            phone: `uid_${uid}`,
                        }
                    });
                } catch (e) {
                    // Handle race condition: user was created by another request
                    if (e.code === 'P2002') { // Unique constraint failed (race condition)
                        return await prisma.user.findUnique({ where: { email } });
                    }
                    throw e;
                }
            },
            { operationName: 'Create User' }
        );

        return res.status(201).json({
            id: newUser.id,
            name: newUser.name,
            email: newUser.email,
            role: newUser.role,
            // image: newUser.image
        });

    } catch (error) {
        console.error('Auth Sync Error:', error);
        res.status(500).json({
            error: 'Failed to sync user',
            details: process.env.NODE_ENV !== 'production' ? error.message : undefined
        });
    }
}
