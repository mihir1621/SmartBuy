import twilio from 'twilio';
import crypto from 'crypto';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const serviceSid = process.env.TWILIO_SERVICE_SID; // Optional if using Verify Service
const client = accountSid && authToken ? twilio(accountSid, authToken) : null;

const SECRET_KEY = process.env.OTP_SECRET || 'complex-secret-key-change-me';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { phone } = req.body;

        // Generate a 4 digit code
        let otp = Math.floor(1000 + Math.random() * 9000).toString();

        const cleanPhone = phone ? phone.trim() : '';

        // Hardcoded OTP for demo admin/seller
        if (cleanPhone === '9999999999' || cleanPhone === '8888888888') otp = '1234';

        // Create a hash to verify this later (Phone + OTP + Secret + Expiry)
        // Expiry = 5 minutes
        const ttl = 5 * 60 * 1000;
        const expires = Date.now() + ttl;
        const data = `${phone}.${otp}.${expires}`;
        const hash = crypto.createHmac('sha256', SECRET_KEY).update(data).digest('hex');
        const fullHash = `${hash}.${expires}`;

        try {
            // Bypass Twilio for demo admin or if no client configured
            if (client && cleanPhone !== '9999999999' && cleanPhone !== '8888888888') {
                // Send Real SMS
                await client.messages.create({
                    body: `Your SmartBuy Login OTP is: ${otp}`,
                    from: process.env.TWILIO_PHONE_NUMBER,
                    to: cleanPhone
                });
                console.log(`Sent Real OTP ${otp} to ${cleanPhone}`);
            } else {
                // Mock SMS (Log to console)
                console.log('==================================================');
                console.log(`[DEV MODE] OTP for ${phone} is: ${otp}`);
                console.log('==================================================');
            }

            res.status(200).json({ success: true, hash: fullHash, message: "OTP sent successfully" });
        } catch (error) {
            console.error("Twilio Error (Falling back to Mock OTP):", error.message);
            // Fallback: If SMS fails, logging it to console so user can still continue
            console.log('==================================================');
            console.log(`[FALLBACK] OTP for ${phone} is: ${otp}`);
            console.log('==================================================');

            res.status(200).json({ success: true, hash: fullHash, message: "OTP sent (fallback mode)" });
        }
    } else {
        res.status(405).json({ message: 'Method not allowed' });
    }
}
