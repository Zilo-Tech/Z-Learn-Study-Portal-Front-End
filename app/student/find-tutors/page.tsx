"use client";

import React, { useState, useEffect, useCallback } from 'react';
import api from '@/lib/api';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { 
  Search, 
  Filter, 
  Star, 
  Calendar, 
  DollarSign,
  MapPin,
  Clock,
  MessageSquare,
  Heart,
  GraduationCap,
  Award,
  BookOpen
} from 'lucide-react';

interface Tutor {
  id: number;
  first_name: string;
  last_name: string;
  avatar?: string;
  bio: string;
  subjects: string[];
  hourly_rate: number;
  rating: number;
  total_reviews: number;
  total_sessions: number;
  years_experience: number;
  education: string;
  availability_count: number;
  is_online: boolean;
  location?: string;
  languages: string[];
}

export default function FindTutorsPage() {
  const [tutors, setTutors] = useState<Tutor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [priceRange, setPriceRange] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('rating');
  const [favorites, setFavorites] = useState<number[]>([]);

  const subjects = [
    'Mathematics', 'Physics', 'Chemistry', 'Biology', 'Computer Science',
    'English', 'History', 'Geography', 'Economics', 'Psychology'
  ];

  const fetchTutors = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (selectedSubject !== 'all') params.append('subject', selectedSubject);
      if (priceRange !== 'all') params.append('price_range', priceRange);
      params.append('sort_by', sortBy);

      const response = await api.get(`/student/tutors/?${params.toString()}`);
      setTutors(response.data.results || response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching tutors:', err);
      setError('Failed to load tutors');
      // Mock data for development
      setTutors([
        {
          id: 1,
          first_name: 'Dr. Sarah',
          last_name: 'Johnson',
          bio: 'Experienced mathematics professor with 10+ years of teaching experience. Specializes in calculus and algebra.',
          subjects: ['Mathematics', 'Physics'],
          hourly_rate: 45,
          rating: 4.9,
          total_reviews: 127,
          total_sessions: 890,
          years_experience: 10,
          education: 'PhD in Mathematics, MIT',
          availability_count: 12,
          is_online: true,
          location: 'Boston, MA',
          languages: ['English', 'Spanish']
        },
        {
          id: 2,
          first_name: 'Prof. Michael',
          last_name: 'Chen',
          bio: 'Computer Science expert with industry experience at Google and Microsoft. Passionate about teaching programming.',
          subjects: ['Computer Science', 'Mathematics'],
          hourly_rate: 60,
          rating: 4.8,
          total_reviews: 93,
          total_sessions: 654,
          years_experience: 8,
          education: 'MS Computer Science, Stanford',
          availability_count: 8,
          is_online: false,
          location: 'San Francisco, CA',
          languages: ['English', 'Mandarin']
        },
        {
          id: 3,
          first_name: 'Ms. Emily',
          last_name: 'Davis',
          bio: 'Chemistry and Biology tutor with a focus on making complex concepts simple and understandable.',
          subjects: ['Chemistry', 'Biology'],
          hourly_rate: 35,
          rating: 4.7,
          total_reviews: 156,
          total_sessions: 1200,
          years_experience: 6,
          education: 'MS Chemistry, UC Berkeley',
          availability_count: 15,
          is_online: true,
          location: 'Los Angeles, CA',
          languages: ['English']
        },
        {
          id: 4,
          first_name: 'Dr. James',
          last_name: 'Wilson',
          bio: 'Physics researcher and educator. Expert in quantum mechanics and classical physics.',
          subjects: ['Physics', 'Mathematics'],
          hourly_rate: 50,
          rating: 4.9,
          total_reviews: 78,
          total_sessions: 432,
          years_experience: 12,
          education: 'PhD Physics, Caltech',
          availability_count: 6,
          is_online: true,
          location: 'Pasadena, CA',
          languages: ['English', 'German']
        }
      ]);
    } finally {
      setLoading(false);
    }
  }, [selectedSubject, priceRange, sortBy]);

  useEffect(() => {
    fetchTutors();
  }, [fetchTutors]);

  const toggleFavorite = (tutorId: number) => {
    setFavorites(prev => 
      prev.includes(tutorId) 
        ? prev.filter(id => id !== tutorId)
        : [...prev, tutorId]
    );
  };

  const bookSession = async (tutorId: number) => {
    try {
      // Navigate to booking page or open booking modal
      console.log('Booking session with tutor:', tutorId);
    } catch (err) {
      console.error('Error booking session:', err);
    }
  };

  const filteredTutors = tutors.filter(tutor => {
    const matchesSearch = 
      tutor.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tutor.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tutor.subjects.some(subject => subject.toLowerCase().includes(searchTerm.toLowerCase())) ||
      tutor.bio.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch;
  });

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-emerald-100 rounded-lg">
            <Search className="h-6 w-6 text-emerald-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Find Tutors</h1>
            <p className="text-gray-600">Discover expert tutors for your subjects</p>
          </div>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="p-6">
              <div className="animate-pulse space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="h-12 w-12 bg-gray-200 rounded-full"></div>
                  <div className="space-y-2 flex-1">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
                <div className="h-20 bg-gray-200 rounded"></div>
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
      <div className="flex items-center space-x-3">
        <div className="p-2 bg-emerald-100 rounded-lg">
          <Search className="h-6 w-6 text-emerald-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Find Tutors</h1>
          <p className="text-gray-600">Discover expert tutors for your subjects</p>
        </div>
      </div>

      {/* Search and Filters */}
      <Card className="p-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          {/* Search */}
          <div className="lg:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search tutors, subjects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Subject Filter */}
          <div>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option value="all">All Subjects</option>
              {subjects.map(subject => (
                <option key={subject} value={subject}>{subject}</option>
              ))}
            </select>
          </div>

          {/* Price Range */}
          <div>
            <select
              value={priceRange}
              onChange={(e) => setPriceRange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option value="all">Any Price</option>
              <option value="0-30">$0 - $30/hr</option>
              <option value="30-50">$30 - $50/hr</option>
              <option value="50-80">$50 - $80/hr</option>
              <option value="80+">$80+/hr</option>
            </select>
          </div>

          {/* Sort By */}
          <div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option value="rating">Highest Rated</option>
              <option value="price_low">Price: Low to High</option>
              <option value="price_high">Price: High to Low</option>
              <option value="experience">Most Experienced</option>
              <option value="sessions">Most Sessions</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <p className="text-gray-600">
          {filteredTutors.length} tutor{filteredTutors.length !== 1 ? 's' : ''} found
        </p>
        <div className="flex items-center space-x-2">
          <Filter className="h-4 w-4 text-gray-500" />
          <span className="text-sm text-gray-500">
            {selectedSubject !== 'all' && `${selectedSubject} • `}
            {priceRange !== 'all' && `${priceRange} • `}
            Sorted by {sortBy.replace('_', ' ')}
          </span>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <Card className="p-6 border-red-200 bg-red-50">
          <div className="flex items-center space-x-2 text-red-800">
            <Search className="h-5 w-5" />
            <p>{error}</p>
          </div>
        </Card>
      )}

      {/* Empty State */}
      {filteredTutors.length === 0 && !loading && !error && (
        <Card className="p-12 text-center">
          <Search className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No tutors found</h3>
          <p className="text-gray-500 mb-6">
            Try adjusting your search criteria or browse all available tutors
          </p>
          <Button 
            onClick={() => {
              setSearchTerm('');
              setSelectedSubject('all');
              setPriceRange('all');
            }}
            className="bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            Clear Filters
          </Button>
        </Card>
      )}

      {/* Tutors Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredTutors.map((tutor) => (
          <Card key={tutor.id} className="p-6 hover:shadow-lg transition-all duration-200">
            <div className="space-y-4">
              {/* Tutor Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    {tutor.avatar ? (
                      <Image
                        src={tutor.avatar}
                        alt={`${tutor.first_name} ${tutor.last_name}`}
                        width={48}
                        height={48}
                        className="rounded-full object-cover w-12 h-12"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-semibold">
                        {getInitials(tutor.first_name, tutor.last_name)}
                      </div>
                    )}
                    {tutor.is_online && (
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full"></div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {tutor.first_name} {tutor.last_name}
                    </h3>
                    <div className="flex items-center space-x-1 text-sm">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="font-medium">{tutor.rating}</span>
                      <span className="text-gray-500">({tutor.total_reviews})</span>
                    </div>
                  </div>
                </div>
                
                <button
                  onClick={() => toggleFavorite(tutor.id)}
                  className={`p-2 rounded-full transition-colors ${
                    favorites.includes(tutor.id)
                      ? 'text-red-600 bg-red-50'
                      : 'text-gray-400 hover:text-red-600 hover:bg-red-50'
                  }`}
                >
                  <Heart className={`h-4 w-4 ${favorites.includes(tutor.id) ? 'fill-current' : ''}`} />
                </button>
              </div>

              {/* Subjects */}
              <div className="flex flex-wrap gap-1">
                {tutor.subjects.map((subject, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-emerald-100 text-emerald-800 text-xs rounded-full"
                  >
                    {subject}
                  </span>
                ))}
              </div>

              {/* Bio */}
              <p className="text-sm text-gray-600 line-clamp-2">{tutor.bio}</p>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="flex items-center space-x-1 text-gray-500">
                    <DollarSign className="h-4 w-4" />
                    <span>Rate</span>
                  </div>
                  <p className="font-medium text-gray-900">${tutor.hourly_rate}/hr</p>
                </div>
                
                <div>
                  <div className="flex items-center space-x-1 text-gray-500">
                    <BookOpen className="h-4 w-4" />
                    <span>Sessions</span>
                  </div>
                  <p className="font-medium text-gray-900">{tutor.total_sessions}</p>
                </div>
              </div>

              {/* Experience & Education */}
              <div className="space-y-2 text-sm">
                <div className="flex items-center space-x-2">
                  <Award className="h-4 w-4 text-gray-500" />
                  <span className="text-gray-600">{tutor.years_experience} years experience</span>
                </div>
                <div className="flex items-center space-x-2">
                  <GraduationCap className="h-4 w-4 text-gray-500" />
                  <span className="text-gray-600 line-clamp-1">{tutor.education}</span>
                </div>
                {tutor.location && (
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <span className="text-gray-600">{tutor.location}</span>
                  </div>
                )}
              </div>

              {/* Availability */}
              <div className="flex items-center space-x-2 text-sm">
                <Clock className="h-4 w-4 text-emerald-500" />
                <span className="text-emerald-600">
                  {tutor.availability_count} slots available this week
                </span>
              </div>

              {/* Actions */}
              <div className="flex items-center space-x-2 pt-2 border-t border-gray-100">
                <Button 
                  variant="outline" 
                  size="sm"
                  className="flex-1"
                >
                  <MessageSquare className="h-4 w-4 mr-1" />
                  Message
                </Button>
                <Button 
                  size="sm"
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
                  onClick={() => bookSession(tutor.id)}
                >
                  <Calendar className="h-4 w-4 mr-1" />
                  Book Session
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Load More Button (if applicable) */}
      {filteredTutors.length > 0 && (
        <div className="text-center">
          <Button variant="outline" className="px-8">
            Load More Tutors
          </Button>
        </div>
      )}
    </div>
  );
}