"use client";

import { useEffect, useMemo, useState } from "react";
import api from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Preference { id: number; subjects: string[]; time_zone: string; goals: string }
interface Match { id: number; user_a_username: string; user_b_username: string; status: string; created_at: string }

export default function StudyBuddyPage() {
  const [prefs, setPrefs] = useState<Preference | null>(null);
  const [matches, setMatches] = useState<Match[]>([]);
  const [form, setForm] = useState({ subjects: '', time_zone: 'UTC', goals: '' });

  const load = useMemo(() => async () => {
    try {
      const [pRes, mRes] = await Promise.all([
        api.get('/study-buddy/preferences/'),
        api.get('/study-buddy/matches/'),
      ]);
      setPrefs((pRes.data || [])[0] || null);
      setMatches(mRes.data || []);
    } catch {}
  }, []);

  useEffect(() => { load(); }, [load]);

  const savePrefs = async () => {
    const payload = { subjects: form.subjects ? form.subjects.split(',').map(s=>s.trim()) : [], availability: {}, time_zone: form.time_zone, goals: form.goals };
    if (prefs) {
      await api.patch(`/study-buddy/preferences/${prefs.id}/`, payload);
    } else {
      const res = await api.post('/study-buddy/preferences/', payload);
      setPrefs(res.data);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Study Buddy</h1>
      <Card>
        <CardHeader><CardTitle>Your preferences</CardTitle></CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-3">
            <input className="rounded-md border p-3" placeholder="Subjects (comma separated)" value={form.subjects} onChange={(e) => setForm((f)=>({...f, subjects: e.target.value}))} />
            <input className="rounded-md border p-3" placeholder="Time zone" value={form.time_zone} onChange={(e)=> setForm((f)=>({...f, time_zone: e.target.value}))} />
            <input className="rounded-md border p-3" placeholder="Goals" value={form.goals} onChange={(e)=> setForm((f)=>({...f, goals: e.target.value}))} />
          </div>
          <div className="mt-3 flex justify-end"><Button onClick={savePrefs}>Save</Button></div>
        </CardContent>
      </Card>
      <div className="mt-6 space-y-3">
        {matches.map((m)=> (
          <Card key={m.id}>
            <CardHeader><CardTitle className="flex items-center justify-between"><span>@{m.user_a_username} ↔ @{m.user_b_username}</span><span className="text-xs text-muted-foreground">{m.status}</span></CardTitle></CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
}

