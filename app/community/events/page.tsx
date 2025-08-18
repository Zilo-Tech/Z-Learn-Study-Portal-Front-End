"use client";

import { useEffect, useMemo, useState } from "react";
import api from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";

interface CommunityEvent {
  id: number;
  group: number | null;
  group_name: string | null;
  created_by: number;
  created_by_username: string;
  title: string;
  description: string;
  start_at: string;
  end_at: string;
  location: string | null;
  is_virtual: boolean;
  meeting_url: string | null;
  created_at: string;
}

export default function EventsPage() {
  const [events, setEvents] = useState<CommunityEvent[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [form, setForm] = useState({ 
    title: "", 
    description: "",
    start_date: "", 
    start_time: "",
    end_date: "", 
    end_time: "",
    is_virtual: true, 
    meeting_url: "",
    location: ""
  });

  const loadEvents = useMemo(() => async () => {
    setIsLoading(true);
    try {
      const res = await api.get('/events/', { params: { upcoming: true } });
      setEvents(res.data || []);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { loadEvents(); }, [loadEvents]);

  const createEvent = async () => {
    if (!form.title.trim() || !form.start_date || !form.start_time || !form.end_date || !form.end_time) return;
    
    setIsCreating(true);
    try {
      // Format dates properly for API (ISO format without .000Z)
      const start_at = `${form.start_date}T${form.start_time}:00Z`;
      const end_at = `${form.end_date}T${form.end_time}:00Z`;

      type EventPayload = {
        title: string;
        start_at: string;
        end_at: string;
        is_virtual: boolean;
        description?: string;
        meeting_url?: string;
        location?: string;
      };

      let payload: EventPayload = {
        title: form.title.trim(),
        start_at,
        end_at,
        is_virtual: form.is_virtual,
      };

      // Add optional fields only if they have values
      if (form.description.trim()) {
        payload = { ...payload, description: form.description.trim() };
      }
      if (form.is_virtual && form.meeting_url.trim()) {
        payload = { ...payload, meeting_url: form.meeting_url.trim() };
      }
      if (!form.is_virtual && form.location.trim()) {
        payload = { ...payload, location: form.location.trim() };
      }
      
      const res = await api.post('/events/', payload);
      setForm({ 
        title: '', 
        description: '',
        start_date: '', 
        start_time: '',
        end_date: '', 
        end_time: '',
        is_virtual: true, 
        meeting_url: '',
        location: ''
      });
      setEvents((prev) => [res.data, ...prev]);
    } catch (error) {
      console.error('Error creating event:', error);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Community Events</h1>
        <p className="text-gray-600">Discover and create learning events</p>
      </div>
      <Card className="shadow-sm border-gray-200">
        <CardHeader className="bg-gradient-to-r from-emerald-50 to-green-50">
          <CardTitle className="text-emerald-800">Create an Event</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Basic Info */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Event Title</label>
              <input 
                className="w-full rounded-lg border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-emerald-400/40 focus:border-emerald-400" 
                placeholder="Enter event title" 
                value={form.title} 
                onChange={(e) => setForm((f) => ({...f, title: e.target.value}))} 
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Event Type</label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setForm((f) => ({...f, is_virtual: true}))}
                  className={`flex-1 px-4 py-3 rounded-lg border transition-colors ${
                    form.is_virtual 
                      ? 'bg-emerald-100 border-emerald-300 text-emerald-700' 
                      : 'bg-gray-50 border-gray-300 text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  Virtual
                </button>
                <button
                  type="button"
                  onClick={() => setForm((f) => ({...f, is_virtual: false}))}
                  className={`flex-1 px-4 py-3 rounded-lg border transition-colors ${
                    !form.is_virtual 
                      ? 'bg-emerald-100 border-emerald-300 text-emerald-700' 
                      : 'bg-gray-50 border-gray-300 text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  In-Person
                </button>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Description</label>
            <textarea 
              className="w-full rounded-lg border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-emerald-400/40 focus:border-emerald-400 h-24" 
              placeholder="What's this event about?" 
              value={form.description} 
              onChange={(e) => setForm((f) => ({...f, description: e.target.value}))} 
            />
          </div>

          {/* Date and Time */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-700">Start Date & Time</label>
              <div className="grid grid-cols-2 gap-2">
                <input 
                  type="date"
                  className="rounded-lg border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-emerald-400/40 focus:border-emerald-400" 
                  value={form.start_date} 
                  onChange={(e) => setForm((f) => ({...f, start_date: e.target.value}))} 
                />
                <input 
                  type="time"
                  className="rounded-lg border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-emerald-400/40 focus:border-emerald-400" 
                  value={form.start_time} 
                  onChange={(e) => setForm((f) => ({...f, start_time: e.target.value}))} 
                />
              </div>
            </div>
            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-700">End Date & Time</label>
              <div className="grid grid-cols-2 gap-2">
                <input 
                  type="date"
                  className="rounded-lg border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-emerald-400/40 focus:border-emerald-400" 
                  value={form.end_date} 
                  onChange={(e) => setForm((f) => ({...f, end_date: e.target.value}))} 
                />
                <input 
                  type="time"
                  className="rounded-lg border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-emerald-400/40 focus:border-emerald-400" 
                  value={form.end_time} 
                  onChange={(e) => setForm((f) => ({...f, end_time: e.target.value}))} 
                />
              </div>
            </div>
          </div>

          {/* Location/Meeting URL */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              {form.is_virtual ? 'Meeting URL' : 'Location'}
            </label>
            <input 
              className="w-full rounded-lg border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-emerald-400/40 focus:border-emerald-400" 
              placeholder={form.is_virtual ? 'https://meet.example.com/abc' : 'Event location address'} 
              value={form.is_virtual ? form.meeting_url : form.location} 
              onChange={(e) => setForm((f) => ({...f, [form.is_virtual ? 'meeting_url' : 'location']: e.target.value}))} 
            />
          </div>

          <div className="flex justify-end pt-2">
            <Button 
              onClick={createEvent} 
              disabled={isCreating || !form.title.trim() || !form.start_date || !form.start_time || !form.end_date || !form.end_time}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isCreating ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Creating...
                </div>
              ) : (
                'Create Event'
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="mt-8 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Upcoming Events</h2>
          {isLoading && <div className="text-sm text-gray-500">Loading...</div>}
        </div>
        
        {!isLoading && events.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>No upcoming events yet. Create the first one!</p>
          </div>
        )}
        
        <div className="grid gap-4">
          {events.map((e) => (
            <Card key={e.id} className="hover:shadow-md transition-shadow border-l-4 border-l-emerald-500">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg text-gray-900 mb-1">{e.title}</CardTitle>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(e.start_at).toLocaleDateString()}
                      </div>
                      <div>
                        {new Date(e.start_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(e.end_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                        e.is_virtual 
                          ? 'bg-blue-100 text-blue-700' 
                          : 'bg-green-100 text-green-700'
                      }`}>
                        {e.is_virtual ? 'Virtual' : 'In-Person'}
                      </div>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500">
                    by @{e.created_by_username}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {e.description && (
                  <p className="text-gray-700 mb-3">{e.description}</p>
                )}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {e.is_virtual && e.meeting_url && (
                      <a 
                        className="inline-flex items-center gap-1 text-emerald-600 hover:text-emerald-700 text-sm font-medium" 
                        href={e.meeting_url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Join Meeting
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </a>
                    )}
                    {!e.is_virtual && e.location && (
                      <span className="text-sm text-gray-600">{e.location}</span>
                    )}
                  </div>
                  <Button variant="outline" size="sm" className="border-emerald-200 text-emerald-700 hover:bg-emerald-50">
                    RSVP
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

