"use client";

import React, { useState, useEffect } from 'react';
import api from '@/lib/api';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  Search, 
  Filter, 
  Calendar, 
  Star,
  Clock,
  MessageSquare,
  TrendingUp,
  Eye,
  MoreHorizontal,
  UserCheck,
  AlertCircle
} from 'lucide-react';
import Image from 'next/image';

interface Student {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  avatar?: string;
  total_sessions: number;
  last_session: string;
  rating_given?: number;
  subjects: string[];
  progress_percentage: number;
  next_session?: string;
  status: 'active' | 'inactive' | 'completed';
}

export default function TutorStudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive' | 'completed'>('all');

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const response = await api.get('/tutor/students/');
      setStudents(response.data.results || response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching students:', err);
      setError('Failed to load students');
      // Mock data for development
      setStudents([
        {
          id: 1,
          first_name: 'Alice',
          last_name: 'Johnson',
          email: 'alice.johnson@email.com',
          total_sessions: 12,
          last_session: '2024-01-10T14:00:00Z',
          rating_given: 5,
          subjects: ['Mathematics', 'Physics'],
          progress_percentage: 78,
          next_session: '2024-01-15T10:00:00Z',
          status: 'active'
        },
        {
          id: 2,
          first_name: 'Bob',
          last_name: 'Smith',
          email: 'bob.smith@email.com',
          total_sessions: 8,
          last_session: '2024-01-08T16:30:00Z',
          rating_given: 4,
          subjects: ['Chemistry'],
          progress_percentage: 65,
          status: 'active'
        },
        {
          id: 3,
          first_name: 'Carol',
          last_name: 'Davis',
          email: 'carol.davis@email.com',
          total_sessions: 20,
          last_session: '2023-12-20T11:00:00Z',
          rating_given: 5,
          subjects: ['Mathematics', 'Computer Science'],
          progress_percentage: 100,
          status: 'completed'
        },
        {
          id: 4,
          first_name: 'David',
          last_name: 'Wilson',
          email: 'david.wilson@email.com',
          total_sessions: 5,
          last_session: '2023-12-15T13:00:00Z',
          subjects: ['Physics'],
          progress_percentage: 35,
          status: 'inactive'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const filteredStudents = students.filter(student => {
    const matchesSearch = 
      student.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.subjects.some(subject => subject.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesFilter = filterStatus === 'all' || student.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'inactive':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'completed':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return UserCheck;
      case 'inactive':
        return AlertCircle;
      case 'completed':
        return Star;
      default:
        return Users;
    }
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-emerald-100 rounded-lg">
            <Users className="h-6 w-6 text-emerald-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Students</h1>
            <p className="text-gray-600">Manage and track your students' progress</p>
          </div>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="p-6">
              <div className="animate-pulse space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
                  <div className="space-y-2 flex-1">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
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
            <Users className="h-6 w-6 text-emerald-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Students</h1>
            <p className="text-gray-600">Manage and track your students' progress</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Total Students</p>
              <p className="text-2xl font-bold text-gray-900">{students.length}</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-emerald-100 rounded-lg">
              <UserCheck className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Active Students</p>
              <p className="text-2xl font-bold text-gray-900">
                {students.filter(s => s.status === 'active').length}
              </p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Star className="h-5 w-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Avg. Rating</p>
              <p className="text-2xl font-bold text-gray-900">
                {students.length > 0 
                  ? (students.reduce((sum, s) => sum + (s.rating_given || 0), 0) / students.filter(s => s.rating_given).length).toFixed(1)
                  : '0'
                }
              </p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <TrendingUp className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Avg. Progress</p>
              <p className="text-2xl font-bold text-gray-900">
                {students.length > 0 
                  ? Math.round(students.reduce((sum, s) => sum + s.progress_percentage, 0) / students.length)
                  : 0
                }%
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search students..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <Filter className="h-4 w-4 text-gray-500" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as 'all' | 'active' | 'inactive' | 'completed')}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="completed">Completed</option>
          </select>
        </div>
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
      {filteredStudents.length === 0 && !loading && !error && (
        <Card className="p-12 text-center">
          <Users className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No students found</h3>
          <p className="text-gray-500 mb-6">
            {searchTerm || filterStatus !== 'all' 
              ? 'Try adjusting your search or filters' 
              : 'Start tutoring to see your students here'}
          </p>
        </Card>
      )}

      {/* Students Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredStudents.map((student) => {
          const StatusIcon = getStatusIcon(student.status);
          
          return (
            <Card key={student.id} className="p-6 hover:shadow-lg transition-all duration-200">
              <div className="space-y-4">
                {/* Student Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    {student.avatar ? (
                      <Image
                        src={student.avatar}
                        alt={`${student.first_name} ${student.last_name}`}
                        width={40}
                        height={40}
                        className="rounded-full object-cover w-10 h-10"
                      />
                    ) : (
                      <div className="w-10 h-10 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center font-semibold">
                        {getInitials(student.first_name, student.last_name)}
                      </div>
                    )}
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {student.first_name} {student.last_name}
                      </h3>
                      <p className="text-sm text-gray-600">{student.email}</p>
                    </div>
                  </div>
                  
                  <div className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(student.status)}`}>
                    <div className="flex items-center space-x-1">
                      <StatusIcon className="h-3 w-3" />
                      <span className="capitalize">{student.status}</span>
                    </div>
                  </div>
                </div>

                {/* Subjects */}
                <div>
                  <p className="text-xs font-medium text-gray-600 mb-1">Subjects</p>
                  <div className="flex flex-wrap gap-1">
                    {student.subjects.map((subject, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                      >
                        {subject}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Progress */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-gray-600">Progress</span>
                    <span className="text-xs text-gray-500">{student.progress_percentage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-emerald-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${student.progress_percentage}%` }}
                    />
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="flex items-center space-x-1 text-gray-500">
                      <Calendar className="h-4 w-4" />
                      <span>Sessions</span>
                    </div>
                    <p className="font-medium text-gray-900">{student.total_sessions}</p>
                  </div>
                  
                  <div>
                    <div className="flex items-center space-x-1 text-gray-500">
                      <Star className="h-4 w-4" />
                      <span>Rating</span>
                    </div>
                    <p className="font-medium text-gray-900">
                      {student.rating_given ? `${student.rating_given}/5` : 'No rating'}
                    </p>
                  </div>
                </div>

                {/* Last Session */}
                <div className="text-sm">
                  <div className="flex items-center space-x-1 text-gray-500 mb-1">
                    <Clock className="h-4 w-4" />
                    <span>Last Session</span>
                  </div>
                  <p className="font-medium text-gray-900">
                    {formatDate(student.last_session)}
                  </p>
                </div>

                {/* Next Session */}
                {student.next_session && (
                  <div className="text-sm">
                    <div className="flex items-center space-x-1 text-emerald-600 mb-1">
                      <Calendar className="h-4 w-4" />
                      <span>Next Session</span>
                    </div>
                    <p className="font-medium text-emerald-700">
                      {formatDate(student.next_session)}
                    </p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">
                      <MessageSquare className="h-4 w-4 mr-1" />
                      Message
                    </Button>
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-1" />
                      Profile
                    </Button>
                  </div>
                  
                  <Button variant="outline" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}