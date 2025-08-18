"use client";

import React, { useState, useEffect } from 'react';
import api from '@/lib/api';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Calendar, 
  Clock, 
  User, 
  BookOpen, 
  Video,
  MessageSquare,
  Plus,
  CheckCircle2,
  XCircle,
  AlertCircle
} from 'lucide-react';

interface Session {
  id: number;
  tutor: {
    id: number;
    name: string;
    subjects: string[];
  };
  subject: string;
  scheduled_time: string;
  duration: number;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  meeting_url?: string;
  notes?: string;
  created_at: string;
}

export default function StudentSessionsPage() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      setLoading(true);
      const response = await api.get('/student/sessions/');
      setSessions(response.data.results || response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching sessions:', err);
      setError('Failed to load sessions');
      // Mock data for development
      setSessions([
        {
          id: 1,
          tutor: {
            id: 1,
            name: 'Dr. Sarah Johnson',
            subjects: ['Mathematics', 'Physics']
          },
          subject: 'Mathematics',
          scheduled_time: '2024-01-15T10:00:00Z',
          duration: 60,
          status: 'scheduled',
          created_at: '2024-01-10T10:00:00Z'
        },
        {
          id: 2,
          tutor: {
            id: 2,
            name: 'Prof. Michael Chen',
            subjects: ['Computer Science', 'Mathematics']
          },
          subject: 'Computer Science',
          scheduled_time: '2024-01-16T14:30:00Z',
          duration: 90,
          status: 'scheduled',
          created_at: '2024-01-11T14:00:00Z'
        },
        {
          id: 3,
          tutor: {
            id: 3,
            name: 'Ms. Emily Davis',
            subjects: ['Chemistry', 'Biology']
          },
          subject: 'Chemistry',
          scheduled_time: '2024-01-12T11:00:00Z',
          duration: 60,
          status: 'completed',
          meeting_url: 'https://meet.google.com/abc-defg-hij',
          created_at: '2024-01-08T09:00:00Z'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'in_progress':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'scheduled':
        return Clock;
      case 'in_progress':
        return AlertCircle;
      case 'completed':
        return CheckCircle2;
      case 'cancelled':
        return XCircle;
      default:
        return Clock;
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-emerald-100 rounded-lg">
            <Calendar className="h-6 w-6 text-emerald-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Sessions</h1>
            <p className="text-gray-600">Manage your tutoring sessions</p>
          </div>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="p-6">
              <div className="animate-pulse space-y-4">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-20 bg-gray-200 rounded"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-emerald-100 rounded-lg">
            <Calendar className="h-6 w-6 text-emerald-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Sessions</h1>
            <p className="text-gray-600">Manage your tutoring sessions</p>
          </div>
        </div>
        
        <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
          <Plus className="h-4 w-4 mr-2" />
          Book New Session
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Calendar className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Total Sessions</p>
              <p className="text-2xl font-bold text-gray-900">{sessions.length}</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Clock className="h-5 w-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Scheduled</p>
              <p className="text-2xl font-bold text-gray-900">
                {sessions.filter(s => s.status === 'scheduled').length}
              </p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-gray-900">
                {sessions.filter(s => s.status === 'completed').length}
              </p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Clock className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Total Hours</p>
              <p className="text-2xl font-bold text-gray-900">
                {sessions.reduce((sum, s) => sum + s.duration, 0) / 60}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Error State */}
      {error && (
        <Card className="p-6 border-red-200 bg-red-50">
          <div className="flex items-center space-x-2 text-red-800">
            <AlertCircle className="h-5 w-5" />
            <p>{error}</p>
          </div>
        </Card>
      )}

      {/* Empty State */}
      {sessions.length === 0 && !loading && !error && (
        <Card className="p-12 text-center">
          <Calendar className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No sessions scheduled</h3>
          <p className="text-gray-500 mb-6">Start learning by booking your first tutoring session</p>
          <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
            <Plus className="h-4 w-4 mr-2" />
            Book Session
          </Button>
        </Card>
      )}

      {/* Sessions Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {sessions.map((session) => {
          const StatusIcon = getStatusIcon(session.status);
          
          return (
            <Card key={session.id} className="p-6 hover:shadow-lg transition-all duration-200">
              <div className="space-y-4">
                {/* Session Header */}
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">{session.subject}</h3>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <User className="h-4 w-4" />
                      <span>{session.tutor.name}</span>
                    </div>
                  </div>
                  
                  <div className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(session.status)}`}>
                    <div className="flex items-center space-x-1">
                      <StatusIcon className="h-3 w-3" />
                      <span className="capitalize">{session.status.replace('_', ' ')}</span>
                    </div>
                  </div>
                </div>

                {/* Tutor Subjects */}
                <div>
                  <p className="text-xs font-medium text-gray-600 mb-1">Tutor Subjects</p>
                  <div className="flex flex-wrap gap-1">
                    {session.tutor.subjects.map((subject, index) => (
                      <span
                        key={index}
                        className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-xs rounded-full"
                      >
                        {subject}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Session Details */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="flex items-center space-x-1 text-gray-500 mb-1">
                      <Calendar className="h-4 w-4" />
                      <span>Date & Time</span>
                    </div>
                    <p className="font-medium text-gray-900">
                      {formatDateTime(session.scheduled_time)}
                    </p>
                  </div>
                  
                  <div>
                    <div className="flex items-center space-x-1 text-gray-500 mb-1">
                      <Clock className="h-4 w-4" />
                      <span>Duration</span>
                    </div>
                    <p className="font-medium text-gray-900">{session.duration} minutes</p>
                  </div>
                </div>

                {/* Meeting URL for completed/scheduled sessions */}
                {session.meeting_url && (
                  <div className="text-sm">
                    <div className="flex items-center space-x-1 text-emerald-600 mb-1">
                      <Video className="h-4 w-4" />
                      <span>Meeting Link</span>
                    </div>
                    <a 
                      href={session.meeting_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-emerald-700 hover:text-emerald-800 underline"
                    >
                      Join Meeting
                    </a>
                  </div>
                )}

                {/* Notes */}
                {session.notes && (
                  <div className="text-sm">
                    <div className="flex items-center space-x-1 text-gray-500 mb-1">
                      <BookOpen className="h-4 w-4" />
                      <span>Notes</span>
                    </div>
                    <p className="font-medium text-gray-900">{session.notes}</p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">
                      <MessageSquare className="h-4 w-4 mr-1" />
                      Message
                    </Button>
                    
                    {session.status === 'scheduled' && (
                      <Button variant="outline" size="sm">
                        <Video className="h-4 w-4 mr-1" />
                        Join
                      </Button>
                    )}
                  </div>
                  
                  {session.status === 'scheduled' && (
                    <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50">
                      Cancel
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
} 