"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

interface Thread {
  id: number;
  group: number;
  group_name: string;
  title: string;
  created_by: number;
  created_by_username: string;
  category?: string;
  is_locked: boolean;
  is_pinned: boolean;
  created_at: string;
  updated_at: string;
}

export default function GroupPage() {
  const params = useParams();
  const router = useRouter();
  const groupId = Number(params?.id);
  const [threads, setThreads] = useState<Thread[]>([]);
  const [title, setTitle] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const loadThreads = useMemo(
    () => async () => {
      setIsLoading(true);
      try {
        const res = await api.get(`/threads/`, { params: { group: groupId } });
        setThreads(res.data || []);
      } finally {
        setIsLoading(false);
      }
    },
    [groupId]
  );

  useEffect(() => {
    if (!Number.isFinite(groupId)) return;
    loadThreads();
  }, [groupId, loadThreads]);

  const createThread = async () => {
    if (!title.trim()) return;
    setIsCreating(true);
    try {
      const res = await api.post(`/threads/`, { 
        title: title.trim(),
        category: undefined,
        group: groupId 
      });
      setTitle("");
      setThreads((prev) => [res.data, ...prev]);
    } catch (error) {
      console.error('Error creating thread:', error);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-4">
        <button onClick={() => router.back()} className="p-2 rounded-lg hover:bg-gray-100 text-gray-700">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h1 className="text-2xl font-bold">Group #{groupId}</h1>
      </div>

      <Card className="shadow-sm border-gray-200">
        <CardHeader className="bg-gradient-to-r from-emerald-50 to-green-50">
          <CardTitle className="text-emerald-800">Start a new thread</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3">
            <input
              className="flex-1 rounded-md border p-3 focus:outline-none focus:ring-2 focus:ring-emerald-400/40"
              placeholder="Thread title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <Button onClick={createThread} disabled={!title.trim() || isCreating} className="bg-emerald-600 hover:bg-emerald-700 text-white">
              {isCreating ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Creating...
                </div>
              ) : (
                'Create'
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="mt-6 space-y-3">
        {isLoading && (
          <div className="flex items-center gap-3 text-gray-600">
            <div className="w-5 h-5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
            Loading threads...
          </div>
        )}
        {threads.map((t) => (
          <Card key={t.id}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <a href={`/community/threads/${t.id}`} className="hover:underline">{t.title}</a>
                <span className="text-xs text-muted-foreground">by @{t.created_by_username}</span>
              </CardTitle>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
}

