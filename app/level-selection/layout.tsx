import { Metadata } from 'next'
import Header from '@/components/ui/header'

export const metadata: Metadata = {
  title: 'Level Selection',
  description: 'Select a level to play',
}

export default function LevelSelectionLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen ">
        <Header />
      <div className="container mx-auto px-4 py-8">
        {children}
      </div>
    </div>
  )
}