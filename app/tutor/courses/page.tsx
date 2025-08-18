"use client";

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface TutorCourse { id: number; title: string; level?: string; duration?: string; modules_count?: number }

export default function TutorCoursesPage() {
  const [courses, setCourses] = useState<TutorCourse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async ()=>{
      try {
        const res = await api.get('/tutor/courses/me/');
        setCourses(res.data || []);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">My Courses</h1>
      {loading ? (
        <div className="flex items-center gap-3 text-gray-600">
          <div className="w-5 h-5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
          Loading courses...
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {courses.map(c => (
            <Card key={c.id}>
              <CardHeader>
                <CardTitle className="text-lg">{c.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-gray-600">Level: {c.level || '—'}</div>
                <div className="text-sm text-gray-600">Duration: {c.duration || '—'}</div>
                <div className="text-sm text-gray-600">Modules: {c.modules_count ?? '—'}</div>
                <a href={`/tutor/courses/manage?course=${c.id}`} className="inline-flex mt-3 text-emerald-700 hover:underline">Manage</a>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}