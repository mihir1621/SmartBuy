import { PrismaClient } from '@prisma/client'

const globalForPrisma = global

// HARDCODED FALLBACK for Vercel Deployment to fix "Environment variable not found" error
// The user has the key, but Vercel isn't injecting it into the function runtime for some reason.
const DB_URL_FALLBACK = "mysql://avnadmin:AVNS_k_BWki3ZEZI7Gpb8kTc@smartbuy-mihirchaudhari1621-ddd4.d.aivencloud.com:25694/defaultdb?ssl-mode=REQUIRED";

const connectionUrl = process.env.DATABASE_URL || DB_URL_FALLBACK;

if (!process.env.DATABASE_URL) {
    console.warn("WARNING: DATABASE_URL missing from environment. Using hardcoded fallback.");
}

export const prisma =
    globalForPrisma.prisma ||
    new PrismaClient({
        log: ['query', 'info', 'warn', 'error'],
        datasources: {
            db: {
                url: connectionUrl,
            },
        },
    })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
