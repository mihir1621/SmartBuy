import { PrismaClient } from '@prisma/client'

const globalForPrisma = global

/**
 * Production-Grade Prisma Client Configuration
 * Optimized for Vercel serverless deployment with Aiven MySQL
 */

// Environment variable validation
function getDatabaseUrl() {
    const envUrl = process.env.DATABASE_URL;

    // Hardcoded fallback (ONLY for deployment safety - should use env vars in production)
    const FALLBACK_URL = "mysql://avnadmin:AVNS_k_BWki3ZEZI7Gpb8kTc@smartbuy-mihirchaudhari1621-ddd4.d.aivencloud.com:25694/defaultdb?ssl-mode=REQUIRED";

    if (!envUrl || envUrl.trim() === '') {
        console.warn('⚠️  DATABASE_URL not found in environment variables. Using hardcoded fallback.');
        console.warn('⚠️  For production, set DATABASE_URL in Vercel Environment Variables.');
        return FALLBACK_URL;
    }

    return envUrl;
}

// Build connection URL with optimized parameters
function buildConnectionUrl(baseUrl) {
    // Parse existing URL to avoid duplicate parameters
    const url = new URL(baseUrl);
    const params = url.searchParams;

    // Connection pool settings for serverless (Vercel)
    // Free-tier Aiven MySQL typically allows 5-10 connections
    if (!params.has('connection_limit')) {
        params.set('connection_limit', '2'); // Conservative limit for free tier
    }

    // Timeout settings to handle database cold starts
    if (!params.has('connect_timeout')) {
        params.set('connect_timeout', '60'); // 60 seconds for cold start
    }
    if (!params.has('pool_timeout')) {
        params.set('pool_timeout', '60');
    }
    if (!params.has('socket_timeout')) {
        params.set('socket_timeout', '60');
    }

    // SSL mode (required for Aiven)
    if (!params.has('ssl-mode') && !params.has('sslmode')) {
        params.set('ssl-mode', 'REQUIRED');
    }

    return url.toString();
}

const connectionUrl = buildConnectionUrl(getDatabaseUrl());

// Log connection info (sanitized)
if (process.env.NODE_ENV !== 'production') {
    const sanitized = connectionUrl.replace(/:([^:@]+)@/, ':****@');
    console.log('📊 Database Connection:', sanitized);
}

// Prisma Client configuration
const prismaConfig = {
    datasources: {
        db: {
            url: connectionUrl,
        },
    },
    log: process.env.NODE_ENV === 'production'
        ? ['error', 'warn']
        : ['query', 'info', 'warn', 'error'],
};

// Singleton pattern for Prisma Client (prevents connection exhaustion)
export const prisma =
    globalForPrisma.prisma ||
    new PrismaClient(prismaConfig);

if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = prisma;
}

// Graceful shutdown
if (typeof window === 'undefined') {
    process.on('beforeExit', async () => {
        await prisma.$disconnect();
    });
}

