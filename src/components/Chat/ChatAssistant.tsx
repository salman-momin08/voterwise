import React, { useState, useRef, useEffect } from 'react';
import { FocusTrap } from 'focus-trap-react';
import { getChatResponse } from '../../lib/gemini';
import { Mic, Send, Volume2, CheckCircle, ExternalLink, Calendar as CalendarIcon, Sparkles, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import './ChatAssistant.css';

import type { SourceAttribution } from '../../types/civic';
import TrustIndicator from '../Civic/TrustIndicator';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  actions?: string[];
  sources?: SourceAttribution[];
  is_validated?: boolean;
}

interface ChatAssistantProps {
  context?: string;
  onClose?: () => void;
}


const ChatAssistant: React.FC<ChatAssistantProps> = ({ context, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);


  const handleSend = async (text: string) => {
    if (!text.trim()) return;

    const userMsg: Message = { id: crypto.randomUUID(), role: 'user', content: text };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    // Format history for Gemini Content[] type
    const history = messages.map(m => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.content }]
    }));

    const responseText = await getChatResponse(text, history, context ?? undefined);
    
    // Parse structured citations
    const citationRegex = /\[CITATION: ({.*?})\]/g;
    const sources: SourceAttribution[] = [];
    let cleanedResponse = responseText;
    
    let match;
    while ((match = citationRegex.exec(responseText)) !== null) {
      try {
        const sourceData = JSON.parse(match[1]);
        sources.push({
          ...sourceData,
          last_verified_timestamp: new Date().toISOString()
        });
        cleanedResponse = cleanedResponse.replace(match[0], '');
      } catch (e) {
        console.error("Failed to parse citation:", e);
      }
    }

    const assistantMsg: Message = {
      id: crypto.randomUUID(),
      role: 'assistant',
      content: cleanedResponse.trim(),
      is_validated: sources.length > 0,
      sources: sources,
      actions: [] 
    };

    setMessages(prev => [...prev, assistantMsg]);
    setIsLoading(false);
    
    if (isListening) speak(responseText);
  };

  // Web Speech API - Recognition
  const startListening = () => {
    const SpeechRecognitionCtor = window.SpeechRecognition ?? window.webkitSpeechRecognition;
    if (!SpeechRecognitionCtor) {
      alert("Speech recognition not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognitionCtor();
    recognition.onstart = () => { setIsListening(true); };
    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = event.results[0][0].transcript;
      void handleSend(transcript);
    };
    recognition.onend = () => { setIsListening(false); };
    recognition.start();
  };

  // Web Speech API - Synthesis
  const speak = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <FocusTrap active={true}>
      <div className="chat-container glass" role="complementary" aria-label="Election Assistant">
        <div className="chat-header">
          <div className="header-info">
            <div className="status-indicator"></div>
            <h3>VoterWise Assistant</h3>
          </div>
          <div className="header-actions">
            <span className="header-badge">AI</span>
            {onClose && (
              <button className="close-btn" onClick={onClose} aria-label="Close assistant">
                <X size={18} />
              </button>
            )}
          </div>
        </div>

        <div className="messages-area" ref={scrollRef}>
          {messages.length === 0 && (
            <div className="chat-welcome">
              <Sparkles size={32} className="welcome-icon" />
              <p className="welcome-title">Namaste! I'm your civic assistant.</p>
              <p className="welcome-sub">Ask me about voter registration, election deadlines, or anything about the Indian democratic process.</p>
              <div className="quick-prompts">
                <button onClick={() => { void handleSend("How do I register to vote?"); }} className="prompt-chip">
                  How to register?
                </button>
                <button onClick={() => { void handleSend("When is the next election deadline?"); }} className="prompt-chip">
                  Next deadline?
                </button>
                <button onClick={() => { void handleSend("What ID do I need to vote?"); }} className="prompt-chip">
                  Required ID docs
                </button>
              </div>
            </div>
          )}

          <AnimatePresence initial={false}>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`message-wrapper ${msg.role}`}
              >
                <div className="message-bubble">
                  {msg.content}
                  
                  {msg.actions?.includes('register') && (
                    <div className="action-card">
                      <CheckCircle size={16} className="success-icon" />
                      <span>Ready to vote?</span>
                      <a href="https://voters.eci.gov.in/" target="_blank" rel="noopener noreferrer" className="action-link">
                        Register Now <ExternalLink size={12} />
                      </a>
                    </div>
                  )}

                  {msg.actions?.includes('calendar') && (
                    <div className="action-card calendar">
                      <CalendarIcon size={16} className="accent-icon" />
                      <span>Deadlines for {context ?? 'your region'}</span>
                      <a href="#roadmap" className="action-link">
                        View Timeline <ExternalLink size={12} />
                      </a>
                    </div>
                  )}
                </div>
                  {msg.sources && msg.sources.length > 0 && (
                    <div className="message-sources" style={{ marginTop: 'var(--space-md)' }}>
                      {msg.sources.map((source, idx) => (
                        <TrustIndicator key={idx} source={source} />
                      ))}
                    </div>
                  )}
                {msg.role === 'assistant' && (
                  <button className="read-btn" onClick={() => { speak(msg.content); }} aria-label="Read message aloud">
                    <Volume2 size={14} /> Listen
                  </button>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
          {isLoading && (
            <div className="loading-indicator">
              <span></span><span></span><span></span>
            </div>
          )}
        </div>

        <form className="chat-input-area" onSubmit={(e) => { e.preventDefault(); void handleSend(input); }}>
          <button 
            type="button" 
            className={`icon-btn ${isListening ? 'active' : ''}`} 
            onClick={startListening}
            aria-label="Voice input"
          >
            <Mic size={20} />
          </button>
          <input
            type="text"
            value={input}
            onChange={(e) => { setInput(e.target.value); }}
            placeholder="Ask about registration, deadlines..."
            aria-label="Type your question"
            id="chat-input"
          />
          <button type="submit" className="send-btn" disabled={!input.trim()} aria-label="Send message">
            <Send size={18} />
          </button>
        </form>
      </div>
    </FocusTrap>
  );
};

export default ChatAssistant;
