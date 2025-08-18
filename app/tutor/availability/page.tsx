"use client";

import React, { useState, useEffect } from 'react';
import api from '@/lib/api';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Clock, 
  Calendar, 
  Plus, 
  Save, 
  RotateCcw,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';

interface TimeSlot {
  start_time: string;
  end_time: string;
}

interface Availability {
  id?: number;
  day_of_week: number;
  time_slots: TimeSlot[];
}

const DAYS_OF_WEEK = [
  { id: 0, name: 'Monday', short: 'Mon' },
  { id: 1, name: 'Tuesday', short: 'Tue' },
  { id: 2, name: 'Wednesday', short: 'Wed' },
  { id: 3, name: 'Thursday', short: 'Thu' },
  { id: 4, name: 'Friday', short: 'Fri' },
  { id: 5, name: 'Saturday', short: 'Sat' },
  { id: 6, name: 'Sunday', short: 'Sun' },
];

const TIME_OPTIONS = Array.from({ length: 48 }, (_, i) => {
  const hour = Math.floor(i / 2);
  const minute = i % 2 === 0 ? '00' : '30';
  const time24 = `${hour.toString().padStart(2, '0')}:${minute}`;
  const hour12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
  const ampm = hour < 12 ? 'AM' : 'PM';
  const time12 = `${hour12}:${minute} ${ampm}`;
  return { value: time24, label: time12 };
});

