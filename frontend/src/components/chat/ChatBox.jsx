import React, { useState, useRef, useEffect } from 'react';
import { PaperAirplaneIcon } from '@heroicons/react/24/solid';
import MessageBubble from './MessageBubble';
import CitationCard from './CitationCard';
import LoadingSpinner from '../common/LoadingSpinner';
import Button from '../common/Button';

const ChatBox = ({ messages, onSendMessage, loading, selectedPapers }) => {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim() && selectedPapers.length > 0) {
      onSendMessage(input);
      setInput('');
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-primary-50 rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4">
              <PaperAirplaneIcon className="h-8 w-8 text-primary-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Start a conversation
            </h3>
            <p className="text-gray-600">
              {selectedPapers.length === 0
                ? 'Select papers to start asking questions'
                : 'Ask questions about the selected papers'}
            </p>
          </div>
        ) : (
          messages.map((msg, index) => (
            <div key={index}>
              {/* Question */}
              <MessageBubble message={msg.question} isUser={true} />
              
              {/* Answer */}
              <MessageBubble message={msg.answer} isUser={false} />
              
              {/* Citations */}
              {msg.citations && msg.citations.length > 0 && (
                <div className="ml-11 mt-4 space-y-2">
                  <p className="text-sm font-medium text-gray-700">Sources:</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {msg.citations.map((citation, citIndex) => (
                      <CitationCard key={citIndex} citation={citation} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
        
        {loading && (
          <div className="flex justify-start mb-4">
            <div className="bg-white border border-gray-200 rounded-lg px-4 py-3">
              <LoadingSpinner size="sm" message="Thinking..." />
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t border-gray-200 p-4 bg-white">
        {selectedPapers.length === 0 ? (
          <div className="text-center py-4 bg-yellow-50 rounded-lg">
            <p className="text-sm text-yellow-800">
              Please select at least one paper to start chatting
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex items-center space-x-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a question about the papers..."
              className="flex-1 input-field"
              disabled={loading}
            />
            <Button
              type="submit"
              disabled={!input.trim() || loading}
              loading={loading}
            >
              <PaperAirplaneIcon className="h-5 w-5" />
            </Button>
          </form>
        )}
        
        {selectedPapers.length > 0 && (
          <div className="mt-2 text-xs text-gray-500">
            Asking about {selectedPapers.length} paper{selectedPapers.length !== 1 ? 's' : ''}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatBox;