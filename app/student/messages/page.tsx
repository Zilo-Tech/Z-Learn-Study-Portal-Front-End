"use client";

import React, { useState, useEffect } from 'react';
import api from '@/lib/api';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { 
  MessageSquare, 
  Send, 
  Search, 
  PaperclipIcon,
  Smile,
  Phone,
  Video,
  Info,
  CheckCheck,
  AlertCircle,
  GraduationCap
} from 'lucide-react';

interface Message {
  id: number;
  content: string;
  timestamp: string;
  sender_id: number;
  is_from_student: boolean;
  read: boolean;
}

interface Conversation {
  id: number;
  tutor: {
    id: number;
    first_name: string;
    last_name: string;
    avatar?: string;
    subjects: string[];
  };
  last_message: Message;
  unread_count: number;
  updated_at: string;
}

export default function StudentMessagesPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation.id);
      markAsRead(selectedConversation.id);
    }
  }, [selectedConversation]);

  const fetchConversations = async () => {
    try {
      setLoading(true);
      const response = await api.get('/student/messages/conversations/');
      setConversations(response.data.results || response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching conversations:', err);
      setError('Failed to load conversations');
      // Mock data for development
      setConversations([
        {
          id: 1,
          tutor: {
            id: 1,
            first_name: 'Dr. Sarah',
            last_name: 'Johnson',
            subjects: ['Mathematics', 'Physics']
          },
          last_message: {
            id: 1,
            content: 'Great job on today\'s assignment! Your understanding of calculus has really improved.',
            timestamp: '2024-01-12T15:30:00Z',
            sender_id: 1,
            is_from_student: false,
            read: false
          },
          unread_count: 1,
          updated_at: '2024-01-12T15:30:00Z'
        },
        {
          id: 2,
          tutor: {
            id: 2,
            first_name: 'Prof. Michael',
            last_name: 'Chen',
            subjects: ['Computer Science']
          },
          last_message: {
            id: 2,
            content: 'See you tomorrow for our programming session!',
            timestamp: '2024-01-12T10:15:00Z',
            sender_id: 999,
            is_from_student: true,
            read: true
          },
          unread_count: 0,
          updated_at: '2024-01-12T10:15:00Z'
        },
        {
          id: 3,
          tutor: {
            id: 3,
            first_name: 'Ms. Emily',
            last_name: 'Davis',
            subjects: ['Chemistry', 'Biology']
          },
          last_message: {
            id: 3,
            content: 'The lab report looks excellent. Well done!',
            timestamp: '2024-01-11T16:45:00Z',
            sender_id: 3,
            is_from_student: false,
            read: true
          },
          unread_count: 0,
          updated_at: '2024-01-11T16:45:00Z'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (conversationId: number) => {
    try {
      const response = await api.get(`/student/messages/conversations/${conversationId}/messages/`);
      setMessages(response.data.results || response.data);
    } catch (err) {
      console.error('Error fetching messages:', err);
      // Mock messages for development
      setMessages([
        {
          id: 1,
          content: 'Hi Dr. Johnson! I have a question about the calculus homework.',
          timestamp: '2024-01-11T14:00:00Z',
          sender_id: 999,
          is_from_student: true,
          read: true
        },
        {
          id: 2,
          content: 'Of course! What specifically are you having trouble with?',
          timestamp: '2024-01-11T14:05:00Z',
          sender_id: 1,
          is_from_student: false,
          read: true
        },
        {
          id: 3,
          content: 'I\'m struggling with integration by parts. Could you explain it again?',
          timestamp: '2024-01-11T14:10:00Z',
          sender_id: 999,
          is_from_student: true,
          read: true
        },
        {
          id: 4,
          content: 'Great job on today\'s assignment! Your understanding of calculus has really improved.',
          timestamp: '2024-01-12T15:30:00Z',
          sender_id: 1,
          is_from_student: false,
          read: false
        }
      ]);
    }
  };

  const markAsRead = async (conversationId: number) => {
    try {
      await api.post(`/student/messages/conversations/${conversationId}/mark-read/`);
      // Update local state
      setConversations(prev => prev.map(conv => 
        conv.id === conversationId ? { ...conv, unread_count: 0 } : conv
      ));
    } catch (err) {
      console.error('Error marking as read:', err);
    }
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversation || sendingMessage) return;

    try {
      setSendingMessage(true);
      const response = await api.post(`/student/messages/conversations/${selectedConversation.id}/messages/`, {
        content: newMessage.trim()
      });
      
      const sentMessage = response.data;
      setMessages(prev => [...prev, sentMessage]);
      setNewMessage('');
      
      // Update conversation list
      setConversations(prev => prev.map(conv => 
        conv.id === selectedConversation.id 
          ? { ...conv, last_message: sentMessage, updated_at: sentMessage.timestamp }
          : conv
      ));
    } catch (err) {
      console.error('Error sending message:', err);
      // For demo purposes, add message locally
      const mockMessage: Message = {
        id: Date.now(),
        content: newMessage.trim(),
        timestamp: new Date().toISOString(),
        sender_id: 999,
        is_from_student: true,
        read: true
      };
      setMessages(prev => [...prev, mockMessage]);
      setNewMessage('');
    } finally {
      setSendingMessage(false);
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const filteredConversations = conversations.filter(conv =>
    conv.tutor.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.tutor.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.tutor.subjects.some(subject => subject.toLowerCase().includes(searchTerm.toLowerCase())) ||
    conv.last_message.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-emerald-100 rounded-lg">
            <MessageSquare className="h-6 w-6 text-emerald-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
            <p className="text-gray-600">Chat with your tutors</p>
          </div>
        </div>
        
        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-1 p-6">
            <div className="animate-pulse space-y-4">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-10 bg-gray-200 rounded"></div>
            </div>
          </Card>
          <Card className="lg:col-span-2 p-6">
            <div className="animate-pulse space-y-4">
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-32 bg-gray-200 rounded"></div>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <div className="p-2 bg-emerald-100 rounded-lg">
          <MessageSquare className="h-6 w-6 text-emerald-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
          <p className="text-gray-600">Chat with your tutors</p>
        </div>
      </div>

      {/* Messages Interface */}
      <div className="grid gap-6 lg:grid-cols-3 h-[600px]">
        {/* Conversations List */}
        <Card className="lg:col-span-1 flex flex-col">
          {/* Search */}
          <div className="p-4 border-b border-gray-200">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search tutors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Conversation List */}
          <div className="flex-1 overflow-y-auto">
            {error && (
              <div className="p-4 text-center text-red-600">
                <AlertCircle className="mx-auto h-8 w-8 mb-2" />
                <p className="text-sm">{error}</p>
              </div>
            )}

            {filteredConversations.length === 0 && !error && (
              <div className="p-8 text-center text-gray-500">
                <MessageSquare className="mx-auto h-8 w-8 mb-2" />
                <p className="text-sm">No conversations found</p>
              </div>
            )}

            {filteredConversations.map((conversation) => (
              <div
                key={conversation.id}
                onClick={() => setSelectedConversation(conversation)}
                className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                  selectedConversation?.id === conversation.id ? 'bg-emerald-50 border-emerald-200' : ''
                }`}
              >
                <div className="flex items-start space-x-3">
                  {conversation.tutor.avatar ? (
                    <Image
                      src={conversation.tutor.avatar}
                      alt={`${conversation.tutor.first_name} ${conversation.tutor.last_name}`}
                      width={40}
                      height={40}
                      className="rounded-full object-cover w-10 h-10"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-semibold text-sm">
                      {getInitials(conversation.tutor.first_name, conversation.tutor.last_name)}
                    </div>
                  )}
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-gray-900 truncate">
                        {conversation.tutor.first_name} {conversation.tutor.last_name}
                      </h3>
                      <div className="flex items-center space-x-1">
                        {conversation.unread_count > 0 && (
                          <span className="bg-emerald-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                            {conversation.unread_count}
                          </span>
                        )}
                        <span className="text-xs text-gray-500">
                          {formatTime(conversation.updated_at)}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-1 mb-1">
                      {conversation.tutor.subjects.slice(0, 2).map((subject, index) => (
                        <span
                          key={index}
                          className="px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded-full"
                        >
                          {subject}
                        </span>
                      ))}
                    </div>
                    
                    <p className={`text-sm truncate mt-1 ${
                      conversation.unread_count > 0 ? 'text-gray-900 font-medium' : 'text-gray-600'
                    }`}>
                      {conversation.last_message.is_from_student ? 'You: ' : ''}
                      {conversation.last_message.content}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Chat Interface */}
        <Card className="lg:col-span-2 flex flex-col">
          {selectedConversation ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      {selectedConversation.tutor.avatar ? (
                        <Image
                          src={selectedConversation.tutor.avatar}
                          alt={`${selectedConversation.tutor.first_name} ${selectedConversation.tutor.last_name}`}
                          width={32}
                          height={32}
                          className="rounded-full object-cover w-8 h-8"
                        />
                      ) : (
                        <div className="w-8 h-8 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-semibold text-sm">
                          {getInitials(selectedConversation.tutor.first_name, selectedConversation.tutor.last_name)}
                        </div>
                      )}
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-100 rounded-full flex items-center justify-center">
                        <GraduationCap className="h-2 w-2 text-emerald-600" />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">
                        {selectedConversation.tutor.first_name} {selectedConversation.tutor.last_name}
                      </h3>
                      <p className="text-xs text-gray-500">
                        {selectedConversation.tutor.subjects.join(', ')}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">
                      <Phone className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Video className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Info className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.is_from_student ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        message.is_from_student
                          ? 'bg-emerald-600 text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                      <div className={`flex items-center justify-end mt-1 space-x-1 ${
                        message.is_from_student ? 'text-emerald-100' : 'text-gray-500'
                      }`}>
                        <span className="text-xs">{formatTime(message.timestamp)}</span>
                        {message.is_from_student && (
                          <CheckCheck className="h-3 w-3" />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Message Input */}
              <div className="p-4 border-t border-gray-200">
                <form onSubmit={sendMessage} className="flex items-center space-x-2">
                  <Button type="button" variant="outline" size="sm">
                    <PaperclipIcon className="h-4 w-4" />
                  </Button>
                  
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type a message..."
                      disabled={sendingMessage}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 pr-10"
                    />
                    <Button type="button" variant="ghost" size="sm" className="absolute right-2 top-1/2 transform -translate-y-1/2">
                      <Smile className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <Button 
                    type="submit" 
                    disabled={!newMessage.trim() || sendingMessage}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white"
                  >
                    {sendingMessage ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                  </Button>
                </form>
              </div>
            </>
          ) : (
            /* No Conversation Selected */
            <div className="flex items-center justify-center h-full text-gray-500">
              <div className="text-center">
                <MessageSquare className="mx-auto h-12 w-12 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Select a tutor</h3>
                <p className="text-sm">Choose a tutor from the list to start messaging</p>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}