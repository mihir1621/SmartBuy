import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import crypto from 'crypto';

const SECRET_KEY = process.env.OTP_SECRET || 'complex-secret-key-change-me';

export const authOptions = {
    // Configure one or more authentication providers
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),
        CredentialsProvider({
            name: "Mobile Login",
            credentials: {
                phone: { label: "Phone", type: "text" },
                otp: { label: "OTP", type: "text" },
                hash: { label: "Hash", type: "text" }
            },
            async authorize(credentials, req) {
                const { phone, otp, hash } = credentials;

                if (!phone || !otp || !hash) return null;

                const [hashValue, expires] = hash.split('.');

                // Check expiry
                if (Date.now() > parseInt(expires)) {
                    throw new Error("OTP Expired");
                }

                // Verify Hash
                const data = `${phone}.${otp}.${expires}`;
                const calculatedHash = crypto.createHmac('sha256', SECRET_KEY).update(data).digest('hex');

                if (calculatedHash === hashValue) {
                    // Hardcoded admin for initial setup - replace with DB check later
                    const role = phone === '9999999999' ? 'ADMIN' : 'USER';
                    return {
                        id: phone,
                        name: "SmartBuy User",
                        email: phone,
                        image: null,
                        role: role
                    };
                } else {
                    return null;
                }
            }
        })
    ],
    pages: {
        signIn: '/login', // Custom login page
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.role = user.role || 'USER'; // Default to USER
            }
            return token;
        },
        async session({ session, token }) {
            if (token && session.user) {
                session.user.id = token.id;
                session.user.role = token.role;
            }
            return session;
        }
    }
}

export default NextAuth(authOptions)
