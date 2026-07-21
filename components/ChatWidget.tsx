'use client';
import React, { useState, useRef, useEffect } from 'react';

interface Message {
  id: string;
  sender: 'user' | 'nancy';
  text: string;
}

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', sender: 'nancy', text: "Hi! I'm Nancy, your immigration assistant. How can I help you today?" }
  ]);
  const [unreadCount, setUnreadCount] = useState<number>(() => {
    try {
      const v = localStorage.getItem('chat_unread_count');
      return v ? parseInt(v, 10) : 0;
    } catch (e) {
      return 0;
    }
  });
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  // Track incoming messages while widget is closed and increment unread counter
  const prevMessagesLen = useRef(messages.length);
  useEffect(() => {
    const prev = prevMessagesLen.current;
    if (!isOpen && messages.length > prev) {
      const diff = messages.length - prev;
      setUnreadCount((c) => {
        const next = c + diff;
        try { localStorage.setItem('chat_unread_count', String(next)); } catch (e) { }
        return next;
      });
    }
    prevMessagesLen.current = messages.length;
  }, [messages, isOpen]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { id: Date.now().toString(), sender: 'user', text: userMessage }]);
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage })
      });

      const data = await res.json();
      setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), sender: 'nancy', text: data.reply }]);
    } catch (err) {
      setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), sender: 'nancy', text: "I'm having trouble connecting right now. Please try again later." }]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <div
        onClick={() => { setIsOpen(true); setUnreadCount(0); try { localStorage.setItem('chat_unread_count', '0'); } catch (e) { } }}
        className="fixed bottom-6 right-6 z-50 flex items-center bg-white rounded-full shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)] pr-2 pl-5 py-2 space-x-3 cursor-pointer border border-gray-100 hover:-translate-y-1 transition-transform"
      >
        <span className="text-sm font-semibold text-[#101F38]">Need help? Chat Nancy</span>
        <div className="relative">
          <div className="w-10 h-10 bg-[#E3755D] rounded-full flex items-center justify-center text-white shadow-sm">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2Z" />
            </svg>
          </div>
          {unreadCount > 0 && (
            <div className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">{unreadCount > 9 ? '9+' : unreadCount}</div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 w-80 sm:w-96 bg-white rounded-[24px] shadow-[0_20px_50px_-15px_rgba(16,31,56,0.2)] border border-gray-100 flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-300">
      {/* Header */}
      <div className="bg-[#101F38] p-4 flex justify-between items-center text-white">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-[#E3755D] rounded-full flex items-center justify-center font-bold text-lg">
            N
          </div>
          <div>
            <h3 className="font-bold text-[15px]">Nancy</h3>
            <p className="text-[11px] text-gray-300">Horizon Pathways Assistant</p>
          </div>
        </div>
        <button onClick={() => setIsOpen(false)} className="text-gray-300 hover:text-white transition-colors">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 overflow-y-auto bg-[#FDFBF9] space-y-4 max-h-[400px] min-h-[300px]">
        {messages.map(msg => (
          <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-[14px] ${msg.sender === 'user' ? 'bg-[#E3755D] text-white rounded-br-sm' : 'bg-white text-[#101F38] border border-gray-100 shadow-sm rounded-bl-sm'}`}>
              {msg.text}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white border border-gray-100 shadow-sm rounded-2xl rounded-bl-sm px-4 py-3 flex space-x-1.5">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-3 bg-white border-t border-gray-100">
        <form onSubmit={handleSend} className="flex items-center space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 bg-[#F5F4F1] border-none outline-none px-4 py-2.5 rounded-full text-[14px] text-[#101F38] placeholder-gray-400"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="w-10 h-10 bg-[#E3755D] rounded-full flex items-center justify-center text-white shrink-0 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#C93500] transition-colors"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-0.5">
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
}
