# Z-Learn Study Portal - Frontend

## 🚀 Current Status

### ✅ Completed Features
1. **Enhanced Authentication System**
   - NextAuth.js with backend integration
   - Rich user session data (id, username, email, full_name, is_staff)
   - Professional UserMenu with gradient profile sidebar
   - Conditional rendering of auth components

2. **Course Management**
   - Dynamic course details pages (converted to client components)
   - Interactive modules and lessons
   - Real API integration with centralized configuration

3. **AI Learning Assistant**
   - AgentChatBox component with authentication
   - Context-aware chat with lesson content
   - Quick actions (Ask, Summarize, Quiz)

4. **UI/UX Improvements**
   - Brand colors applied consistently (#446d6d, #002424)
   - Responsive design with modern gradients
   - Professional loading states and error handling

### 🔧 Recent Fixes
- **Session Provider Issue**: Converted course details page from server to client component
- **API Centralization**: Created centralized API configuration with environment variables
- **Authentication Deployment**: Added proper NextAuth.js production configuration

## 🚨 Production Deployment Issue

### Problem
Getting "Server error - There is a problem with the server configuration" when signing in on deployed site.

### Root Cause
Missing required NextAuth.js environment variables in production.

### Solution
Set these environment variables in your hosting platform:

```bash
NEXTAUTH_URL=https://your-production-domain.com
NEXTAUTH_SECRET=your-long-random-secret-key
NEXT_PUBLIC_API_URL=https://z-learn-study-portal-backend.onrender.com/api
```

### Generate Secret Key
```bash
openssl rand -base64 32
```

## 📁 Key Files Modified

### Authentication
- `/app/api/auth/[...nextauth]/auth.ts` - Enhanced with production config
- `/app/services/auth.ts` - Centralized API URL
- `/components/user-menu.tsx` - Professional user interface
- `/components/auth-buttons.tsx` - Modern auth buttons

### Pages (Client Components)
- `/app/courses/[courseId]/page.tsx` - Course details with session access
- `/app/courses/[courseId]/modules/page.tsx` - Modules overview
- `/app/courses/[courseId]/modules/[moduleId]/lessons/[lessonId]/page.tsx` - Interactive lessons

### API Integration
- `/lib/constants.ts` - Centralized API configuration
- `/lib/api.ts` - Axios instance with environment variables
- `/components/agent-chat/AgentChatBox.tsx` - AI chat with authentication

## 🎨 Brand Colors
- Primary: `#446d6d`
- Secondary: `#002424`
- Applied to gradients, buttons, focus states, and accents

## 🔄 Session Management
- Root layout with SessionProvider
- Consistent session access across all client components
- UserMenu shows when logged in, AuthButtons when logged out
- No duplicate authentication buttons

## 📋 Deployment Checklist

1. ✅ Set `NEXTAUTH_URL` to your production domain
2. ✅ Generate and set `NEXTAUTH_SECRET`
3. ✅ Set `NEXT_PUBLIC_API_URL` if using different backend
4. ✅ Verify backend CORS settings allow your domain
5. ✅ Test authentication flow after deployment

## 🚀 Quick Start

### Development
```bash
npm install
npm run dev
```

### Environment Setup
Copy `.env.example` to `.env.local` and configure:
```bash
cp .env.example .env.local
```

### Production Build
```bash
npm run build
npm start
```

## 📖 Documentation
- See `DEPLOYMENT.md` for detailed deployment guide
- Check `.env.example` for required environment variables
- Review component documentation in respective folders

## 🐛 Troubleshooting

### Authentication Issues
1. Check environment variables are set correctly
2. Verify NEXTAUTH_URL matches your domain exactly
3. Ensure NEXTAUTH_SECRET is long and random
4. Check deployment logs for specific errors

### API Issues
1. Verify NEXT_PUBLIC_API_URL is correct
2. Check backend API is accessible
3. Confirm CORS settings on backend
4. Test API endpoints directly

## 🔧 Development Notes
- All course-related pages are client components for session access
- API calls use centralized configuration from `lib/constants.ts`
- Brand colors are consistently applied across all components
- Session state is managed at root level with no duplicates
