"use client";
import React, { useState, useRef, useEffect } from 'react';
import { Send, Loader2, Bot, User, FileText, Brain, HelpCircle } from 'lucide-react';
import { useSession } from 'next-auth/react';
import axios from 'axios';

interface Message {
  id: string;
  sender: 'user' | 'agent';
  text: string;
  timestamp: Date;
  type?: 'text' | 'action' | 'ask' | 'summarize' | 'quiz';
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
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initialize conversation
  useEffect(() => {
    if (!isInitialized) {
      const welcomeMessage: Message = {
        id: Date.now().toString(),
        sender: 'agent',
        text: `Hello! I'm your AI learning assistant. I'm here to help you understand this lesson better. Feel free to ask me questions about the content, request summaries, or take a quick quiz!`,
        timestamp: new Date(),
        type: 'text'
      };
      setMessages([welcomeMessage]);
      setIsInitialized(true);
    }
  }, [isInitialized]);

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
        'https://z-learn-study-portal-backend.onrender.com/api/agent-chat/',
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

      // Add AI response to chat
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'agent',
        text: response.data.response || "I'm here to help! Could you please rephrase your question?",
        timestamp: new Date(),
        type: 'text'
      };

      setMessages(prev => [...prev, aiResponse]);

    } catch (error) {
      console.error('Error sending message to AI:', error);
      
      // Handle different error types
      let errorText = "I'm having trouble connecting right now. Please try again in a moment!";
      
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          errorText = "Your session has expired. Please sign in again to continue using the AI assistant.";
        } else if (error.response?.status === 403) {
          errorText = "You don&apos;t have permission to use the AI assistant for this lesson.";
        } else if (error.response?.data?.error) {
          errorText = error.response.data.error;
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

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b border-gray-200 bg-gradient-to-r from-[#446d6d]/10 to-[#002424]/10 rounded-t-xl">
        <div className="w-8 h-8 bg-gradient-to-r from-[#446d6d] to-[#002424] rounded-full flex items-center justify-center">
          <Bot className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">AI Learning Assistant</h3>
          <p className="text-sm text-gray-600">Ask questions, get summaries, or take quizzes</p>
        </div>
        {_sessionId && (
          <div className="ml-auto text-xs text-gray-400 font-mono">
            Session: {_sessionId.slice(-8)}
          </div>
        )}
      </div>

      {/* Messages */}
      <div className="h-80 overflow-y-auto p-4 space-y-4 bg-gray-50">
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
