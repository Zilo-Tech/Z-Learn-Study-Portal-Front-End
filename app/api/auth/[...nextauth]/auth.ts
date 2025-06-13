import { AuthOptions, DefaultSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { login } from "@/app/services/auth";

declare module "next-auth" {
  interface Session extends DefaultSession {
    accessToken?: string;
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
            console.error('Missing credentials');
            throw new Error("Email and password are required");
          }

          console.log('Attempting to authorize with credentials:', { email: credentials.email });
          
          const response = await login({
            email: credentials.email,
            password: credentials.password,
          });

          console.log('Login response received:', { 
            hasAccessToken: !!response.access,
            hasRefreshToken: !!response.refresh
          });

          if (response.access) {
            // Decode the JWT token to get user information
            const tokenPayload = JSON.parse(atob(response.access.split('.')[1]));
            
            return {
              id: tokenPayload.user_id.toString(),
              email: credentials.email,
              name: tokenPayload.name || credentials.email,
              accessToken: response.access,
              refreshToken: response.refresh
            };
          }
          
          console.error('No access token in response');
          return null;
        } catch (error) {
          console.error('Auth error in authorize callback:', error);
          throw error;
        }
      }
    })
  ],
  pages: {
    signIn: '/auth/signin',
  },
  session: {
    strategy: "jwt" as const,
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async redirect({ url, baseUrl }: { url: string; baseUrl: string }) {
      console.log('Redirect callback:', { url, baseUrl });
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
    async jwt({ token, user }) {
      if (user) {
        console.log('JWT callback - user data:', { 
          userId: user.id,
          userEmail: user.email
        });
        token.accessToken = user.accessToken;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        console.log('Session callback - token data:', { 
          tokenId: token.id,
          hasAccessToken: !!token.accessToken
        });
        session.accessToken = token.accessToken as string;
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  debug: true, // Enable debug messages
}; 