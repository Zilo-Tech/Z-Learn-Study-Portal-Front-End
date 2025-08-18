"use client";

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { 
  ChevronLeft, 
  ChevronRight,
  Users,
  Calendar,
  HelpCircle,
  FileText,
  Code,
  UserPlus,
  Trophy,
  UserCheck,
  Zap,
  GraduationCap,
  Home
} from 'lucide-react';

interface NavItem {
  name: string;
  href: string;
  icon: React.ElementType;
  description?: string;
}

const navItems: NavItem[] = [
  { name: 'Community Home', href: '/community', icon: Home, description: 'Feed & Groups' },
  { name: 'Events', href: '/community/events', icon: Calendar, description: 'Community events' },
  { name: 'Q&A', href: '/community/qa', icon: HelpCircle, description: 'Ask questions' },
  { name: 'Resources', href: '/community/resources', icon: FileText, description: 'Shared resources' },
  { name: 'Projects', href: '/community/projects', icon: Code, description: 'Project showcase' },
  { name: 'Mentorship', href: '/community/mentorship', icon: UserPlus, description: 'Find mentors' },
  { name: 'Challenges', href: '/community/challenges', icon: Trophy, description: 'Learning challenges' },
  { name: 'Study Buddy', href: '/community/study-buddy', icon: UserCheck, description: 'Find study partners' },
  { name: 'Streaks', href: '/community/streaks', icon: Zap, description: 'Track your streak' },
  { name: 'Tutoring', href: '/community/tutoring', icon: GraduationCap, description: 'Tutoring sessions' },
];

interface CommunityNavProps {
  isMobileOpen?: boolean;
  onMobileToggle?: () => void;
}

export default function CommunityNav({ isMobileOpen = false, onMobileToggle }: CommunityNavProps = {}) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/community') {
      return pathname === '/community';
    }
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={onMobileToggle}
        />
      )}
      
      <aside className={cn(
        "fixed left-0 top-0 h-full bg-white border-r border-gray-200 shadow-lg z-40 transition-all duration-300",
        // Mobile behavior
        "lg:block",
        isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        isCollapsed ? "w-20" : "w-72"
      )}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-emerald-50 to-green-50">
        {!isCollapsed && (
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-green-600 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Community</h2>
              <p className="text-xs text-gray-600">Connect & Learn</p>
            </div>
          </div>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 rounded-lg hover:bg-emerald-100 transition-colors"
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? (
            <ChevronRight className="w-5 h-5 text-emerald-600" />
          ) : (
            <ChevronLeft className="w-5 h-5 text-emerald-600" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-2 h-[calc(100%-80px)] overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center space-x-3 px-3 py-3 rounded-xl transition-all duration-200 group relative",
                active
                  ? "bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-700 shadow-sm border border-emerald-200"
                  : "text-gray-600 hover:bg-emerald-50 hover:text-emerald-700"
              )}
            >
              <div className={cn(
                "flex items-center justify-center w-8 h-8 rounded-lg transition-colors",
                active 
                  ? "bg-emerald-500 text-white shadow-sm" 
                  : "text-gray-500 group-hover:text-emerald-600 group-hover:bg-emerald-100"
              )}>
                <Icon className="w-4 h-4" />
              </div>
              
              {!isCollapsed && (
                <div className="flex-1 min-w-0">
                  <div className={cn(
                    "font-medium text-sm truncate",
                    active ? "text-emerald-800" : "text-gray-700 group-hover:text-emerald-800"
                  )}>
                    {item.name}
                  </div>
                  {item.description && (
                    <div className={cn(
                      "text-xs truncate mt-0.5",
                      active ? "text-emerald-600" : "text-gray-500 group-hover:text-emerald-600"
                    )}>
                      {item.description}
                    </div>
                  )}
                </div>
              )}
              
              {/* Active indicator */}
              {active && (
                <div className="absolute right-2 w-2 h-2 bg-emerald-500 rounded-full" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Tooltip for collapsed state */}
      {isCollapsed && (
        <div className="absolute top-20 left-20 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          {/* Tooltips would be handled by each nav item individually */}
        </div>
      )}
    </aside>
    </>
  );
}