export default function AvailabilityPage() {
  const [availability, setAvailability] = useState<Availability[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchAvailability();
  }, []);

  const fetchAvailability = async () => {
    try {
      setLoading(true);
      const response = await api.get('/tutor/availability/');
      const availabilityData: Availability[] = response.data.results || response.data;
      
      // Initialize availability for all days
      const fullWeekAvailability = DAYS_OF_WEEK.map(day => {
        const existing = availabilityData.find((a) => a.day_of_week === day.id);
        return existing || {
          day_of_week: day.id,
          time_slots: []
        };
      });
      
      setAvailability(fullWeekAvailability);
      setError(null);
    } catch (err) {
      console.error('Error fetching availability:', err);
      setError('Failed to load availability');
      // Initialize empty availability if fetch fails
      setAvailability(DAYS_OF_WEEK.map(day => ({
        day_of_week: day.id,
        time_slots: []
      })));
    } finally {
      setLoading(false);
    }
  };

  const addTimeSlot = (dayIndex: number) => {
    const updatedAvailability = [...availability];
    updatedAvailability[dayIndex].time_slots.push({
      start_time: '09:00',
      end_time: '10:00'
    });
    setAvailability(updatedAvailability);
  };

  const removeTimeSlot = (dayIndex: number, slotIndex: number) => {
    const updatedAvailability = [...availability];
    updatedAvailability[dayIndex].time_slots.splice(slotIndex, 1);
    setAvailability(updatedAvailability);
  };

  const updateTimeSlot = (dayIndex: number, slotIndex: number, field: 'start_time' | 'end_time', value: string) => {
    const updatedAvailability = [...availability];
    updatedAvailability[dayIndex].time_slots[slotIndex][field] = value;
    setAvailability(updatedAvailability);
  };

  const saveAvailability = async () => {
    try {
      setSaving(true);
      setError(null);
      
      for (const dayAvailability of availability) {
        if (dayAvailability.time_slots.length > 0) {
          if (dayAvailability.id) {
            // Update existing
            await api.patch(`/tutor/availability/${dayAvailability.id}/`, dayAvailability);
          } else {
            // Create new
            await api.post('/tutor/availability/', dayAvailability);
          }
        } else if (dayAvailability.id) {
          // Delete if no time slots
          await api.delete(`/tutor/availability/${dayAvailability.id}/`);
        }
      }
      
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      fetchAvailability(); // Refresh to get updated IDs
    } catch (err) {
      console.error('Error saving availability:', err);
      setError('Failed to save availability');
    } finally {
      setSaving(false);
    }
  };

  const resetAvailability = () => {
    setAvailability(DAYS_OF_WEEK.map(day => ({
      day_of_week: day.id,
      time_slots: []
    })));
    setSuccess(false);
    setError(null);
  };

  const copyToAllDays = (dayIndex: number) => {
    const sourceTimeSlots = availability[dayIndex].time_slots;
    const updatedAvailability = availability.map(day => ({
      ...day,
      time_slots: [...sourceTimeSlots]
    }));
    setAvailability(updatedAvailability);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-emerald-100 rounded-lg">
            <Clock className="h-6 w-6 text-emerald-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Availability</h1>
            <p className="text-gray-600">Set your teaching schedule</p>
          </div>
        </div>
        
        <div className="grid gap-4">
          {[...Array(7)].map((_, i) => (
            <Card key={i} className="p-6">
              <div className="animate-pulse space-y-4">
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                <div className="h-10 bg-gray-200 rounded"></div>
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
            <Clock className="h-6 w-6 text-emerald-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Availability</h1>
            <p className="text-gray-600">Set your teaching schedule for students to book sessions</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button 
            variant="outline" 
            onClick={resetAvailability}
            disabled={saving}
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset All
          </Button>
          <Button 
            onClick={saveAvailability}
            disabled={saving}
            className="bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            {saving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Schedule
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Status Messages */}
      {error && (
        <Card className="p-4 border-red-200 bg-red-50">
          <div className="flex items-center space-x-2 text-red-800">
            <AlertCircle className="h-5 w-5" />
            <p>{error}</p>
          </div>
        </Card>
      )}

      {success && (
        <Card className="p-4 border-emerald-200 bg-emerald-50">
          <div className="flex items-center space-x-2 text-emerald-800">
            <CheckCircle2 className="h-5 w-5" />
            <p>Availability schedule saved successfully!</p>
          </div>
        </Card>
      )}

      {/* Availability Grid */}
      <div className="space-y-4">
        {availability.map((dayAvailability, dayIndex) => {
          const dayInfo = DAYS_OF_WEEK[dayIndex];
          
          return (
            <Card key={dayInfo.id} className="p-6">
              <div className="space-y-4">
                {/* Day Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-emerald-100 text-emerald-700 rounded-lg flex items-center justify-center font-semibold">
                      {dayInfo.short}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{dayInfo.name}</h3>
                      <p className="text-sm text-gray-500">
                        {dayAvailability.time_slots.length} time slot{dayAvailability.time_slots.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {dayAvailability.time_slots.length > 0 && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => copyToAllDays(dayIndex)}
                      >
                        Copy to All Days
                      </Button>
                    )}
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => addTimeSlot(dayIndex)}
                      className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add Time Slot
                    </Button>
                  </div>
                </div>

                {/* Time Slots */}
                {dayAvailability.time_slots.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Calendar className="mx-auto h-8 w-8 mb-2" />
                    <p>No time slots set for {dayInfo.name}</p>
                    <p className="text-sm">Click "Add Time Slot" to set your availability</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {dayAvailability.time_slots.map((slot, slotIndex) => (
                      <div key={slotIndex} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-2 flex-1">
                          <select
                            value={slot.start_time}
                            onChange={(e) => updateTimeSlot(dayIndex, slotIndex, 'start_time', e.target.value)}
                            className="px-3 py-1.5 border border-gray-300 rounded focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                          >
                            {TIME_OPTIONS.map(time => (
                              <option key={time.value} value={time.value}>
                                {time.label}
                              </option>
                            ))}
                          </select>
                          
                          <span className="text-gray-500">to</span>
                          
                          <select
                            value={slot.end_time}
                            onChange={(e) => updateTimeSlot(dayIndex, slotIndex, 'end_time', e.target.value)}
                            className="px-3 py-1.5 border border-gray-300 rounded focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                          >
                            {TIME_OPTIONS.map(time => (
                              <option key={time.value} value={time.value}>
                                {time.label}
                              </option>
                            ))}
                          </select>
                        </div>
                        
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => removeTimeSlot(dayIndex, slotIndex)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </Card>
          );
        })}
      </div>

      {/* Quick Setup Tips */}
      <Card className="p-6 bg-blue-50 border-blue-200">
        <h3 className="font-semibold text-blue-900 mb-2">Quick Setup Tips</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Set consistent time slots across multiple days using "Copy to All Days"</li>
          <li>• Students can only book sessions during your available time slots</li>
          <li>• You can add multiple time slots per day for flexible scheduling</li>
          <li>• Remember to save your changes after making updates</li>
        </ul>
      </Card>
    </div>
  );
}