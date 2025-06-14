'use client';

import { useSession, signOut } from "next-auth/react";
import { useState } from "react";
import { 
  User, 
  LogOut, 
  ChevronRight, 
  LayoutDashboard,
  BookOpen,
} from "lucide-react";

const UserMenu = () => {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);

  if (!session) return null;

  return (
    <div className="relative">
      {/* User Profile Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
      >
        <div className="p-2 rounded-lg border-2 transition-colors">
        <User className="h-5 w-5" />
        </div>  
        <span className="font-medium text-gray-700 w-[70px] truncate hidden md:block">
          {session.user?.name || session.user?.email}
        </span>
      </button>

      {/* Profile Sidebar */}
      <div className={`fixed top-0 right-0 h-full bg-white shadow-xl z-50 w-80 transition-all duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        {/* Header */}
        <div className=" p-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="px-5 py-3 rounded-full bg-white flex items-center justify-center border-2 font-bold">
              {session.user?.name?.charAt(0) || session.user?.email?.charAt(0) || 'U'}
            </div>
            <div>
              <div className="font-bold">{session.user?.name || session.user?.email}</div>
              <div className="text-sm text-gray-900">Student at Z-Learn</div>
            </div>
          </div>
          <button 
            onClick={() => setIsOpen(false)}
          >
          </button>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto h-[calc(100%-64px)]">
          {/* Dashboard Section */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-3">
              <LayoutDashboard className="" />
              <span className="font-bold">Dashboard</span>
            </div>
            <a href="/dashboard" className="flex justify-between items-center py-2 px-3 hover:bg-gray-50 rounded-lg transition-colors">
              <span>My Learning</span>
              <ChevronRight className="h-4 w-4 text-gray-400" />
            </a>
            <a href="/dashboard" className="flex justify-between items-center py-2 px-3 hover:bg-gray-50 rounded-lg transition-colors">
              <span>Achievements</span>
              <ChevronRight className="h-4 w-4 text-gray-400" />
            </a>
            <a href="/dashboard" className="flex justify-between items-center py-2 px-3 hover:bg-gray-50 rounded-lg transition-colors">
              <span>Progess</span>
              <ChevronRight className="h-4 w-4 text-gray-400" />
            </a>
            
          </div>

          {/* Profile Section */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-3">
              <User className="" />
              <span className="font-bold">Profile</span>
            </div>
            <a href="/dashboard" className="flex justify-between items-center py-2 px-3 hover:bg-gray-50 rounded-lg transition-colors">
              <span>Update Profile</span>
              <ChevronRight className="h-4 w-4 text-gray-400" />
            </a>
          
          </div>

          <hr className="my-4 border-gray-200" />


       
         {/* Instructor Section */}
         <div className="mb-6">
          <div className="flex items-center gap-3 mb-3">
            <BookOpen className="" />
            <span className="font-bold">Courses</span>
          </div>
         </div>

          {/* Logout Button */}
          <button
            onClick={() => signOut()}
            className="w-full flex items-center gap-3 py-2 px-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut className="h-5 w-5" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default UserMenu;