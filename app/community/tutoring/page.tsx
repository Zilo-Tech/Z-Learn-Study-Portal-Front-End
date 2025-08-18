"use client";

import { useEffect, useMemo, useState } from "react";
import api from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface TutoringSession { id: number; tutor_username: string; learner_username: string; scheduled_at: string; duration_minutes: number; status: string }

export default function TutoringPage() {
  const [items, setItems] = useState<TutoringSession[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({ tutor: '', learner: '', scheduled_at: '', duration_minutes: '60' });

  const load = useMemo(() => async () => {
    setIsLoading(true);
    try { const res = await api.get('/tutoring/sessions/'); setItems(res.data || []); }
    finally { setIsLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const create = async () => {
    if (!form.tutor || !form.scheduled_at) return;
    const res = await api.post('/tutoring/sessions/', {
      tutor: Number(form.tutor),
      learner: form.learner ? Number(form.learner) : undefined,
      scheduled_at: form.scheduled_at,
      duration_minutes: Number(form.duration_minutes) || 60,
      notes: '',
    });
    setForm({ tutor: '', learner: '', scheduled_at: '', duration_minutes: '60' });
    setItems((prev) => [res.data, ...prev]);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Tutoring Sessions</h1>
      <Card>
        <CardHeader><CardTitle>Request a session</CardTitle></CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-3">
            <input className="rounded-md border p-3" placeholder="Tutor ID" value={form.tutor} onChange={(e)=> setForm((f)=>({...f, tutor: e.target.value}))} />
            <input className="rounded-md border p-3" placeholder="Learner ID (optional)" value={form.learner} onChange={(e)=> setForm((f)=>({...f, learner: e.target.value}))} />
            <input className="rounded-md border p-3" placeholder="Scheduled at (ISO)" value={form.scheduled_at} onChange={(e)=> setForm((f)=>({...f, scheduled_at: e.target.value}))} />
            <input className="rounded-md border p-3" placeholder="Duration (min)" value={form.duration_minutes} onChange={(e)=> setForm((f)=>({...f, duration_minutes: e.target.value}))} />
          </div>
          <div className="mt-3 flex justify-end"><Button onClick={create} disabled={!form.tutor || !form.scheduled_at}>Request</Button></div>
        </CardContent>
      </Card>
      <div className="mt-6 space-y-3">
        {isLoading && <div className="text-sm text-muted-foreground">Loading...</div>}
        {items.map((s)=> (
          <Card key={s.id}>
            <CardHeader><CardTitle className="flex items-center justify-between"><span>@{s.tutor_username} → @{s.learner_username}</span><span className="text-xs text-muted-foreground">{s.status}</span></CardTitle></CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground">{new Date(s.scheduled_at).toLocaleString()} • {s.duration_minutes} min</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

