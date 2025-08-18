"use client";

import { useEffect, useMemo, useState } from 'react';
import api from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface SessionItem { id: number; tutor_username: string; learner_username: string; scheduled_at: string; duration_minutes: number; status: string }

export default function TutorSessionsPage() {
  const [sessions, setSessions] = useState<SessionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ learner: '', scheduled_at: '', duration_minutes: '60', notes: '' });
  
  const load = useMemo(() => async () => {
    setLoading(true);
    try {
      const res = await api.get('/tutoring/sessions/', { params: { as: 'tutor' } });
      setSessions(res.data || []);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const create = async () => {
    if (!form.scheduled_at) return;
    type CreateSessionPayload = {
      tutor?: number;
      learner?: number;
      scheduled_at: string;
      duration_minutes: number;
      notes?: string;
    };
    const payload: CreateSessionPayload = {
      scheduled_at: form.scheduled_at,
      duration_minutes: Number(form.duration_minutes) || 60,
    };
    if (form.learner) payload.learner = Number(form.learner);
    if (form.notes) payload.notes = form.notes;
    const res = await api.post('/tutoring/sessions/', payload);
    setForm({ learner: '', scheduled_at: '', duration_minutes: '60', notes: '' });
    setSessions(prev => [res.data, ...prev]);
  };

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">Tutoring Sessions</h1>
      <Card>
        <CardHeader>
          <CardTitle>Create Session</CardTitle>
        </CardHeader>
        <CardContent className="grid md:grid-cols-4 gap-3">
          <input className="rounded-md border p-3" placeholder="Learner ID (optional)" value={form.learner} onChange={(e)=> setForm(f=>({...f, learner: e.target.value}))} />
          <input className="rounded-md border p-3" placeholder="Scheduled at (ISO)" value={form.scheduled_at} onChange={(e)=> setForm(f=>({...f, scheduled_at: e.target.value}))} />
          <input className="rounded-md border p-3" placeholder="Duration (min)" value={form.duration_minutes} onChange={(e)=> setForm(f=>({...f, duration_minutes: e.target.value}))} />
          <Button onClick={create} className="bg-emerald-600 hover:bg-emerald-700 text-white">Create</Button>
        </CardContent>
      </Card>

      <div className="mt-6 grid md:grid-cols-2 gap-4">
        {loading ? (
          <div className="flex items-center gap-3 text-gray-600">
            <div className="w-5 h-5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
            Loading sessions...
          </div>
        ) : sessions.map(s => (
          <Card key={s.id}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>@{s.tutor_username} → @{s.learner_username}</span>
                <span className="text-xs text-gray-500">{s.status}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-gray-600">{new Date(s.scheduled_at).toLocaleString()} • {s.duration_minutes} min</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}