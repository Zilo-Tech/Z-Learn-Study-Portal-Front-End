import "@/app/globals.css";



import { ReactNode } from "react";
import { Metadata } from "next";
import Header from "@/components/ui/header";

// app/signin/metadata.ts or wherever you define metadata
export const metadata: Metadata = {
  title: 'Courses | Z-Learn',
  description: 'Explore our curated collection of AI-powered courses. Learn from experts and level up your skills with Z-Learn.',
  keywords: 'AI courses, online learning, skill development, personalized education',
  authors: [{ name: 'Z-Learn' }],
  creator: 'Z-Learn',
  openGraph: {
    title: 'Courses | Z-Learn',
    description: 'Explore our curated collection of AI-powered courses. Learn from experts and level up your skills with Z-Learn.',
    type: 'website',
    url: 'https://yourdomain.com/courses',
  },
};

export default function CoursesLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div>
        <Header />
        {children}
      </div>
    </div>
  );
}

