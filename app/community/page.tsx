"use client";

import { useEffect, useMemo, useState } from "react";
import api from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useSession } from 'next-auth/react';
import { Heart, Share2 } from 'lucide-react';
import { FEED_POST_CONTENT_TYPE_ID } from '@/lib/constants';

interface FeedPost {
  id: number;
  author: number;
  author_username: string;
  group: number | null;
  group_name: string | null;
  content: string;
  attachments: string[];
  visibility: "public" | "group" | "followers";
  created_at: string;
  updated_at: string;
}

interface FeedComment {
  id: number;
  post: number;
  author: number;
  author_username: string;
  content: string;
  parent: number | null;
  created_at: string;
  updated_at: string;
}

interface CommunityGroup {
  id: number;
  name: string;
  description: string;
  owner: number;
  owner_username: string;
  moderators: number[];
  is_public: boolean;
  tags: string[];
  region: string | null;
  created_at: string;
  updated_at: string;
}

type TabKey = "feed" | "groups";

interface ReactionSummary { total: number; mineId?: number }

export default function CommunityHomePage() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState<TabKey>("feed");
  const [isLoading, setIsLoading] = useState(false);
  const [isCreatingPost, setIsCreatingPost] = useState(false);
  const [posts, setPosts] = useState<FeedPost[]>([]);
  const [groups, setGroups] = useState<CommunityGroup[]>([]);
  const [newPost, setNewPost] = useState("");
  const [creatingGroup, setCreatingGroup] = useState(false);
  const [groupForm, setGroupForm] = useState({ name: "", description: "" });
  const [openCommentsFor, setOpenCommentsFor] = useState<number | null>(null);
  const [comments, setComments] = useState<Record<number, FeedComment[]>>({});
  const [commentDraft, setCommentDraft] = useState<Record<number, string>>({});
  const [reactions, setReactions] = useState<Record<number, ReactionSummary>>({});

  const loadFeed = useMemo(
    () => async () => {
      setIsLoading(true);
      try {
        const res = await api.get("/feed/");
        setPosts(res.data || []);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const loadGroups = useMemo(
    () => async () => {
      setIsLoading(true);
      try {
        const res = await api.get("/groups/");
        setGroups(res.data || []);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const loadPostReactions = useMemo(() => async (postId: number) => {
    try {
      const res = await api.get('/reactions/', { params: { content_type: FEED_POST_CONTENT_TYPE_ID, object_id: postId } });
      const list: Array<{ id: number; user: number; type: string }> = res.data || [];
      const myIdStr = session?.user?.id;
      const mine = myIdStr ? list.find(r => String(r.user) === String(myIdStr)) : undefined;
      setReactions(prev => ({ ...prev, [postId]: { total: list.length, mineId: mine?.id } }));
    } catch {}
  }, [session?.user?.id]);

  useEffect(() => {
    if (activeTab === "feed") {
      loadFeed();
    } else if (activeTab === "groups") {
      loadGroups();
    }
  }, [activeTab, loadFeed, loadGroups]);

  useEffect(() => {
    // Prefetch reactions for first few posts to avoid N+1 feeling
    if (posts.length) {
      posts.slice(0, 10).forEach(p => {
        if (!reactions[p.id]) {
          loadPostReactions(p.id);
        }
      });
    }
  }, [posts, reactions, loadPostReactions]);

  const handleCreatePost = async () => {
    if (!newPost.trim()) return;
    setIsCreatingPost(true);
    try {
      const payload = { content: newPost.trim(), visibility: "public" as const };
      const res = await api.post("/feed/", payload);
      setNewPost("");
      setPosts((prev) => [res.data, ...prev]);
    } catch (error) {
      console.error('Error creating post:', error);
    } finally {
      setIsCreatingPost(false);
    }
  };

  const handleCreateGroup = async () => {
    if (!groupForm.name.trim()) return;
    setCreatingGroup(true);
    try {
      const res = await api.post("/groups/", {
        name: groupForm.name.trim(),
        description: groupForm.description.trim() || undefined,
        is_public: true,
        tags: [], // Empty array is fine according to API docs
        region: undefined
      });
      setGroupForm({ name: "", description: "" });
      setGroups((prev) => [res.data, ...prev]);
    } catch (error) {
      console.error('Error creating group:', error);
    } finally {
      setCreatingGroup(false);
    }
  };

  const toggleComments = async (postId: number) => {
    if (openCommentsFor === postId) {
      setOpenCommentsFor(null);
      return;
    }
    setOpenCommentsFor(postId);
    if (!comments[postId]) {
      const res = await api.get('/feed-comments/', { params: { post: postId } });
      setComments((prev) => ({ ...prev, [postId]: res.data || [] }));
    }
    if (!reactions[postId]) {
      await loadPostReactions(postId);
    }
  };

  const addComment = async (postId: number) => {
    const text = (commentDraft[postId] || '').trim();
    if (!text) return;
    const res = await api.post('/feed-comments/', { post: postId, content: text });
    setComments((prev) => ({ ...prev, [postId]: [...(prev[postId] || []), res.data] }));
    setCommentDraft((prev) => ({ ...prev, [postId]: '' }));
  };

  const likePost = async (postId: number) => {
    try {
      const current = reactions[postId];
      if (current?.mineId) {
        await api.delete(`/reactions/${current.mineId}/`);
      } else {
        await api.post('/reactions/', { content_type: FEED_POST_CONTENT_TYPE_ID, object_id: postId, type: 'like' });
      }
      await loadPostReactions(postId);
    } catch {}
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Community Feed & Groups</h1>
        <p className="text-gray-600">Connect with fellow learners, share updates, and join groups</p>
      </div>

      <div className="flex gap-2 mb-6">
        <button
          className={cn(
            "px-4 py-2 rounded-md text-sm font-semibold",
            activeTab === "feed"
              ? "bg-emerald-500 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-emerald-50 hover:text-emerald-700"
          )}
          onClick={() => setActiveTab("feed")}
        >
          Feed
        </button>
        <button
          className={cn(
            "px-4 py-2 rounded-md text-sm font-semibold",
            activeTab === "groups"
              ? "bg-emerald-500 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-emerald-50 hover:text-emerald-700"
          )}
          onClick={() => setActiveTab("groups")}
        >
          Groups
        </button>
      </div>

      {activeTab === "feed" && (
        <div className="space-y-6">
          <Card className="shadow-sm border-gray-200">
            <CardHeader className="bg-gradient-to-r from-emerald-50 to-green-50">
              <CardTitle className="text-emerald-800">Share an Update</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <textarea
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                placeholder="What are you learning today? Share your progress, questions, or discoveries..."
                className="w-full h-28 rounded-lg border border-gray-300 p-4 focus:outline-none focus:ring-2 focus:ring-emerald-400/40 focus:border-emerald-400 resize-none"
              />
              <div className="flex justify-between items-center">
                <div className="text-xs text-gray-500">
                  {newPost.length > 0 && `${newPost.length}/280 characters`}
                </div>
                <Button 
                  onClick={handleCreatePost} 
                  disabled={isCreatingPost || !newPost.trim()}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isCreatingPost ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Sharing...
                    </div>
                  ) : (
                    'Share Update'
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {isLoading && (
            <div className="flex items-center justify-center py-8">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-gray-600">Loading feed...</span>
              </div>
            </div>
          )}

          {!isLoading && posts.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <p className="text-gray-500">No posts yet. Share the first update!</p>
            </div>
          )}

          <div className="space-y-4">
            {posts.map((post) => (
              <Card key={post.id}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="text-base">
                      @{post.author_username}
                      {post.group_name ? (
                        <span className="text-muted-foreground text-sm ml-2">in {post.group_name}</span>
                      ) : null}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(post.created_at).toLocaleString()}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-6 whitespace-pre-wrap">{post.content}</p>
                  <div className="mt-3 flex items-center gap-3">
                    <Button size="sm" variant="ghost" onClick={() => likePost(post.id)} className={cn(reactions[post.id]?.mineId ? 'text-emerald-700' : 'text-gray-600 hover:text-emerald-700')}>
                      <Heart className={cn('w-4 h-4 mr-1', reactions[post.id]?.mineId ? 'fill-emerald-600 text-emerald-600' : '')} />
                      {reactions[post.id]?.mineId ? 'Unlike' : 'Like'}
                    </Button>
                    <span className="text-xs text-gray-500">{reactions[post.id]?.total ?? 0} likes</span>
                    <Button size="sm" variant="ghost" onClick={() => toggleComments(post.id)}>
                      {openCommentsFor === post.id ? 'Hide comments' : 'View comments'}
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => navigator.share?.({ title: 'Z-Learn', text: post.content.slice(0, 120) })}>
                      <Share2 className="w-4 h-4 mr-1" /> Share
                    </Button>
                  </div>
                  {openCommentsFor === post.id && (
                    <div className="mt-4 space-y-3">
                      <div className="space-y-2">
                        {(comments[post.id] || []).map((c) => (
                          <div key={c.id} className="text-sm">
                            <span className="font-semibold">@{c.author_username}</span>
                            <span className="ml-2 text-muted-foreground">{c.content}</span>
                          </div>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <input
                          className="flex-1 rounded-md border p-2 focus:outline-none focus:ring-2 focus:ring-brand/40"
                          placeholder="Add a comment"
                          value={commentDraft[post.id] || ''}
                          onChange={(e) => setCommentDraft((prev) => ({ ...prev, [post.id]: e.target.value }))}
                        />
                        <Button size="sm" onClick={() => addComment(post.id)} disabled={!(commentDraft[post.id] || '').trim()}>Send</Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {activeTab === "groups" && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Create a group</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-3">
                <input
                  className="w-full rounded-md border p-3 focus:outline-none focus:ring-2 focus:ring-brand/40"
                  placeholder="Group name"
                  value={groupForm.name}
                  onChange={(e) => setGroupForm((f) => ({ ...f, name: e.target.value }))}
                />
                <input
                  className="w-full rounded-md border p-3 focus:outline-none focus:ring-2 focus:ring-brand/40"
                  placeholder="Description (optional)"
                  value={groupForm.description}
                  onChange={(e) => setGroupForm((f) => ({ ...f, description: e.target.value }))}
                />
                <div className="flex justify-end">
                  <Button 
                    onClick={handleCreateGroup} 
                    disabled={!groupForm.name.trim() || creatingGroup}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {creatingGroup ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Creating...
                      </div>
                    ) : (
                      "Create Group"
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {isLoading && (
            <div className="flex items-center justify-center py-8">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-gray-600">Loading groups...</span>
              </div>
            </div>
          )}

          {!isLoading && groups.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <p className="text-gray-500">No groups yet. Create the first one!</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {groups.map((g) => (
              <Card key={g.id}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{g.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {g.is_public ? "Public" : "Private"}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-3">{g.description}</p>
                  <a
                    href={`/community/groups/${g.id}`}
                    className="mt-4 inline-flex text-sm text-brand hover:underline"
                  >
                    View group
                  </a>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

