import React, { useState, useEffect, useRef } from 'react';
import { 
  Bot, Send, Sparkles, Copy, Check, RotateCcw, 
  Loader2, User, FileText, Bug, Calendar, Calculator, Lightbulb 
} from 'lucide-react';
import { api } from '../../services/api';
import { Badge } from '../../components/Badge';

export const AIAssistant: React.FC = () => {
  const [messages, setMessages] = useState<any[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    api.getAiHistory().then(setMessages);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSendMessage = async (customPrompt?: string) => {
    const textToSend = customPrompt || inputMessage;
    if (!textToSend.trim() || isLoading) return;

    const tempUserMsg = {
      id: 'usr_' + Date.now(),
      role: 'user',
      text: textToSend,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, tempUserMsg]);
    if (!customPrompt) setInputMessage('');
    setIsLoading(true);

    try {
      const response = await api.sendAiMessage(textToSend);
      if (response) {
        setMessages(prev => [...prev, response]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const promptPresets = [
    { title: 'Resume Review', desc: 'Scan for tech internship keywords', icon: FileText, prompt: 'Review my resume for a Full-Stack AI Engineer internship. What key sections, action verbs, and impact metrics should I emphasize?' },
    { title: 'Debug Error', desc: 'Trace segfault or memory leak', icon: Bug, prompt: 'I have a segmentation fault in my C code when reversing a linked list. What are the common causes and how do I trace it?' },
    { title: '7-Day Exam Plan', desc: 'Accelerated study schedule', icon: Calendar, prompt: 'Create an intensive 7-day revision schedule for Operating Systems and Data Structures before university end-semesters.' },
    { title: 'Feynman Analogy', desc: 'Explain tricky concepts simply', icon: Lightbulb, prompt: 'Explain the difference between TCP and UDP using a real-world mail carrier analogy.' },
    { title: 'Math & Master Theorem', desc: 'Step-by-step recurrence solution', icon: Calculator, prompt: 'Solve this recurrence step-by-step using Master Theorem: T(n) = 3T(n/4) + n log n.' }
  ];

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-8rem)] flex flex-col space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#232936]">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-600/30">
            <Bot size={18} />
          </div>
          <div>
            <h1 className="text-lg font-bold text-[#F8FAFC]">Academic & Career AI Assistant</h1>
            <p className="text-[11px] text-[#94A3B8]">University CS Co-Pilot & Engineering Mentor</p>
          </div>
        </div>

        <Badge variant="purple" size="sm">Autonomous AI Engine</Badge>
      </div>

      {/* Preset Prompt Buttons */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {promptPresets.map((preset, i) => {
          const Icon = preset.icon;
          return (
            <button
              key={i}
              onClick={() => handleSendMessage(preset.prompt)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#151923] border border-[#232936] hover:border-indigo-500/40 text-xs font-medium text-[#94A3B8] hover:text-[#F8FAFC] whitespace-nowrap transition-all"
            >
              <Icon size={12} className="text-indigo-400" />
              <span>{preset.title}</span>
            </button>
          );
        })}
      </div>

      {/* Chat Messages History */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-2">
        {messages.map((msg, idx) => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={msg.id || idx}
              className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : ''}`}
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-white ${
                isUser ? 'bg-indigo-600' : 'bg-[#151923] border border-[#232936] text-indigo-400'
              }`}>
                {isUser ? <User size={16} /> : <Bot size={16} />}
              </div>

              <div className={`relative max-w-[85%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed space-y-2 ${
                isUser 
                  ? 'bg-indigo-600/20 text-[#F8FAFC] border border-indigo-500/30' 
                  : 'bg-[#151923] text-[#F8FAFC] border border-[#232936]'
              }`}>
                <div className="whitespace-pre-line font-sans">
                  {msg.text}
                </div>

                {!isUser && (
                  <div className="flex items-center justify-between pt-2 border-t border-[#232936]/60 text-[10px] text-[#94A3B8]">
                    <span>LearnOS Academic Model</span>
                    <button
                      onClick={() => copyToClipboard(msg.text, msg.id || String(idx))}
                      className="flex items-center gap-1 hover:text-[#F8FAFC]"
                    >
                      {copiedId === (msg.id || String(idx)) ? (
                        <>
                          <Check size={11} className="text-emerald-400" />
                          <span className="text-emerald-400">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy size={11} />
                          <span>Copy Markdown</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#151923] border border-[#232936] flex items-center justify-center text-indigo-400">
              <Bot size={16} />
            </div>
            <div className="p-4 rounded-2xl bg-[#151923] border border-[#232936] text-xs text-indigo-400 flex items-center gap-2">
              <Loader2 size={14} className="animate-spin" />
              <span>Synthesizing academic answer...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="relative"
      >
        <textarea
          rows={2}
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSendMessage();
            }
          }}
          placeholder="Ask anything about computer science, algorithms, code debugging, or career advice... (Enter to send)"
          className="w-full bg-[#151923] border border-[#232936] rounded-xl pl-4 pr-14 py-3 text-xs sm:text-sm text-[#F8FAFC] placeholder-[#94A3B8]/60 focus:outline-none focus:border-indigo-500 shadow-lg resize-none"
        />

        <button
          type="submit"
          disabled={!inputMessage.trim() || isLoading}
          className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-30 text-white flex items-center justify-center transition-all shadow-md shadow-indigo-600/30"
        >
          {isLoading ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
        </button>
      </form>
    </div>
  );
};
