// Test component to debug AI chat responses
"use client";
import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import { API_BASE_URL } from '@/lib/constants';

interface DebugResponse {
  status: number;
  headers: unknown;
  data: unknown;
  dataType?: string;
  dataKeys?: string[];
  error?: boolean;
}

const AgentChatDebugger = () => {
  const { data: session } = useSession();
  const [response, setResponse] = useState<DebugResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const testMessage = async () => {
    if (!session?.accessToken) {
      setError('No authentication token available');
      return;
    }

    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      const result = await axios.post(
        `${API_BASE_URL}/agent-chat/`,
        {
          message: "Hello, this is a test message",
          context: {
            lessonId: "test",
            courseId: "test",
            moduleId: "test",
            lessonContent: "Test lesson content",
            sessionId: "test-session"
          },
          action_type: "ask"
        },
        {
          headers: {
            'Authorization': `Bearer ${session.accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('Full response:', result);
      setResponse({
        status: result.status,
        headers: result.headers,
        data: result.data,
        dataType: typeof result.data,
        dataKeys: result.data && typeof result.data === 'object' ? Object.keys(result.data) : []
      });
    } catch (err: unknown) {
      console.error('Error:', err);
      const error = err as { response?: { data?: unknown; status?: number; headers?: unknown }; message?: string };
      setError(error.response?.data as string || error.message || 'Unknown error');
      if (error.response) {
        setResponse({
          status: error.response.status || 0,
          headers: error.response.headers,
          data: error.response.data,
          error: true
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 border rounded-lg bg-gray-50">
      <h3 className="font-bold mb-4">AI Chat Backend Debugger</h3>
      
      <button
        onClick={testMessage}
        disabled={loading || !session?.accessToken}
        className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50 mb-4"
      >
        {loading ? 'Testing...' : 'Test Backend Response'}
      </button>

      {!session?.accessToken && (
        <p className="text-red-500 mb-4">Please sign in to test the backend</p>
      )}

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-300 rounded">
          <h4 className="font-semibold text-red-800">Error:</h4>
          <pre className="text-sm text-red-700 whitespace-pre-wrap">{JSON.stringify(error, null, 2)}</pre>
        </div>
      )}

      {response && (
        <div className="space-y-4">
          <div className="p-3 bg-white border rounded">
            <h4 className="font-semibold mb-2">Response Details:</h4>
            <pre className="text-sm overflow-auto max-h-96 whitespace-pre-wrap">
              {JSON.stringify(response, null, 2)}
            </pre>
          </div>
          
          {response.data !== null && response.data !== undefined && (
            <div className="p-3 bg-green-100 border border-green-300 rounded">
              <h4 className="font-semibold text-green-800 mb-2">Raw Response Data:</h4>
              <pre className="text-sm text-green-700 whitespace-pre-wrap">
                {JSON.stringify(response.data, null, 2)}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AgentChatDebugger;
