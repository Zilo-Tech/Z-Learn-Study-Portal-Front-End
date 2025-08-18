"use client";

import React from 'react';
import { Card } from '@/components/ui/card';
import { BarChart3 } from 'lucide-react';

export default function StudentProgressPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <div className="p-2 bg-emerald-100 rounded-lg">
          <BarChart3 className="h-6 w-6 text-emerald-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Progress</h1>
          <p className="text-gray-600">Track your learning analytics and achievements</p>
        </div>
      </div>
      
      <Card className="p-12 text-center">
        <BarChart3 className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Progress Analytics Coming Soon</h3>
        <p className="text-gray-500">Detailed progress tracking and analytics will be available soon</p>
      </Card>
    </div>
  );
} 