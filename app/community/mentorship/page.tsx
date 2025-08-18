"use client";

import { useEffect, useMemo, useState } from "react";
import api from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Mentorship { id: number; mentor_username: string; mentee_username: string; topics: string[]; status: string; created_at: string }

export default function MentorshipPage() {
  const [items, setItems] = useState<Mentorship[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({ mentor: '', mentee: '', topics: '' });

  const load = useMemo(() => async () => {
    setIsLoading(true);
    try {
      const res = await api.get('/mentorship/');
      setItems(res.data || []);
    } finally { setIsLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const create = async () => {
    if (!form.mentor || !form.mentee) return;
    const res = await api.post('/mentorship/', { mentor: Number(form.mentor), mentee: Number(form.mentee), topics: form.topics ? form.topics.split(',').map(s=>s.trim()) : [] });
    setForm({ mentor: '', mentee: '', topics: '' });
    setItems((prev) => [res.data, ...prev]);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Mentorship</h1>
      <Card>
        <CardHeader><CardTitle>Create mentorship</CardTitle></CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-3">
            <input className="rounded-md border p-3" placeholder="Mentor ID" value={form.mentor} onChange={(e) => setForm((f) => ({...f, mentor: e.target.value}))} />
            <input className="rounded-md border p-3" placeholder="Mentee ID" value={form.mentee} onChange={(e) => setForm((f) => ({...f, mentee: e.target.value}))} />
            <input className="rounded-md border p-3" placeholder="Topics (comma separated)" value={form.topics} onChange={(e) => setForm((f) => ({...f, topics: e.target.value}))} />
          </div>
          <div className="mt-3 flex justify-end"><Button onClick={create} disabled={!form.mentor || !form.mentee}>Create</Button></div>
        </CardContent>
      </Card>
      <div className="mt-6 space-y-3">
        {isLoading && <div className="text-sm text-muted-foreground">Loading...</div>}
        {items.map((m) => (
          <Card key={m.id}>
            <CardHeader><CardTitle className="flex items-center justify-between"><span>@{m.mentor_username} → @{m.mentee_username}</span><span className="text-xs text-muted-foreground">{m.status}</span></CardTitle></CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground">Topics: {m.topics?.join(', ')}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

