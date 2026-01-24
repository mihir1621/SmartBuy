import { PrismaClient } from '@prisma/client'

const globalForPrisma = global

if (!process.env.DATABASE_URL) {
    console.warn("WARNING: DATABASE_URL is missing in this environment. Prisma Init may fail.");
}

export const prisma =
    globalForPrisma.prisma ||
    new PrismaClient({
        log: ['query'],
        datasources: {
            db: {
                url: process.env.DATABASE_URL,
            },
        },
    })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
