import { prisma } from '@/lib/prisma';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";

export default async function handler(req, res) {
    const session = await getServerSession(req, res, authOptions);

    if (!session || session.user.role !== 'SELLER') {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    const userId = parseInt(session.user.id);

    if (req.method === 'GET') {
        try {
            const user = await prisma.user.findUnique({
                where: { id: userId },
                select: {
                    name: true,
                    email: true,
                    phone: true,
                    role: true,
                    createdAt: true
                }
            });
            res.status(200).json(user);
        } catch (error) {
            res.status(500).json({ error: "Fetch profile failed" });
        }
    } else if (req.method === 'PUT') {
        const { name, email } = req.body;

        try {
            const updatedUser = await prisma.user.update({
                where: { id: userId },
                data: { name, email }
            });
            res.status(200).json({ message: "Profile updated", user: updatedUser });
        } catch (error) {
            console.error("Update profile error", error);
            res.status(500).json({ error: "Failed to update profile" });
        }
    } else {
        res.setHeader('Allow', ['GET', 'PUT']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
