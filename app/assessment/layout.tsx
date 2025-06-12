import { ReactNode } from 'react'
import { Metadata } from 'next'
import Header from '@/components/ui/header'

export const metadata: Metadata = {
  title: 'Assessment',
  description: 'Assessment page for evaluating skills and knowledge',
}

interface AssessmentLayoutProps {
  children: ReactNode
}

export default function AssessmentLayout({ children }: AssessmentLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  )
}

