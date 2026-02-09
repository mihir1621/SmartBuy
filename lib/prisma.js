import { PrismaClient } from '@prisma/client'

const globalForPrisma = global

// HARDCODED FALLBACK for Vercel Deployment to fix "Environment variable not found" error
// The user has the key, but Vercel isn't injecting it into the function runtime for some reason.
let DB_URL_FALLBACK = "mysql://avnadmin:AVNS_k_BWki3ZEZI7Gpb8kTc@smartbuy-mihirchaudhari1621-ddd4.d.aivencloud.com:25694/defaultdb?ssl-mode=REQUIRED";

// Append connection timeouts to handle serverless cold starts and sleeping DBs
const connectionParams = "&connect_timeout=30&pool_timeout=30&socket_timeout=30";
if (!DB_URL_FALLBACK.includes("connect_timeout")) {
    DB_URL_FALLBACK += connectionParams;
}

let connectionUrl = process.env.DATABASE_URL || DB_URL_FALLBACK;

// Ensure production env var also has timeouts if missing
if (process.env.DATABASE_URL && !process.env.DATABASE_URL.includes("connect_timeout")) {
    connectionUrl += connectionParams;
}

if (!process.env.DATABASE_URL) {
    console.warn("WARNING: DATABASE_URL missing from environment. Using hardcoded fallback with timeouts.");
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
