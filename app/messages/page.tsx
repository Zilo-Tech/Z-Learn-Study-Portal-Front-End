"use client";

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

import api from '@/lib/api';
import { useEffect, useMemo, useState } from 'react';

interface Conversation {
  id: number;
  participants: number[];
  created_at: string;
}

interface DirectMessage {
  id: number;
  conversation: number;
  sender: number;
  sender_username: string;
  content: string;
  created_at: string;
  is_read: boolean;
}

function MessagesContent() {
  const searchParams = useSearchParams();
  const course = searchParams.get('course') || 'Unknown Course';
  const session = searchParams.get('session') || 'Unknown Session';
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeId, setActiveId] = useState<number | null>(null);
  const [messages, setMessages] = useState<DirectMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const loadConversations = useMemo(() => async () => {
    const res = await api.get('/dm/conversations/');
    setConversations(res.data || []);
    if ((res.data || []).length && activeId === null) {
      setActiveId(res.data[0].id);
    }
  }, [activeId]);

  const loadMessages = useMemo(() => async (cid: number) => {
    setLoading(true);
    try {
      const res = await api.get('/dm/messages/', { params: { conversation: cid } });
      setMessages(res.data || []);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  useEffect(() => {
    if (activeId) {
      loadMessages(activeId);
    }
  }, [activeId, loadMessages]);

  const sendMessage = async () => {
    if (!input.trim() || !activeId) return;
    const res = await api.post('/dm/messages/', { conversation: activeId, content: input.trim() });
    setInput('');
    setMessages((prev) => [...prev, res.data]);
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-2">Messages</h1>
      <p className="text-gray-600 mb-2">Course: <span className="font-semibold">{course}</span></p>
      <p className="text-gray-600 mb-6">Session ID: <span className="font-mono">{session}</span></p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg border shadow p-4 md:col-span-1">
          <h2 className="font-semibold mb-3">Conversations</h2>
          <div className="space-y-2 max-h-[60vh] overflow-auto">
            {conversations.map((c) => (
              <button
                key={c.id}
                onClick={() => setActiveId(c.id)}
                className={`w-full text-left px-3 py-2 rounded-md border ${activeId === c.id ? 'border-brand text-brand bg-brand/5' : 'border-gray-200 hover:bg-gray-50'}`}
              >
                Conversation #{c.id}
                <div className="text-xs text-gray-500">{new Date(c.created_at).toLocaleString()}</div>
              </button>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-lg border shadow p-4 md:col-span-2">
          <h2 className="font-semibold mb-3">Messages</h2>
          <div className="space-y-3 max-h-[50vh] overflow-auto">
            {loading && <div className="text-sm text-gray-500">Loading...</div>}
            {messages.map((m) => (
              <div key={m.id} className="flex justify-start">
                <span className="px-3 py-2 rounded-lg text-sm max-w-xs break-words bg-gray-100 text-gray-800">{m.content}</span>
              </div>
            ))}
          </div>
          <div className="mt-3 flex gap-2">
            <input
              className="flex-1 rounded-md border p-3 focus:outline-none focus:ring-2 focus:ring-brand/40"
              placeholder="Type a message"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button onClick={sendMessage} className="px-4 py-2 rounded-md bg-brand text-white font-semibold">Send</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function MessagesPage() {
  return (
    <Suspense fallback={<div className="p-6 text-center">Loading messages...</div>}>
      <MessagesContent />
    </Suspense>
  );
}
