"use client";

import React from 'react';
import { Card } from '@/components/ui/card';
import { Users } from 'lucide-react';

export default function StudentStudyGroupsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <div className="p-2 bg-emerald-100 rounded-lg">
          <Users className="h-6 w-6 text-emerald-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Study Groups</h1>
          <p className="text-gray-600">Join collaborative learning communities</p>
        </div>
      </div>
      
      <Card className="p-12 text-center">
        <Users className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Study Groups Coming Soon</h3>
        <p className="text-gray-500">Collaborate with other students in study groups and learning communities</p>
      </Card>
    </div>
  );
} 