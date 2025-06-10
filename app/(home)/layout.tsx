import type { Metadata } from 'next';
import '../globals.css';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/sonner';
import { AIAssistant } from './components/ai/assistant';
import Footer from '@/components/footer';

// Poppins - Used by Coursera, Udemy, and many modern learning platforms

// Source Sans Pro - Used by Khan Academy, Cisco Learning, and edX
// Excellent for body text and long-form content


export const metadata: Metadata = {
  title: 'Z-Learn | AI-Powered Learning',
  description: 'Personalized learning with AI tutoring - Transform your skills with cutting-edge education',
  keywords: 'AI learning, online education, personalized tutoring, skill development',
  authors: [{ name: 'Z-Learn' }],
  creator: 'Z-Learn',
  openGraph: {
    title: 'Z-Learn | AI-Powered Learning',
    description: 'Transform your skills with AI-driven personalized education',
    type: 'website',
  },
};

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div lang="en" suppressHydrationWarning>
      <div className={cn(
        "min-h-screen bg-background antialiased",
        "font-source-sans", // Source Sans as default body font
        "container mx-auto border shadow",
        
      )}>
        <main className="flex-1">
          {children}
          <AIAssistant />
        </main>
        <Footer />
        <Toaster richColors />
      </div>
    </div>
  );
}