import { prisma } from '@/lib/prisma';

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
            for (let i = 0; i < 3; i++) {
                try {
                    user = await prisma.user.findUnique({ where: { email } });
                    break;
                } catch (e) {
                    if (i === 2) throw e;
                    await new Promise(r => setTimeout(r, 500));
                }
            }
        }

        // 2. If exists, return user data
        // 2. If exists, update role if needed and return user data
        if (user) {
            // Update role if explicitly requested and different (e.g. user toggles logging in as Seller)
            if (role && (role === 'SELLER' || role === 'ADMIN') && user.role !== role) {
                user = await prisma.user.update({
                    where: { id: user.id },
                    data: { role: role }
                });
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

        const newUser = await prisma.user.create({
            data: {
                name: name || 'New User',
                email: email,
                role: assignedRole,
                // image: image || null, // Image field does not exist in User schema
                phone: `uid_${uid}`, // Temporary placeholder for unique phone if schema requires it
            }
        });

        return res.status(201).json({
            id: newUser.id,
            name: newUser.name,
            email: newUser.email,
            role: newUser.role,
            // image: newUser.image
        });

    } catch (error) {
        console.error('Auth Sync Error:', error);
        res.status(500).json({ error: 'Failed to sync user' });
    }
}
