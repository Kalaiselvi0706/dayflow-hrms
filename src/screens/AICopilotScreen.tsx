import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { AIChatMessage } from '../types';
import { aiService } from '../services/aiService';

export const AICopilotScreen: React.FC = () => {
  const navigate = useNavigate();
  const { userRole } = useAuth();
  const [messages, setMessages] = useState<AIChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  const loadHistory = async () => {
    try {
      const data = await aiService.getChatHistory();
      setMessages(data);
    } catch (err) {}
  };

  useEffect(() => {
    loadHistory();
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = async (text: string) => {
    if (!text.trim()) return;
    setInputValue('');
    
    // Add user message locally
    const userMsg: AIChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages((prev) => [...prev, userMsg]);
    
    setIsTyping(true);
    try {
      // Send through service (which resolves mock response after a timeout)
      const aiResponse = await aiService.sendMessage(text);
      setMessages((prev) => {
        // Since aiService.sendMessage also adds to history, let's sync with it
        return [...prev.filter((m) => m.id !== aiResponse.id), aiResponse];
      });
    } catch (err) {}
    setIsTyping(false);
  };


  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto h-[calc(100vh-5rem)] flex flex-col justify-between space-y-4">
      {/* Top Banner */}
      <div className="rounded-2xl bg-[#1e1f26]/80 border border-[#464554]/30 p-4 sm:p-5 backdrop-blur-xl flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#8083ff] to-[#a078ff] p-[2px] flex items-center justify-center shadow-md shadow-[#8083ff]/20">
            <div className="w-full h-full bg-[#111319] rounded-[9px] flex items-center justify-center">
              <span className="material-symbols-outlined text-[#d0bcff]">psychology</span>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm sm:text-base font-bold text-white">Nexora AI Copilot</h2>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#8083ff]/20 text-[#c0c1ff] font-semibold border border-[#8083ff]/40">
                Gen-2 Neural
              </span>
            </div>
            <p className="text-xs text-[#908fa0]">Real-time organization telemetry & cognitive talent assistant</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate(userRole === 'admin' ? '/admin/dashboard' : '/employee/dashboard')}
            className="px-3 py-1.5 rounded-xl bg-[#282a30] text-[#c0c1ff] hover:bg-[#33343b] text-xs font-semibold"
          >
            Dashboard
          </button>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-1">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-3 ${
              msg.sender === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {msg.sender === 'ai' && (
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#8083ff] to-[#a078ff] text-white flex items-center justify-center shrink-0 mt-1 shadow-sm">
                <span className="material-symbols-outlined text-sm">auto_awesome</span>
              </div>
            )}

            <div
              className={`max-w-xl rounded-2xl p-4 text-xs sm:text-sm leading-relaxed space-y-3 ${
                msg.sender === 'user'
                  ? 'bg-gradient-to-r from-[#8083ff] to-[#6f72ff] text-white shadow-md'
                  : 'bg-[#1e1f26]/90 border border-[#464554]/40 text-[#e2e2eb] backdrop-blur-md'
              }`}
            >
              <div className="whitespace-pre-line">{msg.text}</div>

              {/* Embedded Interactive Widget */}
              {msg.widget && msg.widget.type === 'availability_absence' && (
                <div className="p-4 rounded-xl bg-[#111319]/80 border border-[#8083ff]/40 space-y-3 mt-2 text-xs">
                  <div className="flex items-center justify-between border-b border-[#464554]/30 pb-2">
                    <span className="font-bold text-white">
                      {msg.widget.data.department} Department Attendance
                    </span>
                    <span className="text-emerald-400 font-semibold">{msg.widget.data.delta} vs baseline</span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="p-2 rounded-lg bg-[#1e1f26]">
                      <span className="text-[#908fa0] text-[10px] block">Availability</span>
                      <span className="font-bold text-white text-sm">{msg.widget.data.availability}</span>
                    </div>
                    <div className="p-2 rounded-lg bg-[#1e1f26]">
                      <span className="text-[#908fa0] text-[10px] block">Sick Leave</span>
                      <span className="font-bold text-amber-300 text-sm">{msg.widget.data.sick} Staff</span>
                    </div>
                    <div className="p-2 rounded-lg bg-[#1e1f26]">
                      <span className="text-[#908fa0] text-[10px] block">Approved PTO</span>
                      <span className="font-bold text-cyan-300 text-sm">{msg.widget.data.pto} Staff</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={() => navigate(userRole === 'admin' ? '/admin/attendance' : '/employee/attendance')}
                      className="flex-1 py-1.5 rounded-lg bg-[#8083ff]/20 text-[#c0c1ff] hover:bg-[#8083ff]/30 text-xs font-semibold transition-all text-center"
                    >
                      View Live Telemetry →
                    </button>
                    <button
                      onClick={() => navigate(userRole === 'admin' ? '/admin/leave' : '/employee/leave')}
                      className="flex-1 py-1.5 rounded-lg bg-[#282a30] text-white hover:bg-[#33343b] text-xs font-semibold transition-all text-center"
                    >
                      Open Leave Hub
                    </button>
                  </div>
                </div>
              )}

              <span className="text-[10px] text-[#908fa0] block text-right pt-1">
                {msg.timestamp}
              </span>
            </div>

            {msg.sender === 'user' && (
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDoN3FD_QRBjTCVNpEsrYn9FEjWkdRvDBsnb9l-rlyRp-jYtyBsi0Ze1pCmUxkA2kbMbo5IOUU_Sy-mahmf8UfzKnpQPcmihZ_y7L_AfHDNiNYMaXOCiofRrR6TaNLBUDwNmhkjCb2dzrjMR95jUbXvWyFneWAkPD8OxgsZaddTeNv7UmmETrWE1UXLsEDoIdGrSGO502SGozPkrzD6zYKFGMgvz35rIGtvGVrEGIlB9ZU5LnG8YutYeQ"
                alt="Alex Rivers"
                className="w-8 h-8 rounded-xl object-cover border border-[#8083ff]/40 shrink-0 mt-1"
                referrerPolicy="no-referrer"
              />
            )}
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      {/* Suggested Prompts Bar */}
      <div className="shrink-0 space-y-2">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 hide-scrollbar">
          {[
            'Who is currently absent or late today?',
            'Show pending leave requests.',
            'Summarize weekly attendance across Engineering.',
            'Is there any flight risk in the Sales team?',
          ].map((prompt, i) => (
            <button
              key={i}
              onClick={() => handleSend(prompt)}
              className="px-3 py-1.5 rounded-xl bg-[#1e1f26] hover:bg-[#282a30] text-[#c0c1ff] border border-[#464554]/30 hover:border-[#8083ff]/50 text-xs whitespace-nowrap transition-all flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-xs text-[#8083ff]">chat_bubble_outline</span>
              <span>{prompt}</span>
            </button>
          ))}
        </div>

        {/* Bottom Input Box */}
        <div className="relative flex items-center">
          <input
            type="text"
            placeholder="Ask Nexora AI anything about attendance, talent, leaves, or workflows..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSend(inputValue);
            }}
            className="w-full bg-[#1e1f26] border border-[#464554]/50 rounded-2xl pl-4 pr-24 py-3.5 text-xs sm:text-sm text-white placeholder-[#908fa0]/60 focus:outline-none focus:border-[#8083ff] shadow-lg"
          />
          <button
            onClick={() => handleSend(inputValue)}
            disabled={!inputValue.trim()}
            className="absolute right-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#8083ff] to-[#a078ff] text-white text-xs font-semibold shadow-md shadow-[#8083ff]/20 hover:scale-105 transition-all disabled:opacity-40"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};
