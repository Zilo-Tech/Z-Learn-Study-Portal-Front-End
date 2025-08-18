"use client";

import { useEffect, useMemo, useState } from "react";
import api from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface SharedResource { id: number; title: string; description: string; link: string | null; file: string | null; author_username: string; created_at: string }

export default function ResourcesPage() {
  const [resources, setResources] = useState<SharedResource[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', link: '' });

  const loadResources = useMemo(() => async () => {
    setIsLoading(true);
    try {
      const res = await api.get('/resources/');
      setResources(res.data || []);
    } finally { setIsLoading(false); }
  }, []);

  useEffect(() => { loadResources(); }, [loadResources]);

  const createResource = async () => {
    if (!form.title.trim()) return;
    const res = await api.post('/resources/', { title: form.title.trim(), description: form.description.trim(), link: form.link || null });
    setForm({ title: '', description: '', link: '' });
    setResources((prev) => [res.data, ...prev]);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Shared Resources</h1>
      <Card>
        <CardHeader><CardTitle>Share a resource</CardTitle></CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-3">
            <input className="rounded-md border p-3 focus:outline-none focus:ring-2 focus:ring-brand/40" placeholder="Title" value={form.title} onChange={(e) => setForm((f) => ({...f, title: e.target.value}))} />
            <input className="rounded-md border p-3 focus:outline-none focus:ring-2 focus:ring-brand/40" placeholder="Description" value={form.description} onChange={(e) => setForm((f) => ({...f, description: e.target.value}))} />
            <input className="rounded-md border p-3 focus:outline-none focus:ring-2 focus:ring-brand/40" placeholder="Link (optional)" value={form.link} onChange={(e) => setForm((f) => ({...f, link: e.target.value}))} />
          </div>
          <div className="mt-3 flex justify-end"><Button onClick={createResource} disabled={!form.title.trim()}>Share</Button></div>
        </CardContent>
      </Card>

      <div className="mt-6 grid md:grid-cols-2 gap-4">
        {isLoading && <div className="text-sm text-muted-foreground">Loading resources...</div>}
        {resources.map((r) => (
          <Card key={r.id}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between"><span>{r.title}</span><span className="text-xs text-muted-foreground">@{r.author_username}</span></CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{r.description}</p>
              {r.link && <a className="text-sm text-brand hover:underline" href={r.link}>Open link</a>}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

