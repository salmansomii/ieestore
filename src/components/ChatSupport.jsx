import { useState, useEffect, useRef } from 'react';
import { MessageSquare, X } from 'lucide-react';

const ChatSupport = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Hi! 👋 Welcome to Taicon Store. How can we help you today?' }
  ]);
  const messagesEndRef = useRef(null);

  const predefinedQuestions = [
    {
      q: 'Do you offer Cash on Delivery?',
      a: 'Yes! We offer 100% Cash on Delivery across all cities in Pakistan. You can pay cash when the parcel arrives at your doorstep.'
    },
    {
      q: 'How long does delivery take?',
      a: 'Orders are usually verified within a few hours and delivered within 2 to 4 working days across Pakistan.'
    },
    {
      q: 'Are your Solar products genuine?',
      a: 'All our Solar Panels, Inverters, and Batteries are 100% Tier-1 genuine products with official brand warranty.'
    },
    {
      q: 'I need to speak to live support',
      a: 'You can reach our Taicon support team directly on WhatsApp at +92 327 4000155 for instant quotation and assistance.'
    }
  ];

  const handleQuestionClick = (qa) => {
    setMessages(prev => [...prev, { sender: 'user', text: qa.q }]);
    setTimeout(() => {
      setMessages(prev => [...prev, { sender: 'bot', text: qa.a }]);
    }, 400);
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  return (
    <>
      {isOpen && (
        <div 
          className="chat-window-container"
          style={{
            position: 'fixed',
            zIndex: 9999,
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            border: '1px solid var(--border-color)',
            animation: 'chatPopUp 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
        >
          {/* Header */}
          <div 
            style={{
              backgroundColor: '#ea580c',
              color: '#ffffff',
              padding: '12px 16px',
              fontWeight: 'bold',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem' }}>
              <MessageSquare size={18} />
              <span>Taicon Store Support</span>
            </div>
            <button 
              onClick={() => setIsOpen(false)} 
              style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', padding: '4px' }}
              aria-label="Close support chat"
            >
              <X size={20} />
            </button>
          </div>

          {/* Messages */}
          <div 
            style={{
              flex: 1,
              padding: '12px',
              overflowY: 'auto',
              backgroundColor: '#f8fafc',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px'
            }}
          >
            {messages.map((msg, idx) => {
              const isUser = msg.sender === 'user';
              return (
                <div 
                  key={idx}
                  style={{
                    maxWidth: '82%',
                    padding: '8px 12px',
                    borderRadius: '12px',
                    fontSize: '0.825rem',
                    lineHeight: '1.45',
                    alignSelf: isUser ? 'flex-end' : 'flex-start',
                    backgroundColor: isUser ? '#ea580c' : '#ffffff',
                    color: isUser ? '#ffffff' : '#0f172a',
                    border: isUser ? 'none' : '1px solid #e2e8f0',
                    borderBottomRightRadius: isUser ? '2px' : '12px',
                    borderBottomLeftRadius: isUser ? '12px' : '2px',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.04)'
                  }}
                >
                  {msg.text}
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Quick Questions */}
          <div 
            style={{
              padding: '10px 12px',
              backgroundColor: '#ffffff',
              borderTop: '1px solid #e2e8f0',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px'
            }}
          >
            <p style={{ fontSize: '0.7rem', color: '#64748b', margin: '0 0 2px 2px', fontWeight: 600 }}>Frequent questions:</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', maxHeight: '110px', overflowY: 'auto' }}>
              {predefinedQuestions.map((qa, idx) => (
                <button 
                  key={idx} 
                  style={{
                    padding: '6px 10px',
                    backgroundColor: '#f1f5f9',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '0.75rem',
                    color: '#0f172a',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'background-color 0.15s'
                  }}
                  onClick={() => handleQuestionClick(qa)}
                >
                  {qa.q}
                </button>
              ))}
            </div>

            <a
              href="https://wa.me/923274000155"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                padding: '6px 12px',
                backgroundColor: '#25D366',
                color: 'white',
                borderRadius: '8px',
                fontSize: '0.75rem',
                fontWeight: 700,
                textDecoration: 'none',
                marginTop: '4px'
              }}
            >
              Open WhatsApp Chat (+92 327 4000155)
            </a>
          </div>
        </div>
      )}

      {/* Floating Chat Trigger Button */}
      {!isOpen && (
        <button 
          className="chat-floating-btn"
          onClick={() => setIsOpen(true)}
          aria-label="Open support chat"
        >
          <MessageSquare size={24} />
        </button>
      )}

      <style dangerouslySetInnerHTML={{__html: `
        .chat-floating-btn {
          position: fixed;
          bottom: 74px; /* Sits above mobile bottom nav */
          right: 16px;
          background-color: #ea580c;
          color: #ffffff;
          width: 50px;
          height: 50px;
          border-radius: 50%;
          box-shadow: 0 4px 15px rgba(234, 88, 12, 0.35);
          z-index: 85;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: transform 0.2s ease;
          border: none;
        }
        .chat-floating-btn:active {
          transform: scale(0.92);
        }
        .chat-window-container {
          bottom: 74px;
          right: 12px;
          left: 12px;
          max-width: 360px;
          height: 440px;
        }
        @media (min-width: 768px) {
          .chat-floating-btn {
            bottom: 24px;
            right: 24px;
            width: 56px;
            height: 56px;
          }
          .chat-window-container {
            bottom: 90px;
            right: 24px;
            left: auto;
            width: 350px;
            height: 480px;
          }
        }
        @keyframes chatPopUp {
          from {
            opacity: 0;
            transform: scale(0.92) translateY(10px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
      `}} />
    </>
  );
};

export default ChatSupport;
