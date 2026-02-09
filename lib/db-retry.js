/**
 * Database Retry Utility
 * Handles transient connection failures for Aiven free-tier databases
 * Implements exponential backoff with jitter
 */

const DEFAULT_RETRIES = 5;
const BASE_DELAY_MS = 1000;
const MAX_DELAY_MS = 30000;

/**
 * Execute a database operation with automatic retry logic
 * @param {Function} operation - Async function to execute
 * @param {Object} options - Configuration options
 * @param {number} options.retries - Number of retry attempts (default: 5)
 * @param {string} options.operationName - Name for logging purposes
 * @returns {Promise} Result of the operation
 */
export async function withRetry(operation, options = {}) {
    const {
        retries = DEFAULT_RETRIES,
        operationName = 'Database Operation'
    } = options;

    let lastError;

    for (let attempt = 0; attempt < retries; attempt++) {
        try {
            return await operation();
        } catch (error) {
            lastError = error;

            // Don't retry on non-transient errors
            if (isNonRetriableError(error)) {
                throw error;
            }

            // Last attempt - throw the error
            if (attempt === retries - 1) {
                console.error(`[DB Retry] ${operationName} failed after ${retries} attempts:`, error.message);
                throw error;
            }

            // Calculate delay with exponential backoff and jitter
            const baseDelay = Math.min(BASE_DELAY_MS * Math.pow(2, attempt), MAX_DELAY_MS);
            const jitter = Math.random() * 0.3 * baseDelay; // 0-30% jitter
            const delay = Math.floor(baseDelay + jitter);

            console.warn(
                `[DB Retry] ${operationName} attempt ${attempt + 1}/${retries} failed. ` +
                `Retrying in ${delay}ms... Error: ${error.message}`
            );

            await sleep(delay);
        }
    }

    throw lastError;
}

/**
 * Determine if an error should not be retried
 * @param {Error} error - The error to check
 * @returns {boolean} True if error is non-retriable
 */
function isNonRetriableError(error) {
    const nonRetriableCodes = [
        'P2002', // Unique constraint violation
        'P2003', // Foreign key constraint violation
        'P2025', // Record not found
        'P2014', // Required relation violation
    ];

    // Prisma error codes
    if (error.code && nonRetriableCodes.includes(error.code)) {
        return true;
    }

    // Application-level validation errors
    if (error.message && error.message.includes('Validation failed')) {
        return true;
    }

    return false;
}

/**
 * Sleep utility
 * @param {number} ms - Milliseconds to sleep
 * @returns {Promise} Promise that resolves after delay
 */
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Wrapper for Prisma transactions with retry logic
 * @param {Object} prisma - Prisma client instance
 * @param {Function} transactionFn - Transaction function
 * @param {Object} options - Transaction and retry options
 * @returns {Promise} Transaction result
 */
export async function withRetryTransaction(prisma, transactionFn, options = {}) {
    const {
        timeout = 30000,
        maxWait = 5000,
        retries = 3,
        operationName = 'Transaction'
    } = options;

    return withRetry(
        () => prisma.$transaction(transactionFn, {
            timeout,
            maxWait
        }),
        { retries, operationName }
    );
}
