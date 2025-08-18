"use client";

import React from 'react';
import { Card } from '@/components/ui/card';
import { User } from 'lucide-react';

export default function StudentProfilePage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <div className="p-2 bg-emerald-100 rounded-lg">
          <User className="h-6 w-6 text-emerald-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
          <p className="text-gray-600">Manage your account settings and preferences</p>
        </div>
      </div>
      
      <Card className="p-12 text-center">
        <User className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Profile Management Coming Soon</h3>
        <p className="text-gray-500">Update your profile information and account settings</p>
      </Card>
    </div>
  );
} 