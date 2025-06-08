import "@/app/globals.css";



import { ReactNode } from "react";
import { Metadata } from "next";

// app/signin/metadata.ts or wherever you define metadata
export const metadata: Metadata = {
  title: 'Sign In | Z-Learn',
  description: 'Access your personalized AI-powered learning dashboard. Sign in to Z-Learn to continue your skill development journey.',
  keywords: 'Z-Learn sign in, AI learning login, personalized education access',
  authors: [{ name: 'Z-Learn' }],
  creator: 'Z-Learn',
  openGraph: {
    title: 'Sign In | Z-Learn',
    description: 'Sign in to access personalized AI learning with Z-Learn.',
    type: 'website',
    url: 'https://yourdomain.com/signin',
  },
};


export default function SignUp({ children }: { children: ReactNode }) {
  return (
      <div
        
      >
        <div>
        {children}
        </div>
      </div>
  );
}
