# SmartBuy - Production Deployment Guide

## Overview
This guide provides step-by-step instructions for deploying SmartBuy to production (Vercel) with proper Firebase Authentication and Aiven MySQL database configuration.

---

## Prerequisites

1. **Vercel Account** - Sign up at [vercel.com](https://vercel.com)
2. **Firebase Project** - Create at [console.firebase.google.com](https://console.firebase.google.com)
3. **Aiven MySQL Database** - Set up at [console.aiven.io](https://console.aiven.io)
4. **Razorpay Account** - Register at [razorpay.com](https://razorpay.com)

---

## Part 1: Firebase Configuration

### 1.1 Enable Authentication Methods
1. Go to **Firebase Console** → Your Project → **Authentication**
2. Click **Sign-in method** tab
3. Enable:
   - **Email/Password**
   - **Google** (configure OAuth consent screen)

### 1.2 Configure Authorized Domains
**CRITICAL**: This step prevents `auth/unauthorized-domain` errors.

1. Go to **Authentication** → **Settings** tab
2. Scroll to **Authorized domains**
3. Add these domains:
   ```
   localhost
   your-project-name.vercel.app
   *.vercel.app (for preview deployments - use with caution)
   ```

**Important**: Every time Vercel creates a new preview URL (e.g., `smart-abc123-yourname.vercel.app`), you must add it to this list OR use your main production URL for testing.

### 1.3 Get Firebase Configuration
1. Go to **Project Settings** → **General**
2. Scroll to **Your apps** → **Web app**
3. Copy the configuration values:
   - API Key
   - Auth Domain
   - Project ID
   - Storage Bucket
   - Messaging Sender ID
   - App ID

---

## Part 2: Aiven MySQL Database Setup

### 2.1 Create Database Service
1. Log in to [Aiven Console](https://console.aiven.io)
2. Create a new **MySQL** service
3. Choose **Free Plan** (if available) or smallest paid plan
4. Select a region close to your Vercel deployment region

### 2.2 Get Connection String
1. Go to your MySQL service → **Overview**
2. Find **Connection Information**
3. Copy the **MySQL URI** (format: `mysql://username:password@host:port/database`)
4. Ensure it includes `?ssl-mode=REQUIRED` at the end

**Example**:
```
mysql://avnadmin:PASSWORD@smartbuy-project.aivencloud.com:25694/defaultdb?ssl-mode=REQUIRED
```

### 2.3 Initialize Database Schema
Run Prisma migrations:
```bash
npx prisma migrate deploy
```

---

## Part 3: Vercel Deployment

### 3.1 Connect Repository
1. Log in to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **Add New** → **Project**
3. Import your GitHub repository
4. Configure build settings:
   - **Framework Preset**: Next.js
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`

### 3.2 Configure Environment Variables
**CRITICAL**: Add these in Vercel Dashboard → Project Settings → Environment Variables

#### Required Variables:

```bash
# Database
DATABASE_URL="mysql://avnadmin:PASSWORD@host:port/defaultdb?ssl-mode=REQUIRED"

# NextAuth
NEXTAUTH_URL="https://your-project.vercel.app"
NEXTAUTH_SECRET="generate-a-random-secret-here"

# Firebase (Public - safe to expose)
NEXT_PUBLIC_FIREBASE_API_KEY="your-api-key"
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="your-project.firebaseapp.com"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="your-project-id"
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="your-project.firebasestorage.app"
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="your-sender-id"
NEXT_PUBLIC_FIREBASE_APP_ID="your-app-id"

# Razorpay
RAZORPAY_KEY_ID="rzp_live_xxxxx"
RAZORPAY_KEY_SECRET="your-secret-key"
NEXT_PUBLIC_RAZORPAY_KEY_ID="rzp_live_xxxxx"
RAZORPAY_WEBHOOK_SECRET="your-webhook-secret"

# Google OAuth (Optional)
GOOGLE_CLIENT_ID="your-client-id"
GOOGLE_CLIENT_SECRET="your-client-secret"
```

**Important Notes**:
- Set environment for: **Production**, **Preview**, and **Development**
- Use **live** Razorpay keys for production
- Generate `NEXTAUTH_SECRET` using: `openssl rand -base64 32`

### 3.3 Deploy
1. Click **Deploy**
2. Wait for build to complete
3. Note your deployment URL (e.g., `https://smart-buy.vercel.app`)

---

## Part 4: Post-Deployment Configuration

### 4.1 Update Firebase Authorized Domains
1. Go back to **Firebase Console** → **Authentication** → **Settings**
2. Add your Vercel production URL:
   ```
   smart-buy.vercel.app
   ```

### 4.2 Configure Razorpay Webhook
1. Log in to **Razorpay Dashboard**
2. Go to **Settings** → **Webhooks**
3. Add webhook URL:
   ```
   https://your-project.vercel.app/api/payment/webhook
   ```
4. Select events:
   - `payment.captured`
   - `payment.failed`
5. Copy the **Webhook Secret** and add it to Vercel environment variables

### 4.3 Test the Deployment
1. Visit your production URL
2. Test user registration and login
3. Test product browsing
4. Test order creation (use Razorpay test mode first)
5. Verify payment webhook processing

---

## Part 5: Troubleshooting

### Issue: `auth/unauthorized-domain`
**Solution**:
1. Check the exact domain in the error message
2. Add it to Firebase Console → Authentication → Settings → Authorized domains
3. Wait 2 minutes for changes to propagate

### Issue: `Can't reach database server`
**Causes**:
- Aiven free-tier database is sleeping (wakes up in 10-30 seconds)
- Connection limit exceeded
- Incorrect DATABASE_URL

**Solutions**:
1. Verify `DATABASE_URL` in Vercel environment variables
2. Check Aiven service status (should be "Running")
3. Wait for database to wake up (first request after sleep is slow)
4. Verify connection parameters include timeouts:
   ```
   ?ssl-mode=REQUIRED&connect_timeout=60&pool_timeout=60
   ```

### Issue: Payment webhook not working
**Solutions**:
1. Verify `RAZORPAY_WEBHOOK_SECRET` is set in Vercel
2. Check webhook URL in Razorpay dashboard matches your deployment
3. Review Vercel function logs for errors
4. Ensure webhook signature validation is working

### Issue: Slow database queries
**Expected Behavior**: 
- Free-tier Aiven databases sleep after 30 minutes of inactivity
- First request after sleep takes 10-30 seconds
- Subsequent requests are fast

**Solutions**:
- Upgrade to paid Aiven plan (always-on)
- Accept the cold-start delay
- Implement application-level caching

---

## Part 6: Monitoring and Maintenance

### 6.1 Monitor Vercel Logs
1. Go to Vercel Dashboard → Your Project → **Logs**
2. Filter by **Errors** to identify issues
3. Check function execution times

### 6.2 Monitor Database
1. Go to Aiven Console → Your Service → **Metrics**
2. Watch connection count (should stay under limit)
3. Monitor query performance

### 6.3 Regular Maintenance
- Review and rotate API keys quarterly
- Update dependencies monthly
- Monitor error rates in production
- Backup database regularly (Aiven provides automatic backups)

---

## Part 7: Security Best Practices

1. **Never commit `.env.local`** to version control
2. **Use environment variables** for all secrets
3. **Rotate credentials** regularly
4. **Enable 2FA** on all service accounts (Vercel, Firebase, Aiven)
5. **Monitor authentication logs** for suspicious activity
6. **Use HTTPS only** (Vercel provides this automatically)
7. **Validate webhook signatures** (already implemented)

---

## Support

For issues specific to:
- **Vercel**: [vercel.com/support](https://vercel.com/support)
- **Firebase**: [firebase.google.com/support](https://firebase.google.com/support)
- **Aiven**: [help.aiven.io](https://help.aiven.io)
- **Razorpay**: [razorpay.com/support](https://razorpay.com/support)

---

## Quick Reference: Environment Variables Checklist

- [ ] DATABASE_URL
- [ ] NEXTAUTH_URL
- [ ] NEXTAUTH_SECRET
- [ ] NEXT_PUBLIC_FIREBASE_API_KEY
- [ ] NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
- [ ] NEXT_PUBLIC_FIREBASE_PROJECT_ID
- [ ] NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
- [ ] NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
- [ ] NEXT_PUBLIC_FIREBASE_APP_ID
- [ ] RAZORPAY_KEY_ID
- [ ] RAZORPAY_KEY_SECRET
- [ ] NEXT_PUBLIC_RAZORPAY_KEY_ID
- [ ] RAZORPAY_WEBHOOK_SECRET
- [ ] GOOGLE_CLIENT_ID (if using Google OAuth)
- [ ] GOOGLE_CLIENT_SECRET (if using Google OAuth)

---

**Last Updated**: February 2026
