"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Heart } from "lucide-react";
import { THREAD_POST_CONTENT_TYPE_ID } from '@/lib/constants';

interface ThreadPost {
  id: number;
  thread: number;
  author: number;
  author_username: string;
  content: string;
  attachments: string[];
  parent: number | null;
  created_at: string;
  updated_at: string;
  is_edited: boolean;
}

export default function ThreadPage() {
  const params = useParams();
  const router = useRouter();
  const threadId = Number(params?.id);
  const [posts, setPosts] = useState<ThreadPost[]>([]);
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [reactions, setReactions] = useState<Record<number, { total: number; mineId?: number }>>({});

  const loadPosts = useMemo(
    () => async () => {
      setIsLoading(true);
      try {
        const res = await api.get(`/thread-posts/`, { params: { thread: threadId } });
        setPosts(res.data || []);
      } finally {
        setIsLoading(false);
      }
    },
    [threadId]
  );

  const loadPostReactions = useMemo(() => async (postId: number) => {
    try {
      const res = await api.get('/reactions/', { params: { content_type: THREAD_POST_CONTENT_TYPE_ID, object_id: postId } });
      const list: Array<{ id: number; user: number; type: string }> = res.data || [];
      // If user id is available in session, we could check mine; we just track totals and optimistic toggle here
      const mine = undefined;
      setReactions(prev => ({ ...prev, [postId]: { total: list.length, mineId: mine } }));
    } catch {}
  }, []);

  useEffect(() => {
    if (!Number.isFinite(threadId)) return;
    loadPosts();
  }, [threadId, loadPosts]);

  useEffect(() => {
    posts.slice(0, 20).forEach(p => { if (!reactions[p.id]) loadPostReactions(p.id); });
  }, [posts, reactions, loadPostReactions]);

  const toggleLike = async (postId: number) => {
    const current = reactions[postId];
    try {
      if (current?.mineId) {
        await api.delete(`/reactions/${current.mineId}/`);
      } else {
        await api.post('/reactions/', { content_type: THREAD_POST_CONTENT_TYPE_ID, object_id: postId, type: 'like' });
      }
    } catch {}
    await loadPostReactions(postId);
  };

  const createReply = async () => {
    if (!content.trim()) return;
    setIsSending(true);
    try {
      const res = await api.post(`/thread-posts/`, { 
        thread: threadId, 
        content: content.trim()
      });
      setContent("");
      setPosts((prev) => [...prev, res.data]);
    } catch (error) {
      console.error('Error creating reply:', error);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-4">
        <button onClick={() => router.back()} className="p-2 rounded-lg hover:bg-gray-100 text-gray-700">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h1 className="text-2xl font-bold">Thread #{threadId}</h1>
      </div>

      <Card className="shadow-sm border-gray-200">
        <CardHeader className="bg-gradient-to-r from-emerald-50 to-green-50">
          <CardTitle className="text-emerald-800">Reply</CardTitle>
        </CardHeader>
        <CardContent>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your reply"
            className="w-full h-24 rounded-md border p-3 focus:outline-none focus:ring-2 focus:ring-emerald-400/40"
          />
          <div className="mt-3 flex justify-end">
            <Button onClick={createReply} disabled={!content.trim() || isSending} className="bg-emerald-600 hover:bg-emerald-700 text-white">
              {isSending ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Sending...
                </div>
              ) : (
                'Send'
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="mt-6 space-y-3">
        {isLoading && (
          <div className="flex items-center gap-3 text-gray-600">
            <div className="w-5 h-5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
            Loading posts...
          </div>
        )}
        {posts.map((p) => (
          <Card key={p.id}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="text-base">@{p.author_username}</span>
                <span className="text-xs text-muted-foreground">{new Date(p.created_at).toLocaleString()}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-6 whitespace-pre-wrap">{p.content}</p>
              <div className="mt-3 flex items-center gap-3">
                <Button size="sm" variant="ghost" onClick={() => toggleLike(p.id)} className="text-gray-600 hover:text-emerald-700">
                  <Heart className="w-4 h-4 mr-1" /> Like
                </Button>
                <span className="text-xs text-gray-500">{reactions[p.id]?.total ?? 0} likes</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

