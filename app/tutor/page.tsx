"use client";

import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, CalendarClock, UserCheck } from 'lucide-react';

export default function TutorOverviewPage() {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Tutor Overview</h1>
        <p className="text-gray-600">Manage your profile, courses, and tutoring sessions.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><UserCheck className="w-4 h-4 text-emerald-600" /> Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-3">Set your subjects, rates, and availability.</p>
            <Link href="/tutor/profile"><Button className="bg-emerald-600 hover:bg-emerald-700 text-white">Edit Profile</Button></Link>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><BookOpen className="w-4 h-4 text-emerald-600" /> My Courses</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-3">View courses assigned to you.</p>
            <Link href="/tutor/courses"><Button variant="outline">View Courses</Button></Link>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><CalendarClock className="w-4 h-4 text-emerald-600" /> Sessions</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-3">Manage your tutoring sessions.</p>
            <Link href="/tutor/sessions"><Button variant="outline">Open Sessions</Button></Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}