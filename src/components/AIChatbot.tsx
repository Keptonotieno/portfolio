/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef, useEffect } from 'react';
import { X, Send, Bot, User, CornerDownLeft, Sparkles, MessageCircleCode, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Message {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: Date;
}

interface AIChatbotProps {
  isOpen: boolean;
  onClose: () => void;
  darkMode: boolean;
}

const QUICK_PROMPTS = [
  "What are your core tech skills?",
  "Tell me about your experience",
  "Are you available for hire?",
  "Tell me about this portfolio's tech stack"
];

// High quality fallback local answers if GEMINI_API_KEY is missing or server is unreachable
const LOCAL_FALLBACK_ANSWERS: { keywords: string[]; response: string }[] = [
  {
    keywords: ["skill", "tech", "languages", "know", "c++", "react", "typescript"],
    response: "I have extensive expertise across full-stack technologies. My core programming languages include **C++**, **JavaScript**, **TypeScript**, **Python**, and **Java**. In frontend, I am a master of **React** and **HTML5/CSS3** styled with **Tailwind CSS** or **Bootstrap**. My backend expertise revolves around **Supabase**, API integration, and relational database management."
  },
  {
    keywords: ["experience", "job", "work", "career", "freelance"],
    response: "I am currently working as a **Freelance Software Developer**. In this capacity, I develop custom websites and applications, design responsive user interfaces using React and Tailwind CSS, build robust features using Java, JavaScript, and Python, integrate database backends (like Spring Boot and Supabase), and maintain professional software development practices."
  },
  {
    keywords: ["hire", "contact", "available", "recruit", "email"],
    response: "Yes! I am actively looking for new career opportunities and freelance contracts! I am highly motivated to work with recruiters, tech companies, and startup founders. You can reach me directly at **keptonotieno@gmail.com** or **keptonokoth@gmail.com**, call me at **0700830335**, or send a message using the Contact section of this website!"
  },
  {
    keywords: ["project", "build", "portfolio", "code"],
    response: "I have built several amazing projects shown in the Projects section. These include this **Smart Portfolio & CMS** (built with React, TypeScript, Tailwind, Express, and Gemini API), a **Gemini Analytics Hub** (predictive panel using python & FastAPI), a **CyberSpace E-commerce Marketplace** with Supabase sync, and a team **Smart-Grid Task System**."
  },
  {
    keywords: ["stack", "this", "portfolio", "database"],
    response: "This portfolio is a full-stack React and TypeScript single-page app utilizing **Vite**, **Tailwind CSS**, and **Framer Motion** for sleek animations. The backend runs on an **Express** proxy server facilitating secure, server-side Gemini 3.5 API calls, and is fully ready to connect to **Supabase** for durable client data persistence."
  }
];

function getLocalFallback(query: string): string {
  const lowercase = query.toLowerCase();
  for (const fallback of LOCAL_FALLBACK_ANSWERS) {
    if (fallback.keywords.some(keyword => lowercase.includes(keyword))) {
      return fallback.response;
    }
  }
  return "I am a highly skilled Full Stack Developer based in Nairobi, Kenya. I excel in building fast, scalable applications using React, TypeScript, Node.js, and Supabase. Is there a specific project, skill, or experience detail you'd like to ask about?";
}

export default function AIChatbot({ isOpen, onClose, darkMode }: AIChatbotProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'model',
      content: "Hello! I am your AI Co-Pilot. Ask me anything about my coding journey, projects, skills, or professional experience!",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSend = async (textToSend: string) => {
    if (!textToSend.trim() || loading) return;

    const userMsg: Message = {
      id: `msg-${Date.now()}-user`,
      role: 'user',
      content: textToSend,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      // Build standard chat history format
      const history = messages
        .filter(m => m.id !== 'welcome')
        .map(m => ({
          role: m.role,
          content: m.content
        }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: textToSend, history })
      });

      const data = await res.json();

      if (res.ok && data.reply) {
        setMessages(prev => [...prev, {
          id: `msg-${Date.now()}-bot`,
          role: 'model',
          content: data.reply,
          timestamp: new Date()
        }]);
      } else {
        // Fallback to local answering if API key is not yet set or endpoint errors
        const fallbackText = getLocalFallback(textToSend);
        setMessages(prev => [...prev, {
          id: `msg-${Date.now()}-bot-fallback`,
          role: 'model',
          content: `*[Local AI Fallback - Database Offline]* \n\n${fallbackText}`,
          timestamp: new Date()
        }]);
      }
    } catch (err) {
      console.warn("Express chatbot fetch failed, using smart local answers", err);
      const fallbackText = getLocalFallback(textToSend);
      setMessages(prev => [...prev, {
        id: `msg-${Date.now()}-bot-fallback`,
        role: 'model',
        content: `*[Offline Assistant Mode]* \n\n${fallbackText}`,
        timestamp: new Date()
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div id="ai-chatbot-drawer-overlay" className="fixed inset-0 z-50 flex justify-end pointer-events-none">
          {/* Backdrop */}
          <motion.div
            id="chatbot-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm pointer-events-auto"
          />

          {/* Drawer Panel */}
          <motion.div
            id="chatbot-panel"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className={`relative w-full max-w-md h-full flex flex-col pointer-events-auto shadow-2xl border-l ${
              darkMode
                ? 'bg-gray-950 border-white/10 text-white'
                : 'bg-white border-black/10 text-gray-900'
            }`}
          >
            {/* Header */}
            <div className={`p-5 flex items-center justify-between border-b ${darkMode ? 'border-white/10' : 'border-black/10'}`}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-400 to-purple-500 flex items-center justify-center text-white glow-cyan">
                  <Bot size={20} className="animate-pulse" />
                </div>
                <div>
                  <h3 className="font-sans font-bold text-sm flex items-center gap-1.5">
                    AI Co-Pilot
                    <span className="flex h-2 w-2 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
                    </span>
                  </h3>
                  <p className="font-mono text-[10px] text-cyan-400 font-semibold tracking-wider">
                    GEMINI 3.5 POWERED AGENT
                  </p>
                </div>
              </div>
              <button
                id="chatbot-close-btn"
                onClick={onClose}
                className={`p-2 rounded-lg hover:bg-gray-500/10 transition-colors ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}
              >
                <X size={18} />
              </button>
            </div>

            {/* Messages Body */}
            <div id="chatbot-messages-body" className="flex-1 overflow-y-auto p-5 space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
                >
                  <div className={`w-8 h-8 rounded-lg shrink-0 flex items-center justify-center ${
                    msg.role === 'user'
                      ? 'bg-purple-600 text-white'
                      : darkMode ? 'bg-white/5 text-cyan-400 border border-white/5' : 'bg-gray-100 text-cyan-600'
                  }`}>
                    {msg.role === 'user' ? <User size={14} /> : <Bot size={14} />}
                  </div>
                  <div className={`p-3.5 rounded-2xl text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-purple-600/90 text-white rounded-tr-none'
                      : darkMode
                      ? 'bg-white/5 border border-white/5 text-gray-200 rounded-tl-none'
                      : 'bg-gray-100 text-gray-800 rounded-tl-none'
                  }`}>
                    {msg.content.split('\n').map((line, idx) => (
                      <p key={idx} className="mb-1.5 last:mb-0">
                        {/* Super simple markup parsing for bold points */}
                        {line.includes('**') ? (
                          line.split('**').map((part, pIdx) => pIdx % 2 === 1 ? <strong key={pIdx} className="text-cyan-400 font-bold">{part}</strong> : part)
                        ) : line}
                      </p>
                    ))}
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex gap-3 max-w-[80%] mr-auto">
                  <div className={`w-8 h-8 rounded-lg shrink-0 flex items-center justify-center ${darkMode ? 'bg-white/5 text-cyan-400' : 'bg-gray-100 text-cyan-600'}`}>
                    <Bot size={14} />
                  </div>
                  <div className={`p-4 rounded-2xl rounded-tl-none flex items-center gap-1.5 ${darkMode ? 'bg-white/5' : 'bg-gray-100'}`}>
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Quick Prompts */}
            {messages.length === 1 && (
              <div id="chatbot-quick-prompts" className="px-5 py-3 space-y-2">
                <p className={`text-xs font-semibold flex items-center gap-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  <Sparkles size={12} className="text-cyan-400" />
                  <span>Suggested Questions:</span>
                </p>
                <div className="grid grid-cols-1 gap-2">
                  {QUICK_PROMPTS.map((prompt, index) => (
                    <button
                      id={`quick-prompt-${index}`}
                      key={index}
                      onClick={() => handleSend(prompt)}
                      className={`text-left text-xs p-2.5 rounded-xl border transition-all duration-300 flex items-center justify-between group ${
                        darkMode
                          ? 'bg-white/5 border-white/5 hover:bg-white/10 text-gray-300'
                          : 'bg-gray-50 border-black/5 hover:bg-gray-100 text-gray-700'
                      }`}
                    >
                      <span>{prompt}</span>
                      <ArrowRight size={12} className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-cyan-400" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Footer Input */}
            <div className={`p-4 border-t ${darkMode ? 'border-white/10' : 'border-black/10'}`}>
              <form
                id="chatbot-input-form"
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend(input);
                }}
                className="flex gap-2"
              >
                <input
                  id="chatbot-input-field"
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask AI Co-Pilot..."
                  disabled={loading}
                  className={`flex-1 px-4 py-2.5 rounded-xl text-sm border focus:outline-none focus:ring-2 focus:ring-cyan-400 ${
                    darkMode
                      ? 'bg-white/5 border-white/10 text-white placeholder-gray-500'
                      : 'bg-gray-50 border-black/10 text-gray-900 placeholder-gray-400'
                  }`}
                />
                <button
                  id="chatbot-send-btn"
                  type="submit"
                  disabled={loading || !input.trim()}
                  className="p-2.5 bg-gradient-to-r from-cyan-500 to-purple-600 disabled:opacity-50 text-white rounded-xl shadow-lg hover:opacity-95 transition-opacity"
                >
                  <Send size={16} />
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
