import { AuthOptions, DefaultSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { login } from "@/app/services/auth";

declare module "next-auth" {
  interface Session extends DefaultSession {
    accessToken?: string;
    refreshToken?: string;
    user: {
      id: string;
      full_name?: string;
      avatar?: string;
      bio?: string;
      is_instructor?: boolean;
      is_student?: boolean;
      courses_enrolled?: number;
      courses_completed?: number;
      achievements?: number;
    } & DefaultSession["user"]
  }

  interface User {
    accessToken?: string;
    refreshToken?: string;
    full_name?: string;
    avatar?: string;
    bio?: string;
    is_instructor?: boolean;
    is_student?: boolean;
    courses_enrolled?: number;
    courses_completed?: number;
    achievements?: number;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
    refreshToken?: string;
    id?: string;
    full_name?: string;
    avatar?: string;
    bio?: string;
    is_instructor?: boolean;
    is_student?: boolean;
    courses_enrolled?: number;
    courses_completed?: number;
    achievements?: number;
  }
}

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            throw new Error("Email and password are required");
          }

          const response = await login({
            email: credentials.email,
            password: credentials.password,
          });

          if (response.access) {
            // The backend now returns user data directly in the login response
            const userData = response.user;
            
            return {
              id: userData.id?.toString() || credentials.email,
              email: userData.email || credentials.email,
              name: userData.first_name && userData.last_name 
                ? `${userData.first_name} ${userData.last_name}` 
                : userData.username || credentials.email,
              full_name: userData.first_name && userData.last_name 
                ? `${userData.first_name} ${userData.last_name}` 
                : userData.username,
              // Set defaults for fields we'll implement later
              avatar: undefined,
              bio: undefined,
              is_instructor: userData.is_staff || false,
              is_student: !userData.is_staff || true,
              courses_enrolled: 0,
              courses_completed: 0,
              achievements: 0,
              accessToken: response.access,
              refreshToken: response.refresh
            };
          }
          
          return null;
        } catch (error) {
          console.error('Auth error:', error);
          throw new Error(error instanceof Error ? error.message : "Authentication failed");
        }
      }
    })
  ],
  pages: {
    signIn: '/auth/signin',
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
        token.id = user.id;
        token.full_name = user.full_name;
        token.avatar = user.avatar;
        token.bio = user.bio;
        token.is_instructor = user.is_instructor;
        token.is_student = user.is_student;
        token.courses_enrolled = user.courses_enrolled;
        token.courses_completed = user.courses_completed;
        token.achievements = user.achievements;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.accessToken = token.accessToken as string;
        session.refreshToken = token.refreshToken as string;
        session.user.id = token.id as string;
        session.user.full_name = token.full_name as string;
        session.user.avatar = token.avatar as string;
        session.user.bio = token.bio as string;
        session.user.is_instructor = token.is_instructor as boolean;
        session.user.is_student = token.is_student as boolean;
        session.user.courses_enrolled = token.courses_enrolled as number;
        session.user.courses_completed = token.courses_completed as number;
        session.user.achievements = token.achievements as number;
      }
      return session;
    },
  },
  // Add essential environment variables for production
  secret: process.env.NEXTAUTH_SECRET || 'fallback-secret-key-change-in-production',
  debug: process.env.NODE_ENV === 'development',
  // Add error handling for better debugging
  logger: {
    error(code, metadata) {
      console.error('[NextAuth Error]', code, metadata);
    },
    warn(code) {
      console.warn('[NextAuth Warning]', code);
    },
    debug(code, metadata) {
      if (process.env.NODE_ENV === 'development') {
        console.debug('[NextAuth Debug]', code, metadata);
      }
    }
  }
};