/* eslint-disable @typescript-eslint/no-explicit-any */

'use client';

import { useState } from 'react';
import { MessageCircle, Send, ArrowLeft, Bot, User } from 'lucide-react';
import Link from 'next/link';

export default function DemoPage() {
  const [messages, setMessages] = useState([
    {
      type: 'ai',
      content: 'Hello! I\'m the AutoAssistPro AI assistant. I can help answer questions about our consulting services, pricing, and how we can support your business. What would you like to know?'
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage = inputValue.trim();
    setInputValue('');
    
    // Add user message
    setMessages(prev => [...prev, { type: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
        const response = await fetch('https://n8n-production-26f5.up.railway.app/webhook/44a5dd65-4e87-4e02-bc22-b5fe27350fd6?demo=true', {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: userMessage }),
        });

        if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
        }

        const aiResponse = await response.text();
        
        // Add AI response (should now be clean text)
        setMessages(prev => [...prev, { type: 'ai', content: aiResponse }]);
    } catch (error) {
        console.error('Error:', error);
        setMessages(prev => [...prev, { 
        type: 'ai', 
        content: 'Sorry, I\'m having trouble connecting right now. Please try again in a moment.' 
        }]);
    } finally {
        setIsLoading(false);
    }
    };

  const handleKeyPress = (e: { key: string; shiftKey: any; preventDefault: () => void; }) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950">
      {/* Header */}
      <header className="container mx-auto px-6 py-6">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 text-white hover:text-blue-300 transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span>Back to AutoAssistPro</span>
          </Link>
          <div className="bg-orange-500/20 border border-orange-500/30 rounded-lg px-4 py-2">
            <span className="text-orange-300 text-sm font-medium">DEMO MODE</span>
          </div>
        </div>
      </header>

      {/* Chat Interface */}
      <div className="container mx-auto px-6 pb-6">
        <div className="max-w-4xl mx-auto bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 overflow-hidden">
          {/* Chat Header */}
          <div className="bg-gradient-to-r from-blue-600 to-cyan-600 p-6">
            <h1 className="text-2xl font-bold text-white flex items-center gap-3">
              <MessageCircle className="w-8 h-8" />
              AutoAssistPro Demo
            </h1>
            <p className="text-blue-100 mt-2">Experience AI-powered customer engagement</p>
          </div>

          {/* Messages Area */}
            <div className="h-96 p-6 overflow-y-auto overflow-x-hidden bg-slate-900/50 space-y-4">
            {messages.map((message, index) => (
                <div key={index} className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`flex gap-3 max-w-[80%] ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    message.type === 'user' 
                        ? 'bg-gradient-to-r from-blue-600 to-cyan-600' 
                        : 'bg-gradient-to-r from-purple-600 to-pink-600'
                    }`}>
                    {message.type === 'user' ? <User className="w-4 h-4 text-white" /> : <Bot className="w-4 h-4 text-white" />}
                    </div>
                    <div className={`rounded-lg p-4 min-w-0 flex-1 ${
                    message.type === 'user' 
                        ? 'bg-blue-600/80 text-white' 
                        : 'bg-white/10 text-white border border-white/20'
                    }`}>
                    <p className="text-sm break-words whitespace-pre-wrap leading-relaxed">{message.content}</p>
                    </div>
                </div>
                </div>
            ))}
            
            {isLoading && (
                <div className="flex gap-3 justify-start">
                <div className="flex gap-3 max-w-[80%]">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-gradient-to-r from-purple-600 to-pink-600">
                    <Bot className="w-4 h-4 text-white" />
                    </div>
                    <div className="bg-white/10 text-white border border-white/20 rounded-lg p-4 min-w-0 flex-1">
                    <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                        <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    </div>
                    </div>
                </div>
                </div>
            )}
            </div>

          {/* Input Area */}
          <div className="p-6 border-t border-white/20">
            <div className="flex gap-4">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="flex-1 bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400"
                disabled={isLoading}
              />
              <button
                onClick={sendMessage}
                disabled={isLoading || !inputValue.trim()}
                className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-cyan-700 transition-all duration-300 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-5 h-5" />
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}