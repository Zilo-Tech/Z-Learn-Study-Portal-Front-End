import { AuthOptions, DefaultSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { login } from "@/app/services/auth";

declare module "next-auth" {
  interface Session extends DefaultSession {
    accessToken?: string;
    refreshToken?: string;
    user: {
      id: string;
    } & DefaultSession["user"]
  }

  interface User {
    accessToken?: string;
    refreshToken?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
    refreshToken?: string;
    id?: string;
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
            // Decode the JWT token to get user information
            const tokenPayload = JSON.parse(atob(response.access.split('.')[1]));
            
            return {
              id: tokenPayload.user_id?.toString() || credentials.email,
              email: credentials.email,
              name: tokenPayload.name || credentials.email,
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
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.accessToken = token.accessToken as string;
        session.refreshToken = token.refreshToken as string;
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  debug: process.env.NODE_ENV === 'development',
};