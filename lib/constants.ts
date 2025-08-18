export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://z-learn-study-portal-backend.onrender.com/api';

// Numeric ContentType IDs required by the reactions API
// Configure via env for your backend; these defaults are placeholders.
export const FEED_POST_CONTENT_TYPE_ID = Number(process.env.NEXT_PUBLIC_CT_FEEDPOST_ID || 25);
export const THREAD_POST_CONTENT_TYPE_ID = Number(process.env.NEXT_PUBLIC_CT_THREADPOST_ID || 26);
