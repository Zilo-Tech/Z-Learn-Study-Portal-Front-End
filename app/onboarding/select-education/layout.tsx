import "@/app/globals.css";
import Header from "@/components/ui/header";
import type { Metadata } from 'next';



import { ReactNode } from "react";
// app/signin/metadata.ts or wherever you define metadata
export const metadata: Metadata = {
  title: 'What’s Your Highest Qualification? | Z-Learn',
  authors: [{ name: 'Z-Learn' }],
  creator: 'Z-Learn',
};


export default function SignIn({ children }: { children: ReactNode }) {
  return (
      <div
        className="container border min-h-screen mx-auto shadow"
      > 
      <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {children}
        </div>
      </div>
  );
}
