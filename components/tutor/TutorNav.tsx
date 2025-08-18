"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  Home,
  User,
  BookOpen,
  Calendar,
  Users,
  ClipboardList,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  Clock,
  MessageSquare,
  DollarSign
} from 'lucide-react';

interface TutorNavProps {
  isMobileOpen: boolean;
  onMobileToggle: () => void;
}

const navigationItems = [
  {
    id: 'overview',
    name: 'Overview',
    href: '/tutor',
    icon: Home,
    description: 'Dashboard overview'
  },
  {
    id: 'profile',
    name: 'Profile',
    href: '/tutor/profile',
    icon: User,
    description: 'Manage your tutor profile'
  },
  {
    id: 'courses',
    name: 'My Courses',
    href: '/tutor/courses',
    icon: BookOpen,
    description: 'Courses you teach'
  },
  {
    id: 'assignments',
    name: 'Assignments',
    href: '/tutor/assignments',
    icon: ClipboardList,
    description: 'Student assignments'
  },
  {
    id: 'sessions',
    name: 'Sessions',
    href: '/tutor/sessions',
    icon: Calendar,
    description: 'Tutoring sessions'
  },
  {
    id: 'students',
    name: 'Students',
    href: '/tutor/students',
    icon: Users,
    description: 'Manage your students'
  },
  {
    id: 'availability',
    name: 'Availability',
    href: '/tutor/availability',
    icon: Clock,
    description: 'Set your schedule'
  },
  {
    id: 'analytics',
    name: 'Analytics',
    href: '/tutor/analytics',
    icon: BarChart3,
    description: 'Performance insights'
  },
  {
    id: 'earnings',
    name: 'Earnings',
    href: '/tutor/earnings',
    icon: DollarSign,
    description: 'Revenue and payments'
  },
  {
    id: 'messages',
    name: 'Messages',
    href: '/tutor/messages',
    icon: MessageSquare,
    description: 'Student communications'
  }
];

export default function TutorNav({ isMobileOpen, onMobileToggle }: TutorNavProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();

  return (
    <>
      {/* Desktop Sidebar */}
      <nav
        className={cn(
          "fixed left-0 top-16 h-[calc(100vh-4rem)] bg-white border-r border-gray-200 transition-all duration-300 z-40 hidden lg:block",
          isCollapsed ? "w-20" : "w-72"
        )}
      >
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-emerald-50 to-green-50 border-b border-emerald-100">
          <div className="flex items-center justify-between">
            {!isCollapsed && (
              <div className="flex items-center space-x-2">
                <GraduationCap className="h-6 w-6 text-emerald-600" />
                <h2 className="text-lg font-semibold text-emerald-800">Tutor Hub</h2>
              </div>
            )}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-1.5 rounded-lg hover:bg-emerald-100 text-emerald-600 transition-colors"
            >
              {isCollapsed ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <ChevronLeft className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>

        {/* Navigation Items */}
        <div className="p-4 space-y-2 overflow-y-auto h-[calc(100%-5rem)]">
          {navigationItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.id}
                href={item.href}
                className={cn(
                  "flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all duration-200 group",
                  isActive
                    ? "bg-emerald-100 text-emerald-700 shadow-sm"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                )}
                title={isCollapsed ? item.name : undefined}
              >
                <Icon className={cn(
                  "h-5 w-5 flex-shrink-0",
                  isActive ? "text-emerald-600" : "text-gray-500 group-hover:text-gray-700"
                )} />
                {!isCollapsed && (
                  <div>
                    <span className="font-medium">{item.name}</span>
                    <p className="text-xs text-gray-500 mt-0.5">{item.description}</p>
                  </div>
                )}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Mobile Sidebar */}
      <div
        className={cn(
          "fixed inset-0 z-50 lg:hidden",
          isMobileOpen ? "block" : "hidden"
        )}
      >
        <div className="fixed inset-0 bg-black/20" onClick={onMobileToggle} />
        <nav className="fixed left-0 top-0 h-full w-72 bg-white shadow-xl transform transition-transform duration-300">
          {/* Mobile Header */}
          <div className="p-4 bg-gradient-to-r from-emerald-50 to-green-50 border-b border-emerald-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <GraduationCap className="h-6 w-6 text-emerald-600" />
                <h2 className="text-lg font-semibold text-emerald-800">Tutor Hub</h2>
              </div>
              <button
                onClick={onMobileToggle}
                className="p-1.5 rounded-lg hover:bg-emerald-100 text-emerald-600"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Mobile Navigation Items */}
          <div className="p-4 space-y-2 overflow-y-auto h-[calc(100%-5rem)]">
            {navigationItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;

              return (
                <Link
                  key={item.id}
                  href={item.href}
                  onClick={onMobileToggle}
                  className={cn(
                    "flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all duration-200",
                    isActive
                      ? "bg-emerald-100 text-emerald-700 shadow-sm"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  )}
                >
                  <Icon className={cn(
                    "h-5 w-5 flex-shrink-0",
                    isActive ? "text-emerald-600" : "text-gray-500"
                  )} />
                  <div>
                    <span className="font-medium">{item.name}</span>
                    <p className="text-xs text-gray-500 mt-0.5">{item.description}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </nav>
      </div>
    </>
  );
}