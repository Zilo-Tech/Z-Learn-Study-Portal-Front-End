# Deployment Configuration Guide

## NextAuth.js Production Issues - Solutions

### 1. Required Environment Variables

For NextAuth.js to work in production, you MUST set these environment variables:

#### Vercel/Netlify/Other hosting platforms:
```bash
NEXTAUTH_URL=https://your-production-domain.com
NEXTAUTH_SECRET=your-very-long-random-secret-key-here
NEXT_PUBLIC_API_URL=https://z-learn-study-portal-backend.onrender.com/api
```

#### Local Development:
```bash
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=any-secret-for-development
NEXT_PUBLIC_API_URL=https://z-learn-study-portal-backend.onrender.com/api
```

### 2. Generate NEXTAUTH_SECRET

Use one of these methods to generate a secure secret:

#### Method 1: OpenSSL
```bash
openssl rand -base64 32
```

#### Method 2: Node.js
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

#### Method 3: Online Generator
Use: https://generate-secret.vercel.app/32

### 3. Platform-Specific Setup

#### Vercel
1. Go to your project dashboard
2. Navigate to Settings → Environment Variables
3. Add the variables above
4. Redeploy your application

#### Netlify
1. Go to Site Settings → Environment Variables
2. Add the variables above
3. Trigger a new deploy

#### Railway/Render
1. Go to your app settings
2. Add environment variables
3. Redeploy

### 4. Common Deployment Issues & Solutions

#### Issue: "Server error - There is a problem with the server configuration"
**Cause:** Missing NEXTAUTH_SECRET or NEXTAUTH_URL
**Solution:** Add both environment variables and redeploy

#### Issue: Authentication callbacks failing
**Cause:** NEXTAUTH_URL doesn't match your production domain
**Solution:** Set NEXTAUTH_URL to exact production URL (https://yourdomain.com)

#### Issue: CORS errors with backend API
**Cause:** API_BASE_URL not set correctly
**Solution:** Verify NEXT_PUBLIC_API_URL matches your backend domain

### 5. Debugging Steps

1. Check deployment logs for specific error messages
2. Verify all environment variables are set correctly
3. Ensure NEXTAUTH_URL matches exactly (no trailing slash)
4. Test API endpoints directly
5. Check backend CORS settings

### 6. Security Notes

- Never commit secrets to version control
- Use different secrets for development and production
- Regenerate secrets if compromised
- Keep secrets long and random (32+ characters)

### 7. Testing After Deployment

1. Visit /api/auth/signin
2. Attempt to sign in
3. Check browser network tab for errors
4. Verify session cookies are set correctly
