import React, { useState, useRef, useEffect } from 'react';
import { API_URL } from '../api/apiConfig';

const QUICK_QUESTIONS = [
  "What yoga poses help with back pain?",
  "How can I reduce my stress level?",
  "Tips to improve sleep quality?",
  "Best morning routine for energy?",
  "Explain my wellness score",
];

const MAX_MESSAGES = 10;

const WellnessChatbot = ({ userId, report }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'ai',
      text: 'Namaste! 🙏 I\'m your FitNexus Wellness Companion. Ask me about yoga, stress, sleep, nutrition, or your wellness report. How can I help you today?',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [msgCount, setMsgCount] = useState(0);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const sendMessage = async (text) => {
    if (!text.trim() || loading || msgCount >= MAX_MESSAGES) return;

    const userMsg = { role: 'user', text: text.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);
    setMsgCount((prev) => prev + 1);

    const activeUserId = userId || localStorage.getItem("userId") || localStorage.getItem("id") || localStorage.getItem("user_id");

    try {
      const res = await fetch(`${API_URL}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: activeUserId ? Number(activeUserId) : null, message: text.trim() }),
      });
      const data = await res.json();
      setMessages((prev) => [...prev, { role: 'ai', text: data.reply || 'I couldn\'t process that. Try asking about yoga, stress, or sleep.' }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: 'ai', text: 'Hmm, I\'m having trouble connecting. Please make sure the backend is running on port 8083.' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  return (
    <>
      {/* Floating Action Button Highlight Badge */}
      {!isOpen && (
        <div style={styles.badgeCallout}>
          ✨ Ask AI Wellness Companion!
        </div>
      )}

      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={styles.fab}
        title="Wellness Chat"
      >
        {isOpen ? '✕' : '🧘'}
      </button>

      {/* Chat Panel */}
      {isOpen && (
        <div style={styles.panel}>
          {/* Header */}
          <div style={styles.header}>
            <div style={styles.headerInfo}>
              <span style={styles.headerIcon}>🧘</span>
              <div>
                <div style={styles.headerTitle}>Wellness Companion</div>
                <div style={styles.headerStatus}>
                  <span style={styles.statusDot}></span>
                  AI-Powered · {MAX_MESSAGES - msgCount} messages left
                </div>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} style={styles.closeBtn}>✕</button>
          </div>

          {/* Messages */}
          <div style={styles.messages}>
            {messages.map((msg, i) => (
              <div
                key={i}
                style={{
                  ...styles.msgRow,
                  justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                }}
              >
                {msg.role === 'ai' && <span style={styles.avatar}>🧘</span>}
                <div
                  style={{
                    ...styles.bubble,
                    ...(msg.role === 'user' ? styles.userBubble : styles.aiBubble),
                  }}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {loading && (
              <div style={styles.msgRow}>
                <span style={styles.avatar}>🧘</span>
                <div style={{ ...styles.bubble, ...styles.aiBubble }}>
                  <span style={styles.typing}>
                    <span style={styles.dot}>●</span>
                    <span style={{ ...styles.dot, animationDelay: '0.2s' }}>●</span>
                    <span style={{ ...styles.dot, animationDelay: '0.4s' }}>●</span>
                  </span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Questions (show only at start) */}
          {msgCount === 0 && (
            <div style={styles.quickQuestions}>
              {QUICK_QUESTIONS.map((q, i) => (
                <button
                  key={i}
                  onClick={() => sendMessage(q)}
                  style={styles.quickBtn}
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* Input Area */}
          {msgCount < MAX_MESSAGES ? (
            <div style={styles.inputArea}>
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about yoga, stress, sleep..."
                style={styles.input}
                disabled={loading}
              />
              <button
                onClick={() => sendMessage(input)}
                disabled={loading || !input.trim()}
                style={{
                  ...styles.sendBtn,
                  opacity: loading || !input.trim() ? 0.5 : 1,
                }}
              >
                ➤
              </button>
            </div>
          ) : (
            <div style={styles.limitReached}>
              Session limit reached ({MAX_MESSAGES} messages). Refresh to start a new chat.
            </div>
          )}

          {/* Disclaimer */}
          <div style={styles.disclaimer}>
            ⚠️ AI-generated wellness advice. Consult a doctor for medical concerns.
          </div>
        </div>
      )}

      <style>{keyframesCSS}</style>
    </>
  );
};

const keyframesCSS = `
  @keyframes chatFadeIn {
    from { opacity: 0; transform: translateY(20px) scale(0.95); }
    to { opacity: 1; transform: translateY(0) scale(1); }
  }
  @keyframes dotPulse {
    0%, 60%, 100% { opacity: 0.3; }
    30% { opacity: 1; }
  }
  @keyframes fabPulse {
    0%, 100% { box-shadow: 0 4px 20px rgba(96, 46, 125, 0.4); }
    50% { box-shadow: 0 4px 30px rgba(96, 46, 125, 0.7); }
  }
  @keyframes calloutPulse {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-6px); }
  }
`;

const styles = {
  badgeCallout: {
    position: 'fixed',
    bottom: '38px',
    right: '98px',
    background: 'linear-gradient(135deg, #602e7d 0%, #054474 100%)',
    color: '#fff',
    padding: '10px 18px',
    borderRadius: '20px',
    fontSize: '0.82rem',
    fontWeight: 700,
    boxShadow: '0 4px 18px rgba(96, 46, 125, 0.45)',
    zIndex: 9999,
    fontFamily: "'Inter', sans-serif",
    pointerEvents: 'none',
    whiteSpace: 'nowrap',
    animation: 'calloutPulse 2.3s ease-in-out infinite',
    border: '1px solid rgba(255, 255, 255, 0.15)',
  },
  fab: {
    position: 'fixed',
    bottom: '28px',
    right: '28px',
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #602e7d 0%, #054474 100%)',
    color: '#fff',
    border: 'none',
    fontSize: '1.6rem',
    cursor: 'pointer',
    zIndex: 9999,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 20px rgba(96, 46, 125, 0.4)',
    animation: 'fabPulse 3s ease-in-out infinite',
    transition: 'transform 0.2s ease',
  },
  panel: {
    position: 'fixed',
    bottom: '100px',
    right: '28px',
    width: '380px',
    maxHeight: '560px',
    borderRadius: '20px',
    background: '#161b22',
    border: '1px solid #30363d',
    boxShadow: '0 16px 48px rgba(0, 0, 0, 0.5)',
    zIndex: 9998,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    animation: 'chatFadeIn 0.3s ease',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px 18px',
    background: 'linear-gradient(135deg, #602e7d 0%, #054474 100%)',
    color: '#fff',
  },
  headerInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  headerIcon: {
    fontSize: '1.8rem',
  },
  headerTitle: {
    fontWeight: 700,
    fontSize: '0.95rem',
    fontFamily: "'Inter', sans-serif",
  },
  headerStatus: {
    fontSize: '0.7rem',
    opacity: 0.85,
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
    fontFamily: "'Inter', sans-serif",
  },
  statusDot: {
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    background: '#66bb6a',
    display: 'inline-block',
  },
  closeBtn: {
    background: 'rgba(255,255,255,0.2)',
    border: 'none',
    color: '#fff',
    width: '28px',
    height: '28px',
    borderRadius: '50%',
    cursor: 'pointer',
    fontSize: '0.85rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  messages: {
    flex: 1,
    overflowY: 'auto',
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    maxHeight: '300px',
    scrollBehavior: 'smooth',
  },
  msgRow: {
    display: 'flex',
    alignItems: 'flex-end',
    gap: '8px',
  },
  avatar: {
    fontSize: '1.2rem',
    flexShrink: 0,
  },
  bubble: {
    maxWidth: '80%',
    padding: '10px 14px',
    borderRadius: '16px',
    fontSize: '0.88rem',
    lineHeight: 1.5,
    fontFamily: "'Inter', sans-serif",
    wordWrap: 'break-word',
  },
  aiBubble: {
    background: '#21262d',
    color: '#e6edf3',
    borderBottomLeftRadius: '4px',
  },
  userBubble: {
    background: 'linear-gradient(135deg, #602e7d 0%, #054474 100%)',
    color: '#fff',
    borderBottomRightRadius: '4px',
  },
  typing: {
    display: 'flex',
    gap: '4px',
    padding: '4px 0',
  },
  dot: {
    fontSize: '0.8rem',
    color: '#8b949e',
    animation: 'dotPulse 1s ease-in-out infinite',
  },
  quickQuestions: {
    padding: '0 16px 12px',
    display: 'flex',
    flexWrap: 'wrap',
    gap: '6px',
  },
  quickBtn: {
    background: 'rgba(96, 46, 125, 0.15)',
    border: '1px solid rgba(96, 46, 125, 0.3)',
    color: '#b39ddb',
    padding: '6px 12px',
    borderRadius: '20px',
    fontSize: '0.75rem',
    cursor: 'pointer',
    fontFamily: "'Inter', sans-serif",
    transition: 'all 0.2s ease',
  },
  inputArea: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 16px',
    borderTop: '1px solid #30363d',
  },
  input: {
    flex: 1,
    background: '#0d1117',
    border: '1px solid #30363d',
    borderRadius: '12px',
    padding: '10px 14px',
    color: '#e6edf3',
    fontSize: '0.9rem',
    outline: 'none',
    fontFamily: "'Inter', sans-serif",
  },
  sendBtn: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #602e7d 0%, #054474 100%)',
    color: '#fff',
    border: 'none',
    fontSize: '1.1rem',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'opacity 0.2s ease',
  },
  limitReached: {
    padding: '12px 16px',
    textAlign: 'center',
    color: '#8b949e',
    fontSize: '0.8rem',
    borderTop: '1px solid #30363d',
    fontFamily: "'Inter', sans-serif",
  },
  disclaimer: {
    padding: '8px 16px',
    textAlign: 'center',
    fontSize: '0.65rem',
    color: '#6e7681',
    borderTop: '1px solid #21262d',
    fontFamily: "'Inter', sans-serif",
  },
};

export default WellnessChatbot;
