"use client";

import { useEffect, useMemo, useState } from "react";
import api from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Challenge { id: number; title: string; type: string; rules: Record<string, unknown>; start_at: string; end_at: string; created_by_username: string }

export default function ChallengesPage() {
  const [items, setItems] = useState<Challenge[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({ title: '', type: 'streak', start_at: '', end_at: '' });

  const load = useMemo(() => async () => {
    setIsLoading(true);
    try { const res = await api.get('/challenges/'); setItems(res.data || []); }
    finally { setIsLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const create = async () => {
    if (!form.title.trim() || !form.type || !form.start_at || !form.end_at) return;
    const res = await api.post('/challenges/', { title: form.title.trim(), type: form.type, rules: {}, start_at: form.start_at, end_at: form.end_at });
    setForm({ title: '', type: 'streak', start_at: '', end_at: '' });
    setItems((prev) => [res.data, ...prev]);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Challenges</h1>
      <Card>
        <CardHeader><CardTitle>Create challenge</CardTitle></CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-3">
            <input className="rounded-md border p-3" placeholder="Title" value={form.title} onChange={(e) => setForm((f) => ({...f, title: e.target.value}))} />
            <select className="rounded-md border p-3" value={form.type} onChange={(e) => setForm((f)=>({...f, type: e.target.value}))}>
              <option value="streak">Streak</option>
              <option value="score">Score</option>
            </select>
            <input className="rounded-md border p-3" placeholder="Start (ISO)" value={form.start_at} onChange={(e) => setForm((f) => ({...f, start_at: e.target.value}))} />
            <input className="rounded-md border p-3" placeholder="End (ISO)" value={form.end_at} onChange={(e) => setForm((f) => ({...f, end_at: e.target.value}))} />
          </div>
          <div className="mt-3 flex justify-end"><Button onClick={create} disabled={!form.title.trim() || !form.start_at || !form.end_at}>Create</Button></div>
        </CardContent>
      </Card>
      <div className="mt-6 space-y-3">
        {isLoading && <div className="text-sm text-muted-foreground">Loading...</div>}
        {items.map((c) => (
          <Card key={c.id}>
            <CardHeader><CardTitle className="flex items-center justify-between"><span>{c.title}</span><span className="text-xs text-muted-foreground">@{c.created_by_username}</span></CardTitle></CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground">{c.type} | {new Date(c.start_at).toLocaleDateString()} → {new Date(c.end_at).toLocaleDateString()}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

