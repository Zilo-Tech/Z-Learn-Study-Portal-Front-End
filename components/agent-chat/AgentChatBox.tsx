import React from 'react';

const AgentChatBox = ({ _sessionId, _mockMode = false }: { _sessionId?: string; _mockMode?: boolean }) => {
  // Mock messages for UI - only used when _mockMode is true
  const mockMessages = [
    { sender: 'agent', text: 'Welcome to your study session! How can I help you today?' },
    { sender: 'user', text: 'Can you summarize the key points of this lesson?' },
    { sender: 'agent', text: 'Absolutely! Here are the main takeaways...' }
  ];

  // _sessionId will be used to fetch real messages when _mockMode is false
  const messages = _mockMode ? mockMessages : [];

  return (
    <div className="space-y-3">
      {/* Display session ID if provided */}
      {_sessionId && (
        <div className="text-xs text-gray-400">Session ID: {_sessionId}</div>
      )}
      <div className="bg-gray-100 rounded p-4 h-48 overflow-y-auto flex flex-col gap-2">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <span className={`px-3 py-2 rounded-lg text-sm max-w-xs break-words ${msg.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-white border text-gray-800'}`}>{msg.text}</span>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input className="flex-1 border rounded px-3 py-2" placeholder="Type your message..." disabled />
        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700" disabled>Send</button>
      </div>
    </div>
  );
};

export default AgentChatBox;
