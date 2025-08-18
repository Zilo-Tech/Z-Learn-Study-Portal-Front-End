"use client";

import { useEffect, useMemo, useState } from "react";
import api from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Project { id: number; title: string; description: string; demo_url: string | null; repo_url: string | null; author_username: string; created_at: string }

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', demo_url: '', repo_url: '' });

  const loadProjects = useMemo(() => async () => {
    setIsLoading(true);
    try {
      const res = await api.get('/projects/');
      setProjects(res.data || []);
    } finally { setIsLoading(false); }
  }, []);

  useEffect(() => { loadProjects(); }, [loadProjects]);

  const createProject = async () => {
    if (!form.title.trim() || !form.description.trim()) return;
    const res = await api.post('/projects/', {
      title: form.title.trim(),
      description: form.description.trim(),
      demo_url: form.demo_url || null,
      repo_url: form.repo_url || null,
      images: [],
    });
    setForm({ title: '', description: '', demo_url: '', repo_url: '' });
    setProjects((prev) => [res.data, ...prev]);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Project Showcase</h1>
      <Card>
        <CardHeader><CardTitle>Share a project</CardTitle></CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-3">
            <input className="rounded-md border p-3 focus:outline-none focus:ring-2 focus:ring-brand/40" placeholder="Title" value={form.title} onChange={(e) => setForm((f) => ({...f, title: e.target.value}))} />
            <input className="rounded-md border p-3 focus:outline-none focus:ring-2 focus:ring-brand/40" placeholder="Demo URL (optional)" value={form.demo_url} onChange={(e) => setForm((f) => ({...f, demo_url: e.target.value}))} />
            <input className="rounded-md border p-3 focus:outline-none focus:ring-2 focus:ring-brand/40" placeholder="Repo URL (optional)" value={form.repo_url} onChange={(e) => setForm((f) => ({...f, repo_url: e.target.value}))} />
            <input className="rounded-md border p-3 focus:outline-none focus:ring-2 focus:ring-brand/40 md:col-span-2" placeholder="Short description" value={form.description} onChange={(e) => setForm((f) => ({...f, description: e.target.value}))} />
          </div>
          <div className="mt-3 flex justify-end"><Button onClick={createProject} disabled={!form.title.trim() || !form.description.trim()}>Share</Button></div>
        </CardContent>
      </Card>

      <div className="mt-6 grid md:grid-cols-2 gap-4">
        {isLoading && <div className="text-sm text-muted-foreground">Loading projects...</div>}
        {projects.map((p) => (
          <Card key={p.id}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between"><span>{p.title}</span><span className="text-xs text-muted-foreground">@{p.author_username}</span></CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{p.description}</p>
              <div className="mt-2 flex gap-4">
                {p.demo_url && <a className="text-sm text-brand hover:underline" href={p.demo_url}>Demo</a>}
                {p.repo_url && <a className="text-sm text-brand hover:underline" href={p.repo_url}>Repo</a>}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

