"use client";

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface TutorProfile { id: number; subjects: string[]; hourly_rate: string; availability: Record<string, string[]>; bio?: string; rating?: number }

export default function TutorProfilePage() {
  const [profile, setProfile] = useState<TutorProfile | null>(null);
  const [subjects, setSubjects] = useState('');
  const [rate, setRate] = useState('');
  const [bio, setBio] = useState('');
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get('/tutors/profile/');
        const p: TutorProfile | null = (res.data && res.data.id) ? res.data : null;
        setProfile(p);
        if (p) {
          setSubjects(p.subjects?.join(', ') || '');
          setRate(String(p.hourly_rate || ''));
          setBio(p.bio || '');
        }
      } catch {
        setProfile(null);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const save = async () => {
    setSaving(true);
    try {
      const payload = {
        subjects: subjects ? subjects.split(',').map(s => s.trim()).filter(Boolean) : [],
        hourly_rate: Number(rate || 0),
        availability: {},
        bio: bio || undefined,
      };
      if (!profile) {
        await api.patch('/user/profile/', { role: 'tutor' });
        const res = await api.post('/tutors/profile/', payload);
        setProfile(res.data);
      } else {
        const res = await api.patch('/tutors/profile/', payload);
        setProfile(res.data);
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Tutor Profile</h1>
        <p className="text-gray-600">Set your subjects, rates, and a short bio.</p>
      </div>

      <Card className="shadow-sm border-gray-200">
        <CardHeader className="bg-gradient-to-r from-emerald-50 to-green-50">
          <CardTitle className="text-emerald-800">Profile Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {loading ? (
            <div className="flex items-center gap-3 text-gray-600">
              <div className="w-5 h-5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
              Loading...
            </div>
          ) : (
            <>
              <div>
                <label className="text-sm text-gray-700">Subjects (comma separated)</label>
                <input className="w-full rounded-md border p-3 focus:outline-none focus:ring-2 focus:ring-emerald-400/40" value={subjects} onChange={(e)=> setSubjects(e.target.value)} />
              </div>
              <div>
                <label className="text-sm text-gray-700">Hourly Rate</label>
                <input className="w-full rounded-md border p-3 focus:outline-none focus:ring-2 focus:ring-emerald-400/40" type="number" min="0" step="1" value={rate} onChange={(e)=> setRate(e.target.value)} />
              </div>
              <div>
                <label className="text-sm text-gray-700">Bio</label>
                <textarea className="w-full rounded-md border p-3 focus:outline-none focus:ring-2 focus:ring-emerald-400/40 h-24" value={bio} onChange={(e)=> setBio(e.target.value)} />
              </div>
              <div className="flex justify-end">
                <Button onClick={save} disabled={saving} className="bg-emerald-600 hover:bg-emerald-700 text-white">
                  {saving ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Saving...
                    </div>
                  ) : 'Save Profile'}
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}