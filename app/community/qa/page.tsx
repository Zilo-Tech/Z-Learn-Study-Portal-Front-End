"use client";

import { useEffect, useMemo, useState } from "react";
import api from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface QAQuestion { id: number; title: string; body: string; asked_by_username: string; created_at: string; tags: string[] }

export default function QAPage() {
  const [questions, setQuestions] = useState<QAQuestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({ title: '', body: '' });

  const loadQuestions = useMemo(() => async () => {
    setIsLoading(true);
    try {
      const res = await api.get('/qa/questions/');
      setQuestions(res.data || []);
    } finally { setIsLoading(false); }
  }, []);

  useEffect(() => { loadQuestions(); }, [loadQuestions]);

  const askQuestion = async () => {
    if (!form.title.trim() || !form.body.trim()) return;
    const res = await api.post('/qa/questions/', { title: form.title.trim(), body: form.body.trim() });
    setForm({ title: '', body: '' });
    setQuestions((prev) => [res.data, ...prev]);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Q&A</h1>
        <p className="text-gray-600">Ask questions and help others learn</p>
      </div>
      <Card>
        <CardHeader><CardTitle>Ask a question</CardTitle></CardHeader>
        <CardContent>
          <div className="grid gap-3">
            <input className="rounded-md border p-3 focus:outline-none focus:ring-2 focus:ring-emerald-400/40" placeholder="Title" value={form.title} onChange={(e) => setForm((f) => ({...f, title: e.target.value}))} />
            <textarea className="rounded-md border p-3 focus:outline-none focus:ring-2 focus:ring-emerald-400/40 h-24" placeholder="Body" value={form.body} onChange={(e) => setForm((f) => ({...f, body: e.target.value}))} />
            <div className="flex justify-end"><Button onClick={askQuestion} disabled={!form.title.trim() || !form.body.trim()}>Post</Button></div>
          </div>
        </CardContent>
      </Card>

      <div className="mt-6 space-y-3">
        {isLoading && <div className="text-sm text-muted-foreground">Loading questions...</div>}
        {questions.map((q) => (
          <Card key={q.id}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="hover:underline">{q.title}</span>
                <span className="text-xs text-muted-foreground">@{q.asked_by_username}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground line-clamp-3">{q.body}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

