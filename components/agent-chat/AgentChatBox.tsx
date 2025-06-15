"use client";
import React, { useState, useRef, useEffect } from 'react';
import { Send, Loader2, Bot, User, FileText, Brain, HelpCircle, Trash2 } from 'lucide-react';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import { API_BASE_URL } from '@/lib/constants';

interface Message {
  id: string;
  sender: 'user' | 'agent';
  text: string;
  timestamp: Date;
  type?: 'text' | 'action' | 'ask' | 'summarize' | 'quiz';
}

interface HistoryMessage {
  id: number;
  sender: 'user' | 'agent';
  content: string;
  timestamp: string;
}



interface AgentChatBoxProps {
  _sessionId?: string;
  _mockMode?: boolean;
  lessonId?: string;
  courseId?: string;
  moduleId?: string;
  lessonContent?: string;
  onQuickAction?: (action: string) => void;
}

const AgentChatBox = ({ 
  _sessionId, 
  _mockMode = false, 
  lessonId,
  courseId,
  moduleId,
  lessonContent,
  onQuickAction
}: AgentChatBoxProps) => {
  const { data: session } = useSession();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [debugMode, setDebugMode] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load conversation history on mount
  useEffect(() => {
    const loadConversationHistory = async () => {
      if (!lessonId || !courseId || !session?.accessToken) return;
      
      try {
        setIsLoadingHistory(true);
        // Use the new lesson-specific chat history endpoint
        const response = await axios.get(`${API_BASE_URL}/lessons/${lessonId}/chat-history/`, {
          params: {
            course_id: courseId,
            limit: 50
          },
          headers: {
            'Authorization': `Bearer ${session.accessToken}`,
          }
        });

        const historyData = response.data;
        console.log('[AgentChatBox] Loaded conversation history:', historyData);

        if (historyData.messages && Array.isArray(historyData.messages)) {
          const historyMessages: Message[] = historyData.messages.map((msg: HistoryMessage) => ({
            id: msg.id?.toString() || Date.now().toString(),
            sender: msg.sender === 'user' ? 'user' : 'agent',
            text: msg.content || '',
            timestamp: new Date(msg.timestamp),
            type: 'text'
          }));

          setMessages(historyMessages);
        }
      } catch (error) {
        console.error('[AgentChatBox] Failed to load conversation history:', error);
        // Don't show error to user, just start with welcome message
      } finally {
        setIsLoadingHistory(false);
      }
    };

    if (!isInitialized) {
      loadConversationHistory().then(() => {
        // Add welcome message if no history exists
        setMessages(prev => {
          if (prev.length === 0) {
            return [{
              id: Date.now().toString(),
              sender: 'agent',
              text: `Hello! I'm your AI learning assistant. I'm here to help you understand this lesson better. Feel free to ask me questions about the content, request summaries, or take a quick quiz!`,
              timestamp: new Date(),
              type: 'text'
            }];
          }
          return prev;
        });
        setIsInitialized(true);
      });
    }
  }, [isInitialized, lessonId, courseId, session?.accessToken]);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Send message to AI backend
  const sendMessageToAI = async (userMessage: string, actionType?: string) => {
    try {
      setIsLoading(true);
      
      // Check if user is authenticated
      if (!session?.accessToken) {
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          sender: 'agent',
          text: "Please sign in to use the AI assistant.",
          timestamp: new Date(),
          type: 'text'
        };
        setMessages(prev => [...prev, errorMessage]);
        return;
      }
      
      // Add user message to chat
      const newUserMessage: Message = {
        id: Date.now().toString(),
        sender: 'user',
        text: userMessage,
        timestamp: new Date(),
        type: (actionType as 'ask' | 'summarize' | 'quiz') || 'text'
      };
      
      setMessages(prev => [...prev, newUserMessage]);
      setInputText('');

      // Prepare context for AI
      const context = {
        lessonId,
        courseId,
        moduleId,
        lessonContent: lessonContent || '',
        sessionId: _sessionId,
        actionType,
        conversationHistory: messages.slice(-5) // Last 5 messages for context
      };

      // Call your AI backend endpoint with authentication
      const response = await axios.post(
        `${API_BASE_URL}/agent-chat/`,
        {
          message: userMessage,
          context: context,
          action_type: actionType
        },
        {
          headers: {
            'Authorization': `Bearer ${session.accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('[AgentChatBox] Backend response:', response.data);
      console.log('[AgentChatBox] Response status:', response.status);
      console.log('[AgentChatBox] Response headers:', response.headers);

      // Handle different possible response formats from backend
      let aiResponseText = '';
      if (response.data) {
        console.log('[AgentChatBox] Response data type:', typeof response.data);
        console.log('[AgentChatBox] Response data keys:', Object.keys(response.data));
        
        // Try different possible field names for the AI response
        aiResponseText = response.data.agent_message || 
                        response.data.response || 
                        response.data.message || 
                        response.data.content || 
                        response.data.reply ||
                        response.data.answer ||
                        response.data.text ||
                        '';
        
        // If response.data is a string, use it directly
        if (typeof response.data === 'string') {
          aiResponseText = response.data;
        }
        
        console.log('[AgentChatBox] Extracted AI response text:', aiResponseText);
      }

      // Fallback message if no valid response found
      if (!aiResponseText || aiResponseText.trim() === '') {
        console.warn('[AgentChatBox] No valid response text found in:', response.data);
        aiResponseText = "I received your message, but I'm having trouble formulating a response right now. Could you please rephrase your question?";
      }

      // Add AI response to chat
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'agent',
        text: aiResponseText,
        timestamp: new Date(),
        type: 'text'
      };

      setMessages(prev => [...prev, aiResponse]);

    } catch (error) {
      console.error('[AgentChatBox] Error sending message to AI:', error);
      
      // Log the full error details for debugging
      if (axios.isAxiosError(error)) {
        console.error('[AgentChatBox] Response data:', error.response?.data);
        console.error('[AgentChatBox] Response status:', error.response?.status);
        console.error('[AgentChatBox] Response headers:', error.response?.headers);
      }
      
      // Handle different error types
      let errorText = "I'm having trouble connecting right now. Please try again in a moment!";
      
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          errorText = "Your session has expired. Please sign in again to continue using the AI assistant.";
        } else if (error.response?.status === 403) {
          errorText = "You don&apos;t have permission to use the AI assistant for this lesson.";
        } else if (error.response?.status === 500) {
          errorText = "The AI service is temporarily unavailable. Please try again in a moment.";
        } else if (error.response?.data?.error) {
          errorText = error.response.data.error;
        } else if (error.response?.data?.detail) {
          errorText = error.response.data.detail;
        } else if (error.response?.data) {
          // If there's response data but no specific error field, show generic message
          errorText = "I encountered an issue processing your request. Please try rephrasing your question.";
        }
      }
      
      // Fallback response for errors
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'agent',
        text: _mockMode ? getMockResponse(userMessage, actionType) : errorText,
        timestamp: new Date(),
        type: 'text'
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Mock responses for development/testing
  const getMockResponse = (message: string, actionType?: string) => {
    switch (actionType) {
      case 'summarize':
        return "Here's a summary of this lesson: This lesson covers the fundamental concepts and provides practical examples to help you understand the core principles. Key takeaways include understanding the basic definitions, recognizing real-world applications, and being able to apply these concepts in practice.";
      
      case 'quiz':
        return "Great! Let's test your knowledge:\n\n1. What is the main concept discussed in this lesson?\n2. Can you give an example of how this applies in real life?\n3. What are the key benefits of understanding this topic?\n\nTake your time to think about these questions!";
      
      case 'ask':
        return "That's a great question! Based on the lesson content, here's what I can explain: The topic you're asking about is fundamental to understanding the broader concepts we're covering. Let me break it down in simple terms...";
      
      default:
        if (message.toLowerCase().includes('help')) {
          return "I'm here to help! You can ask me questions about the lesson, request a summary, or take a quiz. What would you like to know?";
        }
        return "Thanks for your message! I understand you're asking about the lesson content. Based on what we've covered, here's my response to help clarify things for you...";
    }
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputText.trim() && !isLoading) {
      sendMessageToAI(inputText.trim());
    }
  };

  // Handle quick action buttons
  const handleQuickAction = async (actionType: string, actionText: string) => {
    await sendMessageToAI(actionText, actionType);
    onQuickAction?.(actionType);
  };

  // Clear conversation
  const clearConversation = () => {
    setMessages([{
      id: Date.now().toString(),
      sender: 'agent',
      text: `Hello! I'm your AI learning assistant. I'm here to help you understand this lesson better. Feel free to ask me questions about the content, request summaries, or take a quick quiz!`,
      timestamp: new Date(),
      type: 'text'
    }]);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b border-gray-200 bg-gradient-to-r from-[#446d6d]/10 to-[#002424]/10 rounded-t-xl">
        <div className="w-8 h-8 bg-gradient-to-r from-[#446d6d] to-[#002424] rounded-full flex items-center justify-center">
          <Bot className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900">AI Learning Assistant</h3>
          <p className="text-sm text-gray-600">Ask questions, get summaries, or take quizzes</p>
        </div>
        
        {/* Action buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setDebugMode(!debugMode)}
            className="p-1.5 text-gray-500 hover:text-[#446d6d] transition-colors"
            title="Toggle debug mode"
          >
            <FileText className="w-4 h-4" />
          </button>
          <button
            onClick={clearConversation}
            className="p-1.5 text-gray-500 hover:text-red-500 transition-colors"
            title="Clear conversation"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
        
        {_sessionId && (
          <div className="text-xs text-gray-400 font-mono">
            Session: {_sessionId.slice(-8)}
          </div>
        )}
      </div>

      {/* Messages */}
      <div className="h-80 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {/* Loading history indicator */}
        {isLoadingHistory && (
          <div className="flex justify-center items-center py-4">
            <div className="flex items-center gap-2 text-gray-500">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-sm">Loading conversation history...</span>
            </div>
          </div>
        )}
        
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-xl px-4 py-3 shadow-sm ${
                message.sender === 'user'
                  ? 'bg-gradient-to-r from-[#446d6d] to-[#002424] text-white'
                  : 'bg-white border border-gray-200 text-gray-800'
              }`}
            >
              <div className="flex items-start gap-2">
                {message.sender === 'agent' && (
                  <Bot className="w-4 h-4 mt-1 text-[#446d6d] flex-shrink-0" />
                )}
                {message.sender === 'user' && (
                  <User className="w-4 h-4 mt-1 text-white/80 flex-shrink-0" />
                )}
                <div className="flex-1">
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">
                    {message.text}
                  </p>
                  <span className={`text-xs mt-1 block ${
                    message.sender === 'user' ? 'text-white/70' : 'text-gray-500'
                  }`}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {/* Loading indicator */}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white border border-gray-200 rounded-xl px-4 py-3 shadow-sm">
              <div className="flex items-center gap-2">
                <Bot className="w-4 h-4 text-[#446d6d]" />
                <Loader2 className="w-4 h-4 animate-spin text-[#446d6d]" />
                <span className="text-sm text-gray-600">Thinking...</span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Debug Panel */}
      {debugMode && (
        <div className="px-4 py-3 border-t border-gray-200 bg-yellow-50">
          <div className="text-xs">
            <div className="font-semibold text-yellow-800 mb-2">Debug Information</div>
            <div className="space-y-1 text-yellow-700">
              <div>Lesson ID: {lessonId || 'Not set'}</div>
              <div>Course ID: {courseId || 'Not set'}</div>
              <div>Module ID: {moduleId || 'Not set'}</div>
              <div>Session Token: {session?.accessToken ? 'Present' : 'Missing'}</div>
              <div>API Base URL: {API_BASE_URL}</div>
              <div>Messages Count: {messages.length}</div>
            </div>
          </div>
        </div>
      )}

      {/* Quick Action Buttons */}
      <div className="px-4 py-3 border-t border-gray-200 bg-gray-50">
        <div className="flex gap-2 mb-3">
          <button
            onClick={() => handleQuickAction('ask', 'I have a question about this lesson. Can you help me understand it better?')}
            disabled={isLoading}
            className="flex items-center gap-1 px-3 py-1.5 bg-blue-100 text-blue-700 hover:bg-blue-200 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-sm font-medium transition-colors"
          >
            <HelpCircle className="w-4 h-4" />
            Ask Question
          </button>
          
          <button
            onClick={() => handleQuickAction('summarize', 'Please provide a summary of this lesson\'s key points and main concepts.')}
            disabled={isLoading}
            className="flex items-center gap-1 px-3 py-1.5 bg-green-100 text-green-700 hover:bg-green-200 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-sm font-medium transition-colors"
          >
            <FileText className="w-4 h-4" />
            Summarize
          </button>
          
          <button
            onClick={() => handleQuickAction('quiz', 'Can you create a quick quiz to test my understanding of this lesson?')}
            disabled={isLoading}
            className="flex items-center gap-1 px-3 py-1.5 bg-purple-100 text-purple-700 hover:bg-purple-200 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-sm font-medium transition-colors"
          >
            <Brain className="w-4 h-4" />
            Quiz Me
          </button>
        </div>
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200 bg-white rounded-b-xl">
        <div className="flex gap-3">
          <input
            ref={inputRef}
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type your question or message..."
            disabled={isLoading}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#446d6d] focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <button
            type="submit"
            disabled={!inputText.trim() || isLoading}
            className="px-6 py-2 bg-gradient-to-r from-[#446d6d] to-[#002424] text-white rounded-lg hover:from-[#446d6d]/80 hover:to-[#002424]/80 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-2 font-medium shadow-sm hover:shadow-md"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
            Send
          </button>
        </div>
      </form>
    </div>
  );
};

export default AgentChatBox;
